<!-- 整体布局容器 -->
<template>
  <el-container class="layout-container">
    <!-- 左侧菜单栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="aside">
      <!-- Logo区域 -->
      <div class="logo">
        <!-- <img src="@/assets/logo.png" alt="Logo" /> -->
        <span class="logo_text" :class="{ hidden: isCollapse }">运营管理后台</span>
      </div>

      <!-- 公司选择器 -->
      <div class="company-selector" :class="{ collapsed: isCollapse }">
        <el-select v-model="defaultCompanyNo" placeholder="选择公司" size="small" style="width: 100%"
          @change="handleCompanyChange">
          <el-option v-for="company in companyList" :key="company.companyNo" :label="company.companyName"
            :value="company.companyNo" />
        </el-select>
      </div>
      <!-- 菜单容器 -->
      <div class="menu-container">
        <el-menu :default-active="activeMenu" class="el-menu-vertical" :collapse="isCollapse" background-color="#304156"
          text-color="#bfcbd9" active-text-color="#409EFF" router>
          <el-sub-menu :index="item.index" v-for="item in menuList" :key="item.index">
            <template #title>
              <el-icon>
                <Document />
              </el-icon>
              <span>{{ item.parentName }}</span>
            </template>

            <el-menu-item :index="child.menuUrl" v-for="child in item.children" :key="child.id">
              {{ child.menuText }}
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
    </el-aside>

    <el-container>
      <!-- 顶部 Header -->
      <el-header class="header">
        <!-- 左侧区域：折叠按钮和面包屑导航 -->
        <div class="header-left">
          <el-icon class="collapse-btn" @click="toggleCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
            <el-breadcrumb-item>{{ currentRoute }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <!-- 中间区域：应用选择器 -->
        <div class="header-center" v-if='showAppSelcet()'>
          <div class="app-selector">
            <el-select v-model="defaultAppNo" placeholder="🔍 请选择应用" size="default" @change="handleAppChange"
              filterable>
              <el-option v-for="app in appListInCom" :key="app.appNo"
                :label="`${app.appAbbreviation}  [${app.id || app.appNo}]`" :value="app.appNo" />
            </el-select>
          </div>
        </div>
        <!-- 右侧区域：用户信息和下拉菜单 -->
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar :size="32"
                :src="userAvatar ? userAvatar : `https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png`" />
              <span>{{ userName }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主内容区域 -->
      <el-main class="main" style="overflow-y: scroll;">
        <!-- 路由视图，用于显示子页面 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
  // 引入Vue相关API
  import { ref, computed, onMounted, watch, nextTick } from 'vue'
  // 引入Vue Router
  import { useRouter, useRoute } from 'vue-router'
  // 引入Element Plus图标
  import { Fold, Expand } from '@element-plus/icons-vue'

  // 引入Pinia状态管理
  import { useCounterStore } from '@/stores/counter'
  import { storeToRefs } from 'pinia'
  // 引入axios实例
  import service from '@/axios'
  // 引入加密工具
  import { desEncrypt } from '@/utils/des'
  // 获取路由实例
  const router = useRouter()
  // 获取当前路由信息
  const route = useRoute()
  // 获取Pinia store实例
  const counterStore = useCounterStore()
  // 从store中解构状态和action，并保持响应式
  const { userName, userAvatar, appList, menuList, companyList, defaultCompanyNo, defaultAppNo, appListInCom, showLoading } = storeToRefs(counterStore)
  // 控制菜单是否折叠
  const isCollapse = ref(false)
  // 计算属性，获取当前激活的菜单项路径
  const activeMenu = computed(() => route.path)

  /**
   * @description: 判断是否显示应用选择器
   * @returns {boolean} 是否显示
   */
  const showAppSelcet = () => {
    const hotshowarr = ['/templateMaterial', '/bannerImgConfig/index']
    const path = route.path
    console.log('path', path);
    if (hotshowarr.includes(path)) {
      return false
    } else {
      return true
    }
  }

  // 监听公司列表的变化，设置默认选中的公司
  watch(() => companyList.value, (newV) => {
    console.log('companyList 发生变化:', newV)
    if (newV && newV.length > 0) {
      defaultCompanyNo.value = defaultCompanyNo.value ? defaultCompanyNo.value : companyList.value[0].companyNo
      console.log('设置默认公司编号:', defaultCompanyNo.value)
    }
  }, {
    deep: true,
    immediate: true
  })






  /**
   * @description: 根据公司编号获取应用列表
   * @param {number | string} id 公司编号
   */
  const getAppByCom = async (id: number | string) => {
    try {

      const params = {
        timestamp: Date.now(),
        companyNo: id,
      }
      console.log('获取应用参数', params);
      const enData = desEncrypt(JSON.stringify(params))
      showLoading.value = true
      const res = await service.post('/appInfo/listByCompanyNo', {
        enData
      })
      console.log('获取公司下的应用列表', res);
      appListInCom.value = res.data.data.dtos

      // 如果已有持久化的 defaultAppNo 且在新列表中存在，则保持原值
      const currentAppNo = defaultAppNo.value
      const appExists = appListInCom.value.some((app: any) => app.appNo === currentAppNo)

      if (!currentAppNo || !appExists) {
        // 如果没有选中的应用或选中的应用不在当前公司的应用列表中，则选择第一个
        defaultAppNo.value = appListInCom.value[0].appNo
      }
    } catch (err) {
      console.log('获取该公司下应用列表失败', err);
    } finally {
      showLoading.value = false
    }
  }
  // 监听默认公司编号的变化，获取对应公司的应用列表
  watch(() => defaultCompanyNo.value, (newValue) => {
    console.log('defaultCompanyNo 发生变化:', newValue)
    if (newValue) {
      console.log('获取默认应用');
      // 公司切换时获取该公司下的应用列表
      getAppByCom(newValue)
    }
  }, {
    immediate: true

  })



  // 计算属性，获取当前路由的标题
  const currentRoute = computed(() => route.meta.title || '页面')


  // 切换菜单的折叠状态
  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
  }

  // 处理用户退出登录
  const handleLogout = () => {
    // 清除token等登录信息
    localStorage.removeItem('token')
    router.push('/login')
  }

  /**
   * @description: 处理公司选择变化的事件
   * @param {string} companyNo 选择的公司编号
   */
  const handleCompanyChange = (companyNo: string) => {
    console.log('选择的公司ID:', companyNo)
    // 这里可以添加公司切换的逻辑，比如更新store中的当前公司
    // counterStore.setCurrentCompany(companyId)
    getAppByCom(companyNo)
  }

  /**
   * @description: 处理应用选择变化的事件
   * @param {string} appNo 选择的应用编号
   */
  const handleAppChange = (appNo: string) => {
    console.log('选择的应用编号:', appNo)

    // 这里可以添加应用切换的逻辑，比如更新store中的当前应用
    // counterStore.setCurrentApp(appNo)
    // 或者触发相关的数据刷新
  }





  // 自动滚动到激活菜单项的函数
  const scrollToActiveMenuItem = () => {
    const menuContainer = document.querySelector('.menu-container') as HTMLElement
    const activeMenuItem = document.querySelector('.el-menu-item.is-active') as HTMLElement
    const activeSubMenu = activeMenuItem?.closest('.el-sub-menu')

    if (menuContainer && activeMenuItem) {
      // 确保父级子菜单也展开
      if (activeSubMenu && !activeSubMenu.classList.contains('is-opened')) {
        const subMenuTitle = activeSubMenu.querySelector('.el-sub-menu__title')
        if (subMenuTitle) {
          (subMenuTitle as HTMLElement).click()
        }
      }

      // 延迟滚动，等待子菜单展开动画完成
      setTimeout(() => {
        // 获取菜单项相对于菜单容器的位置
        const containerRect = menuContainer.getBoundingClientRect()
        const itemRect = activeMenuItem.getBoundingClientRect()

        // 计算菜单项相对于容器顶部的实际位置（考虑当前滚动位置）
        const itemRelativeTop = itemRect.top - containerRect.top + menuContainer.scrollTop
        const containerHeight = menuContainer.clientHeight

        // 计算最佳滚动位置（将激活项显示在容器中央偏上位置）
        const targetScrollTop = itemRelativeTop - containerHeight * 0.3


        menuContainer.scrollTo({
          top: Math.max(0, targetScrollTop),
          behavior: 'smooth'
        })
      }, 300) // 等待Element Plus动画完成
    }
  }

  // 监听路由变化，确保导航时也能自动滚动
  watch(() => route.path, () => {
    nextTick(() => {
      scrollToActiveMenuItem()
    })
  })

  onMounted(() => {
    // 延迟执行，确保DOM完全渲染
    nextTick(() => {
      scrollToActiveMenuItem()
    })
  })
</script>

<style scoped>
  .layout-container {
    height: 100vh;
  }

  .aside {
    background-color: #304156;
    transition: width 0.3s;
    overflow: hidden;
  }

  .logo {
    overflow: hidden;
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    background: #2b2f3a;
    color: #fff;
  }

  .company-selector {
    padding: 12px 16px;
    background: #2b2f3a;
    border-top: 1px solid #41546d;
    transition: all 0.3s;
  }

  .company-selector.collapsed {
    padding: 8px;
    opacity: 0;
    height: 0;
    overflow: hidden;
  }

  .company-selector :deep(.el-select) {
    width: 100%;
  }

  .company-selector :deep(.el-input__wrapper) {
    background-color: #41546d;
    border: 1px solid #5a6c7d;
    box-shadow: none;
  }

  .company-selector :deep(.el-input__inner) {
    color: #bfcbd9;
  }

  .company-selector :deep(.el-input__wrapper:hover) {
    border-color: #409EFF;
  }

  .company-selector :deep(.el-input__wrapper.is-focus) {
    border-color: #409EFF;
  }

  .logo_text {
    transition: opacity 0.3s, transform 0.3s;
    white-space: nowrap;
    color: #fff;
  }

  .logo_text.hidden {
    opacity: 0;
    transform: translateX(-20px);
  }

  .logo img {
    width: 32px;
    height: 32px;
    margin-right: 12px;
  }

  .menu-container {
    height: calc(100vh - 60px - 48px);
    /* 减去 logo 区域的高度(60px) 和公司筛选区域的高度(48px) */
    overflow-y: auto;
    /* 添加垂直滚动 */
    overflow-x: hidden;
    /* 防止水平滚动 */
    scroll-behavior: smooth;
    /* 添加平滑滚动 */
  }

  /* 美化滚动条样式 */
  .menu-container::-webkit-scrollbar {
    width: 8px;
  }

  .menu-container::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #41546d 0%, #5a6c7d 100%);
    border-radius: 4px;
    transition: background 0.3s ease;
  }

  .menu-container::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #5a6c7d 0%, #6b7d8e 100%);
  }

  .menu-container::-webkit-scrollbar-track {
    background-color: #304156;
  }

  .el-menu-vertical {
    border-right: none;
  }

  .el-menu-vertical:not(.el-menu--collapse) {
    width: 200px;
  }

  .header {
    background-color: #fff;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
  }

  .header-left {
    display: flex;
    align-items: center;
    flex: 1;
  }

  .header-center {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
  }

  .header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
  }

  .app-selector {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .app-selector .el-select {
    width: 320px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  .collapse-btn {
    font-size: 20px;
    cursor: pointer;
    margin-right: 20px;
  }

  .user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .user-info span {
    margin-left: 8px;
    font-size: 14px;
  }

  .main {
    background-color: #f0f2f5;
    padding: 20px;
  }

  /* 响应式处理 */
  @media screen and (max-width: 768px) {
    .aside {
      position: fixed;
      height: 100%;
      z-index: 1000;
    }

    .header {
      padding: 0 10px;
      flex-wrap: wrap;
    }

    .header-center {
      order: 3;
      flex-basis: 100%;
      margin-top: 10px;
      justify-content: flex-start;
    }

    .app-selector {
      width: 100%;
    }

    .app-selector .el-select {
      width: 100% !important;
    }

    .user-info span {
      display: none;
    }
  }

  @media screen and (max-width: 1200px) {
    .app-selector .el-select {
      width: 280px !important;
    }
  }

  @media screen and (max-width: 900px) {
    .app-selector .el-select {
      width: 240px !important;
    }
  }
</style>