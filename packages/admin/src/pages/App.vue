<template>
  <header>
    <div pointer>
      <img alt="logo" src="../assets/logo.jpeg" />
      clicli 投稿中心
    </div>

    <div class="dropdown dropdown-hover dropdown-end">
      <div class="avatar placeholder" tabindex="0">
        <div class="bg-neutral-focus text-neutral-content rounded-full">
          <span>{{ user.name?.[0] }}</span>
        </div>
      </div>
      <ul class="shadow menu dropdown-content bg-base-100 rounded-box w-52" tabindex="0">
        <li @click="logout">
          <a>退出</a>
        </li>
      </ul>
    </div>
  </header>
  <nav>
    <ul>
      <router-link to="/upload" class="upload">
        <li v-if="isCreator(user.level)">投稿</li>
      </router-link>
      <router-link to="/postmanage">
        <li v-if="isCreator(user.level)">文章</li>
      </router-link>
      <router-link to="/users">
        <li v-if="isAdmin(user.level)">用户</li>
      </router-link>
      <router-link :to="`/user/${user?.id}`">
        <li>账号</li>
      </router-link>
    </ul>
  </nav>
  <main>
    <section>
      <router-view></router-view>
    </section>
  </main>

  <footer class="p-4 footer bg-base-200 text-base-content footer-center">
    <div class="grid grid-flow-col gap-4">
      <a class="link link-hover">About us</a>
      <a class="link link-hover">Contact</a>
      <a class="link link-hover">Press kit</a>
    </div>
    <div>
      <div class="grid grid-flow-col gap-4">
        <a>
          <svg
            class="fill-current"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
            />
          </svg>
        </a>
        <a>
          <svg
            class="fill-current"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
            />
          </svg>
        </a>
        <a>
          <svg
            class="fill-current"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
            />
          </svg>
        </a>
      </div>
    </div>
    <div>
      <p>Copyright © 2021 - All right reserved</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import router from '../router'
import { getLocalUser, GlobalState, setLocalToken, setLocalUser } from '../utils/localstorage'
import { isAdmin, isCreator } from '../constant'
import { onMounted } from 'vue'

const user = getLocalUser()

onMounted(() => {
  if (isAdmin(user.level)) {
    router.push({ path: 'postmanage', replace: true })
  } else if (isCreator(user.level)) {
    router.push({ path: 'upload', replace: true })
  } else {
    router.push({ path: '/user/' + user.id, replace: true })
  }
})

const logout = () => {
  setLocalToken('')
  setLocalUser('' as any)
  GlobalState.user = null
  router.push({ path: '/login', replace: true })
}
</script>

<style lang="scss" scoped>
header {
  display: flex;
  align-items: center;
  background: #fff;
  color: var(--theme);
  font-weight: bold;
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 1px 1px 10px #e2dcec;
  right: 0;
  z-index: 99;
  justify-content: space-between;
}

header img {
  width: 40px;
  height: 40px;
  margin: 15px;
  border-radius: 10px;
  display: inline-block;
}

.bg-neutral-focus {
  background-color: var(--second);

  span {
    color: var(--theme);
  }
}

.avatar > div {
  width: 40px;
  height: 40px;
  margin-right: 15px;
}

nav {
  width: 250px;
  height: 100%;
  position: fixed;
  border-right: 1px solid var(--second);
  box-sizing: border-box;
  margin-top: 70px;

  li {
    /* border-right: 2px solid var(--theme); */
    margin: 50px 0;
    padding: 10px 50px;
    text-align: right;
    /* border-right: 5px solid var(--bg); */
  }

  .router-link-exact-active li,
  .router-link-active.upload li {
    border-right: 5px solid var(--theme);
    background: var(--second);
    color: var(--theme);
    box-sizing: border-box;
  }
}

main {
  padding: 100px 50px 20px 300px;

  section {
    max-width: 80%;
    margin: 0 auto;
  }
}
</style>
