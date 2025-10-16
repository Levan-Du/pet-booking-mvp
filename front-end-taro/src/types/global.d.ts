declare module 'react' {
  import * as React from 'react'
  export = React
}

declare module 'react/jsx-runtime' {
  const jsxRuntime: any
  export = jsxRuntime
}

declare module '@tarojs/taro' {
  import * as Taro from '@tarojs/taro'
  export = Taro
}

declare module '@tarojs/components' {
  import * as TaroComponents from '@tarojs/components'
  export = TaroComponents
}

declare module 'jwt-decode' {
  export function jwtDecode(token: string): any
  export default jwtDecode
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.jpeg' {
  const content: string
  export default content
}

declare module '*.gif' {
  const content: string
  export default content
}

declare module '*.svg' {
  const content: string
  export default content
}