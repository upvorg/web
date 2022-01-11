<template>
  <div class="flex flex-col space-y-4 max-w-xs">
    <span class="inline-block"><span class="label-text">用户名</span> ：{{ user.name?.toUpperCase() }}</span>

    <input
      id="file"
      name="file"
      style="display: none"
      type="file"
      accept="image/png, image/jpeg"
      @change="avatarFile = ($event as any)?.target?.files[0]"
    />
    <label for="file">
      <div class="w-24 h-24 p-px mask mask-squircle bg-base-content bg-opacity-10">
        <img :src="user.avatar" width="94" height="94" alt="Avatar Tailwind CSS Component" class="mask mask-squircle" />
      </div>
    </label>
    <input
      v-model="user.avatar"
      class="input input-sm input-bordered"
      placeholder="这个人很懒什么都没有留下"
      type="text"
    />

    <div class="form-control">
      <label class="label">
        <span class="label-text">昵称</span>
      </label>
      <input v-model="user.nickname" class="input input-bordered input-sm" placeholder="nickname" type="text" />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">签名</span>
      </label>
      <input v-model="user.bio" class="input input-bordered" placeholder="这个人很懒什么都没有留下" type="text" />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">角色</span>
      </label>

      <select v-model="user.level" class="select select-sm select-bordered w-full max-w-xs">
        <option
          v-for="item in Object.keys(USER_ROLE_STATE_MAP)"
          :disabled="GlobalState.user!.level >= +item"
          :value="+item"
        >
          {{ USER_ROLE_STATE_MAP[item as unknown as keyof typeof USER_ROLE_STATE_MAP] }}
        </option>
      </select>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">状态</span>
      </label>

      <select v-model="user.status" class="select select-sm select-bordered w-full max-w-xs">
        <option v-for="item in Object.keys(USER_STATUS)" :disabled="GlobalState.user!.level > 1" :value="item">
          {{ USER_STATUS[item  as unknown as keyof typeof USER_STATUS] }}
        </option>
      </select>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">密码</span>
      </label>
      <input v-model="pwd" class="input input-bordered input-sm" placeholder="密码：留空则不修改" type="text" />
    </div>

    <p class="text-slate-400">注册时间: {{ user.create_time }}</p>
    <p><button class="btn btn-primary btn-sm" @click="update">修改</button></p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { USER_ROLE_STATE_MAP, USER_STATUS } from '../constant'
import { getUser, updateUser } from '../utils/api'
import { GlobalState, removeLocalUser, User } from '../utils/localstorage'

export default defineComponent({
  data() {
    return {
      user: {} as User,
      pwd: null,
      avatarFile: null,
      USER_STATUS,
      USER_ROLE_STATE_MAP,
      GlobalState
    }
  },
  mounted() {
    this.get()
  },
  methods: {
    get() {
      getUser(null, this.$route.params.uid, null).then((res) => {
        this.user = res.data
        if (+(this.$route.params.uid as string) == GlobalState.user!.id) {
          GlobalState.user = res.data
        }
      })
    },
    update() {
      updateUser({ pwd: this.pwd, ...this.user }).then((_) => {
        if (this.user.id === GlobalState.user!.id && this.pwd) {
          removeLocalUser()
          this.$router.push({ path: '/login', replace: true })
        } else {
          this.get()
        }
      })
    }
  }
})
</script>
