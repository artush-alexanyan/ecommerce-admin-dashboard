<template>
  <div class="new-produsct">
    <div>
      <div>
        <div class="bg-white rounde-xl p-5">
          <div class="flex items-center justify-between pb-5 border-b border-b-gray-200">
            <div class="flex items-center space-x-5">
              <h1 class="text-left text-xl font-semibold uppercase">Add new product</h1>
              <ProductTypeSwitch
                :is-multi-variant="isMultiVariant"
                @toggle-product-type="toggleMultiVariant"
              />
            </div>
          </div>
          <div class="grid md:grid-cols-10 gap-5">
            <div :class="isMultiVariant ? 'md:col-span-4' : 'md:col-span-5'">
              <BaseAlert :messages="messages || uploadMessages" />

              <div class="mt-5 text-sm">
                <form @submit.prevent="createProduct">
                  <div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-4 gap-2">
                    <BaseInput v-bind="$attrs" :label="'Title'" :type="'text'" v-model="title" />
                    <BaseInput
                      v-bind="$attrs"
                      :label="'Default price'"
                      :type="'number'"
                      v-model="defaultPrice"
                    />
                    <BaseInput
                      v-bind="$attrs"
                      :label="'Default stock'"
                      :type="'number'"
                      v-model="defaultStock"
                    />

                    <BaseSelect
                      :items="categories"
                      :label="'category'"
                      :selected-item="selectedCategory"
                      @select-item="selectCategory"
                    />

                    <BaseSelect
                      :items="subCategories"
                      :label="'subcategory'"
                      :selected-item="selectedSubCategory"
                      @select-item="selectSubCategory"
                    />

                    <BaseSelect
                      :items="subSubCategories"
                      :label="'sub-subcategory'"
                      :selected-item="selectedSubSubCategory"
                      @select-item="selectSubSubCategory"
                    />

                    <BaseSelect
                      :items="brands"
                      :label="'brand'"
                      :selected-item="selectedBrand"
                      @select-item="selectBrand"
                    />

                    <BaseSelect
                      :items="countryData"
                      :label="'manufacturer'"
                      :selected-item="madeIn"
                      @select-item="selectCountry"
                    />
                  </div>
                  <div class="flex flex-col items-left">
                    <label>
                      <textarea
                        v-model="description"
                        placeholder="Description"
                        class="w-full p-2.5 mt-1.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal rounded-xl mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
                        name=""
                        id=""
                        cols="30"
                        rows="4"
                      ></textarea>
                    </label>
                  </div>
                  <div class="flex items-center justify-between space-x-2">
                    <BaseInput
                      :disabled="generating"
                      v-bind="$attrs"
                      placeholder="'Set rules to generate description'"
                      :type="'text'"
                      v-model="gptQuery"
                      class="w-full"
                    />
                    <button
                      class="bg-blue-600 text-white px-5 py-3.5 rounded-xl"
                      :disabled="generating"
                      @click="sendAssistanceMessage"
                      type="button"
                    >
                      {{ generating ? 'Sending' : 'Send' }}
                    </button>
                  </div>
                  <div class="grid md:grid-cols-2 md:gap-4 gap-2 mt-10">
                    <SelectImage
                      :image="image"
                      :loading="loading"
                      :uploading="uploading"
                      @handle-file-selection="handleFileSelection"
                      @upload-image="uploadNewImage"
                    />
                    <SubmitButton :loading="loading" :uploading="loadingImage" :btnText="btnText" />
                  </div>
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
            <div
              class="border-l border-l-gray-200 p-2.5 h-screen overflow-y-auto pb-10"
              :class="isMultiVariant ? 'md:col-span-3' : 'md:col-span-5'"
            >
              <CharacteristicList
                v-model:characterKey="characterKey"
                v-model:characterValue="characterValue"
                :show-characteristics="showCharacteristics"
                :characteristics="characteristics"
                :character-key="characterKey"
                :character-value="characterValue"
                @toggle-characteristics="toogleCharacteristics"
                @add-caracteristic="addCaracteristic"
                @remove-characteristic="removeCharacteristic"
              />
            </div>
            <div v-if="isMultiVariant" class="border-l border-l-gray-200 p-2.5 md:col-span-3">
              <BaseSelect
                :items="attributesList"
                :label="'attributes'"
                :selected-item="selectedAttribute"
                @select-item="selectAttribute"
                class="mb-5"
              />
              <hr class="my-2.5" />

              <ColorSelect
                v-if="selectedAttribute === 'Color'"
                :selected-color="selectedColor"
                @select-color="selectColor"
                @add-attribute-option="addAttributeOption"
              />
              <div class="flex flex-col" v-if="selectedAttribute && selectedAttribute !== 'Color'">
                <label for="material" class="enter-color">Enter {{ selectedAttribute }}</label>
                <div class="grid grid-cols-3 gap-2.5">
                  <BaseInput
                    v-bind="$attrs"
                    placeholder="Set rules to generate description"
                    :type="'text'"
                    v-model="selectedOption.label"
                    class="w-full"
                  />
                  <BaseInput
                    v-bind="$attrs"
                    :placeholder="`${selectedAttribute} value`"
                    :type="'text'"
                    v-model="selectedOption.attributeValue"
                    class="w-full"
                  />
                  <div class="">
                    <button
                      class="bg-blue-600 text-white px-2.5 py-3 w-full rounded-xl"
                      @click="addAttributeOption"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
              <h2>Attributes and Options</h2>
              <ul>
                <li v-for="(options, attribute) in attributes" :key="attribute">
                  <strong>{{ attribute }}:</strong> {{ options }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useUploadImageStore } from '@/stores/upload-image/upload-image'
