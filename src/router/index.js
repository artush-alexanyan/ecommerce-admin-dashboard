import { createRouter, createWebHistory } from 'vue-router'
import { useCheckAuthStore } from '@/stores/checauthstate'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'AdminAuth',
      component: () => import('../auth/AdminAuth.vue')
    },
    {
      path: '/',
      name: 'AdminMain',
      component: () => import('../dashboard/AdminMain.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'HomeRoot',
          component: () => import('../dashboard/home/HomeRoot.vue')
        },
        {
          path: 'products',
          name: 'ProductsRoot',
          component: () => import('../management/products/ProductsRoot.vue')
        },
        {
          path: '/products/add-product',
          name: 'NewProduct',
          component: () => import('../management/products/add-product/NewProduct.vue')
        },
        {
          path: 'variants/:id',
          name: 'ProductVariants',
          component: () => import('../management/products/variants/ProductVariants.vue')
        },
        {
          path: '/orders',
          name: 'OrdersRoot',
          component: () => import('../management/orders/OrdersRoot.vue')
        },
        {
          path: 'categories',
          name: 'AdminCategories',
          component: () => import('../management/categories/AdminCategories.vue')
        },
        {
          path: 'brands',
          name: 'BrandsRoot',
          component: () => import('../management/brands/BrandsRoot.vue')
        },
        {
          path: 'carousel',
          name: 'Carousel',
          component: () => import('@/application/CarouselItems.vue')
        }
      ]
    }
  ]
})
router.beforeEach(async (to, from, next) => {
  try {
    const authStore = useCheckAuthStore()
    await authStore.checkAuthState()
    const user = authStore.user

    if (to.matched.some((record) => record.meta.requiresAuth) && !user) {
      next({ name: 'AdminAuth' })
    } else {
      next()
    }
  } catch (error) {
    console.error('Failed to check auth state:', error)
    next({ name: 'AdminAuth' })
  }
})
export default router
