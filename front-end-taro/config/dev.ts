import type { UserConfigExport } from "@tarojs/cli"

export default {
  mini: {},
  h5: {
    // 在H5环境下启用导航栏
    enableExtract: true,
    navigationStyle: 'default'
  }
} satisfies UserConfigExport<'vite'>
