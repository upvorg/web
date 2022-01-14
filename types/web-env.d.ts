declare module '*.css'
declare module '*.less'
declare module '*.png'
declare module '*.svg' {
  const url: string
  export default url
}