<template>
  <div class="attributes">
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
        <div class="">
          <input
            v-model="selectedOption.label"
            :placeholder="`${selectedAttribute} label`"
            class="w-full py-2.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal rounded-xl px-2.5 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
            type="text"
          />
        </div>
        <div class="">
          <input
            v-model="selectedOption.attributeValue"
            :placeholder="`${selectedAttribute} value`"
            class="w-full py-2.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal rounded-xl px-2.5 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
            type="text"
          />
        </div>
        <div class="">
          <button
            class="bg-blue-600 text-white px-2.5 py-3.5 w-full rounded-xl"
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
</template>

<script setup>
const emit = defineEmits(['toggle-product-type'])

const props = defineProps({
  selectedOption: { type: Object }
})
</script>
