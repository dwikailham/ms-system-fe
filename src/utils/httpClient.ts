import axios from 'axios'

const BASE_URL = 'http://localhost:5000'

export const HttpClient = axios.create({
  timeout: 325000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  baseURL: BASE_URL
})
