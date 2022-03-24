<template>
  <div id="vditor" />
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue'
import Vditor from 'vditor'
import 'vditor/dist/index.css'

const vditor = ref<Vditor | null>(null)
const props = defineProps(['modelValue'])

const onChange = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

onMounted(() => {
  vditor.value = new Vditor('vditor', {
    after: () => {
      vditor.value!.setValue(props.modelValue)
    },
    input: (value: string) => {
      onChange('update:modelValue', value)
    }
  })
})
</script>
