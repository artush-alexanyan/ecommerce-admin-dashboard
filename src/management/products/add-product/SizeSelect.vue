<template>
  <div class="size-selection">
    <ul class="ul">
      <li class="my-1.5" v-for="(size, index) in sizes" :key="index">
        <div class="flex items-center justify-between text-lg">
          <span> {{ size.size.title }}</span>
          <button @click="emit('remove-size', index)">
            <unicon name="times" fill="black"></unicon>
          </button>
        </div>

        <div v-if="!size.price && !size.stock" class="my-2 5 grid grid-cols-3 gap-5">
          <div class="flex flex-col">
            <label class="mb-1.5">Price</label>
            <input
              :value="currentPrice"
              @input="emit('update:currentPrice', $event.target.value)"
              type="number"
              class="w-full py-2.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
            />
          </div>
          <div class="flex flex-col">
            <label class="mb-1.5">Stock</label>
            <input
              :value="currentStock"
              @input="emit('update:currentStock', $event.target.value)"
              type="number"
              class="w-full py-2.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
            />
          </div>
          <div class="flex flex-col">
            <label class="mb-1.5">Save size</label>
            <button
              class="bg-blue-600 text-white py-3.5 rounded-xl"
              @click="emit('save-size', index)"
              type="button"
            >
              Save
            </button>
          </div>
        </div>
        <div v-else class="grid grid-cols-2 gap-5">
          <span>Stock: {{ size.stock }}</span>
          <span>Price: {{ size.price }}</span>
        </div>
      </li>
    </ul>
    <div class="flex flex-col w-full mt-5">
      <label class="mb-2.5">Select sizes</label>
      <select
        :value="selectedValue"
        @change="handleChange"
        class="w-full py-2.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
        name="item"
        id="item"
      >
        <option v-for="(item, index) in sizesData" :key="index" :value="JSON.stringify(item)">
          {{ item.title }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const emit = defineEmits([
  'select-item',
  'remove-size',
  'update:currentStock',
  'update:currentPrice',
  'save-size'
])

const props = defineProps({
  selectedItem: { type: [Object, String], default: null },
  label: { type: String, default: 'category' },
  sizes: { type: Array, default: () => [] },
  sizesData: { type: Array, default: () => [] },
  currentStock: { type: [Number, String], default: 0 },
  currentPrice: { type: [Number, String], default: 0 }
})

/**
 * Computed property to manage the value of the select element.
 * It ensures that the value of the select element is always a string,
 * even though we are working with objects.
 */

const selectedValue = computed({
  get() {
    return props.selectedItem ? JSON.stringify(props.selectedItem) : ''
  },
  set(value) {
    const selectedItem = JSON.parse(value)
    emit('select-item', selectedItem)
  }
})

const handleChange = (event) => {
  selectedValue.value = event.target.value
}
</script>
