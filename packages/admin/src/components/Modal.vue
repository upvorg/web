<template>
  <div :class="['modal', show ? 'show' : '']">
    <div class="modal-box">
      <p>{{ t.t }}</p>
      <slot />
      <div class="modal-action">
        <label class="btn btn-primary" @click="t.ok">Yes</label>
        <label class="btn" @click="t.no">No</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity'
import emitter, { ModalPayload } from '../utils/emitter'
const noop = () => {}

const show = ref(false)
const t = ref<ModalPayload>({
  t: '',
  yesText: 'OK',
  noText: 'Cancel',
  ok: noop,
  no: noop,
})

emitter.on('opm', (data: ModalPayload) => {
  show.value = true
  t.value.t = data.t
  t.value.yesText = data.yesText || 'OK'
  t.value.noText = data.noText || 'Cancel'
  t.value.ok = () => {
    show.value = false
    data.ok?.()
  }
  t.value.no = () => {
    show.value = false
    data.no?.()
  }
})

emitter.on('clm', () => {
  show.value = false
  t.value.t = ''
  t.value.yesText = 'OK'
  t.value.noText = 'Cancel'
})
</script>

<style scoped>
.show {
  visibility: visible;
  opacity: 1;
}

.modal {
  pointer-events: all;
}
</style>
