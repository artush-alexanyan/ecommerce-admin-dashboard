import axios from 'axios'
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()
const jwt_token = cookies.get('jwt_token')
const API_URL = import.meta.env.VITE_API_BASE_URL;

const BASE_URL = axios.create({
    baseURL: API_URL,
    headers: {
        Authorization: `Bearer ${jwt_token}`
    },
})

export default BASE_URL
