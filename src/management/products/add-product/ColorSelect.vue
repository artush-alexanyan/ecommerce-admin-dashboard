<template>
  <div class="characteristic-list">
    <ul class="ul grid grid-cols-4 gap-5">
      <li
        class="h-10 w-12 rounded-xl"
        :style="`background-color: ${color};`"
        v-for="(color, index) in colors"
        :key="index"
      ></li>
    </ul>
    <div class="w-full mt-5">
      <button
        @click="handleColorInputClick"
        class="w-full rounded-xl px-4 py-2.5 bg-primary text-white sm:text-md outline-0 flex items-center justify-center"
        type="button"
      >
        Add colors
      </button>
      <input
        ref="colorInputRef"
        class="opacity-0"
        @change="emit('select-color', $event.target.value)"
        :value="selectedColor"
        type="color"
        name="colorSelect"
        id="colorSelect"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  colors: { type: Array, default: [] },
  selectedColor: { type: String, default: null }
})
const emit = defineEmits(['select-color'])

const colorInputRef = ref(null)

const handleColorInputClick = () => {
  console.log('clicked')
  console.log('colorInputRef.value', colorInputRef.value)
  colorInputRef.value.click()
}
</script>
