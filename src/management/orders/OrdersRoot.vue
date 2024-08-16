<template>
  <div class="">
    <div class="">
      <h1 class="text-left text-xl font-semibold mb-5 uppercase">Orders</h1>
      <div>
        <div class="flex items-center justify-center py-20" v-if="orderLoading">
          <BaseLoader />
        </div>

        <ul v-else-if="orders.length > 0">
          <li
            class="flex items-center justify-between py-3 border-b border-b-gray-100"
            v-for="order in orders"
            :key="order.id"
          >
            <div class="info flex items-center space-x-2.5">
              <div class="image-wrapper w-20">
                <img
                  :src="order.items[0].image"
                  class="border border-gray-100 rounded-xl h-20 w-full object-cover"
                  alt=""
                />
              </div>
              <div class="flex flex-col space-y-1.5">
                <span>ID: {{ order._id }}</span>
                <StatusSelect
                  :order="order"
                  :statuses="statuses"
                  @toggle-status="toggleStatus"
                  @change-order-status="changeOrderStatus"
                />
              </div>
            </div>
          </li>
        </ul>

        <!-- No orders found -->
        <div v-else>
          <p>No orders found.</p>
        </div>
        <div
          v-if="statusLoading"
          class="fixed top-0 left-0 w-full flex items-center justify-center h-screen bg-black/10"
        >
          <unicon name="spinner" class="animate-spin" fill="purple"></unicon>
        </div>
        <BaseAlert :messages="orderMessages" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useOrderStore } from '@/stores/orders/orders'
import BaseLoader from '@/base/BaseLoader.vue'
import StatusSelect from './StatusSelect.vue'
import BaseAlert from '@/base/BaseAlert.vue'

const orderStore = useOrderStore()
const orders = computed(() => orderStore.orders)
const orderLoading = computed(() => orderStore.orderLoading)
const statusLoading = computed(() => orderStore.statusLoading)
const orderMessages = computed(() => orderStore.orderMessages)

const statuses = ['placed', 'paied', 'shipping', 'delivered', 'completed']

const toggleStatus = (order) => {
  order.showStatus = !order.showStatus
}
const changeOrderStatus = async (order, status) => {
  const orderId = order._id
  console.log('order, status', orderId, status)
  await orderStore.changeOrderStatus(orderId, status)
  order.showStatus = false
}

onMounted(async () => {
  await orderStore.fetchOrders()
})
</script>
