<template>
  <div>
    <h1 class="text-center text-3xl font-semibold py-5">
      Welcome to <span class="text-[#0B877F]">Onlien</span><span>Store</span>
    </h1>
    <p class="text-xs text-center mt-2">
      Feel free to use integrated GPT-3.5 Turbo model to get assistence and help. Ask anything if
      you need any help :)
    </p>

    <div class="ai-input fixed bottom-0 right-0 w-full py-3 px-5" :style="contentSize">
      <div class="h-[30rem] overflow-y-auto w-full mb-5">
        <ul class="px-5">
          <li
            class="my-2.5 flex items-center"
            :class="message.sender === 'user' ? 'justify-end' : 'justify-start'"
            v-for="(message, index) in messages"
            :key="message"
          >
            <div
              class="p-2.5 rounded-xl"
              :class="
                message.sender === 'user'
                  ? 'justify-end bg-black text-white'
                  : 'justify-start bg-purple-600 text-gray-100'
              "
            >
              {{ message.message }}
            </div>
          </li>
        </ul>
      </div>
      <div class="flex items-center justify-between px-5">
        <input
          :disabled="sending"
          v-model="text"
          type="text"
          placeholder="Ask question..."
          class="w-full border border-gray-300 px-5 py-3 outline-0 focus:border-2 focus:border-blue-600"
        />
        <button
          :disabled="sending"
          @click="sendAssistanceMessage"
          class="px-4 py-2.5 bg-[#0B877F] text-white sm:text-md outline-0 flex items-center justify-center ml-2.5"
        >
          <unicon
            v-if="sending"
            name="spinner"
            fill="white"
            height="24"
            class="animate-spin"
          ></unicon>
          <unicon v-else name="message" fill="white" height="24"></unicon>
        </button>
      </div>
      <p class="text-center my-2 text-sm text-gray-400">Ask AI assistante</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import BASE_URL from '@/backand/api'

const contentSize = ref('')
const text = ref('')
const sending = ref(false)
const messages = ref([])
const sendAssistanceMessage = async () => {
  if (text.value === '') {
    alert('Please write message!')
    return
  }
  const message = {
    sender: 'user',
    senderName: 'User',
    message: text.value
  }
  messages.value.push(message)
  sending.value = true
  try {
    const response = await BASE_URL.post('/generate-text', { text: text.value })
    console.log('response', response.data)
    sending.value = false
    text.value = ''
    const responseMessage = {
      sender: 'gpt',
      senderName: 'User',
      message: response.data.text
    }
    messages.value.push(responseMessage)
  } catch (error) {
    sending.value = false
    console.error(error)
  }
}

const logScreenWidth = () => {
  const innerWdt = window.innerWidth
  const sidebarWidth = 256
  const contentWidth = innerWdt - sidebarWidth
  contentSize.value = `width: ${contentWidth}px;`
}
onBeforeUnmount(() => {
  window.removeEventListener('resize', logScreenWidth)
})
onMounted(async () => {
  logScreenWidth()
  window.addEventListener('resize', logScreenWidth)
})
</script>

<style scoped></style>
