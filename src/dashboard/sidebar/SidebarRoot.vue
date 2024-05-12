<template>
  <div>
    <div class="sidebar fixed top-0 left-0 w-56 bg-white">
      <aside class="relative h-screen">
        <div class="logo_wrapper mt-5 mb-10 ml-7">
          <h2 class="text-xl">
            <span class="text-[#0B877F] font-semibold">Online</span>
            <span>Store</span>
          </h2>
        </div>
        <div class="title text-gray-500 uppercase text-xs mb-2 ml-7">General menu</div>
        <div class="sidebar-content">
          <ul>
            <li
              @click="changeTab(tab)"
              class="py-3.5 cursor-pointer"
              :class="{
                'border-l-4 border-l-[#0B877F] text-[#0B877F]': generalCurrentTab === tab
              }"
              v-for="(list, tab) in generalList"
              :key="list.id"
            >
              <div
                class="flex items-center space-x-2"
                :class="generalCurrentTab === tab ? 'pl-6' : 'pl-7'"
              >
                <unicon
                  :name="list.icon"
                  height="20"
                  :fill="generalCurrentTab === tab ? '#0B877F' : ''"
                ></unicon>
                <router-link :to="list.path" class="text-sm font-semibold">
                  {{ list.title }}
                </router-link>
              </div>
            </li>
          </ul>
        </div>
        <div class="list_wrapper mt-5">
          <div class="title text-gray-500 uppercase text-xs mb-2 ml-7">Support menu</div>
          <div class="sidebar-content">
            <ul>
              <li
                @click="changeTab(tab)"
                class="py-3.5 cursor-pointer"
                :class="{
                  'border-l-4 border-l-[#0B877F] text-[#0B877F]': generalCurrentTab === tab
                }"
                v-for="(list, tab) in supportlList"
                :key="list.id"
              >
                <div
                  class="flex items-center space-x-2"
                  :class="generalCurrentTab === tab ? 'pl-6' : 'pl-7'"
                >
                  <unicon
                    :name="list.icon"
                    height="20"
                    :fill="generalCurrentTab === tab ? '#0B877F' : ''"
                  ></unicon>
                  <span class="text-sm font-semibold"> {{ list.title }} </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="absolute bottom-10 left-7 right-7 w-3/4 pb-7 border border-gray-300 rounded-lg">
          <div class="p-2 flex">
            <button class="ml-auto">
              <unicon name="ellipsis-h" height="16"></unicon>
            </button>
          </div>
          <div class="px-5">
            <div class="user flex flex-col items-center justify-center" v-if="props.user">
              <div
                class="h-12 w-12 flex items-center justify-center text-white uppercase rounded-full bg-[#0B877F]"
              >
                {{ user.username.substring(0, 1) }}
              </div>
              <p class="font-semibold text-xs my-1">{{ props.user.username }}</p>
              <p class="text-[0.6rem]">{{ props.user.roles[0] }}</p>
              <button
                @click="userSignout"
                :disabled="signingOut"
                class="rounded bg-black text-white flex items-center justify-center px-2.5 py-1 my-1"
              >
                <unicon
                  v-if="signingOut"
                  name="spinner"
                  fill="white"
                  height="13"
                  class="animate-spin"
                ></unicon>
                <unicon v-else name="power" fill="white" height="13"></unicon>
                <span class="text-[0.6rem]">Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BASE_URL from '@/backand/api'
import { useRouter } from 'vue-router'

const props = defineProps({
  user: Object
})
const signingOut = ref(false)
const router = useRouter()

const generalList = ref([
  { id: 0, icon: 'apps', path: '/', title: 'Dashboard' },
  { id: 1, icon: 'layer-group', path: '/products', title: 'Products' },
  { id: 2, icon: 'shopping-cart', path: '/', title: 'Orders' },
  { id: 3, icon: 'user', path: '/', title: 'Customers' }
])

const supportlList = ref([{ id: 4, icon: 'setting', path: '/', title: 'Settings' }])

const generalCurrentTab = ref(0)

const changeTab = (tab) => {
  generalCurrentTab.value = tab
}

const userSignout = () => {
  signingOut.value = true
  BASE_URL.post(
    '/auth/signout',
    {},
    {
      withCredentials: true
    }
  )
    .then(() => {
      setTimeout(() => {
        signingOut.value = false
        router.push({ path: '/login' })
      }, 1500)
    })
    .catch((error) => {
      signingOut.value = false
      console.error(error.response.data.message || error.message)
    })
}
</script>

<style scoped></style>
