<template>
  <div class="menu_management">
    <div class="header_editbox">
      <el-button type="primary" :icon="CirclePlus" @click="handleAddMenu">新增菜单</el-button>

      <div class="search_box">
        <el-input v-model="searchText" placeholder="请输入菜单名称查询" clearable style="width: 200px;"></el-input>
        <el-select v-model="searchType" placeholder="请选择搜索类型" style="width: 180px;">
          <el-option label="菜单名称" value="name"></el-option>
          <el-option label="菜单路径" value="path"></el-option>
        </el-select>
        <el-button :icon="Refresh" @click="handleResetSearch">重置</el-button>
        <el-button :icon="Search" type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>


    <el-table :data="menuList" border style="width: 100%" row-key="id">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />

      <el-table-column label="操作" width="180">
        <template #default="scope" fixed="right">
          <el-button type="primary" @click="handleEditMenu(scope)">编辑</el-button>
          <el-button type="danger" @click="handleDeleteMenu(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <div class="el_pagination">
      <el-pagination background layout="prev, pager, next" :total="1000" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CirclePlus, Refresh, Search } from '@element-plus/icons-vue';
import { el } from 'element-plus/es/locales.mjs';
import { ref } from 'vue';

//TODO 分页
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);
const handleCurrentChange = (page: number) => {
  currentPage.value = page;
}


//TODO 菜单搜索
const searchText = ref('');
const searchType = ref('name');
const handleResetSearch = () => {
  searchText.value = '';
  searchType.value = 'name';
}
const handleSearch = () => {
  console.log('搜索');
}


//TODO 新增菜单
const handleAddMenu = () => {
  console.log('新增菜单');
}

//TODO 菜单列表
const menuList = ref([
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
])

//TODO 编辑菜单
const handleEditMenu = (scope: any) => {
  console.log('编辑菜单', scope.row);
}

//TODO 删除菜单
const handleDeleteMenu = (scope: any) => {
  console.log('删除菜单', scope.row);
}



</script>

<style scoped>
.menu_management {
  width: auto;

  box-sizing: border-box;
  padding: 20px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.header_editbox {
  display: flex;
  width: 100%;
  margin-bottom: 20px;
}

.search_box {
  width: 100%;
  margin-left: 20px;
  gap: 20px;
  display: flex;
  align-items: center;
}

.el_pagination {
  margin-top: 20px;
  text-align: center;
}
</style>