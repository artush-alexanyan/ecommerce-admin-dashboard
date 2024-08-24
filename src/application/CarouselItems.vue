<template>
  <div class="carousel-items">
    <div class="">
      <h1 class="text-left text-xl font-semibold mb-5 uppercase">Carousel items</h1>
      <div v-if="carouselLoading" class="loading-state flex items-center justify-center py-32">
        <BaseLoader />
      </div>
      <div class="" v-else>
        <div class="relative" v-if="carouselItems.length > 0">
          <div
            v-if="deleting"
            class="absolute left-0 top-0 h-full w-full flex items-center justify-center"
          >
            <unicon name="spinner" class="animate-spin" fill="purple"></unicon>
          </div>
          <ul class="grid grid-cols-3 gap-5">
            <li v-for="item in carouselItems" :key="item._id">
              <div class="flex flex-col items-center">
                <div class="relative">
                  <img
                    :src="item.image.url"
                    class="h-48 rounded-xl object-cover"
                    :alt="item.title"
                  />
                  <div class="absolute top-2 left-2">
                    <button
                      @click="deleteCarouselItem(item._id)"
                      type="button"
                      name="Delete item"
                      aria-label="Delete item"
                    >
                      <unicon name="trash" fill="red"></unicon>
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="" v-else>
          <p class="text-center text-lg">No carousel items found</p>
        </div>
        <div class="my-5">
          <button
            @click="toggleForm"
            class="flex items-center justify-center space-x-2.5 w-full rounded-xl bg-slate-900 px-5 py-2.5 text-white"
            type="button"
            name="Add new item"
            aria-label="Add new item"
          >
            <span>{{ showForm ? 'Cancel' : 'Add new carousel item' }} </span>
            <unicon v-if="showForm" name="times" fill="white"></unicon>
            <unicon v-else name="plus" fill="white"></unicon>
          </button>
        </div>
        <div class="form" v-if="showForm">
          <form @submit.prevent="saveCarouselItem">
            <div class="grid grid-cols-2 gap-5">
              <div class="flex flex-col">
                <label for="title">Title *</label>
                <input
                  v-model="title"
                  required
                  placeholder="Enter title"
                  type="text"
                  id="title"
                  class="w-full py-2.5 mt-1.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
                />
              </div>
              <div class="flex flex-col">
                <label for="link">Link</label>
                <input
                  v-model="link"
                  placeholder="Enter link"
                  type="text"
                  id="link"
                  class="w-full py-2.5 mt-1.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
                />
              </div>
            </div>
            <div class="flex flex-col">
              <label for="description">Description</label>
              <textarea
                v-model="description"
                placeholder="Enter description"
                type="text"
                id="description"
                class="w-full py-2.5 mt-1.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
              ></textarea>
            </div>
            <div class="grid grid-cols-8 gap-5">
              <div class="flex flex-col col-span-3">
                <label for="position">Position</label>
                <input
                  v-model.number="position"
                  placeholder="Enter position"
                  type="number"
                  id="position"
                  class="w-full py-2.5 mt-1.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
                />
              </div>
              <div class="flex flex-col items-center col-span-1">
                <label for="position"> {{ isActive ? 'Active' : 'Not active' }}</label>
                <input
                  v-model="isActive"
                  type="checkbox"
                  id="position"
                  class="w-full py-2.5 mt-1.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
                />
              </div>
              <div class="col-span-4">
                <div class="flex flex-col">
                  <label for="position">{{ imageFile ? 'Select another' : 'Select photo' }}</label>
                  <input
                    @input="handleFileSelection"
                    ref="carouselImageRef"
                    placeholder="Upload image"
                    type="file"
                    id="position"
                    class="hidden"
                    accept="image/*"
                  />
                </div>

                <div class="flex items-center gap-2 5">
                  <button
                    @click.prevent="handleFileInputClick"
                    class="flex items-center justify-center space-x-2.5 w-full rounded-xl px-5 py-2.5 text-white"
                    :class="imageFile ? 'bg-green-900' : 'bg-indigo-900'"
                    type="button"
                    name="Select file"
                    aria-label="Select file"
                  >
                    <span>{{ imageFile ? 'Select another image' : 'Select photo' }}</span>
                  </button>
                  <button
                    v-if="imageFile"
                    @click.prevent="uploadImage"
                    :disabled="uploading"
                    class="flex items-center justify-center space-x-2.5 w-full rounded-xl bg-blue-900 px-5 py-2.5 text-white"
                    type="button"
                    name="Add new item"
                    aria-label="Add new item"
                  >
                    <span>Upload</span>
                    <unicon
                      v-if="uploading"
                      name="spinner"
                      class="animate-spin"
                      fill="white"
                    ></unicon>
                    <unicon v-else name="cloud-upload" fill="white"></unicon>
                  </button>
                </div>
              </div>
            </div>
            <div class="flex justify-end my-5">
              <button
                :disabled="!isReadyToSave"
                class="flex items-center justify-center space-x-2.5 rounded-xl px-5 py-2.5 text-white"
                :class="isReadyToSave ? 'bg-blue-700' : 'bg-blue-200'"
                type="submit"
                name="Add new item"
                aria-label="Add new item"
              >
                <span>Save</span>
                <unicon v-if="saving" name="spinner" class="animate-spin" fill="white"></unicon>
                <unicon v-else name="save" fill="white"></unicon>
              </button>
            </div>
          </form>
        </div>
        <div class="uploaded-image my-8" v-if="finalImage && showForm">
          <p class="my-2.5 text-lg">Image dimensions: {{ imageWidth }}X{{ imageHeight }} pixels</p>
          <div class="w-full border-2 border-dotted h-96 rounded-xl">
            <img
              :src="finalImage.url"
              alt="Carousel image"
              class="w-full bg-cover h-96 rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import BaseLoader from '@/base/BaseLoader.vue'
