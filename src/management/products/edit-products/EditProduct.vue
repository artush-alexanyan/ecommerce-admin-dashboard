<template>
  <div>
    <Transition
      enter-active-class="animate__animated animate__zoomIn animate__faster"
      leave-active-class="animate__animated animate__backOutDown animate__faster"
    >
      <div v-if="showDetails" class="fixed inset-0 flex items-center justify-center">
        <div class="h-96 w-96 bg-black rounded">
          <button @click="closeDetails">close</button>
        </div>
      </div>
    </Transition>

    <p class="text-sm font-semibold pb-5">Edit product</p>
    <div class="loading flex items-center justify-center h-80" v-if="productsLoading">
      <BaseLoader />
    </div>
    <div class="products text-sm" v-else>
      <BaseDeleteModal
        :showDelete="showDelete"
        :deleting="deleting"
        @cancel-delete="cancelDelete"
        @confirm-delete="confirmDelete"
      />
      <ul class="h-[32rem] overflow-y-auto" v-if="products.length > 0">
        <li
          v-for="product in products"
          :key="product._id"
          class="py-2.5 flex items-center justify-between"
        >
          <div class="flex items-center space-x-2.5">
            <img :src="product.image" class="h-16" alt="productImage" />
            <p class="font-semibold">{{ product.title }}</p>
            <p class="text-gray-400">{{ product.category }}</p>
            <p class="text-green-500">${{ product.price }}</p>
            <p>{{ product.createdAt }}</p>
          </div>
          <div class="flex items-center space-x-2.5">
            <button><unicon name="pen" fill="#0b877f" height="16"></unicon></button>
            <button @click="startDelete(product._id)">
              <unicon name="trash" fill="red" height="16"></unicon>
            </button>
            <button @click="showProductDetails(product)">
              <unicon name="ellipsis-h" fill="royalblue" height="16"></unicon>
            </button>
          </div>
        </li>
      </ul>
      <div v-else class="no-products">
        <p class="text-center">No products found</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useProductsFetchStore } from '@/stores/products/get-products'
import BaseLoader from '@/base/BaseLoader.vue'
import BaseDeleteModal from '@/base/BaseDeleteModal.vue'
import BASE_URL from '@/backand/api'

const showDetails = ref(false)
const showDelete = ref(false)
const deleting = ref(false)
const markedTodeleteId = ref(null)
const productsFetchStore = useProductsFetchStore()
const products = computed(() => productsFetchStore.products)
const productsLoading = computed(() => productsFetchStore.productsLoading)

const showProductDetails = (product) => {
  showDetails.value = true
  console.log('product', product)
}
const closeDetails = () => {
  showDetails.value = false
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
