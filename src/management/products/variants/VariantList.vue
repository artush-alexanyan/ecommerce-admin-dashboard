<template>
  <div class="variant-list">
    <h4 class="text-xl font-semibold mb-5">Variations</h4>
    <div class="ul grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
      <div
        class="rounded-xl border border-gray-200 p-2"
        v-for="(variant, index) in variants"
        :key="variant.sku"
      >
        <div>
          <div class="" v-for="(attribute, index) in variant.attributes" :key="index">
            <div class="flex items-center">
              <span class="font-semibold flex items-center space-x-2">
                <span>{{ attribute.name }}:</span>
                <span class="font-normal">{{ attribute.option.label }}</span>
                <div
                  v-if="attribute.name === 'Color'"
                  class="rounded border border-purple-300 h-7 w-7"
                  :style="`background-color: ${attribute.option.attributeValue}`"
                ></div>
                <span v-else class="font-normal">({{ attribute.option.attributeValue }})</span>
              </span>
            </div>
          </div>
        </div>
        <span class="font-semibold">Images: {{ variant.images.length }}</span> <br />
        <span class="font-semibold">Stock: {{ variant.stock }}</span
        ><br />
        <span class="font-semibold">Price: {{ variant.price }}</span
        ><br />
        <span class="font-semibold">Characteristics: {{ variant.characteristics }}</span
        ><br />
        <button @click="emit('open-images-popup', variant._id)" class="text-green-600">
          Add image</button
        ><br />
        <button @click="emit('open-variant-edit-modal', variant)" class="text-orange-600">
          Edit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  product: Object,
  variants: Array
})

const emit = defineEmits(['open-variant-edit-modal', 'open-images-popup'])
</script>
