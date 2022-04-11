<template>
  <form @submit.prevent="onLogin">
    <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
      <div class="text-center">
        <ul class="menu px-3 shadow-lg bg-base-100 rounded-box horizontal">
          <li class="bordered">
            <a>登录</a>
          </li>
          <li @click="register">
            <a>注册</a>
          </li>
        </ul>
      </div>

      <div class="card-body">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Name</span>
          </label>
          <input type="text" placeholder="name" class="input input-bordered" v-model="name" />
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="password"
            class="input input-bordered"
            v-model="pwd"
          />
          <!--          <label class="label">-->
          <!--            <a href="#" class="label-text-alt" @click="register">Register</a>-->
          <!--          </label>-->
        </div>
        <div class="form-control mt-6">
          <input type="submit" value="Login" class="btn btn-primary" />
        </div>
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { login } from '../utils/api'
import { GlobalState, setLocalToken, setLocalUser } from '../utils/localstorage'
import { useRouter } from 'vue-router'

const name = ref('')
const pwd = ref('')
const router = useRouter()

onMounted(() => {})

const onLogin = () => {
  login({ name: name.value, pwd: pwd.value }).then(({ data }) => {
    setLocalToken(data.token)
    setLocalUser(data.user)
    GlobalState.user = data.user

    const r = new URLSearchParams(location.search).get('r')
    if (r) {
      location.href = r
    } else {
      router.push('/')
    }
  })
}

const register = () => {
  router.push({ path: '/register', replace: true })
}
</script>

<style scoped>
@import url(../assets/auth.css);
</style>
