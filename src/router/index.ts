import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      redirect: '/autoOpration',
      children: [
        {
          path: '/autoOpration',
          name: 'AutoOpration',
          component: () => import('../views/autoJSON.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/login.vue'),
    },
  ],
})

export default router
