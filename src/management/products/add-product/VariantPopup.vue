<template>
  <div class="new-produsct">
    <Transition
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <div
        v-if="showVariantPopup"
        class="fixed top-0 left-0 z-30 bg-black/50 w-full h-screen flex p-5 justify-center items-center"
      >
        <div class="bg-white p-5 rounded-[30px] w-1/2 h-4/5">
          <div>
            <div class="flex items-center justify-between pb-5 border-b border-b-gray-200">
              <p class="text-xl font-semibold">
                Add variant to product <span v-if="productId"> {{ productId }}</span>
              </p>
              <button type="button" @click="emit('close-variant-popup')">
                <unicon name="times" fill="black"></unicon>
              </button>
            </div>

            <div class="variant-form py-2.5">
              <div class="grid grid-cols-2 gap-5">
                <div class="flex flex-col">
                  <label>Size</label>
                  <input
                    type="text"
                    v-model="size"
                    class="w-full py-2.5 mt-1.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
                  />
                </div>
                <div class="flex flex-col">
                  <label>Width</label>
                  <input
                    type="text"
                    v-model="width"
                    class="w-full py-2.5 mt-1.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
                  />
                </div>
                <div class="flex flex-col">
                  <label>Height</label>
                  <input
                    type="text"
                    v-model="height"
                    class="w-full py-2.5 mt-1.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
                  />
                </div>
                <div class="flex flex-col">
                  <label>Price</label>
                  <input
                    type="text"
                    v-model="price"
                    class="w-full py-2.5 mt-1.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
                  />
                </div>
                <div class="flex flex-col">
                  <label>Available qt.</label>
                  <input
                    type="text"
                    v-model="availableQuantity"
                    class="w-full py-2.5 mt-1.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
                  />
                </div>
                <div class="flex flex-col">
                  <label>Color</label>
                  <div>
                    <select
                      :disabled="uploading || saving"
                      v-model="selectedColor"
                      class="w-full py-2.5 mt-1.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
                      name="category"
                      id="category"
                    >
                      <option
                        class="flex items-center space-x-2"
                        :value="color"
                        v-for="(color, index) in baseColors"
                        :key="index"
                      >
                        <span> {{ color.name }}</span>
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="my-5 flex items-center space-x-5">
              <div>
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
  showVariantPopup: Boolean,
  productId: String
})

const emit = defineEmits(['close-variant-popup'])

const uploadImageStore = useUploadImageStore()
const uploading = computed(() => uploadImageStore.uploading)
const images = ref([])
const image = ref(null)
const saving = ref(false)
const imageRef = ref(null)
const selectedColor = ref(null)
const size = ref('XL')
const price = ref('1550')
const availableQuantity = ref('')
const height = ref('1560')
const width = ref('700')

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
    url: imageUrl
  })
}

const addImages = async () => {
  console.log('props.productId', props.productId)
  saving.value = true
  const stock = Number(availableQuantity.value)
  const numberPrice = Number(price.value)
  console.log('stock', stock)
  console.log('numberPrice', numberPrice)
  try {
    const response = await BASE_URL.post(`/products/${props.productId}/variants/add`, {
      images: images.value,
      size: size.value,
      price: numberPrice,
      stock,
      height: height.value,
      width: width.value,
      hex: selectedColor.value.hex
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
