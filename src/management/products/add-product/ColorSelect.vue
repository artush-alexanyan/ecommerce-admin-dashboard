<template>
  <div>
    <div>
      <label class="block mb-2 font-medium text-gray-900 dark:text-white">Product color</label>
      <div
        class="relative w-full px-4 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white sm:text-md outline-0 flex items-center justify-center"
        :class="props.showColors ? 'border-[#0B877F]' : 'border-gray-300'"
        ref="container"
        id="container"
      >
        <div>
          <button
            class="flex items-center justify-between w-full py-2"
            @click.prevent="toggleColors"
          >
            <span>{{ props.color === '' ? 'Select color' : props.color }}</span>
            <unicon name="palette" height="16" fill="white"></unicon>
          </button>
        </div>
        <div
          v-if="props.showColors"
          class="absolute p-2 top-12 w-full border border-gray-100 shadow rounded bg-white text-gray-700 max-h-48 overflow-y-auto"
        >
          <div>
            <div
              @click.prevent="selectColor(colorOption)"
              class="flex items-center hover:cursor-pointer py-1 space-x-2"
              v-for="colorOption in props.baseColors"
              :key="colorOption.hex"
            >
              <span
                :style="`background-color: ${colorOption.hex};`"
                class="h-4 w-4 rounded-full border border-gray-200"
              >
              </span>
              <span> {{ colorOption.name }} </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  baseColors: Array,
  showColors: Boolean,
  color: String
})
const emit = defineEmits(['toggle-colors', 'select-color'])

const toggleColors = () => {
  emit('toggle-colors')
}
const selectColor = (colorOption) => {
  emit('select-color', colorOption)
}
</script>
