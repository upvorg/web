declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.png' {
  const url: string
  export default url
}

declare var __GH__: boolean
declare var __ROUTER_BASE__: string
declare var __DEV__: boolean
