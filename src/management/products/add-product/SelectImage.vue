<template>
  <div>
    <label class="block mb-2 font-medium text-gray-900 dark:text-white">Product image</label>
    <input
      class="hidden"
      @change="$emit('handle-file-selection', $event)"
      type="file"
      :disabled="props.loading || props.uploading"
      placeholder="Image"
      ref="imageInput"
    />
    <button
      @click="handleInputClick"
      :disabled="props.loading || props.uploading"
      class="w-full px-4 py-2.5 bg-blue-600 text-white sm:text-md outline-0 flex items-center justify-center"
    >
      <span> {{ image != null ? 'Select other image' : 'Upload an image' }}</span>
      <unicon name="camera-plus" height="16" fill="white"></unicon>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const imageInput = ref(null)

const props = defineProps({
  loading: Boolean,
  uploading: Boolean,
  image: Object
})
const emit = defineEmits(['handle-file-selection', 'select-color'])

const handleInputClick = () => {
  imageInput.value.click()
}
</script>
