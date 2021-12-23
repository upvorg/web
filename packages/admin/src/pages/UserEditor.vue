<template>
  <div>
    <div class="form-control">
      <label class="label">
        <span class="label-text">用户名</span>
      </label>
      <input v-model="user.name" class="input input-bordered" placeholder="username" type="text" />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">签名</span>
      </label>
      <input
        v-model="user.bio"
        class="input input-bordered"
        placeholder="这个人很懒什么都没有留下"
        type="text"
      />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">角色</span>
      </label>

      <select v-model="user.level" class="select select-bordered w-full max-w-xs">
        <option
          v-for="item in Object.keys(USER_ROLE_STATE_MAP)"
          :disabled="GlobalState?.user?.level >= +item"
          :value="+item"
        >
          {{ USER_ROLE_STATE_MAP[item] }}
        </option>
      </select>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">状态</span>
      </label>

      <select v-model="user.status" class="select select-bordered w-full max-w-xs">
        <option
          v-for="item in Object.keys(USER_STATUS)"
          :disabled="GlobalState.user.level > 1"
          :value="item"
        >
          {{ USER_STATUS[item] }}
        </option>
      </select>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">密码</span>
      </label>
      <input
        v-model="pwd"
        class="input input-bordered"
        placeholder="密码：留空则不修改"
        type="text"
      />
    </div>

    <p>注册时间: {{ user.create_time }}</p>
    <button class="btn btn-primary btn-sm" @click="update">修改</button>
  </div>
</template>

<script lang="ts">
import { USER_ROLE_STATE_MAP, USER_STATUS } from '../constant'
import { getUser, updateUser } from '../utils/api'
import { GlobalState, setLocalToken, removeLocalUser, User } from '../utils/localstorage'

export default {
  data() {
    return {
      user: {} as User,
      pwd: null,
      USER_STATUS,
      USER_ROLE_STATE_MAP,
      GlobalState,
    }
  },
  mounted() {
    this.get()
  },
  methods: {
    get() {
      getUser(null, this.$route.params.uid, null).then((res) => {
        this.user = res.data
        if (this.$route.params.uid === GlobalState.user.id) {
          GlobalState.user = res.data
        }
      })
    },
    update() {
      updateUser({ pwd: this.pwd, ...this.user }).then((_) => {
        if (this.user.id === GlobalState.user.id && this.pwd) {
          removeLocalUser()
          this.$router.push({ path: '/login', replace: true })
        } else {
          this.get()
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.form-control {
  width: 40%;
  min-width: 400px;
}

button {
  display: block;
  margin: 0 auto;
}

input :read-only {
  cursor: not-allowed;
}

p {
  margin: 20px auto 10px;
}
</style>
