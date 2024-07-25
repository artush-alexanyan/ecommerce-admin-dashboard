<template>
  <div class="delete-modal">
    <Transition
      enter-active-class="animate__animated animate__bounceIn animate__faster"
      leave-active-class="animate__animated animate__zoomOut animate__faster"
    >
      <div v-if="showDelete" class="fixed inset-0 z-30 flex items-center justify-center">
        <div
          class="h-40 w-96 bg-white border border-gray-100 shadow-xl rounded flex flex-col items-center justify-center space-y-10"
        >
          <p>Are you sure you want to delete this item?</p>
          <div class="flex items-center justify-center space-x-5">
            <button
              class="bg-blue-600 text-white w-full px-5 py-2.5 rounded"
              @click="emit('cancel-delete')"
            >
              Cancel
            </button>
            <button
              :disabled="deleting"
              class="bg-red-600 text-white w-full px-5 py-2.5 rounded"
              @click="confirmDelete"
            >
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const props = defineProps({
  showDelete: Boolean,
  deleting: Boolean
})

const emit = defineEmits(['cancel-delete', 'confirm-delete'])

// const cancelDelete = () => {
//   emit('cancel-delete')
// }
const confirmDelete = () => {
  emit('confirm-delete')
}
</script>
