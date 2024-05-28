<template>
  <div class="base-input">
    <label> {{ label }} </label>
    <input
      required
      :type="type"
      :placeholder="label"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="block w-full px-4 py-2.5 text-gray-900 border border-gray-300 bg-gray-50 sm:text-md focus:border-blue-600 outline-0"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  modelValue: [String, Number],
  type: String
})
</script>
