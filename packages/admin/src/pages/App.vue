<template>
  <div class="drawer drawer-mobile">
    <input id="main-menu" type="checkbox" class="drawer-toggle" />

    <div class="flex-grow block overflow-x-hidden bg-base-100 text-base-content drawer-content">
      <div
        id="nav"
        class="inset-x-0 top-0 z-50 w-full transition duration-200 ease-in-out border-b border-base-200 bg-base-100 text-base-content sticky"
      >
        <div class="mx-auto space-x-1 navbar max-w-none">
          <div class="flex-none lg:hidden">
            <label for="main-menu" class="btn btn-square btn-ghost drawer-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block w-6 h-6 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>
          <div class="flex items-center flex-none lg:hidden">
            <router-link
              to="/"
              class="px-2 flex-0 btn btn-ghost md:px-4 nuxt-link-active"
              aria-label="Homepage"
            >
              <div class="inline-block text-2xl font-title text-primary">
                <span class="lowercase">创作者</span>
                <span class="uppercase text-base-content">中心</span>
              </div>
            </router-link>
          </div>
          <div class="flex-1"></div>
          <div title="Change Theme" class="dropdown dropdown-end">
            <div tabindex="0" class="m-1 normal-case btn-ghost btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block w-6 h-6 stroke-current md:mr-2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
              <span class="hidden md:inline">Change Theme</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1792 1792"
                class="inline-block w-4 h-4 ml-1 fill-current"
              >
                <path
                  d="M1395 736q0 13-10 23l-466 466q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393 393-393q10-10 23-10t23 10l50 50q10 10 10 23z"
                />
              </svg>
            </div>
            <div
              class="mt-16 overflow-y-auto shadow-2xl top-px dropdown-content h-38 w-52 rounded-b-box bg-base-200 text-base-content"
            >
              <ul class="p-4 menu compact">
                <li
                  v-for="theme in [
                    ['🌝', 'corporate'],
                    ['🌚', 'wireframe'],
                    ['📝', 'dark']
                  ]"
                >
                  <a tabindex="0" :data-set-theme="theme[1]" data-act-class="active">{{
                    theme.join('  ')
                  }}</a>
                </li>
              </ul>
            </div>
          </div>

          <div class="dropdown dropdown-end">
            <div tabindex="0" class="btn btn-ghost rounded-btn">
              <div :class="{ avatar: true, placeholder: !user.avatar }">
                <div
                  class="rounded-full w-8 h-8 ring ring-primary ring-offset-base-100 ring-offset-2 bg-neutral-focus text-neutral-content"
                  :class="{
                    'mr-4': user.avatar
                  }"
                >
                  <img v-if="user.avatar" :src="user.avatar" />
                  <span>{{ user?.name[0] }}</span>
                </div>
              </div>
            </div>
            <ul
              tabindex="0"
              class="mt-16 top-px dropdown-content w-52 rounded-b-box bg-base-200 text-base-content p-2 shadow menu"
            >
              <li @click="logout">
                <a>退出</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <main class="p-4 lg:p-10">
        <router-view></router-view>
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
    </div>

    <div class="drawer-side">
      <label for="main-menu" class="drawer-overlay"></label>
      <aside
        class="flex flex-col border-r border-base-200 bg-base-100 text-base-content w-64 md:w-80"
      >
        <div
          class="sticky inset-x-0 top-0 z-50 hidden w-full py-1 transition duration-200 ease-in-out border-b lg:block border-base-200 bg-base-100"
        >
          <div class="mx-auto space-x-1 navbar max-w-none">
            <div class="flex items-center flex-none">
              <a
                href="/"
                class="px-2 flex-0 btn btn-ghost md:px-4 nuxt-link-active"
                aria-label="Homepage"
              >
                <div class="inline-block text-3xl font-title text-primary">
                  <span class="lowercase">创作者</span>
                  <span class="uppercase text-base-content">中心</span>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div>
          <ul class="menu flex flex-col p-4 pt-2 compact bg-base-100 rounded-box">
            <li class="mt-4 menu-title">
              <span>Action</span>
            </li>
            <li v-for="nav in navList">
              <router-link
                :to="nav.path"
                exact
                active-class="capitalize active nuxt-link-active"
                class="capitalize"
              >
                <span class="icon material-icons material-icons-outlined mr-2 text-lg">{{
                  nav.icon
                }}</span>
                {{ nav.title }}
              </router-link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getLocalUser, logout } from '../utils/localstorage'
import { onMounted } from 'vue'
import { get } from '../utils/api'

// https://fonts.google.com/icons?selected=Material+Icons&icon.query=edit
const user = getLocalUser()
const navList = [
  {
    name: 'dashboard',
    path: '/dashboard',
    title: 'Dashboard',
    level: 99,
    icon: 'dashboard'
  },
  {
    name: 'upload',
    path: '/upload',
    title: '投稿',
    level: 2,
    icon: 'edit'
  },
  {
    name: 'post',
    path: '/posts',
    title: '文章',
    level: 0,
    icon: 'vertical_split'
  },
  {
    name: 'users',
    path: '/users',
    title: '用户',
    level: 0,
    icon: 'people'
  },
  {
    name: 'user',
    path: `/user/${user.id}`,
    title: '账号',
    level: 99,
    icon: 'account_circle'
  }
].filter((_) => _.level >= user.level)

onMounted(() => {
  get('/me')
  document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'light')
  document.querySelectorAll('[data-set-theme]').forEach((e) => {
    e.addEventListener('click', function () {
      document.documentElement.setAttribute('data-theme', e.getAttribute('data-set-theme')!)
      localStorage.setItem('theme', document.documentElement.getAttribute('data-theme')!)
      document.querySelectorAll('[data-set-theme]').forEach((e) => {
        e.classList.remove(e.getAttribute('data-act-class')!)
      })
      e.getAttribute('data-act-class') && e.classList.add(e.getAttribute('data-act-class')!)
    })
  })
})
</script>
