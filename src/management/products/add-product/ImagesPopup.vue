<template>
  <div class="new-produsct">
    <Transition
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <div
        v-if="showImagesPopup"
        class="fixed top-0 left-0 z-30 bg-black/50 w-full h-screen flex p-5 justify-center items-center"
      >
        <div class="bg-white p-5 rounded-[30px] w-1/2 h-4/5">
          <div>
            <div class="flex items-center justify-between pb-5 border-b border-b-gray-200">
              <p class="text-xl font-semibold">
                Add image to product variant <span v-if="productId"> {{ productId }}</span>
              </p>
              <button type="button" @click="emit('close-images-popup')">
                <unicon name="times" fill="black"></unicon>
              </button>
            </div>
            <div class="ul grid grid-cols-3 gap-5 mt-5">
              <div
                @click="selectVariant(index, variant)"
                class="li rounded-xl border border-gray-300 cursor-pointer px-3 py-3 flex items-center text-gray-400"
                :style="`background-color: ${variant.hex};`"
                v-for="(variant, index) in variants"
                :key="index"
              >
                <div class="flex items-center justify-between w-full">
                  <span class="text-xs">Size:{{ variant.size }}</span>
                  <button
                    v-if="selectedVariantIndex === index"
                    class="h-4 w-4 rounded-full bg-black flex items-center justify-center"
                  >
                    <span class="h-2 w-2 rounded-full bg-white"></span>
                  </button>
                </div>
              </div>
            </div>
            <div class="my-5 flex items-center space-x-5">
              <div class="w-1/3">
                <button
                  :disabled="uploading || saving"
                  @click="handleInputClick"
                  type="button"
                  class="bg-green-600 text-white px-5 py-2.5 rounded flex items-center justify-center space-x-2.5"
                >
                  <span class="whitespace-nowrap">Select image</span>
                  <unicon name="image-plus" fill="white"></unicon>
                </button>
                <input
                  class="hidden"
                  type="file"
                  name="imageInput"
                  id="imageInput"
                  ref="imageRef"
                  @change="handleImageSelect"
                />
              </div>
              <div class="" v-if="image">
                <button
                  @click="uploadImage"
                  :disabled="uploading || saving"
                  class="bg-blue-600 text-white px-5 py-2.5 rounded flex items-center justify-center space-x-2.5"
                >
                  <span>{{ uploading ? 'Uploading..' : 'Upload' }}</span>
                  <unicon name="cloud-upload" fill="white"></unicon>
                </button>
              </div>
            </div>
            <div class="ul py-5 grid grid-cols-3 gap-5">
              <div class="li" v-for="(imageItem, index) in images" :key="index">
                <img :src="imageItem.url" alt="" class="h-32" />
              </div>
            </div>
            <button
              v-if="images.length > 0"
              :disabled="saving"
              type="button"
              @click="addImages"
              class="bg-blue-600 text-white px-5 py-2.5 rounded"
            >
              {{ saving ? 'Saving...' : 'Save images' }}
            </button>
          </div>
        </div>
      </div></Transition
    >
  </div>
</template>

<script setup>
import BASE_URL from '@/backand/api'
import { ref, reactive, computed } from 'vue'
import { useUploadImageStore } from '@/stores/upload-image/upload-image'

const props = defineProps({
  showImagesPopup: Boolean,
  productId: String,
  variants: Array
})

const emit = defineEmits(['close-images-popup'])

const uploadImageStore = useUploadImageStore()
const uploading = computed(() => uploadImageStore.uploading)
const images = ref([])
const image = ref(null)
const saving = ref(false)
const imageRef = ref(null)
const selectedColor = ref(null)
const uploadedImageUrl = ref(null)
const selectedVariantIndex = ref(0)
const selectedVariantId = ref(null)

const selectVariant = (index, variant) => {
  selectedVariantIndex.value = index
  selectedVariantId.value = variant._id
}

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

const handleInputClick = () => {
  imageRef.value.click()
}

const handleImageSelect = (event) => {
  const imageFile = event.target.files[0]
  console.log('image file', imageFile)
  image.value = imageFile
}

const uploadImage = async () => {
  const folderName = 'productImages'
  const imageUrl = await uploadImageStore.uploadImage(image.value, folderName)
  images.value.push({
    url: imageUrl,
    hex: selectedColor.value.hex,
    colorName: selectedColor.value.name
  })
}

const addImages = async () => {
  console.log('props.productId', props.productId)
  saving.value = true
  try {
    const response = await BASE_URL.post(`/products/${props.productId}/images`, {
      images: images.value
    })
    console.log(response.data)
    selectedColor.value = null
    images.value = []
    image.value = null
    saving.value = false
  } catch (error) {
    saving.value = false
    alert(error.response ? error.response.data.message : error.message)
  }
}
</script>
