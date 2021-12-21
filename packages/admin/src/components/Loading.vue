<script setup lang="ts">
import { ref } from '@vue/reactivity'
import emitter from '../utils/emitter'

const show = ref(false)
const end = ref(false)

emitter.on('loading', (boolean: boolean) => {
  if (boolean === show.value) return
  if (!boolean) {
    end.value = true
    setTimeout(() => {
      end.value = false
    }, 200);
  }
  show.value = boolean
})
</script>

<template>
  <div :class="{ show: show, end: end }" id="loading">
    <img alt="loading" src="../assets/loading.svg" />
  </div>
</template>

<style lang="scss" scoped>
#loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: white;
  z-index: 998;
  display: flex;
  align-content: center;
  justify-content: center;
  cursor: wait;
  transition: opacity 0.2s;
  opacity: 0;
  visibility: hidden;

  &.show {
    visibility: visible;
    opacity: 0.7;
  }

  &.end {
    visibility: visible;
    opacity: 0;
  }

  & > img {
    width: 150px;
  }
}
</style>
