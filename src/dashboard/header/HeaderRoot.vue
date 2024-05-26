<template>
  <div>
    <div
      class="header fixed top-0 right-0 h-20 bg-gray-50 border-b flex items-center justify-between px-10"
      :style="props.contentSize"
    >
      <div class="user-welcome">
        <div class="user-greetings" v-if="props.user">
          <p class="text-black font-semibold text-lg">Welcome back {{ props.user.username }}!</p>
          <p class="text-gray-400 text-xs">Here is your overview in this week</p>
        </div>
      </div>
      <div class="right-tools flex items-center space-x-1.5">
        <div class="search_wrapper">
          <div class="relative">
            <div class="absolute left-2 top-1/2 transform -translate-y-1/2">
              <unicon name="search" fill="#A3A3A3" height="16"></unicon>
            </div>
            <input
              required
              placeholder="Search"
              type="text"
              class="w-full rounded-full text-sm px-8 py-2 border border-gray-200 outline-0 focus:border-[#0B877F]"
              id="password"
            />
          </div>
        </div>
        <div class="messages_wrapper relative">
          <button>
            <span class="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
            <unicon name="envelope" fill="black" height="20"></unicon>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  user: Object,
  contentSize: String
})
</script>

<style scoped></style>
