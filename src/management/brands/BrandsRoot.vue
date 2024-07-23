<template>
  <div class="brands-root">
    <h1 class="text-left text-xl font-semibold mb-5 uppercase">Brands</h1>
    <div v-if="brandLoading" class="flex items-center justify-center">
      <BaseLoader />
    </div>
    <div v-else class="brand-list">
      <div
        class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5"
      >
        <div
          @mouseover="brand.showDetails = true"
          @mouseleave="brand.showDetails = false"
          class="relative rounded-xl border border-gray-300 hover:shadow-lg transition-all duration-500 hover:border-none bg-white px-5 py-10 flex items-center justify-center hover:cursor-pointer"
          v-for="(brand, index) in brands"
          :key="index"
        >
          <img class="h-12 mr-2.5" :src="brand.icon" alt="icon" />
          <span class="text-sm font-semibold"> {{ brand.title }} </span>
          <div
            v-if="brand.showDetails"
            class="absolute top-0 left-0 w-full h-full rounded-xl bg-black/50 flex items-center justify-center space-x-5"
          >
            <button :disabled="brand.deleting" @click="deleteBrand(brand)" type="button">
              <unicon
                v-if="brand.deleting"
                fill="white"
                name="spinner"
                class="animate-spin"
              ></unicon>
              <unicon v-else fill="red" name="trash"></unicon>
            </button>
          </div>
        </div>

        <button
          type="button"
          @click="openBrandPopup"
          class="rounded-xl border border-gray-300 hover:shadow-lg transition-all duration-500 bg-white px-5 py-10 flex items-center justify-center cursor pointer"
        >
          <unicon fill="#883ae1" name="book-medical"></unicon>
        </button>
      </div>
    </div>
    <NewBrandPopup
      v-model:title="brandTitle"
      :show-brand-popup="showBrandPopup"
      :brand-saving="brandSaving"
      @close-brand-popup="closeBrandPopup"
      @save-brand="saveBrand"
    />
  </div>
</template>

<script setup>
import BaseLoader from '@/base/BaseLoader.vue'
import NewBrandPopup from './NewBrandPopup.vue'
import { onMounted, ref } from 'vue'
import BASE_URL from '@/backand/api'

const brands = ref([])
const brandLoading = ref(false)
const brandSaving = ref(false)
const showBrandPopup = ref(false)
const brandTitle = ref('Brand name')

const openBrandPopup = () => {
  showBrandPopup.value = true
}
const closeBrandPopup = () => {
  showBrandPopup.value = false
}
const saveBrand = async (icon) => {
  brandSaving.value = true
  try {
    const response = await BASE_URL.post('/brands/add', { title: brandTitle.value, icon })
    console.log('response.data', response.data)
    const brand = response.data.brand
    brands.value.push(brand)
    brandSaving.value = false
    closeBrandPopup()
  } catch (error) {
    brandSaving.value = false
    alert(error.response ? error.response.data.message : error.message)
  }
}
const getBrands = async () => {
  brandLoading.value = true
  try {
    const response = await BASE_URL.get('/brands/get')
    console.log('response.data', response.data.brands)
    const results = response.data.brands
    brands.value = results.map((brand) => ({
      showDetails: false,
      deleting: false,
      ...brand
    }))
    brandLoading.value = false
  } catch (error) {
    brandLoading.value = false
    alert(error.response ? error.response.data.message : error.message)
  }
}
const deleteBrand = async (brand) => {
  brand.deleting = true
  try {
    const response = await BASE_URL.delete(`/brands/${brand._id}`)
    console.log('response.data', response.data.message)
    brands.value = brands.value.filter((item) => item._id !== brand._id)
    brand.deleting = false
  } catch (error) {
    brand.deleting = false
    alert(error.response ? error.response.data.message : error.message)
  }
}
onMounted(async () => {
  await getBrands()
})
</script>
