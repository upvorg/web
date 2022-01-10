import { createRouter, RouteRecordRaw, createWebHistory } from 'vue-router'
import { getLocalToken } from './utils/localstorage'

const createRoute = (name: string, path: string = '', children?: RouteRecordRaw[]): RouteRecordRaw => {
  return {
    path: `/${path || name.toLocaleLowerCase()}`,
    name: name,
    component: () => import(`./pages/${name}.vue`),
    children
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import(`./pages/App.vue`),
      redirect: 'dashboard',
      children: [
        createRoute('Upload', '', [createRoute('Upload', 'upload/:gv')]),
        createRoute('PostManage', 'posts'),
        createRoute('UserManage', 'users', []),
        createRoute('UserEditor', 'user/:uid'),
        createRoute('Dashboard')
      ]
    },
    createRoute('Register'),
    createRoute('Login')
  ]
})

router.beforeEach((to, _, next) => {
  document.documentElement.scrollTo(0, 0)
  document.body.scrollTo(0, 0)
  if (to.name !== 'Login' && to.name !== 'Register' && !getLocalToken()) next({ name: 'Login' })
  else next()
})

export default router
