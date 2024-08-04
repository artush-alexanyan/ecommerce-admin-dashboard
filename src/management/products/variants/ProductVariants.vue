<template>
  <div class="new-produsct">
    <div>
      <div class="bg-white p-5 rounded-[30px] w-full">
        <div>
          <div class="flex items-center justify-between pb-5 border-b border-b-gray-200">
            <p class="text-xl font-semibold">Product details</p>
            <button type="button" @click="backToProducts">
              <unicon name="times" fill="black"></unicon>
            </button>
          </div>

          <div v-if="productLoading" class="loading-state py-20">
            <BaseLoader />
          </div>
          <div class="" v-else>
            <div class="product" v-if="product">
              <div class="bg-white p-5 rounded-[30px] grid md:grid-cols-3 gap-5">
                <div class="w-full md:col-span-2">
                  <h4 class="text-xl font-semibold">Variations</h4>
                  <div class="ul">
                    <div
                      class="li py-2"
                      v-for="(variant, index) in product.variants"
                      :key="variant.sku"
                    >
                      <span class="text-xs text-purple-600"
                        >{{ index + 1 }} - {{ variant.sku }}</span
                      >
                      <ul>
                        <li v-for="(attribute, index) in variant.attributes" :key="index">
                          <div class="flex items-center">
                            <span class="font-semibold">{{ attribute.name }}:</span>
                            <ul>
                              <li v-for="(option, index) in attribute.options" :key="index">
                                <span>{{ option.label }}</span>
                              </li>
                            </ul>
                          </div>
                        </li>
                      </ul>
                      <span class="font-semibold">Images: {{ variant.images.length }}</span> <br />
                      <span class="font-semibold">Stock: {{ variant.stock }}</span
                      ><br />
                      <button @click="openImagesPopup(variant._id)" class="text-green-600">
                        Add image
                      </button>
                    </div>
                  </div>
                </div>
                <div class="md:col-span-1 border-l border-l-gray-200 px-5">
                  <h4 class="text-xl font-semibold">Attributes</h4>
                  <BaseSelect :label="'color'" v-if="colors.length > 0" :items="colors" />
                  <BaseSelect :label="'material'" v-if="materials.length > 0" :items="materials" />
                  <BaseSelect :label="'size'" v-if="sizes.length > 0" :items="sizes" />
                </div>
              </div>
            </div>
            <div v-else class="no-product">
              <span class="text-center">Product not found</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ImagesPopup
      :show-images-popup="showImagesPopup"
      :saving="saving"
      :uploading="uploading"
      :btn-text="'variant'"
      :image="image"
      :existing-images="existingImages"
      :images="images"
      @handle-image-select="handleImageSelect"
      @select-image="selectImage"
      @remove-image="removeImage"
      @upload-image="uploadImage"
      @save-images="addImages"
      @close-images-popup="closeImagesPopup"
    />
  </div>
</template>

<script setup>
import BASE_URL from '@/backand/api'
import { ref, computed, onMounted } from 'vue'
import { useUploadImageStore } from '@/stores/upload-image/upload-image'
import { useRouter, useRoute } from 'vue-router'
import BaseLoader from '@/base/BaseLoader.vue'
import BaseSelect from '../add-product/BaseSelect.vue'
import ImagesPopup from '../ImagesPopup.vue'

const router = useRouter()
const route = useRoute()
const product = ref(false)
const productLoading = ref(false)
const showImagesPopup = ref(false)
const uploadImageStore = useUploadImageStore()
const uploading = computed(() => uploadImageStore.uploading)
const images = ref([])
const image = ref(null)
const existingImages = ref([])
const saving = ref(false)
const selectedMaterial = ref(null)
const selectedColor = ref(null)
const selectedSize = ref(null)
const selectedVariantId = ref(null)
const currentPrice = ref(0)
const currentStock = ref(0)

const openImagesPopup = (variantId) => {
  selectedVariantId.value = variantId
  showImagesPopup.value = true
}

