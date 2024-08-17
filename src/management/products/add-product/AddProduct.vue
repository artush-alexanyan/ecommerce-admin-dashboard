<template>
  <div>
    <div class="loading flex items-center justify-center h-80" v-if="productsLoading">
      <BaseLoader />
    </div>
    <div class="products text-sm" v-else>
      <NewProductPopupVue
        :show-new-product-popup="showNewProductPopup"
        @close-new-product-popup="closeNewProductPopup"
      />
      <BaseDeleteModal
        :showDelete="showDelete"
        :deleting="deleting"
        @cancel-delete="cancelDelete"
        @confirm-delete="confirmDelete"
      />
      <div class="grid xl:grid-cols-4 lg:grid-cols-2 grid-cols-1 gap-2.5">
        <div
          @mouseover="product.showDetails = true"
          @mouseleave="product.showDetails = false"
          v-for="product in products"
          :key="product._id"
          class="relative rounded-xl border border-gray-300 hover:shadow-lg transition-all duration-500 hover:border-none flex items-center justify-center hover:cursor-pointer"
        >
          <img
            :src="product.defaultImage"
            class="h-56 w-full object-cover rounded-xl"
            alt="productImage"
          />
          <div
            v-if="product.showDetails"
            class="absolute left-0 top-0 p-2.5 w-full h-full bg-black/25 rounded-xl"
          >
            <div class="flex justify-between items-start">
              <div class="flex items-center space-x-2.5">
                <button @click="startDelete(product._id)">
                  <IconTrash />
                </button>
                <button>
                  <IconView />
                </button>
              </div>
              <div class="flex flex-col space-y-2.5">
                <button
                  :disabled="productLoading"
                  @click="openImagesPopup(product._id)"
                  type="button"
                  class="bg-blue-600 text-white px-5 py-2.5 rounded"
                >
                  {{ !productLoading ? 'Add images' : 'Loading...' }}
                </button>
                <button
                  @click="seeVariants(product._id)"
                  type="button"
                  class="bg-blue-600 text-white px-5 py-2.5 rounded"
                >
                  See variants
                </button>
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          @click="openNewProductPopup"
          class="rounded-xl border border-gray-300 hover:shadow-lg transition-all duration-500 bg-white px-5 py-10 flex items-center justify-center cursor pointer"
        >
          <unicon fill="#883ae1" name="book-medical"></unicon>
        </button>
      </div>
    </div>
    <ImagesPopup
      :show-images-popup="showImagesPopup"
      :saving="saving"
      :uploading="uploading"
      :btn-text="'product'"
      :image="image"
      :existing-images="existingImages"
      :images="images"
      :available-for-selection="false"
      @remove-image="removeImage"
      @upload-image="uploadImage"
      @save-images="addImages"
      @close-images-popup="closeImagesPopup"
      @handle-image-select="handleImageSelect"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useProductsFetchStore } from '@/stores/products/get-products'
import BaseLoader from '@/base/BaseLoader.vue'
import BaseDeleteModal from '@/base/BaseDeleteModal.vue'
import IconTrash from '@/icons/IconTrash.vue'
import IconView from '@/icons/IconView.vue'
import BASE_URL from '@/backand/api'
import NewProductPopupVue from './NewProductPopup.vue.vue'
import ImagesPopup from '../ImagesPopup.vue'
import { useRouter } from 'vue-router'
import { useUploadImageStore } from '@/stores/upload-image/upload-image'

const uploadImageStore = useUploadImageStore()
const router = useRouter()
const showDelete = ref(false)
const deleting = ref(false)
const markedTodeleteId = ref(null)
const productsFetchStore = useProductsFetchStore()
const products = computed(() => productsFetchStore.products)
const productsLoading = computed(() => productsFetchStore.productsLoading)
const showNewProductPopup = ref(false)
const showImagesPopup = ref(false)
const markedProductId = ref(null)
const variantsLoading = ref(false)
const variants = ref([])
const uploading = computed(() => uploadImageStore.uploading)
const images = ref([])
const image = ref(null)
const existingImages = ref([])
const saving = ref(false)
const productLoading = ref(false)

const closeImagesPopup = () => {
  showImagesPopup.value = false
}
const openImagesPopup = async (productId) => {
  markedProductId.value = productId
  productLoading.value = true
  try {
    const response = await BASE_URL.get(`/products/getByid/${productId}`)
    console.log('product', response.data.product)
    const images = response.data.product.images.map((item) => ({
      url: item.url,
      isSelected: false
    }))
    existingImages.value = images
    productLoading.value = false
    showImagesPopup.value = true
  } catch (error) {
    productLoading.value = false
    alert(error.response ? error.respose.data.message : error.message)
  }
}

const uploadImage = async () => {
  const folderName = 'productImages'
  const imageUrl = await uploadImageStore.novoMercatoUpload(image.value, folderName)
  images.value.push(imageUrl)
}

const handleImageSelect = (imageFile) => {
  console.log('imageFile', imageFile)
  image.value = imageFile
}
const removeImage = (index) => {
  if (index >= 0 && index < images.value.length) {
    images.value.splice(index, 1)
  }
}
const addImages = async () => {
  saving.value = true
  const urls = images.value
  const productId = markedProductId.value
  try {
    const response = await BASE_URL.post(`/products/${productId}/images/add`, { urls })
    console.log(response.data.message)
    saving.value = false
    showImagesPopup.value = false
  } catch (error) {
    saving.value = false
    alert(error.response ? error.respose.data.message : error.message)
  }
}

const seeVariants = async (productId) => {
  router.push({ path: `/variants/${productId}` })
}

const openNewProductPopup = () => {
  showNewProductPopup.value = true
}
const closeNewProductPopup = () => {
  showNewProductPopup.value = false
}

const startDelete = (id) => {
  markedTodeleteId.value = id
  console.log('markedTodeleteId.value', markedTodeleteId.value)
  showDelete.value = true
}

const cancelDelete = () => {
  showDelete.value = false
}

const confirmDelete = async () => {
  deleting.value = true

  await BASE_URL.delete(`/products/${markedTodeleteId.value}/delete`)
    .then((res) => {
      console.log(res.data)
      deleting.value = false
    })
    .catch((err) => {
      deleting.value = false
      console.error(err.message)
    })
  showDelete.value = false
}
onMounted(async () => {
  await productsFetchStore.getProducts()
})
</script>
<style scoped></style>
