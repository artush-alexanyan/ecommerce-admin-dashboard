<template>
  <div class="new-produsct">
    <Transition
      enter-active-class="animate__animated animate__fadeIn animate__faster"
      leave-active-class="animate__animated animate__fadeOut animate__faster"
    >
      <div
        v-if="showNewProductPopup"
        class="fixed top-0 left-0 z-30 bg-black/50 w-full h-screen flex p-5 justify-center"
      >
        <div class="bg-white p-5 rounded-[30px] w-1/2">
          <BaseAlert :messages="messages || uploadMessages" />
          <div>
            <div class="flex items-center justify-between pb-5 border-b border-b-gray-200">
              <p class="text-xl font-semibold">Add a new product</p>
              <button type="button" @click="emit('close-new-product-popup')">
                <unicon name="times" fill="black"></unicon>
              </button>
            </div>
            <div class="mt-5 text-sm">
              <form @submit.prevent="createProduct">
                <div class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 md:gap-4 gap-2">
                  <BaseInput v-bind="$attrs" :label="'Title'" :type="'text'" v-model="title" />
                  <div class="select flex-col flex">
                    <label class="font-semibold"> Select category </label>
                    <select
                      v-model="selectedCategory"
                      class="w-full py-2.5 mt-1.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
                      name="category"
                      id="category"
                    >
                      <option
                        class="flex items-center space-x-2"
                        :value="category"
                        v-for="(category, index) in categories"
                        :key="index"
                      >
                        <img :src="category.icon" alt="icon" class="h-4" />
                        <span> {{ category.title_ru }}</span>
                      </option>
                    </select>
                  </div>
                  <div class="select flex-col flex">
                    <label class="font-semibold"> Select subcategory </label>
                    <select
                      v-model="selectedSubCategory"
                      class="w-full py-2.5 mt-1.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
                      name="category"
                      id="category"
                    >
                      <option
                        class="flex items-center"
                        :value="category"
                        v-for="(category, index) in subCategories"
                        :key="index"
                      >
                        <span> {{ category.title_ru }}</span>
                      </option>
                    </select>
                  </div>

                  <div class="select flex-col flex">
                    <label class="font-semibold"> Select sub-subcategory </label>
                    <select
                      v-model="selectedSubSubCategory"
                      class="w-full py-2.5 mt-1.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
                      name="category"
                      id="category"
                    >
                      <option
                        class="flex items-center space-x-2"
                        :value="category"
                        v-for="(category, index) in subSubCategories"
                        :key="index"
                      >
                        <span> {{ category.title_ru }}</span>
                      </option>
                    </select>
                  </div>
                  <div class="select flex-col flex">
                    <label class="font-semibold"> Select brand </label>
                    <select
                      v-model="selectedBrand"
                      class="w-full py-2.5 mt-1.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
                      name="category"
                      id="category"
                    >
                      <option
                        class="flex items-center"
                        :value="brand"
                        v-for="(brand, index) in brands"
                        :key="index"
                      >
                        <span> {{ brand.title }}</span>
                      </option>
                    </select>
                  </div>
                  <div class="select flex-col flex">
                    <label class="font-semibold"> Select material </label>
                    <select
                      v-model="selectedMaterial"
                      class="w-full py-2.5 mt-1.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
                      name="category"
                      id="category"
                    >
                      <option
                        class="flex items-center space-x-2"
                        :value="material.title_ru"
                        v-for="(material, index) in materials"
                        :key="index"
                      >
                        <span> {{ material.title_ru }}</span>
                      </option>
                    </select>
                  </div>
                  <BaseInput v-bind="$attrs" :label="'Price'" :type="'number'" v-model="price" />
                  <BaseInput
                    v-bind="$attrs"
                    :label="'Quantity'"
                    :type="'number'"
                    v-model="availableQt"
                  />
                  <BaseInput v-bind="$attrs" :label="'Width'" :type="'number'" v-model="width" />
                  <BaseInput v-bind="$attrs" :label="'Height'" :type="'number'" v-model="height" />
                </div>
                <div class="flex flex-col items-left">
                  <label>
                    <textarea
                      v-model="description"
                      placeholder="Description"
                      class="w-full p-2.5 mt-1.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
                      name=""
                      id=""
                      cols="30"
                      rows="2"
                    ></textarea>
                  </label>
                </div>
                <div class="grid md:grid-cols-2 md:gap-4 gap-2">
                  <ColorSelect
                    :baseColors="baseColors"
                    :color="color"
                    :showColors="showColors"
                    @select-color="selectColor"
                    @toggle-colors="toggleColors"
                  />
                  <SelectImage
                    :image="image"
                    :loading="loading"
                    :uploading="uploading"
                    @handle-file-selection="handleFileSelection"
                    @upload-image="uploadNewImage"
                  />
                </div>
                <SubmitButton :loading="loading" :uploading="loadingImage" :btnText="btnText" />
              </form>
              <div class="uploaded-images my-5 flex flex-col items-center" v-if="defaultImageUrl">
                <p class="font-semibold mg-2.5 text-sm">Default image</p>
                <img
                  class="object-contain rounded h-20"
                  :src="defaultImageUrl"
                  alt="uploaded-image"
                />
              </div>
            </div>
          </div>
        </div></div
    ></Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, computed } from 'vue'