const closeImagesPopup = () => {
  showImagesPopup.value = false
}

const backToProducts = () => {
  router.push({ path: '/products' })
}

// Computed property to get unique colors
const colors = computed(() => {
  const colorSet = new Set()
  product.value.variants.forEach((variant) => {
    const colorAttr = variant.attributes.find((attr) => attr.name.toLowerCase() === 'color')
    if (colorAttr) {
      colorAttr.options.forEach((option) => {
        colorSet.add(JSON.stringify(option))
      })
    }
  })
  return Array.from(colorSet).map((color) => JSON.parse(color))
})

// Computed property to get unique sizes
const sizes = computed(() => {
  const sizeSet = new Set()
  product.value.variants.forEach((variant) => {
    const sizeAttr = variant.attributes.find((attr) => attr.name.toLowerCase() === 'size')
    if (sizeAttr) {
      sizeAttr.options.forEach((option) => {
        sizeSet.add(JSON.stringify(option))
      })
    }
  })
  return Array.from(sizeSet).map((size) => JSON.parse(size))
})

// Computed property to get unique materials
const materials = computed(() => {
  const materialSet = new Set()
  product.value.variants.forEach((variant) => {
    const materialAttr = variant.attributes.find((attr) => attr.name.toLowerCase() === 'material')
    if (materialAttr) {
      materialAttr.options.forEach((option) => {
        materialSet.add(JSON.stringify(option))
      })
    }
  })
  return Array.from(materialSet).map((material) => JSON.parse(material))
})

const selectMaterial = (item) => {
  selectedMaterial.value = item
}

const selectColor = (item) => {
  console.log(item)
  selectedColor.value = {
    colorName: getColorName(item),
    hex: item
  }
}

const selectSize = (item) => {
  console.log(item)
  selectedSize.value = item
  sizes.value.push({ size: item })
}

const handleImageSelect = (imageFile) => {
  image.value = imageFile
}

const uploadImage = async () => {
  const folderName = 'productImages'
  const imageUrl = await uploadImageStore.uploadImage(image.value, folderName)
  images.value.push(imageUrl)
}

const selectImage = (imageItem) => {
  // Toggle the isSelected property
  imageItem.isSelected = !imageItem.isSelected

  if (imageItem.isSelected) {
    // If the image is selected and not already in the array, add it
    if (!images.value.includes(imageItem.url)) {
      images.value.push(imageItem.url)
      console.log('Image selected:', imageItem.url)
    }
  } else {
    // If the image is deselected and in the array, remove it
    const index = images.value.indexOf(imageItem.url)
    if (index !== -1) {
      images.value.splice(index, 1)
      console.log('Image deselected:', imageItem.url)
    }
  }
}

const removeImage = (index) => {
  if (index >= 0 && index < images.value.length) {
    images.value.splice(index, 1)
  }
}

const addImages = async () => {
  const variantId = selectedVariantId.value
  saving.value = true
  try {
    const response = await BASE_URL.post(`/variants/${variantId}/images/add`, {
      urls: images.value
    })
    console.log(response.data)
    selectedColor.value = null
    images.value = []
    image.value = null
    saving.value = false
    showImagesPopup.value = false
  } catch (error) {
    saving.value = false
    alert(error.response ? error.response.data.message : error.message)
  }
}

const getProduct = async (productId) => {
  productLoading.value = true
  try {
    const response = await BASE_URL.get(`/products/getByid/${productId}`)
    product.value = response.data.product
    console.log('product', product.value.variants)
    const images = response.data.product.images.map((item) => ({
      url: item.url,
      isSelected: false
    }))
    existingImages.value = images
    productLoading.value = false
  } catch (error) {
    productLoading.value = false
    alert(error.response ? error.respose.data.message : error.message)
  }
}

onMounted(async () => {
  const productId = route.params.id
  await getProduct(productId)
})
</script>