import BASE_URL from '@/backand/api'
import BaseAlert from '@/base/BaseAlert.vue'
import SubmitButton from './SubmitButton.vue'
import SelectImage from './SelectImage.vue'
import BaseInput from '@/base/BaseInput.vue'
import { loadModel, classifyImage } from '@/utils/tensorflowImageClassifier'
import { useCategoryStore } from '@/stores/categories/categories'
import BaseSelect from './BaseSelect.vue'
import ColorSelect from './ColorSelect.vue'
import namer from 'color-namer'
import CharacteristicList from '../CharacteristicList.vue'
import ProductTypeSwitch from './ProductTypeSwitch.vue'

const props = defineProps({
  showNewProductPopup: Boolean
})

const emit = defineEmits(['close-new-product-popup'])

const categoryStore = useCategoryStore()
const uploadImageStore = useUploadImageStore()
const uploadMessages = computed(() => uploadImageStore.uploadMessages)
const uploading = computed(() => uploadImageStore.uploading)
const loading = ref(false)
const loadingImage = ref(false)
const messages = ref([])
const title = ref('')
const defaultPrice = ref('')
const defaultStock = ref('')
const description = ref('')
const sizes = ref([])
const image = ref(null)
const defaultImageUrl = ref(null)
const materialsData = ref([
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
const sizeData = ref([
  { title: 'Clothing XS', size: 'XS' },
  { title: 'Clothing S', size: 'S' },
  { title: 'Clothing M', size: 'M' },
  { title: 'Clothing L', size: 'L' },
  { title: 'Clothing XL', size: 'XL' },
  { title: 'Clothing XXL', size: 'XXL' },
  { title: 'Clothing Numeric 28 (RU 44)', size: '28' },
  { title: 'Clothing Numeric 30 (RU 46)', size: '30' },
  { title: 'Clothing Numeric 32 (RU 48)', size: '32' },
  { title: 'Clothing Numeric 34 (RU 50)', size: '34' },
  { title: 'Clothing Numeric 36 (RU 52)', size: '36' },
  { title: 'Clothing Numeric 38 (RU 54)', size: '38' },
  { title: 'Clothing Numeric 40 (RU 56)', size: '40' },
  { title: 'Clothing Numeric 42 (RU 58)', size: '42' },
  { title: 'Clothing Numeric 44 (RU 60)', size: '44' },
  { title: "Children's Clothing 2T", size: '2T' },
  { title: "Children's Clothing 3T", size: '3T' },
  { title: "Children's Clothing 4T", size: '4T' },
  { title: "Children's Clothing 5", size: '5' },
  { title: "Children's Clothing 6", size: '6' },
  { title: "Children's Clothing 7", size: '7' },
  { title: "Children's Clothing 8", size: '8' },
  { title: "Children's Clothing 10", size: '10' },
  { title: "Children's Clothing 12", size: '12' },
  { title: "Children's Clothing 14", size: '14' },
  { title: 'Shoe US 5 (RU 35)', size: '5' },
  { title: 'Shoe US 6 (RU 36)', size: '6' },
  { title: 'Shoe US 7 (RU 37)', size: '7' },
  { title: 'Shoe US 8 (RU 38)', size: '8' },
  { title: 'Shoe US 9 (RU 39)', size: '9' },
  { title: 'Shoe US 10 (RU 40)', size: '10' },
  { title: 'Shoe US 11 (RU 41)', size: '11' },
  { title: 'Shoe US 12 (RU 42)', size: '12' },
  { title: 'Shoe US 13 (RU 43)', size: '13' },
  { title: 'Shoe US 14 (RU 44)', size: '14' },
  { title: 'Shoe EU 38', size: '38' },
  { title: 'Shoe EU 39', size: '39' },
  { title: 'Shoe EU 40', size: '40' },
  { title: 'Shoe EU 41', size: '41' },
  { title: 'Shoe EU 42', size: '42' },
  { title: 'Shoe EU 43', size: '43' },
  { title: 'Shoe EU 44', size: '44' },
  { title: 'Shoe EU 45', size: '45' },
  { title: 'Shoe EU 46', size: '46' },
  { title: 'Shoe EU 47', size: '47' },
  { title: 'Shoe UK 4 (RU 36)', size: '4' },
  { title: 'Shoe UK 5 (RU 37)', size: '5' },
  { title: 'Shoe UK 6 (RU 38)', size: '6' },
  { title: 'Shoe UK 7 (RU 39)', size: '7' },
  { title: 'Shoe UK 8 (RU 40)', size: '8' },
  { title: 'Shoe UK 9 (RU 41)', size: '9' },
  { title: 'Shoe UK 10 (RU 42)', size: '10' },
  { title: 'Shoe UK 11 (RU 43)', size: '11' },
  { title: 'Shoe UK 12 (RU 44)', size: '12' },
  { title: 'Shoe UK 13 (RU 45)', size: '13' },
  { title: 'Ring US 3', size: '3' },
  { title: 'Ring US 3.5', size: '3.5' },
  { title: 'Ring US 4', size: '4' },
  { title: 'Ring US 4.5', size: '4.5' },
  { title: 'Ring US 5', size: '5' },
  { title: 'Ring US 5.5', size: '5.5' },
  { title: 'Ring US 6', size: '6' },
  { title: 'Ring US 6.5', size: '6.5' },
  { title: 'Ring US 7', size: '7' },
  { title: 'Ring US 7.5', size: '7.5' },
  { title: 'Ring US 8', size: '8' },
  { title: 'Ring US 8.5', size: '8.5' },
  { title: 'Ring US 9', size: '9' },
  { title: 'Ring US 9.5', size: '9.5' },
  { title: 'Ring US 10', size: '10' },
  { title: 'Ring US 10.5', size: '10.5' },
  { title: 'Ring US 11', size: '11' },
  { title: 'Ring US 11.5', size: '11.5' },
  { title: 'Ring US 12', size: '12' },
  { title: 'Ring US 12.5', size: '12.5' },
  { title: 'Ring US 13', size: '13' },
  { title: 'Ring UK F', size: 'F' },
  { title: 'Ring UK G', size: 'G' },
  { title: 'Ring UK H', size: 'H' },
  { title: 'Ring UK I', size: 'I' },
  { title: 'Ring UK J', size: 'J' },
  { title: 'Ring UK K', size: 'K' },
  { title: 'Ring UK L', size: 'L' },
  { title: 'Ring UK M', size: 'M' },
  { title: 'Ring UK N', size: 'N' },
  { title: 'Ring UK O', size: 'O' },
  { title: 'Ring UK P', size: 'P' },
  { title: 'Ring UK Q', size: 'Q' },
  { title: 'Ring UK R', size: 'R' },
  { title: 'Ring UK S', size: 'S' },
  { title: 'Ring UK T', size: 'T' },
  { title: 'Ring UK U', size: 'U' },
  { title: 'Ring UK V', size: 'V' },
  { title: 'Ring UK W', size: 'W' },
  { title: 'Ring UK X', size: 'X' },
  { title: 'Ring UK Y', size: 'Y' },
  { title: 'Ring UK Z', size: 'Z' },
  { title: 'Furniture Small 18x18x18 inches', size: '18x18x18' },
  { title: 'Furniture Small 24x24x24 inches', size: '24x24x24' },
  { title: 'Furniture Medium 36x36x36 inches', size: '36x36x36' },
  { title: 'Furniture Medium 48x48x48 inches', size: '48x48x48' },
  { title: 'Furniture Large 60x60x60 inches', size: '60x60x60' },
  { title: 'Furniture Large 72x72x72 inches', size: '72x72x72' },
  { title: 'Electronics Screen 13 inches', size: '13"' },
  { title: 'Electronics Screen 15 inches', size: '15"' },
  { title: 'Electronics Screen 17 inches', size: '17"' },
  { title: 'Electronics Screen 19 inches', size: '19"' },
  { title: 'Electronics Screen 21 inches', size: '21"' },
  { title: 'Electronics Screen 24 inches', size: '24"' },
  { title: 'Electronics Screen 27 inches', size: '27"' },
  { title: 'Electronics Screen 32 inches', size: '32"' },
  { title: 'Electronics Screen 40 inches', size: '40"' },
  { title: 'Electronics Screen 50 inches', size: '50"' },
  { title: 'Electronics Screen 55 inches', size: '55"' },
  { title: 'Electronics Screen 60 inches', size: '60"' },
  { title: 'Electronics Screen 65 inches', size: '65"' },
  { title: 'Electronics Screen 70 inches', size: '70"' },
  { title: 'Electronics Screen 75 inches', size: '75"' },
  { title: 'Electronics Storage 32GB', size: '32GB' },
  { title: 'Electronics Storage 64GB', size: '64GB' },
  { title: 'Electronics Storage 128GB', size: '128GB' },
  { title: 'Electronics Storage 256GB', size: '256GB' },
  { title: 'Electronics Storage 512GB', size: '512GB' },
  { title: 'Electronics Storage 1TB', size: '1TB' },
  { title: 'Electronics Storage 2TB', size: '2TB' },
  { title: 'Electronics Storage 4TB', size: '4TB' },
  { title: 'General Small 10x10x10 cm', size: '10x10x10 cm' },
  { title: 'General Medium 30x30x30 cm', size: '30x30x30 cm' },
  { title: 'General Large 50x50x50 cm', size: '50x50x50 cm' },
  { title: 'General Extra Large 70x70x70 cm', size: '70x70x70 cm' }
])
const countryData = ['Russia', 'China', 'Armenia']
const brandLoading = ref(false)
const brands = ref([])
const gptQuery = ref('I need product description in russian minimum 200 character length for')
const generating = ref(false)
const selectedCategory = ref(null)
const selectedSubCategory = ref(null)
const selectedSubSubCategory = ref(null)
const selectedBrand = ref(null)
const selectedColor = ref('#ffffff')
const madeIn = ref(null)
const characteristics = ref([])
const showCharacteristics = ref(false)
const attributes = ref([])
const selectedAttribute = ref(null)
const attributesList = ref(['Color', 'Material', 'Size'])
const characterKey = ref('')
const characterValue = ref('')
const isMultiVariant = ref(false)
const imageHeight = ref(null)
const imageWidth = ref(null)

const toggleMultiVariant = () => {
  isMultiVariant.value = !isMultiVariant.value
}

// Unified structure for a new option based on attribute type
const selectedOption = reactive({
  label: '', // e.g., color name, material name, size label
  attributeValue: '' // e.g., hex code for color, material type, size dimensions
})

const addAttributeOption = () => {
  // Ensure a valid attribute is selected
  if (selectedAttribute.value) {
    // Find or create the attribute entry in the attributes array
    let attribute = attributes.value.find((attr) => attr.name === selectedAttribute.value)

    if (!attribute) {
      attribute = {
        name: selectedAttribute.value,
        options: []
      }
      attributes.value.push(attribute)
    }

    const { label, attributeValue } = selectedOption
    console.log('label, attributeValue', label, attributeValue)
    // Check that label and attributeValue are not empty
    if (label.trim() !== '' && attributeValue.trim() !== '') {
      // Add the option as an object
      attribute.options.push({ label: label.trim(), attributeValue: attributeValue.trim() })
      // Reset selected option
      selectedOption.label = ''
      selectedOption.attributeValue = ''
    }
  }
}

const addCaracteristic = () => {
  characteristics.value.push({
    title: characterKey.value,
    description: characterValue.value
  })
  showCharacteristics.value = false
}

const removeCharacteristic = (index) => {
  if (index >= 0 && index < characteristics.value.length) {
    characteristics.value.splice(index, 1)
  }
}

const toogleCharacteristics = () => {
  showCharacteristics.value = !showCharacteristics.value
}

const sendAssistanceMessage = async () => {
  generating.value = true
  try {
    const response = await BASE_URL.post('/generate-text', { text: gptQuery.value })
    console.log('response', response.data)
    description.value = response.data.text
    generating.value = false
  } catch (error) {
    generating.value = false
    console.error(error)
  }
}

// const resetProductForm = () => {
//   title.value = ''
//   description.value = ''
//   price.value = ''
//   height.value = ''
//   width.value = ''
//   color.value = ''
//   hex.value = ''
//   showColors.value = false
//   defaultImageUrl.value = null
//   selectedBrand.value = null
//   selectedCategory.value = null
//   selectedSubCategory.value = null
//   selectedSubSubCategory.value = null
// }
const selectAttribute = (attribute) => {
  console.log('attribute', attribute)
  selectedAttribute.value = attribute
}
const selectCategory = (item) => {
  console.log('item', item)
  selectedCategory.value = item
}

const selectSubCategory = (item) => {
  selectedSubCategory.value = item
}

const selectSubSubCategory = (item) => {
  selectedSubSubCategory.value = item
}

const selectBrand = (item) => {
  console.log(item)
  selectedBrand.value = item
}

const getColorName = (hex) => {
  const names = namer(hex).ntc[0].name
  return names
}

const selectColor = async (item) => {
  const colorName = getColorName(item)
  const response = await BASE_URL.post('/generate-text', {
    text: `Could u please translate this colorname --${colorName}-- to russian. Please return just the translated text in your response, nothing eles. No additionaleexplanations or sign or commas, etc.Thanks.`
  })
  const translatedName = response.data.text
  selectedColor.value = {
    colorName: translatedName,
    hex: item
  }
  selectedOption.label = translatedName
  selectedOption.attributeValue = item
}

const selectCountry = (item) => {
  madeIn.value = item
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
  const imageUrl = await uploadImageStore.novoMercatoUpload(image.value, folderName)
  defaultImageUrl.value = imageUrl
}
const createProduct = async () => {
  if (!image.value) {
    messages.value.push({
      message: 'Please select image',
      type: 'Warning'
    })
    loading.value = false
    resetMessages()
    return
  }
  if (!imageHeight.value || !imageWidth.value) {
    messages.value.push({
      message: 'Not height and width specified for image',
      type: 'Warning'
    })
    loading.value = false
    resetMessages()
    return
  }
  const classificationResults = []
  // const classificationResults = await processImage(defaultImageUrl.value)
  // console.log('classificationResults', classificationResults)
  loading.value = true
  try {
    const response = await BASE_URL.post('products/add', {
      title: title.value,
      category: selectedCategory.value,
      subCategory: selectedSubCategory.value,
      subSubCategory: selectedSubSubCategory.value,
      defaultImage: defaultImageUrl.value,
      brand: selectedBrand.value,
      description: description.value,
      classificationResults,
      madeIn: madeIn.value,
      attributes: attributes.value,
      characteristics: characteristics.value,
      defaultPrice: Number(defaultPrice.value),
      defaultStock: Number(defaultStock.value),
      isMultiVariant: isMultiVariant.value,
      imageHeight: imageHeight.value,
      imageWidth: imageWidth.value
    })

    if (response && response.status === 201) {
      // resetProductForm()
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
})
</script>

<style scoped></style>
