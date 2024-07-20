<template>
  <div class="category-popup">
    <div
      v-if="showSubCategories"
      class="fixed top-0 left-0 w-full h-screen z-50 bg-black/50 flex items-center justify-center"
    >
      <div class="w-[600px] bg-white rounded-xl shadow-sm p-5 relative">
        <div
          v-if="subSubCategoriesFetching"
          class="absolute top-0 left-0 h-full w-full bg-slate-600/25 flex items-center justify-center"
        >
          <unicon fill="black" name="spinner" class="animate-spin"></unicon>
        </div>
        <div class="flex items-center justify-between pb-2.5 mb-5 border-b border-b-gray-300">
          <p>Subcategory List</p>
          <button class="" type="button" @click="emit('close-sub-category-popup')">
            <unicon fill="black" name="times"></unicon>
          </button>
        </div>
        <div class="mt-5">
          <ul class="h-96 overflow-y-auto no-scrollbar">
            <li
              v-for="(subcategory, index) in subCategories"
              :key="index"
              class="py-2 border-b border-b-gray-200"
            >
              <div class="flex items-center justify-between">
                <span>{{ subcategory.title_ru }}</span>
                <div class="flex items-center space-x-2.5">
                  <button @click="toggleNewSubCategory(subcategory)" type="button">
                    <unicon fill="black" name="book-medical"></unicon>
                  </button>
                  <button @click="getSubSubCategories(subcategory)" type="button">
                    <unicon fill="black" name="list-ul"></unicon>
                  </button>
                </div>
              </div>
              <div class="new-sub-sub-category my-2.5" v-if="subcategory.showDetails">
                <form @submit.prevent="addSubSubCategory" class="grid grid-cols-5 gap-5">
                  <div class="flex flex-col col-span-2">
                    <label class="mb-2.5 text-sm font-semibold">Sub subcategory name (EN)</label>
                    <input
                      v-model="new_ss_title_en"
                      required
                      type="text"
                      placeholder="Name in English"
                      class="w-full p-2.5 rounded-xl border border-gray-300 outline-0 focus:border-2 placeholder:text-sm focus:border-[#883ae1]"
                    />
                  </div>
                  <div class="flex flex-col col-span-2">
                    <label class="mb-2.5 text-sm font-semibold">Sub-subcategory name (RU)</label>
                    <input
                      v-model="new_ss_title_ru"
                      required
                      type="text"
                      placeholder="Name in Russian"
                      class="w-full p-2.5 rounded-xl border border-gray-300 outline-0 focus:border-2 placeholder:text-sm focus:border-[#883ae1]"
                    />
                  </div>
                  <div class="flex flex-col col-span-1">
                    <label class="mb-2.5 text-sm font-semibold">Save</label>
                    <button
                      type="submit"
                      :disabled="s_subCategorySaving"
                      class="text-center bg-primary text-white rounded-xl p-2.5 text-sm"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
              <div class="my-2.5" v-if="markedParentId === subcategory._id">
                <ul v-if="currentSubSubCategories.length > 0">
                  <li
                    v-for="(subsubcategory, index) in currentSubSubCategories"
                    :key="index"
                    class="my-2 5 text-sm"
                  >
                    {{ index + 1 }}. <span>{{ subsubcategory.title_ru }}</span>
                  </li>
                </ul>
                <span v-else class="my-2.5 text-center text-sm">No items found.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCategoryStore } from '@/stores/categories/categories'
import { ref, computed } from 'vue'

const categoryStore = useCategoryStore()
const s_subCategorySaving = computed(() => categoryStore.s_subCategorySaving)
const subSubCategoriesFetching = computed(() => categoryStore.subSubCategoriesFetching)
const currentSubSubCategories = computed(() => categoryStore.currentSubSubCategories)
const markedParentId = ref(null)
const new_ss_title_ru = ref('Мусорные ведра и баки')
const new_ss_title_en = ref('Trash cans and waste bins')

const emit = defineEmits([
  'close-sub-category-popup',
  'open-sub-sub-category-popup',
  'get-sub-sub-categories'
])

const props = defineProps({
  showSubCategories: false,
  categorySaving: Boolean,
  subCategories: Array
})

const toggleNewSubCategory = (subcategory) => {
  subcategory.showDetails = !subcategory.showDetails
  if (subcategory.showDetails) {
    markedParentId.value = subcategory._id
  } else {
    markedParentId.value = null
  }
}
const addSubSubCategory = () => {
  const parentId = markedParentId.value
  const title_en = new_ss_title_en.value
  const title_ru = new_ss_title_ru.value
  console.log('parentId', parentId)
  categoryStore.addSubSubCategory(parentId, title_en, title_ru)
}
const getSubSubCategories = async (subcategory) => {
  console.log('subcategory', subcategory._id)
  subcategory.showDetails = false
  markedParentId.value = subcategory._id
  await categoryStore.getSubSubCategories(subcategory._id)
}
</script>
