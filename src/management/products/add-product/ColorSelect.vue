<template>
  <div class="characteristic-list">
    <ul class="ul grid grid-cols-2 text-white gap-5">
      <li
        class="px-5 py-3.5 rounded-xl text-xs flex items-center justify-center relative"
        :style="`background-color: ${color.hex};`"
        v-for="(color, index) in colors"
        :key="index"
        @click="emit('remove-color', index)"
      >
        {{ color.colorName }}
        <button class="absolute top-0 right-0">
          <unicon name="times" fill="black"></unicon>
        </button>
      </li>
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
import namer from 'color-namer'

const props = defineProps({
  colors: { type: Array, default: [] },
  selectedColor: { type: [Object, String], default: '#ffffff' }
})

const emit = defineEmits(['select-color', 'remove-color'])

const colorInputRef = ref(null)

const getColorName = (hex) => {
  const names = namer(hex).ntc[0].name
  return names
}

const handleColorInputClick = () => {
  console.log('clicked')
  console.log('colorInputRef.value', colorInputRef.value)
  colorInputRef.value.click()
}
</script>
