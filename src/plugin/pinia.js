import { createPinia } from 'pinia'

export const install = (app) => {
  app.use(createPinia())
}