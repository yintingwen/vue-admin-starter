import axios from "axios"
// import router from "./router"
import { Message } from '@arco-design/web-vue';

axios.defaults.baseURL = 'https://hcgjb.jicheng56.com:8001/diversion-tools-mini-apps/app'

axios.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("token")
    // if (config.url !== "/gft/login" && !token) {
    //   router.replace("/login")
    //   return Promise.reject("请先登录")
    // }
    // // 已登录
    // config.headers.token = token
    return config
  },
  (config) => {
    return Promise.reject(config)
  }
)

// 响应拦截
axios.interceptors.response.use(
  (response) => {
    const { data, code, msg } = response.data
    if (code === 0) {
      return data
    }
    Message.error(msg)
    return Promise.reject(msg)
  },
  (error) => {
    console.log(error);
    return Promise.reject(error)
  }
)

/**
 * 创建错误
 * @param {*} message 错误信息
 * @param {*} code 错误码
 * @returns
 */
function createError(message, code) {
  const error = new Error(message)
  error.code = code
  return error
}
