declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.css'
declare module '*.less'
declare module '*.png'
declare module '*.svg' {
  const url: string
  export default url
}

declare var __DEV__: boolean