import { useUploadImageStore } from '@/stores/upload-image/upload-image'
import BASE_URL from '@/backand/api'
import BaseAlert from '@/base/BaseAlert.vue'
import ColorSelect from './ColorSelect.vue'
import SubmitButton from './SubmitButton.vue'
import SelectImage from './SelectImage.vue'
import BaseInput from '@/base/BaseInput.vue'
import { loadModel, classifyImage } from '@/utils/tensorflowImageClassifier'
import { useCategoryStore } from '@/stores/categories/categories'

const props = defineProps({
  showNewProductPopup: Boolean
})

const emit = defineEmits(['close-new-product-popup'])

const categoryStore = useCategoryStore()
const uploadImageStore = useUploadImageStore()
const uploadMessages = computed(() => uploadImageStore.uploadMessages)
const uploading = computed(() => uploadImageStore.uploading)
const containerRef = ref(null)
const loading = ref(false)
const loadingImage = ref(false)
const messages = ref([])
const title = ref('')
const price = ref('')
const availableQt = ref('')
const height = ref('')
const width = ref('')
const description = ref('')
const color = ref('')
const colorName = ref('')
const showColors = ref(false)
const image = ref(null)
const defaultImageUrl = ref(null)
const materials = ref([
  { id: 1, title_ru: 'Дерево', title_en: 'Wood' },
  { id: 2, title_ru: 'Стекло', title_en: 'Glass' },
  { id: 3, title_ru: 'Металл', title_en: 'Metal' },
  { id: 4, title_ru: 'Пластик', title_en: 'Plastic' },
  { id: 5, title_ru: 'Кожа', title_en: 'Leather' },
  { id: 6, title_ru: 'Ткань', title_en: 'Fabric' },
  { id: 7, title_ru: 'Керамика', title_en: 'Ceramic' },
  { id: 8, title_ru: 'Картон', title_en: 'Cardboard' },
  { id: 9, title_ru: 'Бетон', title_en: 'Concrete' },
  { id: 10, title_ru: 'Резина', title_en: 'Rubber' },
  { id: 11, title_ru: 'Алюминий', title_en: 'Aluminum' },
  { id: 12, title_ru: 'Бронза', title_en: 'Bronze' },
  { id: 13, title_ru: 'Нержавеющая сталь', title_en: 'Stainless Steel' },
  { id: 14, title_ru: 'Медь', title_en: 'Copper' },
  { id: 15, title_ru: 'Цинк', title_en: 'Zinc' },
  { id: 16, title_ru: 'Латунь', title_en: 'Brass' },
  { id: 17, title_ru: 'Камень', title_en: 'Stone' },
  { id: 18, title_ru: 'Гипс', title_en: 'Gypsum' },
  { id: 19, title_ru: 'Полиэстер', title_en: 'Polyester' },
  { id: 20, title_ru: 'Нейлон', title_en: 'Nylon' },
  { id: 21, title_ru: 'Акрил', title_en: 'Acrylic' },
  { id: 22, title_ru: 'Полиуретан', title_en: 'Polyurethane' },
  { id: 23, title_ru: 'Резина', title_en: 'Rubber' },
  { id: 24, title_ru: 'Фанера', title_en: 'Plywood' },
  { id: 25, title_ru: 'Стеклопластик', title_en: 'Fiberglass' },
  { id: 26, title_ru: 'Картон', title_en: 'Cardboard' },
  { id: 27, title_ru: 'Вата', title_en: 'Cotton Wool' },
  { id: 28, title_ru: 'Мрамор', title_en: 'Marble' },
  { id: 29, title_ru: 'Гранит', title_en: 'Granite' },
  { id: 30, title_ru: 'Линолеум', title_en: 'Linoleum' },
  { id: 31, title_ru: 'Масло', title_en: 'Oil' },
  { id: 32, title_ru: 'Воск', title_en: 'Wax' },
  { id: 33, title_ru: 'Шершавая бумага', title_en: 'Sandpaper' },
  { id: 34, title_ru: 'Пленка', title_en: 'Film' },
  { id: 35, title_ru: 'Титан', title_en: 'Titanium' },
  { id: 36, title_ru: 'Пластилин', title_en: 'Plasticine' },
  { id: 37, title_ru: 'Изолента', title_en: 'Electrical Tape' },
  { id: 38, title_ru: 'Магнит', title_en: 'Magnet' },
  { id: 39, title_ru: 'Глина', title_en: 'Clay' },
  { id: 40, title_ru: 'Ртуть', title_en: 'Mercury' },
  { id: 41, title_ru: 'Свинец', title_en: 'Lead' },
  { id: 42, title_ru: 'Холст', title_en: 'Canvas' },
  { id: 43, title_ru: 'Лак', title_en: 'Varnish' },
  { id: 44, title_ru: 'Эпоксидная смола', title_en: 'Epoxy Resin' },
  { id: 45, title_ru: 'Пробка', title_en: 'Cork' },
  { id: 46, title_ru: 'Бумага', title_en: 'Paper' },
  { id: 47, title_ru: 'Керамическая плитка', title_en: 'Ceramic Tile' },
  { id: 48, title_ru: 'Силикон', title_en: 'Silicone' },
  { id: 49, title_ru: 'Тефлон', title_en: 'Teflon' },
  { id: 50, title_ru: 'Пенопласт', title_en: 'Foam' },
  { id: 51, title_ru: 'Стеклянные волокна', title_en: 'Glass Fiber' },
  { id: 52, title_ru: 'Ткань из углеродного волокна', title_en: 'Carbon Fiber Fabric' },
  { id: 53, title_ru: 'Полиэтилен', title_en: 'Polyethylene' },
  { id: 54, title_ru: 'Синтетическое волокно', title_en: 'Synthetic Fiber' },
  { id: 55, title_ru: 'Деревянные волокна', title_en: 'Wood Fiber' },
  { id: 56, title_ru: 'Лакокрасочное покрытие', title_en: 'Paint' },
  { id: 57, title_ru: 'Анодированный алюминий', title_en: 'Anodized Aluminum' },
  { id: 58, title_ru: 'Металлизированная пленка', title_en: 'Metalized Film' },
  { id: 59, title_ru: 'Термопласт', title_en: 'Thermoplastic' },
  { id: 60, title_ru: 'Морская древесина', title_en: 'Marine Wood' },
  { id: 61, title_ru: 'Шершавая ткань', title_en: 'Rough Fabric' },
  { id: 62, title_ru: 'Порошковое покрытие', title_en: 'Powder Coating' },
  { id: 63, title_ru: 'Аэрозольная краска', title_en: 'Aerosol Paint' },
  { id: 64, title_ru: 'Кожа наппа', title_en: 'Nappa Leather' },
  { id: 65, title_ru: 'Картонная плита', title_en: 'Fiberboard' },
  { id: 66, title_ru: 'Полипропилен', title_en: 'Polypropylene' },
  { id: 67, title_ru: 'Меламиновая смола', title_en: 'Melamine Resin' },
  { id: 68, title_ru: 'Вулканизированный каучук', title_en: 'Vulcanized Rubber' },
  { id: 69, title_ru: 'Алюминиевый сплав', title_en: 'Aluminum Alloy' },
  { id: 70, title_ru: 'Карбоновая пленка', title_en: 'Carbon Film' },
  { id: 71, title_ru: 'Лавсан', title_en: 'Polyester Film' },
  { id: 72, title_ru: 'Термоклей', title_en: 'Hot Melt Adhesive' },
  { id: 73, title_ru: 'Преципитат', title_en: 'Precipitate' },
  { id: 74, title_ru: 'Кремний', title_en: 'Silicon' },
  { id: 75, title_ru: 'Гипсовая плита', title_en: 'Gypsum Board' },
  { id: 76, title_ru: 'Ватин', title_en: 'Wadding' },
  { id: 77, title_ru: 'Текстолит', title_en: 'Textolite' },
  { id: 78, title_ru: 'Шпон', title_en: 'Veneer' },
  { id: 79, title_ru: 'Нефтеполимер', title_en: 'Oil Polymer' },
  { id: 80, title_ru: 'Металлическая сетка', title_en: 'Metal Mesh' },
  { id: 81, title_ru: 'Гравий', title_en: 'Gravel' },
  { id: 82, title_ru: 'Герметик', title_en: 'Sealant' },
  { id: 83, title_ru: 'Резиновая крошка', title_en: 'Rubber Granules' },
  { id: 84, title_ru: 'Алюмопластик', title_en: 'Alumoplast' },
  { id: 85, title_ru: 'Пенополиуретан', title_en: 'Polyurethane Foam' },
  { id: 86, title_ru: 'Акриловая краска', title_en: 'Acrylic Paint' },
  { id: 87, title_ru: 'Пластиковая пленка', title_en: 'Plastic Film' },
  { id: 88, title_ru: 'Термостойкий стеклофибр', title_en: 'Heat-resistant Glass Fiber' },
  { id: 89, title_ru: 'Линолеум на основе ПВХ', title_en: 'PVC-based Linoleum' },
  { id: 90, title_ru: 'Бумага для упаковки', title_en: 'Packaging Paper' },
  { id: 91, title_ru: 'Антикоррозийное покрытие', title_en: 'Anti-corrosion Coating' },
  { id: 92, title_ru: 'Фторопласт', title_en: 'Fluoroplastic' },
  { id: 93, title_ru: 'Нейлоновая лента', title_en: 'Nylon Tape' },
  { id: 94, title_ru: 'Картонная коробка', title_en: 'Cardboard Box' },
  { id: 95, title_ru: 'Резиноткань', title_en: 'Rubber Fabric' },
  { id: 96, title_ru: 'Полиуретановая пленка', title_en: 'Polyurethane Film' },
  { id: 97, title_ru: 'Синтетическая кожа', title_en: 'Synthetic Leather' },
  { id: 98, title_ru: 'Штампованная сталь', title_en: 'Stamped Steel' },
  { id: 99, title_ru: 'Гибридный композит', title_en: 'Hybrid Composite' },
  { id: 100, title_ru: 'Термостойкий полимер', title_en: 'Heat-resistant Polymer' }
])
const baseColors = reactive([
  { hex: '#FFFFFF', name: 'White' },
  { hex: '#000000', name: 'Black' },
  { hex: '#FF0000', name: 'Red' },
  { hex: '#00FF00', name: 'Green' },
  { hex: '#0000FF', name: 'Blue' },
  { hex: '#FFFF00', name: 'Yellow' },
  { hex: '#FF00FF', name: 'Magenta' },
  { hex: '#00FFFF', name: 'Cyan' },
  { hex: '#808080', name: 'Gray' },
  { hex: '#800000', name: 'Maroon' },
  { hex: '#808000', name: 'Olive' },
  { hex: '#008000', name: 'Green' },
  { hex: '#800080', name: 'Purple' },
  { hex: '#008080', name: 'Teal' },
  { hex: '#C0C0C0', name: 'Silver' },
  { hex: '#FFA500', name: 'Orange' },
  { hex: '#FFC0CB', name: 'Pink' },
  { hex: '#FF69B4', name: 'HotPink' }
])
const brandLoading = ref(false)
const brands = ref([])

