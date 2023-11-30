import axios from 'axios'

const service = axios.create({
  // baseURL: import.meta.env.VITE_APP_BASE_API
  baseURL: "https://ghi-dev.everfortuneai.com.tw/api/v1"
})

service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {

    return Promise.reject(error)
  }
)

export default service
