import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { decryptDes } from '@/utils/des'
const service: AxiosInstance = axios.create({
  // baseURL: 'http://192.168.31.110:18091',
  // baseURL: 'http://192.168.31.36:8091',
  baseURL: 'https://privacy.biggerlens.cn:18091',

  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token && config.headers) {
      config.headers['token'] = `${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    if (typeof response.data === 'string') {
      console.log('response', decryptDes(response.data))
      const { code, msg } = JSON.parse(decryptDes(response.data))

      if (code == 3) {
        ElMessage.error(msg)
        localStorage.removeItem('token')
        router.push('/login')
      }
      // if (code != 200) {
      //   console.log('message', msg)
      //   ElMessage.error(msg)
      // }
    }

    return response
  },
  (error) => {
    const { response } = error
    if (response) {
      switch (response.status) {
        case 401:
          ElMessage.error('未授权，请重新登录')
          localStorage.removeItem('token')
          router.push('/login')
          break
        case 403:
          ElMessage.error('拒绝访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器错误')
          break
        default:
          ElMessage.error('网络错误')
      }
    } else {
      if (error.message.includes('timeout')) {
        ElMessage.error('请求超时')
      } else {
        ElMessage.error('网络错误')
      }
    }
    return Promise.reject(error)
  },
)

export default service