const selectedCategory = ref(null)
const selectedSubCategory = ref(null)
const selectedSubSubCategory = ref(null)
const selectedMaterial = ref(null)
const selectedBrand = ref(null)

const resetProductForm = () => {
  title.value = ''
  description.value = ''
  price.value = ''
  height.value = ''
  width.value = ''
  color.value = ''
  colorName.value = ''
  showColors.value = false
  defaultImageUrl.value = null
  selectedBrand.value = null
  selectedCategory.value = null
  selectedSubCategory.value = null
  selectedSubSubCategory.value = null
}

const categories = computed(() =>
  categoryStore.allCategories.map((category) => ({
    _id: category._id,
    title_ru: category.title_ru,
    title_en: category.title_en,
    category_key: category.category_key
  }))
)

const subCategories = computed(() => {
  if (!selectedCategory.value) return []
  const category = categoryStore.allCategories.find((cat) => cat._id === selectedCategory.value._id)
  return category
    ? category.subcategories.map((subcat) => ({
        _id: subcat._id,
        title_ru: subcat.title_ru,
        title_en: subcat.title_en,
        category_key: subcat.category_key
      }))
    : []
})

const subSubCategories = computed(() => {
  if (!selectedSubCategory.value) return []
  const category = categoryStore.allCategories.find((cat) => cat._id === selectedCategory.value._id)
  const subcategory = category?.subcategories.find(
    (subcat) => subcat._id === selectedSubCategory.value._id
  )
  return subcategory
    ? subcategory.subSubcategories.map((subsubcat) => ({
        _id: subsubcat._id,
        title_ru: subsubcat.title_ru,
        title_en: subsubcat.title_en,
        category_key: subsubcat.category_key
      }))
    : []
})

