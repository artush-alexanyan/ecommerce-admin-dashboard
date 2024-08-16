<template>
  <div class="flex items-center space-x-2 5">
    <span>Status: </span>
    <div class="w-32 relative">
      <button
        @click="emit('toggle-status', order)"
        type="button"
        class="w-full rounded text-white px-2.5 py-0.5 text-sm"
        :style="`background-color: ${getOrderStatusColor(order.status)};`"
      >
        {{ order.status }}
      </button>
      <div
        v-if="order.showStatus"
        class="absolute bg-white z-20 left-0 w-full top-7 border-2 rounded h-auto hover:cursor-pointer"
      >
        <ul>
          <li
            @click="emit('change-order-status', order, st)"
            class="border-b border-b-gray-100 px-2.5 py-1.5"
            v-for="(st, index) in statuses"
            :key="index"
          >
            {{ st }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup>
const emit = defineEmits(['toggle-status', 'change-order-status'])

const props = defineProps({
  order: Object,
  statuses: Array
})

const getOrderStatusColor = (status) => {
  const statusColors = {
    placed: '#ff9800', // Orange
    paied: '#2196f3', // Blue
    shipping: '#ffeb3b', // Yellow
    delivered: '#4caf50', // Green
    completed: '#9c27b0' // Purple
  }

  // Return the corresponding color or a default color if status is not found
  return statusColors[status] || '#000000' // Default to black if the status is unknown
}
</script>
