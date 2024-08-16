import { defineStore } from 'pinia'
import BASE_URL from '@/backand/api'

export const useOrderStore = defineStore('OrderStore', {
  state: () => ({
    orders: [],
    orderLoading: false,
    statusLoading: false,
    orderMessages: []
  }),

  actions: {
    resetMessages() {
      setTimeout(() => {
        this.orderMessages = []
      }, 2500)
    },
    async fetchOrders() {
      try {
        this.orderLoading = true
        const response = await BASE_URL.get('/orders')
        const orderData = response.data.orders

        // Add showStatus: false to each order item
        this.orders = orderData.map((order) => {
          return { ...order, showStatus: false }
        })

        this.orderLoading = false
      } catch (error) {
        this.orderLoading = false
        console.error(error)
      }
    },
    async changeOrderStatus(orderId, status) {
      try {
        this.statusLoading = true
        const response = await BASE_URL.put(`/orders/${orderId}/status`, { status })
        // Find the order in the local state
        const currentOrder = this.orders.find((order) => order._id === orderId)

        // Check if the order exists
        if (currentOrder) {
          // Update the order's status
          currentOrder.status = status
        } else {
          console.log('Order not found')
          this.orderMessages.push({
            type: 'Error',
            message: 'Order not found.'
          })
          this.resetMessages()
        }
        this.statusLoading = false
        const message = response.data.message ? response.data.message : 'Updated!'
        this.orderMessages.push({
          type: 'Success',
          message
        })
        this.resetMessages()
      } catch (error) {
        this.statusLoading = false
        const message = error.response ? error.response.data.message : error.message
        this.orderMessages.push({
          type: 'Error',
          message
        })
        this.resetMessages()
      }
    }
  }
})
