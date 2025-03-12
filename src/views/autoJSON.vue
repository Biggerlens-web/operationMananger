<template>
  <div class="view">

    <el-dialog v-model="dialogJSON" title="JSON配置" width="1000" :before-close="handleCloseJSON">
      <jsonEditor v-model="jsonData" :comment-data="comments" @inputChecked="inputChecked" @dateChange="dateChange" />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCloseJSON">取消</el-button>
          <el-button type="primary" @click="handleComfirmJSON">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <div class="page-header">

      <el-button type="primary" :icon="Plus">新增配置</el-button>
    </div>

    <el-card class="filter-card">
      <div class="filter-box">
        <div class="filter-item">
          <span class="label">应用:</span>
          <el-select v-model="activeApp" placeholder="请选择应用" @select="getAutoConfig" clearable class="filter-select">
            <el-option v-for="item in appList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </div>
        <!-- <div class="filter-actions">
          <el-button type="primary">查询</el-button>
          <el-button>重置</el-button>
        </div> -->
      </div>
    </el-card>

    <el-card class="table-card">
      <el-table :data="tableData" border style="width: 100%" height="630" v-loading="loading">
        <el-table-column prop="date" label="应用" />
        <el-table-column prop="name" label="编码" />
        <el-table-column prop="address" label="名称" />
        <el-table-column prop="address" label="备注" width="700" />
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="scope">
            <el-button type="primary">编辑</el-button>
            <el-button type="primary" @click="editorJSON(scope.row)">JSON配置</el-button>
            <el-button type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>


    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { Plus } from '@element-plus/icons-vue'
  import jsonEditor from '../components/autoJson/jsonEditor.vue'
  import comments from '../utils/notes1.json'
  import { server } from 'typescript'
  import service from '@/axios'
  interface AppItem {
    id: number
    name: string
  }

  // 筛选相关
  const activeApp = ref<string | number>('')
  const appList = ref<AppItem[]>([
    { id: 1, name: '123123' },
    { id: 2, name: '123123' },
    { id: 3, name: '123123' },
    { id: 4, name: '123123' },
    { id: 5, name: '123123' },
    { id: 6, name: '123123' },
    { id: 7, name: '123123' },
    { id: 8, name: '123123' },
    { id: 9, name: '123123' },
    { id: 10, name: '123123' }
  ])

  // 表格相关
  const loading = ref(false)
  const tableData = ref([
    {
      date: '2024-01-01',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles'
    }
  ])

  //编辑JSON
  type JsonDataType = Record<string, any>;
  const jsonData = ref<JsonDataType>({
    "netip": "会员服务ip",
    "piCutConfigBean": "皮卡配置",
    "questionnaireConfigBeanList": "调查问卷配置",
    "xiaomiConfig": "小米配置",
    "adsConfig": "广告配置",
    "vipConfig": "vip配置",
    "xiaomiFirstPayDistanceOpen": "注释",
    "xiaomiFirstPayDistance": "注释",
    "huaweiConfig": "华为配置",
    "feeConfig": "付费点配置",
    "jsonUpdateTime": "2023-07-11 11:11:11",
    "helpMeRetouchConfig": {
      "version": '123123',
      "isShowTaobao": true,
      "isCanPay": true,
    },
  })

  const dialogJSON = ref<boolean>(false)
  const editorJSON = (item: any) => {

    dialogJSON.value = true
  }
  const handleCloseJSON = () => {
    dialogJSON.value = false
  }
  const handleComfirmJSON = () => {
    console.log('JSON配置', jsonData.value);
    handleCloseJSON()
  }
  const dateChange = (dateObj: any) => {
    const { path, value } = dateObj;

    // 遍历 jsonData 中的所有属性
    for (const [key, val] of Object.entries(jsonData.value)) {
      // 如果是直接匹配到顶层属性
      if (key === path) {
        jsonData.value[path] = value;
        console.log(`更新顶层属性 ${path}:`, value);
        return;
      }

      // 如果是对象，检查其内部属性
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        if (path in val) {
          val[path] = value;
          console.log(`更新嵌套属性 ${key}.${path}:`, value);
          return;
        }
      }
    }

    console.warn(`未找到路径 ${path}`);
  }
  const inputChecked = (key: string) => {
    // 遍历 jsonData 中的所有属性
    for (const [dataKey, value] of Object.entries(jsonData.value)) {
      // 如果是对象类型，检查其内部属性
      if (typeof value === 'object' && value !== null) {
        // 如果在嵌套对象中找到了对应的 key
        if (key in value && typeof value[key] === 'boolean') {
          value[key] = !value[key];
          console.log(`修改嵌套值 ${dataKey}.${key}:`, value[key]);
          console.log('Jsondata', jsonData.value);
          return;
        }
      }
      // 如果是顶层属性
      else if (dataKey === key) {
        if (typeof value === 'boolean') {
          jsonData.value[key] = !value;
        } else {
          // 如果不是布尔值，可以设置一个默认的布尔值
          jsonData.value[key] = true;
        }
        console.log(`修改顶层值 ${key}:`, jsonData.value[key]);
        console.log('Jsondata', jsonData.value);
        return;
      }
    }

  }



  const getAutoConfig = async () => {
    try {
      const appNo = encodeURIComponent(activeApp.value)
      const res = await service.get(`/appConfig/json/list/${appNo}`)
      console.log('获取自动化配置列表', res);
    } catch (err) {
      console.log('获取自动化配置列表', err);
    }
  }
  watch(() => appList.value, (newV) => {
    if (newV.length > 0) {
      activeApp.value = 11
      // getAutoConfig()
    }
  }, { immediate: true, deep: true })
</script>

<style scoped>
  .view {
    min-height: 100%;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .page-header h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 500;
    color: #1f2f3d;
  }

  .filter-card {
    margin-bottom: 16px;
  }

  .filter-box {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: flex-start;
  }

  .filter-item {
    display: flex;
    align-items: center;
    margin-right: 24px;
  }

  .filter-item .label {
    margin-right: 8px;
    color: #606266;
    font-size: 14px;
  }

  .filter-select {
    width: 200px;
  }

  .filter-actions {
    margin-left: auto;
  }

  .table-card {
    margin-bottom: 16px;
  }

  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #EBEEF5;
  }

  /* 响应式处理 */
  @media screen and (max-width: 768px) {
    .filter-box {
      flex-direction: column;
    }

    .filter-item {
      margin-right: 0;
      margin-bottom: 16px;
    }

    .filter-select {
      width: 100%;
    }

    .filter-actions {
      margin-left: 0;
      width: 100%;
      display: flex;
      gap: 8px;
    }

    .filter-actions .el-button {
      flex: 1;
    }
  }
</style>