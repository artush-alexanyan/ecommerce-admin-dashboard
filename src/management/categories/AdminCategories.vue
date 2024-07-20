<template>
  <div class="categories-root">
    <h1 class="text-left text-xl font-semibold mb-5">Categories</h1>
    <div v-if="categoryFetching" class="flex items-center justify-center">
      <BaseLoader />
    </div>
    <div v-else class="category-list">
      <div class="grid grid-cols-5 gap-5">
        <div
          @mouseover="category.showDetails = true"
          @mouseleave="category.showDetails = false"
          class="relative rounded-xl border border-gray-300 hover:shadow-lg transition-all duration-500 hover:border-none bg-white px-5 py-10 flex items-center justify-center hover:cursor-pointer"
          v-for="(category, index) in categories"
          :key="index"
        >
          <span class="text-sm font-semibold"> {{ category.title_ru }} </span>
          <div
            v-if="category.showDetails"
            class="absolute top-0 left-0 w-full h-full rounded-xl bg-black/50 flex items-center justify-center space-x-5"
          >
            <button @click="openNewSubCategoryListPopup(category._id)" type="button">
              <unicon fill="white" name="book-medical"></unicon>
            </button>
            <button
              :disabled="subCategoryFetching"
              @click="getSubCategories(category._id)"
              type="button"
            >
              <unicon
                v-if="subCategoryFetching"
                fill="white"
                name="spinner"
                class="animate-spin"
              ></unicon>
              <unicon v-else fill="white" name="list-ul"></unicon>
            </button>
          </div>
        </div>

        <button
          type="button"
          @click="openCategoryPopup"
          class="rounded-xl border border-gray-300 hover:shadow-lg transition-all duration-500 bg-white px-5 py-10 flex items-center justify-center cursor pointer"
        >
          <unicon fill="#883ae1" name="book-medical"></unicon>
        </button>
      </div>
    </div>
    <CategoryPopup
      :show-category-popup="showNewCategoryPopup"
      :category-saving="categoriesSaving"
      v-model:title_en="newCategoryTitle_en"
      v-model:title_ru="newCategoryTitle_ru"
      @close-category-popup="closeCategoryPopup"
      @save-category="addCategory"
    />
    <CategoryPopup
      :popup-title="'Add Subcategory'"
      :show-category-popup="showNewSubCategoryListPopup"
      :category-saving="subCategoriesSaving"
      v-model:title_en="subCategoryTile_en"
      v-model:title_ru="subCategoryTile_ru"
      @close-category-popup="closeNewSubCategoryListPopup"
      @save-category="addSubCategory"
    />
    <SubCategoryListPopup
      :subCategories="currentSubCategories"
      :show-sub-categories="showSubCategories"
      @close-sub-category-popup="closeSubCategoriesList"
    />
  </div>
</template>

<script setup>
import { useCategoryStore } from '@/stores/categories/categories'
import { computed, onMounted, ref } from 'vue'
import CategoryPopup from './CategoryPopup.vue'
import BaseLoader from '@/base/BaseLoader.vue'
import SubCategoryListPopup from './SubCategoryListPopup.vue'

const categoryStore = useCategoryStore()
const categories = computed(() => categoryStore.categories)
const showNewCategoryPopup = computed(() => categoryStore.showNewCategoryPopup)
const categoriesSaving = computed(() => categoryStore.categoriesSaving)
const categoryFetching = computed(() => categoryStore.categoryFetching)
const subCategoriesSaving = computed(() => categoryStore.subCategoriesSaving)
const showSubCategories = computed(() => categoryStore.showSubcategories)
const currentSubCategories = computed(() => categoryStore.currentSubCategories)
const subCategoryFetching = computed(() => categoryStore.subCategoryFetching)

const newCategoryTitle_en = ref('')
const newCategoryTitle_ru = ref('')
const showNewSubCategoryListPopup = ref(false)
const subCategoryTile_en = ref('Lighting')
const subCategoryTile_ru = ref('Освещение')
const markedParentId = ref(null)
const openCategoryPopup = () => {
  categoryStore.openCategoryPopup()
}
const closeCategoryPopup = () => {
  categoryStore.closeCategoryPopup()
}

const closeSubCategoriesList = () => {
  categoryStore.closeSubCategoriesList()
}
const addCategory = async (icon) => {
  await categoryStore.addCategory(newCategoryTitle_en.value, newCategoryTitle_ru.value, icon)
}
const getCategories = async () => {
  await categoryStore.getCategories()
}
const openNewSubCategoryListPopup = (id) => {
  showNewSubCategoryListPopup.value = true
  markedParentId.value = id
}
const closeNewSubCategoryListPopup = () => {
  showNewSubCategoryListPopup.value = false
}
const addSubCategory = async () => {
  const parentId = markedParentId.value
  const title_en = subCategoryTile_en.value
  const title_ru = subCategoryTile_ru.value
  await categoryStore.addSubCategory(parentId, title_en, title_ru)
}
const getSubCategories = async (parentId) => {
  await categoryStore.getSubCategories(parentId)
}
onMounted(async () => {
  await getCategories()
})
</script>
