<template>
  <div class="new-produsct">
    <Transition
      enter-active-class="animate__animated animate__fadeIn animate__faster"
      leave-active-class="animate__animated animate__fadeOut animate__faster"
    >
      <div
        v-if="showImagesPopup"
        class="fixed top-0 left-0 z-30 bg-black/50 w-full h-screen flex p-5 items-center justify-center"
      >
        <div class="bg-white p-5 rounded-[30px]">
          <div>
            <div class="flex items-center justify-between pb-5 border-b border-b-gray-200">
              <p class="text-xl font-semibold">Add a new product</p>
              <button type="button" @click="emit('close-images-popup')">
                <unicon name="times" fill="black"></unicon>
              </button>
            </div>
          </div>
        </div></div
    ></Transition>
  </div>
</template>

<script setup>
const props = defineProps({
  showImagesPopup: Boolean
})

const emit = defineEmits(['close-images-popup'])
</script>
