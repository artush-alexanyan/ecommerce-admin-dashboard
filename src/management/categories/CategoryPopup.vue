<template>
  <div class="category-popup">
    <div
      v-if="showCategoryPopup"
      class="fixed top-0 left-0 w-full h-screen z-50 bg-black/50 flex items-center justify-center"
    >
      <div class="bg-white rounded-xl shadow-sm p-5 w-1/3">
        <div class="flex items-center justify-between pb-2.5 mb-5 border-b border-b-gray-300">
          <p>{{ popupTitle }}</p>
          <button class="" type="button" @click="emit('close-category-popup')">
            <unicon fill="black" name="times"></unicon>
          </button>
        </div>

        <form @submit.prevent="saveCategory">
          <div class="grid grid-cols-1 gap-5">
            <div class="flex flex-col">
              <label class="mb-2.5 text-sm font-semibold">Category name (EN)</label>
              <input
                required
                :value="title_en"
                @input="emit('update:title_en', $event.target.value)"
                type="text"
                placeholder="Name in English"
                class="w-full p-2.5 rounded-xl border border-gray-300 outline-0 focus:border-2 placeholder:text-sm focus:border-[#883ae1]"
              />
            </div>
            <div class="flex flex-col">
              <label class="mb-2.5 text-sm font-semibold">Category name (RU)</label>
              <input
                required
                :value="title_ru"
                @input="emit('update:title_ru', $event.target.value)"
                type="text"
                placeholder="Name in Russian"
                class="w-full p-2.5 rounded-xl border border-gray-300 outline-0 focus:border-2 placeholder:text-sm focus:border-[#883ae1]"
              />
            </div>
          </div>
          <div class="flex items-center justify-between mt-2.5">
            <div class="flex items-center justify-between space-x-2.5">
              <input
                ref="inputRef"
                class="hidden"
                @change="handleImageUpload"
                type="file"
                name=""
                id=""
              />
              <button
                @click.prevent="handleFileInputClick"
                class="text-center bg-blue-600 text-white rounded-xl p-2.5 text-sm mt-5"
              >
                Choose icon
              </button>
              <button class="text-center bg-primary text-white rounded-xl p-2.5 text-sm mt-5">
                Upload
              </button>
            </div>
            <button
              :disabled="categorySaving"
              class="text-center bg-primary text-white rounded-xl p-2.5 text-sm mt-5"
              type="submit"
            >
              {{ categorySaving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUploadImageStore } from '@/stores/upload-image/upload-image'

const emit = defineEmits([
  'close-category-popup',
  'save-category',
  'update:title_en',
  'update:title_ru'
])

const imageFile = ref(null)
const inputRef = ref(null)
const uploadImageStore = useUploadImageStore()

const saveCategory = async () => {
  const folderName = 'categoryIcons'
  const image = imageFile.value
  const icon = await uploadImageStore.uploadImage(image, folderName)
  emit('save-category', icon)
}

const handleFileInputClick = () => {
  inputRef.value.click()
}
const handleImageUpload = (event) => {
  imageFile.value = event.target.files[0]
}

const props = defineProps({
  showCategoryPopup: false,
  categorySaving: Boolean,
  title_en: [String, Number],
  title_ru: [String, Number],
  popupTitle: { type: String, default: 'Add category' }
})
</script>
