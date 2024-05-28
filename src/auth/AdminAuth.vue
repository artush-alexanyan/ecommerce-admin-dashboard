<template>
  <div>
    <BaseAlert :messages="messages" />
    <div class="flex items-center justify-center h-screen">
      <div class="login-form p-5">
        <h1 class="text-center mb-5 text-2xl">Login</h1>
        <form @submit.prevent="loginWithEmailAndPassword">
          <div class="flex flex-col my-5">
            <label class="text-sm mb-1.5 font-semibold" for="email">Email</label>
            <div class="relative">
              <div class="absolute left-2 top-1/2 transform -translate-y-1/2">
                <unicon name="envelope" fill="#A3A3A3" height="20"></unicon>
              </div>
              <input
                v-model="email"
                required
                placeholder="Email"
                type="email"
                class="w-full text-sm px-8 py-2.5 border border-gray-400 outline-0 focus:border-blue-600"
                id="email"
              />
            </div>
          </div>
          <div class="flex flex-col my-5">
            <label class="text-sm mb-1.5 font-semibold" for="password">Password</label>
            <div class="relative">
              <div class="absolute left-2 top-1/2 transform -translate-y-1/2">
                <unicon name="lock" fill="#A3A3A3" height="20"></unicon>
              </div>
              <input
                v-model="password"
                required
                placeholder="Password"
                type="password"
                class="w-full text-sm px-8 py-2.5 border border-gray-400 outline-0 focus:border-blue-600"
                id="password"
              />
            </div>
          </div>
          <button
            type="submit"
            :disabled="loginLoading"
            class="flex items-center justify-center text-sm space-x-1 w-full bg-[#0B877F] text-white px-5 py-2.5"
          >
            <span>Login</span>
            <unicon
              v-if="loginLoading"
              name="spinner"
              fill="white"
              height="16"
              class="animate-spin"
            ></unicon>
            <unicon v-else name="sign-out-alt" fill="white" height="16"></unicon>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import BASE_URL from '@/backand/api'
import BaseAlert from '@/base/BaseAlert.vue'
import { useCookies } from 'vue3-cookies'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const messages = ref([])
const loginLoading = ref(false)
const { cookies } = useCookies()
const router = useRouter()

const resetMessage = () => {
  setTimeout(() => {
    messages.value = []
  }, 2000)
}
const loginWithEmailAndPassword = async () => {
  loginLoading.value = true
  const options = {
    email: email.value,
    password: password.value
  }
  try {
    const response = await BASE_URL.post('/auth/login', options)
    const token = response.data.token
    cookies.set('jwt_token', token)
    loginLoading.value = false
    messages.value.push({
      type: 'Success',
      message: 'Login successful. Redirecting to dashboard...'
    })
    setTimeout(() => {
      router.push({ path: '/' })
    }, 2500)
  } catch (error) {
    loginLoading.value = false
    console.error(error)
    const authError = error.response ? error.response.data.message : error.message
    messages.value.push({
      type: 'Error',
      message: authError
    })
    resetMessage()
  }
}
</script>

<style scoped></style>
