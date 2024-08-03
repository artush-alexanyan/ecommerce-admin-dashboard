<template>
  <div class="characteristic-list">
    <!-- <ul class="ul grid grid-cols-2 text-white gap-5 mb-5">
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
    </ul> -->

    <div class="w-full">
      <button
        @click="handleColorInputClick"
        class="w-full rounded-xl px-4 py-3.5 bg-primary text-white sm:text-md outline-0 flex items-center justify-center"
        type="button"
      >
        Select color
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
    <div class="grid grid-cols-4 my-2.5" v-if="selectedColor">
      <span :style="`color: ${selectedColor.hex};`" class="col-span-2">{{
        selectedColor.colorName
      }}</span>
      <span class="col-span-1">{{ selectedColor.hex }}</span>
      <div class="col-span-1">
        <button
          @click="emit('add-attribute-option')"
          class="bg-blue-600 text-white py-1 px-2 rounded"
        >
          Add
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import namer from 'color-namer'

const props = defineProps({
  selectedColor: { type: [Object, String], default: '#ffffff' }
  // colors: Array
})

const emit = defineEmits(['select-color', 'remove-color', 'add-attribute-option'])

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
