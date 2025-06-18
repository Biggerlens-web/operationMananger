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
      routes[0].redirect = '/appConfig/index'
      // routes[0].redirect = '/pptTemplate'
      //ppt模板管理 可删除
      const pptRoute = {
        path: '/pptTemplate',
        name: 'pptTemplate',
        component: () => import('../views/pptTemplate.vue'),
        meta: {
          title: 'PPT模板管理',
        },
      }

      //模板素材页面
      const stickerRoute = {
        path: '/templateMaterial',
        name: 'templateMaterial',
        component: () => import('@/views/templateMaterial.vue'),
        meta: {
          title: '模板素材管理',
        },
      }
      parentItem?.push(pptRoute)

      parentItem?.push(stickerRoute)

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

  // console.log('pinia', useCounterStore(pinia).menuList)
}

//获取国际化信息
const getInternational = async () => {
  try {
    const res: any = await service.get('/clothingMaterials/getInternational')
    console.log('获取国际化信息', res)
    const languageArr = Object.entries(res.data.data.languages).map(([key, value]) => {
      return {
        language: value,
        value: key,
      }
    })
    useCounterStore(pinia).international = languageArr
  } catch (err) {
    console.log('获取国际化信息失败', err)
  }
}

//获取标签
const getTagList = async () => {
  try {
    const res = await service.post('/clothingMaterialsDetail/bacthLabelEdit')

    console.log('获取标签列表', res)
    useCounterStore(pinia).tagList = res.data.data.mateLabels
  } catch (err) {
    console.log('获取标签列表失败', err)
  }
}
//获取基础信息
const getBaseData = async () => {
  try {
    const res = await service.get('/base/baseData/getBaseDatas/0')
    console.log('基础表单数据', res)
    useCounterStore(pinia).appList = res.data.data.apps
    useCounterStore(pinia).channelList = res.data.data.channels
    useCounterStore(pinia).OSlist = res.data.data.oss
  } catch (err) {
    console.log('获取基础数据失败')
  }
}

//获取公司列表
const getCompanyList = async () => {
  try {
    const res = await service.get('/companyInfo/list')
    console.log('公司列表', res)
    useCounterStore(pinia).companyList = res.data.data.companys
    if (!useCounterStore(pinia).companyView) {
      // useCounterStore(pinia).companyView = res.data.data.companys[0].companyId
    }
  } catch (err) {
    console.log('获取公司列表失败')
  }
}
router.beforeEach(async (to, from, next) => {
  const hasToken = localStorage.getItem('token')
  setMenuStore()
  if (hasToken) {
    if (to.path === '/login') {
      next('/')
    } else {
      await getBaseData()

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
router.afterEach((to, from) => {
  // getCompanyList()
  getInternational()
  getTagList()
})
export default router
