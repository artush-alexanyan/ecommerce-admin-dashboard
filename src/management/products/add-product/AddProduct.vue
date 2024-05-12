<template>
  <div>
    <BaseAlert :messages="messages || uploadMessages" />
    <div>
      <p class="text-sm font-semibold">Add a new product</p>
      <div class="mt-5 text-sm">
        <form @submit.prevent="createProduct">
          <div class="grid md:grid-cols-2 grid-cols-1 md:gap-4 gap-2">
            <BaseInput v-bind="$attrs" :label="'Title'" :type="'text'" v-model="title" />
            <BaseInput
              v-bind="$attrs"
              :label="'Description'"
              :type="'text'"
              v-model="description"
            />
            <BaseInput v-bind="$attrs" :label="'Category'" :type="'text'" v-model="category" />
            <BaseInput v-bind="$attrs" :label="'Category'" :type="'text'" v-model="category" />
            <BaseInput v-bind="$attrs" :label="'Subategory'" :type="'text'" v-model="subcategory" />
            <BaseInput v-bind="$attrs" :label="'Material'" :type="'text'" v-model="material" />
            <BaseInput v-bind="$attrs" :label="'Price'" :type="'number'" v-model="price" />
            <BaseInput v-bind="$attrs" :label="'Quantity'" :type="'number'" v-model="availableQt" />
            <BaseInput v-bind="$attrs" :label="'Width'" :type="'number'" v-model="width" />
            <BaseInput v-bind="$attrs" :label="'Height'" :type="'number'" v-model="height" />
          </div>
          <div class="grid md:grid-cols-2 md:gap-4 gap-2">
            <ColorSelect
              :baseColors="baseColors"
              :color="color"
              :showColors="showColors"
              @select-color="selectColor"
              @toggle-colors="toggleColors"
            />
            <SelectImage
              :image="image"
              :loading="loading"
              :uploading="uploading"
              @handle-file-selection="handleFileSelection"
            />
          </div>
          <SubmitButton :loading="loading" :uploading="uploading" :btnText="btnText" />
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, computed } from 'vue'
import { useUploadImageStore } from '@/stores/upload-image/upload-image'
import BASE_URL from '@/backand/api'
import BaseAlert from '@/base/BaseAlert.vue'
import ColorSelect from './ColorSelect.vue'
import SubmitButton from './SubmitButton.vue'
import SelectImage from './SelectImage.vue'
import BaseInput from '@/base/BaseInput.vue'

const uploadImageStore = useUploadImageStore()
const uploadMessages = computed(() => uploadImageStore.uploadMessages)
const uploading = computed(() => uploadImageStore.uploading)
const containerRef = ref(null)
const imageInput = ref(false)
const loading = ref(false)
const messages = ref([])
const title = ref('')
const price = ref('')
const availableQt = ref('5')
const height = ref('20')
const width = ref('12')
const description = ref('Lorem ispum dolor')
const category = ref('Mugs')
const subcategory = ref('')
const material = ref('Glass')
const color = ref('')
const colorName = ref('')
const showColors = ref(false)
const image = ref(null)
const imageUrl = ref('')
const baseColors = reactive([
  { hex: '#FFFFFF', name: 'White' },
  { hex: '#000000', name: 'Black' },
  { hex: '#FF0000', name: 'Red' },
  { hex: '#00FF00', name: 'Green' },
  { hex: '#0000FF', name: 'Blue' },
  { hex: '#FFFF00', name: 'Yellow' },
  { hex: '#FF00FF', name: 'Magenta' },
  { hex: '#00FFFF', name: 'Cyan' },
  { hex: '#808080', name: 'Gray' },
  { hex: '#800000', name: 'Maroon' },
  { hex: '#808000', name: 'Olive' },
  { hex: '#008000', name: 'Green' },
  { hex: '#800080', name: 'Purple' },
  { hex: '#008080', name: 'Teal' },
  { hex: '#C0C0C0', name: 'Silver' },
  { hex: '#FFA500', name: 'Orange' },
  { hex: '#FFC0CB', name: 'Pink' },
  { hex: '#FF69B4', name: 'HotPink' }
])

const toggleColors = () => {
  showColors.value = !showColors.value
}

const selectColor = (colorOption) => {
  color.value = colorOption.hex
  colorName.value = colorOption.name
  showColors.value = false
}

const btnText = () => {
  if (uploading.value === true) {
    return 'Uploading image...'
  } else if (loading.value === true) {
    return 'Creating product...'
  } else {
    return 'Save product'
  }
}

const resetMessages = () => {
  setTimeout(() => {
    messages.value = []
  }, 2000)
}

const handleFileSelection = (event) => {
  image.value = event.target.files[0]
  if (image.value) {
    const reader = new FileReader()

    reader.readAsDataURL(image.value)
  }
}

const createProduct = async () => {
  const folderName = 'products'
  const createdAt = new Date()
  const numberHeight = Number(height.value)
  const numberWidth = Number(width.value)
  const newAvailableQt = Number(availableQt.value)
  const imageUrl = await uploadImageStore.uploadImage(image.value, color.value, folderName)
  loading.value = true
  if (color.value === '') {
    messages.value.push({
      message: 'Please select image',
      type: 'Warning'
    })
    loading.value = false
    resetMessages()
    return
  }
  try {
    const response = await BASE_URL.post('products/add', {
      createdAt,
      title: title.value,
      price: price.value,
      category: category.value,
      subcategory: subcategory.value,
      color: color.value,
      colorName: colorName.value,
      material: material.value,
      image: imageUrl,
      height: numberHeight,
      width: numberWidth,
      description: description.value,
      availableQt: newAvailableQt
    })

    if (response && response.status === 201) {
      loading.value = false
      messages.value.push({
        message: response.data.message,
        type: 'Success'
      })
      resetMessages()
    }
  } catch (error) {
    loading.value = false
    console.error('Unexpected error:', error.response.data.message)
    messages.value.push({
      message: error.response ? error.response.data.message : error.message,
      type: 'Error'
    })
    resetMessages()
  }
}

const handleClickOutside = (event) => {
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    showColors.value = false
  }
}

onMounted(() => {
  containerRef.value = document.getElementById('container')
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped></style>