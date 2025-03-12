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
          meta: {
            title: '自动化运营配置',
          },
        },
        {
          path: '/templates',
          name: 'Templates',
          component: () => import('../views/templates.vue'),
          meta: {
            title: '模板管理',
          },
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
const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  const hasToken = localStorage.getItem('token')
  if (hasToken) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
export default router
