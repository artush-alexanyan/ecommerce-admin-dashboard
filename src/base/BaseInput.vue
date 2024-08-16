<template>
  <div class="base-input">
    <label class="font-semibold"> {{ label }} </label>
    <input
      :disabled="isDisabled"
      required
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full py-2.5 mt-1.5 placeholder:text-placeholder placeholder:text-base lg:text-lg md:text-base text-sm font-normal leading-7 rounded-xl px-2.5 mb-1 border-[#F3F2F4] border-2 focus:outline-none focus:border-[#D7BCF5]"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  modelValue: [String, Number],
  type: String,
  isDisabled: { type: Boolean, default: false },
  placeholder: String
})
</script>
