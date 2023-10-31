import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    AutoImport({
      imports: [
        'vue',
        {
          md5: [['default', 'md5']],
        },
        {
          'query-string': [['default', 'qs']],
        },
      ],
      vueTemplate: true,
      defaultExportByFilename: true,
      dirs: [
        './src/config',
        './src/constant',
        './src/tool',
        './src/tool',
        './src/hook',
        './src/store',
        './src/enum',
        './src/export-merge',
      ],
      dts: true, // 路径下自动生成文件夹存放全局指令
    })
  ]
})
