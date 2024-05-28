<template>
  <div>
    <Transition
      enter-active-class="animate__animated animate__zoomIn animate__faster"
      leave-active-class="animate__animated animate__backOutDown animate__faster"
    >
      <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center">
        <div class="h-3/4 min-w-96 bg-white shadow-2xl relative px-5">
          <button class="absolute top-2 right-4" @click="closeDetails">
            <IconTimes />
          </button>
          <h2 class="text-center text-2xl my-5">Edit product</h2>
          <form @submit.prevent="createProduct" class="mt-10">
            <div class="grid md:grid-cols-2 grid-cols-1 md:gap-4 gap-2">
              <BaseInput
                v-bind="$attrs"
                :label="'Title'"
                :type="'text'"
                v-model="editedProduct.title"
              />
              <BaseInput
                v-bind="$attrs"
                :label="'Description'"
                :type="'text'"
                v-model="editedProduct.description"
              />
              <BaseInput
                v-bind="$attrs"
                :label="'Category'"
                :type="'text'"
                v-model="editedProduct.category"
              />
              <BaseInput
                v-bind="$attrs"
                :label="'Category'"
                :type="'text'"
                v-model="editedProduct.category"
              />
              <BaseInput
                v-bind="$attrs"
                :label="'Subategory'"
                :type="'text'"
                v-model="editedProduct.subcategory"
              />
              <BaseInput
                v-bind="$attrs"
                :label="'Material'"
                :type="'text'"
                v-model="editedProduct.material"
              />
              <BaseInput
                v-bind="$attrs"
                :label="'Price'"
                :type="'number'"
                v-model="editedProduct.price"
              />
              <BaseInput
                v-bind="$attrs"
                :label="'Quantity'"
                :type="'number'"
                v-model="editedProduct.availableQt"
              />
              <BaseInput
                v-bind="$attrs"
                :label="'Width'"
                :type="'number'"
                v-model="editedProduct.width"
              />
              <BaseInput
                v-bind="$attrs"
                :label="'Height'"
                :type="'number'"
                v-model="editedProduct.height"
              />
            </div>
          </form>
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
      <ul class="h-[32rem] overflow-y-auto no-scrollbar" v-if="products.length > 0">
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
            <button @click="startEditProduct(product)">
              <IconEdit />
            </button>
            <button @click="startDelete(product._id)">
              <IconTrash />
            </button>
            <button>
              <IconView />
            </button>
            <button>
              <IconStar />
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
import BaseInput from '@/base/BaseInput.vue'
import IconTimes from '@/icons/IconTimes.vue'
import IconTrash from '@/icons/IconTrash.vue'
import IconView from '@/icons/IconView.vue'
import IconEdit from '@/icons/IconEdit.vue'
import IconStar from '@/icons/IconStar.vue'
import BASE_URL from '@/backand/api'

const showEditModal = ref(false)
const showDelete = ref(false)
const deleting = ref(false)
const markedTodeleteId = ref(null)
const productsFetchStore = useProductsFetchStore()
const products = computed(() => productsFetchStore.products)
const productsLoading = computed(() => productsFetchStore.productsLoading)
const editedProduct = ref(null)

const startEditProduct = (product) => {
  editedProduct.value = product
  showEditModal.value = true
  console.log('product', product)
}
const closeDetails = () => {
  editedProduct.value = null
  showEditModal.value = false
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
