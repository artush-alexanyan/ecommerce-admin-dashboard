<template>
  <div class="new-produsct">
    <Transition
      enter-active-class="animate__animated animate__fadeIn animate__faster"
      leave-active-class="animate__animated animate__fadeOut animate__faster"
    >
      <div
        v-if="showImagesPopup"
        class="fixed top-0 left-0 z-30 bg-black/50 w-full h-screen flex items-center p-5 justify-center"
      >
        <div class="bg-white p-5 rounded-[30px] w-1/2">
          <div>
            <div class="flex items-center justify-between pb-5 border-b border-b-gray-200">
              <p class="text-xl font-semibold">Add images</p>
              <button type="button" @click="emit('close-images-popup')">
                <unicon name="times" fill="red"></unicon>
              </button>
            </div>
            <div class="image-uploader">
              <div class="my-5 flex items-center space-x-5">
                <div>
                  <button
                    :disabled="uploading || saving"
                    @click="handleInputClick"
                    type="button"
                    class="bg-green-600 text-white px-5 py-2.5 rounded flex items-center justify-center space-x-2.5"
                  >
                    <span class="whitespace-nowrap">{{
                      !image ? 'Select image' : 'Select another'
                    }}</span>
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
                    @click="emit('upload-image')"
                    :disabled="uploading || saving"
                    class="bg-blue-600 text-white px-5 py-2.5 rounded flex items-center justify-center space-x-2.5"
                  >
                    <span>{{ uploading ? 'Uploading..' : 'Upload' }}</span>
                    <unicon name="cloud-upload" fill="white"></unicon>
                  </button>
                </div>
                <button
                  v-if="images.length > 0"
                  :disabled="saving"
                  type="button"
                  @click="emit('save-images')"
                  class="bg-blue-600 text-white px-5 py-2.5 rounded"
                >
                  {{ saving ? 'Saving...' : `Save ${btnText} images` }}
                </button>
              </div>
              <div class="ul py-5 grid grid-cols-6 gap-5">
                <div class="li" v-for="(imageItem, index) in images" :key="index">
                  <div class="relative">
                    <img :src="imageItem.url" alt="" class="h-32 w-24 object-cover rounded-xl" />
                    <button @click="emit('remove-image', index)" class="absolute top-0 right-0">
                      <unicon name="times" fill="red"></unicon>
                    </button>
                  </div>
                </div>
              </div>
              <div class="p mt-5">
                <p>All product images</p>
                <div class="ul py-5 grid grid-cols-6 gap-5">
                  <div
                    class="li border-2 rounded-xl"
                    v-for="(imageItem, index) in existingImages"
                    :key="index"
                  >
                    <div class="relative w-24">
                      <img :src="imageItem.url" alt="" class="h-32 w-24 object-cover" />
                      <button
                        v-if="availableForSelection"
                        @click="emit('select-image', imageItem)"
                        class="absolute bottom-1 left-1 flex items-center justify-center h-4 w-4 rounded-full border border-blue-600"
                      >
                        <div
                          v-if="imageItem.isSelected && images.includes(imageItem.url)"
                          class="h-2 w-2 rounded-full bg-blue-600"
                        ></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div></div
    ></Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits([
  'save-images',
  'upload-image',
  'close-images-popup',
  'handle-image-select',
  'remove-image',
  'select-image'
])
const props = defineProps({
  showImagesPopup: Boolean,
  uploading: Boolean,
  saving: Boolean,
  btnText: String,
  images: Array,
  existingImages: Array,
  image: Object,
  availableForSelection: { type: Boolean, default: true }
})

const imageRef = ref(null)

const handleInputClick = () => {
  imageRef.value.click()
}

const handleImageSelect = (event) => {
  const imageFile = event.target.files[0]
  console.log('image file', imageFile)
  emit('handle-image-select', imageFile)
}
</script>