import BASE_URL from '@/backand/api'
import { useUploadImageStore } from '@/stores/upload-image/upload-image'

const uploadStore = useUploadImageStore()
const carouselItems = ref([])
const carouselLoading = ref(false)
const showForm = ref(false)
const title = ref('')
const description = ref('')
const imageFile = ref(null)
const link = ref('')
const position = ref(0)
const isActive = ref(true)
const carouselImageRef = ref(null)
const imageHeight = ref(null)
const imageWidth = ref(null)
const uploading = computed(() => uploadStore.uploading)
const saving = ref(false)
const finalImage = ref(null)
const deleting = ref(false)

const isReadyToSave = computed(() => {
  return title.value !== '' && finalImage.value
})

const toggleForm = () => {
  showForm.value = !showForm.value
}

const handleFileInputClick = () => {
  carouselImageRef.value.click()
}

const handleFileSelection = (event) => {
  imageFile.value = event.target.files[0]

  if (imageFile.value) {
    const img = new Image()
    img.onload = function () {
      imageWidth.value = img.width
      imageHeight.value = img.height
      console.log('Image dimensions:', imageWidth.value, `X`, imageHeight.value)
    }
    img.src = URL.createObjectURL(imageFile.value)
  }
}
const uploadImage = async () => {
  const imageUrl = await uploadStore.novoMercatoUpload(imageFile.value, 'carouselImages')
  finalImage.value = {
    url: imageUrl,
    height: imageHeight.value,
    width: imageWidth.value
  }
}

const resetForm = () => {
  title.value = ''
  description.value = ''
  position.value = 0
  isActive.value = true
  link.value = ''
  imageFile.value = null
  finalImage.value = null
  imageHeight.value = null
  imageWidth.value = null
  setTimeout(() => {
    showForm.value = false
  }, 500)
}

const saveCarouselItem = async () => {
  saving.value = true
  try {
    const response = await BASE_URL.post('/carousel/add', {
      title: title.value,
      description: description.value,
      image: finalImage.value,
      link: link.value,
      position: position.value,
      isActive: isActive.value
    })
    const item = response.data.carouselItem
    console.log('carousel item', item)
    carouselItems.value.push(response.data.carouselItem)
    saving.value = false
    resetForm()
  } catch (error) {
    saving.value = false
    alert(error.response ? error.response.data.message : error.message)
  }
}

const deleteCarouselItem = async (id) => {
  deleting.value = true
  try {
    const response = await BASE_URL.delete(`/carousel/delete/${id}`)
    console.log('response.data', response.data)

    // Remove the item from the local carouselItems array
    carouselItems.value = carouselItems.value.filter((item) => item._id !== id)

    deleting.value = false
    resetForm()
  } catch (error) {
    deleting.value = false
    alert(error.response ? error.response.data.message : error.message)
  }
}

const getCarouselItems = async () => {
  carouselLoading.value = true
  try {
    const response = await BASE_URL.get('/carousel/items')
    const items = response.data.carouselItems
    carouselItems.value = items
    carouselLoading.value = false
  } catch (error) {
    carouselLoading.value = false
    alert(error.response ? error.response.data.message : error.message)
  }
}

onMounted(() => {
  getCarouselItems()
})
</script>
