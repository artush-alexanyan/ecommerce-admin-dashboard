<template>
  <div class="size-selection">
    <ul class="ul">
      <li class="text-lg my-1.5" v-for="(size, index) in sizes" :key="index">
        {{ size.title }}
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

const emit = defineEmits(['select-item'])

const props = defineProps({
  selectedItem: { type: [Object, String], default: null },
  label: { type: String, default: 'category' },
  sizes: { type: Array, default: () => [] },
  sizesData: { type: Array, default: () => [] }
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
