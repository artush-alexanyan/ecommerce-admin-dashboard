<template>
  <div>
    <div class="sidebar fixed top-0 left-0 w-56 bg-white">
      <aside class="relative h-screen pl-6">
        <div class="logo_wrapper mt-5 mb-10 border-b pb-5">
          <img src="@/assets/logo.png" class="h-10" alt="logo" />
        </div>
        <div class="sidebar-content">
          <ul>
            <li
              class="py-3 flex flex-col cursor-pointer text-lg"
              v-for="(list, tab) in generalList"
              :key="list.id"
            >
              <div class="flex items-center justify-between w-full">
                <button
                  @click="changeTab(list, tab)"
                  class="font-semibold flex items-center space-x-2"
                >
                  <unicon
                    :name="list.icon"
                    height="20"
                    :fill="generalCurrentTab === tab ? '#883ae1' : 'black'"
                  ></unicon>
                  <span
                    :class="{
                      'text-primary': generalCurrentTab === tab
                    }"
                  >
                    {{ list.title }}</span
                  >
                </button>
                <button
                  @click="toggleListChildren(list)"
                  v-if="list.children && list.children.length > 0"
                  class="font-semibold flex items-center space-x-2"
                >
                  <unicon
                    v-if="list.showChildren"
                    name="angle-down"
                    height="20"
                    :fill="generalCurrentTab === tab ? '#883ae1' : 'black'"
                  ></unicon>
                  <unicon
                    v-else
                    name="angle-right-b"
                    height="20"
                    :fill="generalCurrentTab === tab ? '#883ae1' : 'black'"
                  ></unicon>
                </button>
              </div>

              <ul v-if="list.showChildren" class="ml-10 mt-3">
                <li
                  v-motion-slide-left
                  class="py-1 cursor-pointer"
                  v-for="(subList, index) in list.children"
                  :key="index"
                >
                  <button
                    type="button"
                    @click="changeSubList(subList)"
                    :class="currentSubListTitle === subList.title ? 'text-primary' : ''"
                  >
                    {{ subList.title }}
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="absolute bottom-10 left-7 right-7 w-3/4 pb-7 rounded-xl border border-gray-300">
          <div class="p-2 flex">
            <button class="ml-auto">
              <unicon name="ellipsis-h" height="16"></unicon>
            </button>
          </div>
          <div v-if="authCheckLoading" class="flex items-center justify-center h-28">
            <BaseLoader />
          </div>
          <div class="px-5" v-else>
            <div class="user flex flex-col items-center justify-center" v-if="props.user">
              <img
                v-if="user.avatar"
                :src="user.avatar"
                alt="avatar"
                class="h-12 w-12 rounded-full object-cover"
              />
              <div
                v-else
                class="h-12 w-12 rounded-full flex items-center justify-center text-white uppercase bg-[#883ae1]"
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
import BaseLoader from '@/base/BaseLoader.vue'

const props = defineProps({
  user: Object,
  authCheckLoading: Boolean
})
const signingOut = ref(false)
const router = useRouter()

const generalList = ref([
  { id: 0, icon: 'apps', path: '/', title: 'Dashboard' },
  {
    id: 1,
    icon: 'layer-group',
    path: '/products',
    title: 'Products',
    showChildren: false,
    children: [
      {
        id: 0,
        icon: 'layer-group',
        path: '/products',
        title: 'Product list',
        showChildren: false,
        children: []
      },
      {
        id: 1,
        icon: 'layer-group',
        path: '/products/add-product',
        title: 'Add product',
        showChildren: false,
        children: []
      }
    ]
  },
  {
    id: 2,
    icon: 'shopping-bag',
    path: '/orders',
    title: 'Orders',
    showChildren: false,
    children: [
      {
        id: 0,
        icon: 'layer-group',
        path: '/orders',
        title: 'Order list',
        showChildren: false,
        children: []
      },
      {
        id: 1,
        icon: 'layer-group',
        path: '/products/add-product',
        title: 'Add product',
        showChildren: false,
        children: []
      }
    ]
  },
  { id: 3, icon: 'list-ul', path: '/categories', title: 'Categories', showChildren: false },
  { id: 4, icon: 'wordpress', path: '/brands', title: 'Brands', showChildren: false },
  {
    id: 5,
    icon: 'web-grid',
    path: '/carousel',
    title: 'Application',
    showChildren: false,
    children: [
      {
        id: 0,
        icon: 'layer-group',
        path: '/carousel',
        title: 'Carousel',
        showChildren: false,
        children: []
      },
      {
        id: 1,
        icon: 'layer-group',
        path: '/carousel',
        title: 'Navigation',
        showChildren: false,
        children: []
      }
    ]
  }
])

const generalCurrentTab = ref(0)
const currentSubListTitle = ref('')

const changeTab = (list, tab) => {
  currentSubListTitle.value = list.children ? list.children[0].title : ''
  generalCurrentTab.value = tab
  router.push({ path: list.path })
}

const changeSubList = (subList) => {
  currentSubListTitle.value = subList.title
  router.push({ path: subList.path })
}

const toggleListChildren = (list) => {
  list.showChildren = !list.showChildren
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
