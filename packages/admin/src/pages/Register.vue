<template>
  <form @submit.prevent="onregister">
    <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
      <div class="text-center">
        <ul class="menu px-3 shadow-lg bg-base-100 rounded-box horizontal">
          <li @click="onLogin">
            <a>登录</a>
          </li>
          <li class="bordered">
            <a>注册</a>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Name</span>
          </label>
          <input type="text" placeholder="Name" class="input input-bordered" v-model="name" />
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">Password</span>
          </label>
          <input type="password" placeholder="password" class="input input-bordered" v-model="pwd" />
          <!--          <label class="label">-->
          <!--            <a href="#" class="label-text-alt" @click="onLogin">Login</a>-->
          <!--          </label>-->
        </div>
        <div class="form-control mt-6">
          <input type="submit" value="Sign In" class="btn btn-primary" />
        </div>
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../utils/api'

const name = ref('')
const pwd = ref('')
const router = useRouter()

const onLogin = () => {
  router.push('/login')
}

const onregister = () => {
  register(name.value, pwd.value, '').then((_) => {
    _.code === 200 && onLogin()
  })
}
</script>

<style scoped>
@import url(../assets/auth.css);
</style>
