<template>
  <div class="product-type-switch">
    <div class="flex items-center space-x-3">
      <div
        @click="emit('toggle-product-type')"
        class="h-8 w-12 rounded-full border-2 cursor-pointer flex items-center"
        :class="isMultiVariant ? 'justify-end border-purple-500' : 'justify-start border-gray-300'"
      >
        <div
          :class="isMultiVariant ? 'bg-purple-500' : 'bg-gray-300'"
          class="rounded-full h-6 w-6 border border-gray-300 m-1"
        ></div>
      </div>
      <p class="text-sm">
        {{ isMultiVariant ? 'Multivariant product' : 'Regular product' }}
      </p>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['toggle-product-type'])

const props = defineProps({
  isMultiVariant: { type: Boolean, default: false }
})
</script>
