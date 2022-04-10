<template>
  <div id="vditor" />
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, watch } from 'vue'
import Vditor from 'vditor'
// import { SMMS } from '@web/shared'
import 'vditor/dist/index.css'

const vditor = ref<Vditor | null>(null)
const props = defineProps(['modelValue'])

const onChange = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

onMounted(() => {
  vditor.value = new Vditor('vditor', {
    toolbar: [
      // 'emoji',
      'headings',
      'bold',
      'italic',
      'strike',
      '|',
      'line',
      'quote',
      'list',
      'ordered-list',
      'link',
      'table',
      'code',
      'inline-code',
      'check',
      '|',
      {
        name: 'smms',
        icon: '<svg><use xlink:href="#vditor-icon-upload"></use></svg>',
        tip: 'sm.ms',
        click: () => {
          window.open('https://sm.ms/')
        }
      },
      // 'upload',
      'undo',
      'redo'
      // 'export'
    ],
    after: () => {
      document
        .querySelector('.vditor-ir')!
        .classList.add('textarea', 'textarea-bordered', 'milkdown-root')
      vditor.value!.setValue(props.modelValue)
    },
    input: (value: string) => {
      onChange('update:modelValue', value)
    }
    // upload: {
    //   handler(files: File[]) {
    //     return SMMS.upload(files[0]).then((url) => {
    //       return url.url as any
    //     })
    //   }
    // }
  })
})

const w = watch(
  () => props.modelValue,
  (value) => {
    w?.()
    if (vditor.value?.getValue() !== value) {
      vditor.value?.setValue(value)
    }
  }
)
</script>

<style lang="scss">
#vditor {
  border: none;
  min-height: 400px;
  max-height: 700px;

  .vditor-toolbar {
    background: #fff;
    border: 0;
    padding: 0 !important;
  }

  button[data-type='smms'] > svg {
    width: 20px;
  }

  .vditor-ir {
    padding: 0.5em 0 0;
    margin-top: 8px;
  }

  .vditor-reset {
    background: transparent;
  }

  .vditor-reset p {
    margin-bottom: 0;
  }
}
</style>
