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
      <ImagesPopup
        :show-images-popup="showImagesPopup"
        :product-id="markedProductId"
        @close-images-popup="closeImagesPopup"
      />
      <BaseDeleteModal
        :showDelete="showDelete"
        :deleting="deleting"
        @cancel-delete="cancelDelete"
        @confirm-delete="confirmDelete"
      />
      <div class="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-2.5">
        <div
          @mouseover="product.showDetails = true"
          @mouseleave="product.showDetails = false"
          v-for="product in products"
          :key="product._id"
          class="relative rounded-xl border border-gray-300 hover:shadow-lg transition-all duration-500 hover:border-none bg-white px-5 py-10 flex items-center justify-center hover:cursor-pointer"
        >
          <div class="flex items-center space-x-2.5">
            <div class="border border-gray-200">
              <img
                :src="product.defaultImage"
                class="h-32 min-w-32 object-contain"
                alt="productImage"
              />
            </div>
          </div>
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
                  @click="openImagesPopup(product._id)"
                  type="button"
                  class="bg-blue-600 text-white px-5 py-2.5 rounded"
                >
                  Add images
                </button>
                <button type="button" class="bg-blue-600 text-white px-5 py-2.5 rounded">
                  Add variant
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
import ImagesPopup from './ImagesPopup.vue'

const showEditModal = ref(false)
const showDelete = ref(false)
const deleting = ref(false)
const markedTodeleteId = ref(null)
const productsFetchStore = useProductsFetchStore()
const products = computed(() => productsFetchStore.products)
const productsLoading = computed(() => productsFetchStore.productsLoading)
const editedProduct = ref(null)
const showNewProductPopup = ref(false)
const showImagesPopup = ref(false)
const markedProductId = ref(null)

const closeImagesPopup = () => {
  showImagesPopup.value = false
}
const openImagesPopup = (productId) => {
  console.log('ProductId', productId)
  markedProductId.value = productId
  showImagesPopup.value = true
}
const openNewProductPopup = () => {
  showNewProductPopup.value = true
}
const closeNewProductPopup = () => {
  showNewProductPopup.value = false
}
const startEditProduct = (product) => {
  editedProduct.value = product
  showEditModal.value = true
  console.log('product', product)
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
