import './style/index.scss'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import plugin from "./plugin"
import './tool/http.js'

const app = createApp(App)
app.use(router)
app.use(plugin)
app.mount('#app')