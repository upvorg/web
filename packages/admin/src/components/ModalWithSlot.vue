<template>
  <div :class="['modal', 'show']">
    <div class="modal-box">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.show {
  visibility: visible;
  opacity: 1;
}

.modal {
  pointer-events: all;
  align-items: flex-start;
}
</style>
