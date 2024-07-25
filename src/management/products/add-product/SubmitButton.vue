<template>
  <div class="flex items-center justify-center my-10">
    <button
      type="submit"
      :disabled="props.loading || props.uploading"
      name="add-product"
      class="w-full rounded-xl px-4 py-2.5 bg-green-600 text-white sm:text-md outline-0 flex items-center justify-center"
    >
      <span>{{ btnText() }}</span>
      <unicon
        v-if="props.loading || props.uploading"
        name="spinner"
        class="animate-spin"
        height="16"
        fill="white"
      ></unicon>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  uploading: Boolean,
  loading: Boolean,
  btnText: Function
})
</script>
