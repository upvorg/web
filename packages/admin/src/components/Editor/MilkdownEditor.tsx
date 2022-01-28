import { defineComponent, PropType, ref, watch, watchEffect } from 'vue'
import {
  Ctx,
  defaultValueCtx,
  Editor,
  editorViewCtx,
  editorViewOptionsCtx,
  parserCtx,
  rootCtx
} from '@milkdown/core'
import { VueEditor, useEditor, EditorRef } from '@milkdown/vue'
import { listenerCtx, listener } from '@milkdown/plugin-listener'
import { gfm } from '@milkdown/preset-gfm'
import { slash } from '@milkdown/plugin-slash'
import { Slice } from 'prosemirror-model'
import { history } from '@milkdown/plugin-history'
import { indent } from '@milkdown/plugin-indent'
import { upload, Uploader, uploadPlugin } from '@milkdown/plugin-upload'
import { pu } from './pu'
import { uploadApi } from '../../utils/api'

const uploader: Uploader = (files, schema) => {
  const images: File[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files.item(i)

    if (!file || !file.type.includes('image')) {
      continue
    }

    images.push(file)
  }

  return Promise.all(
    images.map(async (image) => {
      const fd = new FormData()
      fd.append('file', image)
      const src = await uploadApi(fd)
      const alt = image.name
      return schema.nodes.image.createAndFill({
        src,
        alt
      }) as unknown as any
    })
  )
}

export const MilkdownEditor = defineComponent({
  name: 'MilkdownEditor',
  components: { VueEditor },
  props: {
    type: String as PropType<'html' | 'json'>,
    modelValue: String,
    content: String,
    readonly: {
      type: Boolean,
      defaut: false
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const editor = useEditor((root) =>
      Editor.make()
        .config((ctx) => {
          ctx.set(rootCtx, root)
          ctx.set(defaultValueCtx, props.modelValue || '')
          ctx.get(listenerCtx).markdownUpdated((_, markdown, __) => {
            emit('update:modelValue', markdown)
          })
          ctx.set(editorViewOptionsCtx, { editable: () => !props.readonly })
        })
        .use(listener)
        .use(pu)
        .use(gfm)
        .use(slash)
        .use(indent)
        .use(upload.configure(uploadPlugin, { uploader }))
        .use(history)
    )

    const editorRef = ref<EditorRef>()

    const watchStopHandle = watch(
      () => props.modelValue,
      (v) => {
        editorRef.value?.get()?.action((ctx: Ctx) => {
          const view = ctx.get(editorViewCtx)
          const parser = ctx.get(parserCtx)
          const doc = parser(v || '')
          if (!doc) return
          const state = view.state
          view.dispatch(state.tr.replace(0, state.doc.content.size, new Slice(doc.content, 0, 0)))
        })
        watchStopHandle() // 只监听一次
      }
    )

    watchEffect(() => {
      editorRef.value?.dom?.()?.classList.add('textarea', 'textarea-bordered', 'milkdown-root')
    })

    //@ts-ignore
    return () => <VueEditor editor={editor} editorRef={editorRef as any} />
  }
})
