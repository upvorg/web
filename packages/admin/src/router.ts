import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router'
import { getLocalToken } from './utils/localstorage'

// const pages = require.context('./pages', false, /.vue$/)

const createRoute = (
  name: string,
  path: string = '',
  children?: RouteRecordRaw[]
): RouteRecordRaw => {
  return {
    path: `/${path || name.toLocaleLowerCase()}`,
    name: name,
    component: () => import(`./pages/${name}.vue`),
    children,
  }
}

const router = createRouter({
  history: createWebHashHistory(__ROUTER_BASE__),
  routes: [
    {
      path: '/',
      component: () => import(`./pages/App.vue`),
      children: [
        createRoute('Upload', '', [createRoute('Upload', 'upload/:gv')]),
        createRoute('PostManage'),
        createRoute('UserManage', 'users', []),
        createRoute('UserEditor', 'user/:uid'),
      ],
    },
    createRoute('Register'),
    createRoute('Login'),
  ],
})

router.beforeEach((to, _, next) => {
  document.documentElement.scrollTo(0, 0)
  document.body.scrollTo(0, 0)
  if (to.name !== 'Login' && to.name !== 'Register' && !getLocalToken()) next({ name: 'Login' })
  else next()
})

export default router
