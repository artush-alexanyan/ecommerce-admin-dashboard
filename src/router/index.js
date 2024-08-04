import { createRouter, createWebHistory } from 'vue-router'

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
          path: 'variants/:id',
          name: 'ProductVariants',
          component: () => import('../management/products/variants/ProductVariants.vue')
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
        }
      ]
    }
  ]
})

export default router
