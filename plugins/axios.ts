import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  // 创建一个 axios 实例
  const service: AxiosInstance = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com', // 默认API基础URL
    timeout: 15000, // 请求超时时间
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })

  // 请求拦截器
  service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 可以在这里添加token等认证信息
      // 例如：
      // const token = localStorage.getItem('token')
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`
      // }
      
      // 可以根据环境变量配置不同的baseURL
      // if (process.env.NODE_ENV === 'production') {
      //   config.baseURL = 'https://api.production.com'
      // }
      
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  service.interceptors.response.use(
    (response: AxiosResponse) => {
      const res = response.data
      
      // 如果响应状态码不是200，认为请求有错误
      if (response.status !== 200) {
        // 可以在这里统一处理不同的错误状态码
        // 例如:
        // if (response.status === 401) {
        //   // 未授权，可能需要重新登录
        //   navigateTo('/login')
        // }
        
        return Promise.reject(new Error(response.statusText || 'Error'))
      }
      
      // 直接返回数据
      return res
    },
    (error) => {
      // 处理网络错误或其他错误
      console.error('请求错误:', error)
      
      // 可以处理特定的错误响应
      if (error.response) {
        switch (error.response.status) {
          case 401:
            // 未授权，跳转到登录页面
            // navigateTo('/login')
            break
          case 403:
            // 禁止访问
            break
          case 404:
            // 资源不存在
            break
          case 500:
            // 服务器错误
            break
        }
      }
      
      return Promise.reject(error)
    }
  )

  // 提供类型化的请求方法
  const http = {
    get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
      return service.get(url, { params, ...config })
    },
    
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
      return service.post(url, data, config)
    },
    
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
      return service.put(url, data, config)
    },
    
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
      return service.delete(url, config)
    },
    
    // 原始axios实例，以防需要更高级的用法
    service
  }

  // 提供给全局使用
  nuxtApp.provide('http', http)
})

// 声明类型扩展
declare module '#app' {
  interface NuxtApp {
    $http: {
      get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T>
      post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
      put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
      delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
      service: AxiosInstance
    }
  }
}

// 为了在组件中使用this.$http
declare module 'vue' {
  interface ComponentCustomProperties {
    $http: {
      get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T>
      post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
      put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
      delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
      service: AxiosInstance
    }
  }
} 