<template>
  <el-container class="layout-container">
    <!-- 左侧菜单 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="aside">
      <div class="logo">
        <!-- <img src="@/assets/logo.png" alt="Logo" /> -->
        <span class="logo_text" :class="{ hidden: isCollapse }">运营管理后台</span>
      </div>

      <!-- 公司筛选 -->
      <div class="company-selector" :class="{ collapsed: isCollapse }">
        <el-select v-model="defaultCompanyNo" placeholder="选择公司" size="small" style="width: 100%"
          @change="handleCompanyChange">
          <el-option v-for="company in companyList" :key="company.companyNo" :label="company.companyName"
            :value="company.companyNo" />
        </el-select>
      </div>
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
      <!-- 顶部导航 -->
      <el-header class="header">
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

        <!-- 中间应用筛选区域 -->
        <div class="header-center" v-if='showAppSelcet()'>
          <div class="app-selector">
            <el-select v-model="defaultAppNo" placeholder="🔍 请选择应用" size="default" @change="handleAppChange"
              filterable>
              <el-option v-for="app in appListInCom" :key="app.appNo"
                :label="`${app.appAbbreviation}  [${app.id || app.appNo}]`" :value="app.appNo" />
            </el-select>
          </div>
        </div>
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

      <!-- 主要内容区 -->
      <el-main class="main" style="overflow-y: scroll;">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { Fold, Expand } from '@element-plus/icons-vue'

  import { useCounterStore } from '@/stores/counter'
  import { storeToRefs } from 'pinia'
  import service from '@/axios'
  import { desEncrypt } from '@/utils/des'
  const router = useRouter()
  const route = useRoute()
  const counterStore = useCounterStore()
  const { userName, userAvatar, appList, menuList, companyList, defaultCompanyNo, defaultAppNo, appListInCom, showLoading } = storeToRefs(counterStore)
  const isCollapse = ref(false)
  const activeMenu = computed(() => route.path)

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






  //获取公司下的应用

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



  const currentRoute = computed(() => route.meta.title || '页面')


  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
  }

  const handleLogout = () => {
    // 清除token等登录信息
    localStorage.removeItem('token')
    router.push('/login')
  }

  const handleCompanyChange = (companyNo: string) => {
    console.log('选择的公司ID:', companyNo)
    // 这里可以添加公司切换的逻辑，比如更新store中的当前公司
    // counterStore.setCurrentCompany(companyId)
    getAppByCom(companyNo)
  }

  const handleAppChange = (appNo: string) => {
    console.log('选择的应用编号:', appNo)

    // 这里可以添加应用切换的逻辑，比如更新store中的当前应用
    // counterStore.setCurrentApp(appNo)
    // 或者触发相关的数据刷新
  }





  onMounted(() => {

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
  }

  /* 美化滚动条样式 */
  .menu-container::-webkit-scrollbar {
    width: 6px;
  }

  .menu-container::-webkit-scrollbar-thumb {
    background-color: #41546d;
    border-radius: 3px;
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