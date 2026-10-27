import axios, { AxiosRequestConfig } from 'axios'

export function request(config: AxiosRequestConfig) {
  const instance = axios.create({
    timeout: 5000,
  })

  return instance(config)
}
