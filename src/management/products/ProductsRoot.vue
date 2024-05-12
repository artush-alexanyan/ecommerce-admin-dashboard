<template>
  <div>
    <h1 class="text-left text-xl font-semibold mb-5">Products</h1>
    <div class="grid grid-cols-3 gap-10">
      <div class="col-span-2 bg-white rounded-md p-5">
        <component :is="currentComponent"></component>
      </div>
      <div class="col-span-1 bg-white rounded-md p-5">
        <ul>
          <li
            v-for="tab in productComponents"
            :key="tab.id"
            @click="changeProductTab(tab)"
            class="py-3.5 cursor-pointer flex items-center space-x-2"
          >
            <unicon
              :name="tab.icon"
              height="20"
              :fill="currentComponent === tab.component ? '#F18868' : 'black'"
            ></unicon>
            <span
              class="text-sm font-semibold"
              :class="{ 'text-[#F18868]': currentComponent === tab.component }"
              >{{ tab.title }}</span
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { shallowRef, markRaw } from 'vue'
import AddProduct from './add-product/AddProduct.vue'
import EditProduct from './edit-products/EditProduct.vue'
import ProductsChart from './ProductsChart.vue'

const currentComponent = shallowRef(AddProduct)
const productComponents = shallowRef([
  { id: 0, icon: 'book-medical', component: markRaw(AddProduct), title: 'Add product' },
  { id: 1, icon: 'pen', component: markRaw(EditProduct), title: 'Edit product' },
  { id: 2, icon: 'chart', component: markRaw(ProductsChart), title: 'Product charts' }
])

const changeProductTab = (tab) => {
  currentComponent.value = tab.component
}
</script>

<style scoped></style>
