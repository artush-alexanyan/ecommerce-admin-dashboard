<template>
  <div>
    <!-- <label class="block mb-2 font-medium text-gray-900 dark:text-white">Product image</label> -->
    <input
      class="hidden"
      @change="$emit('handle-file-selection', $event)"
      type="file"
      :disabled="props.loading || props.uploading"
      placeholder="Image"
      ref="imageInput"
    />
    <div class="flex items-center space-x-2 5">
      <button
        @click.prevent="handleInputClick"
        :disabled="props.loading || props.uploading"
        class="bg-blue-600 text-white px-5 py-2.5 rounded flex items-center"
      >
        <span> {{ image != null ? 'Select other image' : 'Upload an image' }}</span>
        <unicon name="camera-plus" height="16" fill="white"></unicon>
      </button>
      <button
        :disabled="uploading"
        v-if="image"
        class="bg-green-600 text-white px-5 py-2.5 rounded"
        @click.prevent="uploadNewImage"
      >
        {{ uploading ? 'Wait..' : 'Save' }}
      </button>
    </div>
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
const emit = defineEmits(['handle-file-selection', 'upload-image'])

const handleInputClick = () => {
  imageInput.value.click()
}

const uploadNewImage = () => {
  emit('upload-image')
}
</script>
