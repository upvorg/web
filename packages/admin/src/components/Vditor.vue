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

watch(
  () => props.modelValue,
  (value) => {
    if (vditor.value !== value) {
      vditor.value!.setValue(value)
    }
  }
)

onMounted(() => {
  vditor.value = new Vditor('vditor', {
    toolbar: [],
    toolbarConfig: { hide: true },
    after: () => {
      document.querySelector('.vditor-ir')!.classList.add('textarea', 'textarea-bordered', 'milkdown-root')
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
    display: none;
  }

  .vditor-ir {
    padding: 0.5em 0 0;
    margin-top: 8px;
  }

  .vditor-reset {
    background: transparent;
  }
}
</style>
