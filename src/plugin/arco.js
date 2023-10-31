import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'

export const install = (app) => {
  ArcoVue.Message._context = app._context
  app.use(ArcoVue)
}