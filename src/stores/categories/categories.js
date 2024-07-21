import { defineStore } from 'pinia'
import BASE_URL from '@/backand/api'

export const useCategoryStore = defineStore('CategoryStore', {
  state: () => ({
    categories: [],
    categoriesSaving: false,
    subCategoriesSaving: false,
    showNewCategoryPopup: false,
    categoryFetching: false,
    currentSubCategories: [],
    subCategoryFetching: false,
    showSubcategories: false,
    s_subCategorySaving: false,
    currentSubSubCategories: [],
    subSubCategoriesFetching: false,
    allCategories: []
  }),

  actions: {
    async addCategory(title_en, title_ru, icon) {
      try {
        this.categoriesSaving = true
        const response = await BASE_URL.post('/categories/add/top-level', {
          title_en,
          title_ru,
          icon
        })
        console.log(response.data)
        this.categories.push({
          showDetails: false,
          ...response.data.category
        })
        this.categoriesSaving = false
      } catch (error) {
        this.categoriesSaving = false
        alert(error.response ? error.response.data.message : error.message)
      }
    },
    async addSubCategory(parentId, title_en, title_ru) {
      this.s_subCategorySaving = true
      try {
        const response = BASE_URL.post(`/categories/${parentId}/addSubcategory`, {
          title_en,
          title_ru
        })
        console.log(response)
        this.s_subCategorySaving = false
      } catch (error) {
        this.s_subCategorySaving = false
        alert(error.message)
      }
    },
    async addSubSubCategory(parentId, title_en, title_ru) {
      this.subCategoriesSaving = true
      try {
        const response = BASE_URL.post(`/subcategories/${parentId}/addSubSubcategory`, {
          title_en,
          title_ru
        })
        console.log(response)
        this.subCategoriesSaving = false
      } catch (error) {
        this.subCategoriesSaving = false
        alert(error.message)
      }
    },
    async getCategories() {
      try {
        this.categoryFetching = true
        const response = await BASE_URL.get('/categories/get')
        console.log(response.data)
        this.categories = response.data.categories.map((category) => ({
          ...category,
          showDetails: false
        }))

        this.categoryFetching = false
      } catch (error) {
        this.categoryFetching = false
        alert(error.response ? error.response.data.message : error.message)
        console.error(error.response ? error.response.data.message : error.message)
      }
    },
    async getSubCategories(parentId) {
      try {
        this.subCategoryFetching = true
        const response = await BASE_URL.get(`/categories/${parentId}/subcategories`)
        console.log(response.data)
        this.currentSubCategories = response.data.subcategories.map((category) => ({
          ...category,
          showDetails: false
        }))

        this.subCategoryFetching = false
        this.showSubcategories = true
      } catch (error) {
        this.subCategoryFetching = false
        alert(error.response ? error.response.data.message : error.message)
        console.error(error.response ? error.response.data.message : error.message)
      }
    },
    async getSubSubCategories(parentId) {
      this.currentSubSubCategories = []
      try {
        this.subSubCategoriesFetching = true
        const response = await BASE_URL.get(`/subcategories/${parentId}/subSubcategories`)
        console.log(response.data)
        this.currentSubSubCategories = response.data.subSubcategories.map((category) => ({
          ...category,
          showDetails: false
        }))

        this.subSubCategoriesFetching = false
      } catch (error) {
        this.subSubCategoriesFetching = false
        alert(error.response ? error.response.data.message : error.message)
        console.error(error.response ? error.response.data.message : error.message)
      }
    },
    async fetchCategories() {
      try {
        const response = await BASE_URL.get('/categoriesWithNestedSubcategories')
        const data = response.data
        console.log('data', data)
        this.allCategories = data.categories
      } catch (error) {
        console.error(error)
      }
    },
    openCategoryPopup() {
      this.showNewCategoryPopup = true
    },
    closeCategoryPopup() {
      this.showNewCategoryPopup = false
    },
    closeSubCategoriesList() {
      this.currentSubCategories = []
      this.showSubcategories = false
    }
  }
})
