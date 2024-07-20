import { defineStore } from 'pinia'
import BASE_URL from '@/backand/api'
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()

export const useCheckAuthStore = defineStore('CheckAuthStore', {
  state: () => ({
    user: null,
    authCheckLoading: false
  }),

  actions: {
    async checkAuthState() {
      try {
        this.authCheckLoading = true
        const token = cookies.get('jwt_token')
        const response = await BASE_URL.get('/auth/checkAuth', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const userData = response.data.user
        this.user = userData
        this.cart = userData.cart.items
        this.cartTotal = userData.cart.total
        this.authCheckLoading = false
      } catch (error) {
        this.authCheckLoading = false
        console.error(error)
      }
    }
  }
})
