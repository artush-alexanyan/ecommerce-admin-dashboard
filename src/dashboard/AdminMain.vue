<template>
  <div>
    <div class="main">
      <SidebarRoot :user="user" :auth-check-loading="authCheckLoading" />
      <div class="content ml-auto bg-gray-50" :style="contentSize">
        <HeaderRoot :user="user" :contentSize="contentSize" />
        <div class="main-content h-screen overflow-x-hidden overflow-y-auto px-10 pt-24 pb-10">
          <RouterView></RouterView>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useCheckAuthStore } from '@/stores/checauthstate.js'
import SidebarRoot from './sidebar/SidebarRoot.vue'
import HeaderRoot from './header/HeaderRoot.vue'

const checkAuthState = useCheckAuthStore()
const user = computed(() => checkAuthState.user)
const authCheckLoading = computed(() => checkAuthState.authCheckLoading)
const contentSize = ref('')

const logScreenWidth = () => {
  const innerWdt = window.innerWidth
  const sidebarWidth = 240
  const contentWidth = innerWdt - sidebarWidth
  contentSize.value = `width: ${contentWidth}px;`
}
const logScreenHeight = () => {
  const innerHgt = window.innerHeight
  console.log('innerHgt', innerHgt)
}
onBeforeUnmount(() => {
  window.removeEventListener('resize', logScreenWidth)
  window.removeEventListener('resize', logScreenHeight)
})
onMounted(async () => {
  logScreenWidth()
  window.addEventListener('resize', logScreenWidth)
  window.addEventListener('resize', logScreenHeight)
  await checkAuthState.checkAuthState()
})
</script>

<style scoped></style>
