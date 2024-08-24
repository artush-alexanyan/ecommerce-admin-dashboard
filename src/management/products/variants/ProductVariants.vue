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
                  <VariantList
                    :variants="product.variants"
                    @open-images-popup="openImagesPopup"
                    @open-variant-edit-modal="openVariantEditModal"
                  />
                </div>
                <div class="md:col-span-1 border-l border-l-gray-200 px-5">
                  <h4 class="text-xl font-semibold">Attributes</h4>
                  <!-- <BaseSelect :label="'color'" v-if="colors.length > 0" :items="colors" />
                  <BaseSelect :label="'material'" v-if="materials.length > 0" :items="materials" />
                  <BaseSelect :label="'size'" v-if="sizes.length > 0" :items="sizes" /> -->
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
    <VariantEditModal
      v-if="editedVariant"
      v-model:newCharTitle="newCharTitle"
      v-model:newCharDescription="newCharDescription"
      v-model:stock.number="editedVariant.stock"
      v-model:price.number="editedVariant.price"
      :variant="editedVariant"
      :editing="editing"
      :show-variant-edit-popup="showVariantEditPopup"
      :show-new-char-form="showNewCharForm"
      @close-variant-edit-popup="closeVariantEditModal"
      @edit-variant-base-info="editVariantBaseInfo"
      @add-new-character="addNewCharacter"
      @remove-character="removeCharacter"
      @toggle-characters="toggleCharacters"
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
import VariantEditModal from './VariantEditModal.vue'
import VariantList from './VariantList.vue'

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
const showVariantEditPopup = ref(false)
const editedVariant = ref(null)
const editing = ref(false)
const markedEditVariantId = ref(null)
const newCharTitle = ref('')
const newCharDescription = ref('')
const showNewCharForm = ref(false)
const imageHeight = ref(null)
const imageWidth = ref(null)

const openVariantEditModal = (variant) => {
  markedEditVariantId.value = variant._id
  console.log('variantId', markedEditVariantId.value)
  editedVariant.value = variant
  showVariantEditPopup.value = true
}

const closeVariantEditModal = () => {
  showVariantEditPopup.value = false
}

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

const toggleCharacters = () => {
  showNewCharForm.value = !showNewCharForm.value
}

const addNewCharacter = () => {
  if (editedVariant.value) {
    if (newCharTitle.value.trim() !== '' && newCharDescription.value.trim() !== '') {
      editedVariant.value.characteristics.push({
        title: newCharTitle.value,
        description: newCharDescription.value
      })
    }
  } else {
    return
  }
}

const removeCharacter = (index) => {
  if (editedVariant.value) {
    if (index >= 0 && index < editedVariant.value.characteristics.length) {
      editedVariant.value.characteristics.splice(index, 1)
    }
  }
}

const editVariantBaseInfo = async () => {
  const variantId = markedEditVariantId.value
  const productId = route.params.id
  editing.value = true
  try {
    const response = await BASE_URL.put(`/products/${productId}/variants/${variantId}/editBase`, {
      price: editedVariant.value.price,
      stock: editedVariant.value.stock,
      characteristics: editedVariant.value.characteristics
    })
    console.log('Edited', response.data.message)
    showVariantEditPopup.value = false
    editing.value = false
  } catch (error) {
    editing.value = false
    alert(error.response ? error.response.data.message : error.message)
  }
}

const handleImageSelect = (imageFile) => {
  image.value = imageFile

  if (image.value) {
    const img = new Image()

    // Load the image to get its dimensions
    img.onload = function () {
      imageWidth.value = img.width
      imageHeight.value = img.height
      console.log('imageHeight.value', imageHeight.value)
      console.log('imageWidth.value', imageWidth.value)
      console.log('Image dimensions:', imageWidth.value, imageHeight.value)
    }

    // Read the file as a Data URL
    img.src = URL.createObjectURL(image.value)
  }
}

const uploadImage = async () => {
  const folderName = 'productImages'
  const imageUrl = await uploadImageStore.novoMercatoUpload(image.value, folderName)
  images.value.push({
    url: imageUrl,
    height: imageHeight.value,
    width: imageWidth.value
  })
}

const selectImage = (imageItem) => {
  // Toggle the isSelected property
  imageItem.isSelected = !imageItem.isSelected

  if (imageItem.isSelected) {
    // Check if the imageItem already exists in the images array
    const exists = images.value.some(
      (image) =>
        image.url === imageItem.url &&
        image.height === imageItem.height &&
        image.width === imageItem.width
    )

    if (!exists) {
      images.value.push(imageItem)
      console.log('Image selected:', imageItem.url)
    }
  } else {
    // If the image is deselected and in the array, remove it
    const index = images.value.findIndex((image) => image.url === imageItem.url)

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
      images: images.value
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
      height: item.height,
      width: item.height,
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
