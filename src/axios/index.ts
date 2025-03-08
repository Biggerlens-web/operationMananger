import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const service: AxiosInstance = axios.create({
  baseURL: 'https://inapp.iepose.cn/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    config.withCredentials = true
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

// 封装 GET 请求
export function get<T>(url: string, params?: any): Promise<T> {
  return service.get(url, { params })
}

// 封装 POST 请求
export function post<T>(url: string, data?: any): Promise<T> {
  return service.post(url, data)
}

// 封装 PUT 请求
export function put<T>(url: string, data?: any): Promise<T> {
  return service.put(url, data)
}

// 封装 DELETE 请求
export function del<T>(url: string): Promise<T> {
  return service.delete(url)
}

export default service