const processImage = async (imageUrl) => {
  loadingImage.value = true
  const image = new Image()
  image.crossOrigin = 'Anonymous' // Allow cross-origin requests
  image.src = imageUrl

  return new Promise(async (resolve, reject) => {
    image.onload = async () => {
      try {
        await loadModel()
        const classificationResults = await classifyImage(image)
        resolve(classificationResults)
        loadingImage.value = false
      } catch (error) {
        loadingImage.value = false
        reject(error)
      }
    }

    image.onerror = (error) => {
      reject(error)
    }
  })
}

const toggleColors = () => {
  showColors.value = !showColors.value
}

const selectColor = (colorOption) => {
  color.value = colorOption.hex
  colorName.value = colorOption.name
  showColors.value = false
}

const btnText = () => {
  if (loadingImage.value === true) {
    return 'Getting classifications...'
  } else if (loading.value === true) {
    return 'Creating product...'
  } else {
    return 'Save product'
  }
}

const resetMessages = () => {
  setTimeout(() => {
    messages.value = []
  }, 2000)
}

const handleFileSelection = (event) => {
  image.value = event.target.files[0]
  if (image.value) {
    const reader = new FileReader()

    reader.readAsDataURL(image.value)
  }
}
const uploadNewImage = async () => {
  if (!image.value) {
    messages.value.push({
      message: 'Please select image',
      type: 'Warning'
    })
    loading.value = false
    resetMessages()
    return
  }
  const folderName = 'products'
  const imageUrl = await uploadImageStore.uploadImage(image.value, folderName)
  defaultImageUrl.value = imageUrl
}
const createProduct = async () => {
  const createdAt = new Date()
  const numberHeight = Number(height.value)
  const numberWidth = Number(width.value)
  const newAvailableQt = Number(availableQt.value)
  console.log('Number(availableQt.value)', Number(availableQt.value))
  if (color.value === '') {
    messages.value.push({
      message: 'Please select color',
      type: 'Warning'
    })
    loading.value = false
    resetMessages()
    return
  }
  if (!image.value) {
    messages.value.push({
      message: 'Please select image',
      type: 'Warning'
    })
    loading.value = false
    resetMessages()
    return
  }
  const classificationResults = await processImage(defaultImageUrl.value)
  console.log('classificationResults', classificationResults)
  loading.value = true
  try {
    const response = await BASE_URL.post('products/add', {
      createdAt,
      title: title.value,
      price: price.value,
      category: selectedCategory.value,
      subCategory: selectedSubCategory.value,
      subSubCategory: selectedSubSubCategory.value,
      color: color.value,
      colorName: colorName.value,
      material: selectedMaterial.value,
      defaultImage: defaultImageUrl.value,
      brand: selectedBrand.value,
      height: numberHeight,
      width: numberWidth,
      description: description.value,
      availableQuantity: newAvailableQt,
      classificationResults
    })

    if (response && response.status === 201) {
      resetProductForm()
      loading.value = false
      messages.value.push({
        message: response.data.message,
        type: 'Success'
      })
      resetMessages()
    }

    image.value = null
  } catch (error) {
    loading.value = false
    console.error('Unexpected error:', error.message)
    messages.value.push({
      message: error.response ? error.response.data.message : error.message,
      type: 'Error'
    })
    resetMessages()
  }
}

const handleClickOutside = (event) => {
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    showColors.value = false
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

onMounted(async () => {
  await categoryStore.fetchCategories()
  await getBrands()
  containerRef.value = document.getElementById('container')
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped></style>
