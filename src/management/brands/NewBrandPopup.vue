<template>
  <div class="brand-popup">
    <div
      v-if="showBrandPopup"
      class="fixed top-0 left-0 w-full h-screen z-50 bg-black/50 flex items-center justify-center"
    >
      <div class="bg-white rounded-xl shadow-sm p-5 w-1/3">
        <div class="flex items-center justify-between pb-2.5 mb-5 border-b border-b-gray-300">
          <p>{{ popupTitle }}</p>
          <button class="" type="button" @click="emit('close-brand-popup')">
            <unicon fill="black" name="times"></unicon>
          </button>
        </div>

        <form @submit.prevent="savebrand">
          <div class="grid grid-cols-1 gap-5">
            <div class="flex flex-col">
              <label class="mb-2.5 text-sm font-semibold">Brand name</label>
              <input
                required
                :value="title"
                @input="emit('update:title', $event.target.value)"
                type="text"
                placeholder="Enter brand name"
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
            </div>
            <button
              :disabled="brandSaving || uploading"
              class="text-center bg-primary text-white rounded-xl p-2.5 text-sm mt-5"
              type="submit"
            >
              {{ uploading ? 'Uploading icon...' : brandSaving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useUploadImageStore } from '@/stores/upload-image/upload-image'

const emit = defineEmits(['close-brand-popup', 'save-brand', 'update:title'])

const uploadImageStore = useUploadImageStore()
const imageFile = ref(null)
const inputRef = ref(null)
const uploading = computed(() => uploadImageStore.uploading)

const savebrand = async () => {
  const folderName = 'brandIcons'
  const image = imageFile.value
  const icon = await uploadImageStore.novoMercatoUpload(image, folderName)
  emit('save-brand', icon)
}

const handleFileInputClick = () => {
  inputRef.value.click()
}
const handleImageUpload = (event) => {
  imageFile.value = event.target.files[0]
}

const props = defineProps({
  showBrandPopup: false,
  brandSaving: Boolean,
  title: [String, Number],
  popupTitle: { type: String, default: 'Add brand' }
})
</script>
