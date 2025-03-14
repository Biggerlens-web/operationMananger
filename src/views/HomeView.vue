<template>
  <el-container class="layout-container">
    <!-- 左侧菜单 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="aside">
      <div class="logo">
        <!-- <img src="@/assets/logo.png" alt="Logo" /> -->
        <span class="logo_text" :class="{ hidden: isCollapse }">运营管理后台</span>
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
  import { ref, computed, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { House, User, Setting, Fold, Expand } from '@element-plus/icons-vue'

  import service from '@/axios'
  import { useCounterStore } from '@/stores/counter'
  import { storeToRefs } from 'pinia'
  const router = useRouter()
  const route = useRoute()
  const counterStore = useCounterStore()
  const { userName, userAvatar, appList, menuList, channelList, OSlist } = storeToRefs(counterStore)
  const isCollapse = ref(false)
  const activeMenu = computed(() => route.path)
  const currentRoute = computed(() => route.meta.title || '页面')

  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
  }

  const handleLogout = () => {
    // 清除token等登录信息
    localStorage.removeItem('token')
    router.push('/login')
  }


  //获取表单数据
  const getFormData = async () => {
    try {
      const res = await service.get('/base/baseData/getBaseDatas/0')
      console.log('基础表单数据', res);
      appList.value = res.data.data.apps
      channelList.value = res.data.data.channels
      OSlist.value = res.data.data.oss
    } catch (err) {
      console.log('获取失败', err);
    }
  }

  onMounted(() => {
    getFormData()
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
    height: 100%;
    /* 或者设置一个固定高度，如 100vh 或 600px */
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
  }

  .collapse-btn {
    font-size: 20px;
    cursor: pointer;
    margin-right: 20px;
  }

  .header-right {
    display: flex;
    align-items: center;
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
    }

    .user-info span {
      display: none;
    }
  }
</style>