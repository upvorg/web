<template>
  <div id="vditor" />
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, watch } from 'vue'
import Vditor from 'vditor'
import 'vditor/dist/index.css'

const vditor = ref<Vditor | null>(null)
const props = defineProps(['modelValue'])

const onChange = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const w = watch(
  () => props.modelValue,
  (value) => {
    w()
    if (vditor.value !== value) {
      vditor.value!.setValue(value)
    }
  }
)

onMounted(() => {
  vditor.value = new Vditor('vditor', {
    icon: 'material',
    toolbar: [
      'emoji',
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
      'undo',
      'redo',
      'export'
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
  })
})
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
