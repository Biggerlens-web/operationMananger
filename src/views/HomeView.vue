<template>
  <el-container class="layout-container">
    <!-- 左侧菜单 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="aside">
      <div class="logo">
        <!-- <img src="@/assets/logo.png" alt="Logo" /> -->
        <span v-show="!isCollapse">运营管理后台</span>
      </div>
      <el-menu :default-active="activeMenu" class="el-menu-vertical" :collapse="isCollapse" background-color="#304156"
        text-color="#bfcbd9" active-text-color="#409EFF" router>
        <el-menu-item index="/autoOpration">
          <el-icon>
            <Document />
          </el-icon>
          <template #title>自动化运营配置</template>
        </el-menu-item>
        <el-menu-item index="/templates">
          <el-icon>
            <Notebook />
          </el-icon>
          <template #title>模板管理</template>
        </el-menu-item>




      </el-menu>
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
      <el-main class="main" style="overflow: visible;">
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
  const { userName, userAvatar, appList } = storeToRefs(counterStore)
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
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    background: #2b2f3a;
    color: #fff;
  }

  .logo img {
    width: 32px;
    height: 32px;
    margin-right: 12px;
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