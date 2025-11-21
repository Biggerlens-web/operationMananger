import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { decryptDes } from '@/utils/des'
import { getToken, removeToken } from '@/utils/cookie'
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = getToken()

    if (token && config.headers) {
      config.headers['token'] = `${token}`
    }

    // 如果是FormData，删除Content-Type让浏览器自动设置
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
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
    const url = response.request.responseURL
    // console.log('response', response)
    if (url.includes('/companyInfo/importTemplate')) {
      return response
    }
    if (typeof response.data === 'string') {
      console.log('response', decryptDes(response.data))
      const { code, msg } = JSON.parse(decryptDes(response.data))

      if (code == 3) {
        if (window.location.pathname != '/login') {
          ElMessage.error(msg)
          removeToken()
          router.push('/login')
        }
      } else if (code == 1046) {
        ElMessage.error(msg)
      }
    }

    return response
  },
  (error) => {
    const { response } = error
    if (response) {
      switch (response.status) {
        case 401:
          ElMessage.error('未授权，请重新登录')
          removeToken()
          router.push('/login')
          break
        case 403:
          console.log('response', response)
          ElMessage.error(response.data.message)
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
