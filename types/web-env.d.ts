declare module '*.css'
declare module '*.less'
declare module '*.png'
declare module '*.svg' {
  const url: string
  export default url
}

declare global {
  //TODO: not works
  interface Window {
    cookieStore: any
  }
}

declare var __DEV__: boolean
declare var __API_HOST__: string
declare var __STORAGE_HOST__: string
declare var __ADMIN_HOST__: string
