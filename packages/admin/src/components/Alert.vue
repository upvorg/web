<template>
  <div class="alert-warp">
    <div
      v-for="item in queue"
      :key="item.type"
      :class="[
        'alert',
        `alert-${
          item.type === 'info' ? '' : item.type
          /* hack tailwindcss jit */
        }` /** alert-info alert-success alert-warning */,
      ]"
    >
      <div class="flex-1">
        <svg
          v-if="item.type === 'warning'"
          class="w-6 h-6 mx-2 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
        <svg
          v-else-if="item.type === 'info'"
          class="w-6 h-6 mx-2 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>

        <svg
          v-else-if="item.type === 'success'"
          class="flex-shrink-0 w-6 h-6 mx-2"
          fill="none"
          stroke="#009688"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>

        <label>{{ item.text }}</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity'
import emitter, { AlertPayload } from '../utils/emitter'

const queue = ref<AlertPayload[]>([])
const timer = ref<number | null>(null)

emitter.on('alert', (e: AlertPayload) => {
  queue.value.push(e)
  if (timer.value == null) {
    timer.value = shift()
  }
})

const shift = () =>
  setInterval(() => {
    if (queue.value.length === 1) {
      clearInterval(timer.value!)
      timer.value = null
    }
    queue.value.shift()
  }, 1200)
</script>

<style lang="scss" scoped>
.alert-warp {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;

  .alert {
    background-color: white;
    animation: t2d 0.3s forwards;
    margin: 10px 0;
    transition: all 0.3s;
    border: 1px solid var(--second);
  }

  @keyframes t2d {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
}
</style>
