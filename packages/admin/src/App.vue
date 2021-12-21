<script setup>
import Alert from './components/Alert.vue'
import Loading from './components/Loading.vue'
import Modal from './components/Modal.vue'
</script>

<template>
  <router-view></router-view>
  <Alert />
  <Modal />
  <Loading />
</template>
