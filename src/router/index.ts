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
        {
          path: '/system',
          name: 'System',
         redirect: '/system/menu',
          meta: {
            title: '系统管理',
          },
          children: [
            {
              path: 'menu',
              name: 'MenuManagement',
              component: () => import('../views/system/menuManagement.vue'),
              meta: {
                title: '菜单管理',
              },
            },
            {
              path: 'user',
              name: 'UserManagement',
              component: () => import('../views/system/userManagement.vue'),
              meta: {
                title: '用户管理',
              },
            },
            {
              path: 'role',
              name: 'RoleManagement',
              component: () => import('../views/system/roleManagement.vue'),
              meta: {
                title: '角色管理',
              },
            },
            {
              path: 'permission',
              name: 'PermissionManagement',
              component: () => import('../views/system/permissionManagement.vue'),
              meta: {
                title: '权限管理',
              },
            },
          ],
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

// router.beforeEach((to, from, next) => {
//   const hasToken = localStorage.getItem('token')
//   if (hasToken) {
//     if (to.path === '/login') {
//       next('/')
//     } else {
//       next()
//     }
//   } else {
//     if (whiteList.includes(to.path)) {
//       next()
//     } else {
//       next('/login')
//     }
//   }
// })
export default router
