import axios from 'axios'

// Retrieve environment variables
const API_URL_DEV = import.meta.env.VITE_API_BASE_URL
const API_URL_PROD = import.meta.env.VITE_API_BASE_URL_PROD

// Determine the base URL based on the environment
const isProduction = import.meta.env.MODE === 'production'
const BASE_URL = isProduction ? API_URL_PROD : API_URL_DEV

// Create the Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
})

export default axiosInstance
