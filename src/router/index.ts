import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import service from '@/axios'
import { pinia } from '@/main'
import { useCounterStore } from '@/stores/counter'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    redirect: '/appConfig/index',
    children: [] as RouteRecordRaw[],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login.vue'),
  },
]

let menusList: any = null

const getRouterList = async () => {
  try {
    const res = await service.get('/base/baseData/getBaseDatas/2')
    const menusObj = res.data.data.menus
    console.log('menusObj', menusObj)
    let menusSub: any = []
    for (const key in menusObj) {
      menusSub = [...menusSub, ...menusObj[key]]
    }
    console.log('路由数组', menusSub)
    const parentItem = routes[0].children
    for (const item of menusSub) {
      const routeItem = {
        path: item.menuUrl,
        name: item.menuIdentify,
        component: () => import(`../views/${item.menuIdentify}.vue`),
        meta: {
          title: item.menuText,
        },
      }
      // routes[0].redirect = '/appConfig/index'
      routes[0].redirect = '/pptTemplate'
      //ppt模板管理 可删除
      const pptRoute = {
        path: '/pptTemplate',
        name: 'pptTemplate',
        component: () => import('../views/pptTemplate.vue'),
        meta: {
          title: 'PPT模板管理',
        },
      }
      parentItem?.push(pptRoute)

      if (parentItem) {
        parentItem.push(routeItem)
      }
    }

    menusList = res.data.data.menus
    console.log('获取菜单', menusList)
  } catch (err) {
    console.log('获取菜单失败', err)
  }
}

const getMeuns = async () => {
  const hasToken = localStorage.getItem('token')
  if (hasToken) {
    await getRouterList()
  }
}
await getMeuns()

const router = createRouter({
  history: createWebHistory(),
  routes,
})
//白名单
const whiteList = ['/login']

const setMenuStore = () => {
  let menusArr = []
  let index = 1
  for (const key in menusList) {
    const item = {
      parentName: key,
      index: index,
      children: menusList[key],
    }

    menusArr.push(item)
    index++
  }

  useCounterStore(pinia).menuList = menusArr

  console.log('pinia', useCounterStore(pinia).menuList)
}

const getBaseData = async () => {
  try {
    const res = await service.get('/base/baseData/getBaseDatas/0')
    console.log('基础表单数据', res)
    useCounterStore().appList = res.data.data.apps
    useCounterStore().channelList = res.data.data.channels
    useCounterStore().OSlist = res.data.data.oss
  } catch (err) {
    console.log('获取基础数据失败')
  }
}
router.beforeEach(async (to, from, next) => {
  const hasToken = localStorage.getItem('token')
  setMenuStore()
  if (hasToken) {
    if (to.path === '/login') {
      next('/')
    } else {
      getBaseData()
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
