import './style/index.scss'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import plugin from "./plugin"

const app = createApp(App)
app.use(router)
app.use(plugin)
app.mount('#app')