<!-- 应用配置管理视图 -->
<template>
  <div class="view">

    <!-- JSON配置弹窗 -->
    <el-dialog v-model="dialogJSON" title="JSON配置" width="1000" :before-close="handleCloseJSON">
      <!-- JSON编辑器组件 -->
      <jsonEditor ref="childRef" v-model="jsonData" :comment-data="comments" @updateNote="updateNote"
        @inputChecked="inputChecked" @dateChange="dateChange" :editorType="editorType" :dialogJSON="dialogJSON" />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCloseJSON">取消</el-button>
          <el-button type="primary" @click="handleComfirmJSON">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 配置项编辑器弹窗 -->
    <configEditor v-model:dialogEditor="dialogEditor" :editorFormData="editorFormData" :activeApp="activeApp"
      @update="getAutoConfig" />
    <!-- 页面头部操作区 -->
    <div class="page-header">
      <el-button type="primary" :icon="Plus" @click="addConfig">新增配置</el-button>
    </div>

    <!-- 筛选条件卡片 -->
    <el-card class="filter-card">
      <div class="filter-box">
        <!-- <div class="filter-item">
          <span class="label">应用:</span>
          <el-select filterable v-model="activeApp" placeholder="请选择应用" @change="getAutoConfig" clearable
            class="filter-select">
            <el-option v-for="item in appList" :key="item.appNo"
              :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
              :value="item.appNo" />
          </el-select>
        </div> -->
        <div class="filter-item">
          <span class="label">渠道:</span>
          <el-select filterable v-model="activeChannel" placeholder="请选择渠道" @change="getAutoConfig" clearable
            class="filter-select">
            <el-option v-for="item in channelList" :key="item.id" :label="item.channelName" :value="item.id" />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="label">系统:</span>
          <el-select filterable v-model="activeOS" placeholder="请选择系统" @change="getAutoConfig" clearable
            class="filter-select">
            <el-option v-for="item in OSlist" :key="item.value" :label="item.note" :value="item.value" />
          </el-select>
        </div>

        <div class="filter-item">
          <span class="label">地区:</span>
          <el-select filterable v-model="activeArea" placeholder="请选择地区" @change="getAutoConfig" clearable
            class="filter-select">
            <el-option :label="'国内'" :value="'domestic'" />
            <el-option :label="'国外'" :value="'foreign'" />
          </el-select>
        </div>
      </div>
    </el-card>

    <!-- 数据表格卡片 -->
    <el-card class="table-card">
      <el-table :data="tableData" border style="width: 100%" height="630" v-loading="loading">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="appNo" label="应用">
          <template #default="scope">
            <span>
              {{appList.find((item: any) => item.appNo === scope.row.appNo)?.appAbbreviation}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="编码" />
        <el-table-column prop="open" label="开关" width="180px">
          <template #default="scope">
            <!-- 开关和日期选择器 -->
            <p>
              <el-switch v-model="scope.row.open" @change="changeSwitch(scope.row)" />
            </p>
            <el-date-picker v-if="scope.row.open" style="width: 150px;margin-top: 10px;" v-model="scope.row.dateArr"
              type="datetimerange" start-placeholder="开始时间" @change="changeDate(scope.row)" end-placeholder="结束时间"
              value-format="YYYY-MM-DD HH:mm:ss" />
          </template>

        </el-table-column>
        <el-table-column prop="channel" label="渠道">
          <template #default="scope">
            <div class="channel-tags">
              <span v-for="(item, index) in scope.row.channel.split(',')" :key="index" class="channel-tag">
                {{ initChannel(item) }}
              </span>
            </div>
          </template>

        </el-table-column>
        <el-table-column prop="os" label="系统">


        </el-table-column>
        <el-table-column prop="config" label="JSON配置" width="250">

          <template #default="scope">
            <div style="white-space: pre">{{ scope.row.config ? JSON.stringify(JSON.parse(scope.row.config), null, 2)
              : '' }}</div>
          </template>

        </el-table-column>

        <el-table-column prop="desc" label="备注" width="250" />
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="scope">
            <el-button type="primary" @click="editorConfig(scope.row)">编辑</el-button>
            <el-button type="primary" @click="editorJSON(scope.row)">JSON配置</el-button>

            <el-button type="danger" @click="deleteConfig(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>


    </el-card>
  </div>
</template>

<script setup lang="ts">
  // 引入Vue相关API
  import { onMounted, ref, watch, nextTick } from 'vue'

  /**
   * @description: 防抖函数
   * @param {Function} func 需要执行的函数
   * @param {number} delay 延迟时间
   * @returns {Function} 防抖处理后的函数
   */
  const debounce = (func: Function, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>
    return (...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(null, args), delay)
    }
  }
  // 引入Element Plus图标
  import { Plus } from '@element-plus/icons-vue'
  // 引入子组件
  import jsonEditor from '../components/autoJson/jsonEditor.vue'
  import { getKeysAsObject } from '../utils/keyAsObj'
  // 引入axios实例
  import service from '@/axios'
  // 引入Pinia store
  import { useCounterStore } from '@/stores/counter'
  import { storeToRefs } from 'pinia'
  import configEditor from '@/components/autoJson/configEditor.vue'
  import { useAutoOpration } from '@/stores/autoOpration'
  // 引入加解密工具
  import { decryptDes, desEncrypt } from '@/utils/des'
  // 引入Element Plus消息提示
  import { ElMessage } from 'element-plus'
  // 子组件引用
  const childRef = ref()
  // 调用子组件方法，设置JSON数据
  const callChildMethod = () => {
    childRef.value?.setJsonData()
  }
  // 使用Pinia store
  const counterStore = useCounterStore()
  const autoOprationStore = useAutoOpration()
  const { JSONEditorValue, JSONEditorNote } = storeToRefs(autoOprationStore) // 从store中解构状态
  const {
    appList, channelList, OSlist, showLoading, defaultAppNo
  } = storeToRefs(counterStore) // 从store中解构公共数据
  // 筛选条件状态
  const activeApp = ref<string | number>('') // 当前选中的应用
  const activeChannel = ref<string | number>('') // 当前选中的渠道
  const activeOS = ref<string | number>('') // 当前选中的系统
  const activeArea = ref<string>('') // 当前选中的地区
  // 表格状态
  const loading = ref(false) // 表格加载状态
  // 表格数据项接口定义
  interface TableItem {
    configNote: string;
    // 添加其他必要的字段
    [key: string]: any; // 如果有其他动态字段，可以使用索引签名
  }
  const tableData = ref<TableItem[]>([]) // 表格数据
  /**
   * @description: 调用API保存开关状态和配置
   * @param {any} params 配置项数据
   */
  const switchFn = async (params: any) => {
    try {
      params.timestamp = Date.now()
      const config = JSON.parse(params.config)
      const configNote = JSON.parse(params.configNote)
      params.config = JSON.stringify(enCodeObj(config))
      params.configNote = JSON.stringify(enCodeObj(configNote))
      const paramStr = desEncrypt(JSON.stringify(params))
      showLoading.value = true
      const res = await service.post('/appConfig/json/save', {
        enData: paramStr
      })
      console.log('修改状态', res);
      if (res.data.code === 200) {
        ElMessage.success('修改成功')
        getAutoConfig()
      } else {
        ElMessage.error(res.data.msg)
      }
    } catch (err) {
      console.log('修改失败', err);
    } finally {
      showLoading.value = false
    }
  }
  // 开关状态改变时触发
  const changeSwitch = (item: any) => {
    console.log('item', item);
    switchFn(item)
  }

  // 日期范围改变时触发
  const changeDate = (item: any) => {
    console.log('item', item);
    if (item.dateArr) {
      item.startTime = item.dateArr[0]
      item.endTime = item.dateArr[1]
    } else {
      item.startTime = ''
      item.endTime = ''
    }

    switchFn(item)

  }
  //格式化渠道显示
  const initChannel = (item: any) => {
    return channelList.value.find((el: any) => el.id === parseInt(item))?.channelName
  }

  //编辑JSON
  type JsonDataType = Record<string, any>;
  const jsonData = ref<JsonDataType>({

  })
  const comments = ref<JsonDataType>({})


  //编辑配置
  const editorFormData = ref<any>()
  const editorConfig = (item: any) => {
    console.log('item', item);
    editorFormData.value = item
    dialogEditor.value = true
  }




  const editorType = ref<string>('value')
  const dialogJSON = ref<boolean>(false)
  const configingItem = ref<any>({})
  const editorJSON = (item: any) => {
    configEditorJSON(item)
  }


  //配置编辑json
  const configEditorJSON = (item: any) => {

    configingItem.value = item
    jsonData.value = JSON.parse(item.config)
    comments.value = JSON.parse(item.configNote)
    dialogJSON.value = true
    console.log('comments.value', comments.value);
    console.log('jsonData.value', jsonData.value);
  }

  const handleCloseJSON = () => {
    jsonData.value = {}
    dialogJSON.value = false
  }

  //参数值url编码
  const enCodeObj = (obj: any): any => {
    const result: any = {};
    // Check if the input is an array
    if (Array.isArray(obj)) {
      // If it's an array, map over its elements and recursively encode them
      return obj.map(item => enCodeObj(item));
    }

    // If it's an object (and not null)
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        // Ensure the property belongs to the object itself
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (typeof value === 'string') {
            result[key] = encodeURIComponent(value);
          } else if (typeof value === 'object' && value !== null) {
            // Recursively call enCodeObj for nested objects or arrays
            result[key] = enCodeObj(value);
          } else {
            // Handle other primitive types directly
            result[key] = value;
          }
        }
      }
      return result;
    }

    // Return primitive values directly (if not a string already handled)
    // This handles cases where the initial input might be a non-string primitive
    return obj;
  }

  const handleComfirmJSON = async () => {
    try {
      callChildMethod()



      configingItem.value.config = JSON.stringify((jsonData.value))
      console.log('configingItem.value.config', configingItem.value.config);
      configingItem.value.configNote = JSON.stringify((comments.value))
      const params = {
        ...configingItem.value, timestamp: new Date().getTime()
      }


      console.log('保存参数', params);
      const paramStr = desEncrypt(JSON.stringify(params))
      showLoading.value = true
      const res = await service.post('/appConfig/json/save', {
        enData: paramStr
      })
      console.log('保存结果', res);

      console.log('保存结果解密', decryptDes(res.data));
      if (res.data.code === 200) {
        ElMessage.success('保存成功')

        handleCloseJSON()


        getAutoConfig()
      } else {
        ElMessage.error('保存失败')
      }

    } catch (err) {
      ElMessage.error('保存失败')
    } finally {
      showLoading.value = false
    }

  }

  //编辑日期
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
  //编辑布尔值
  const inputChecked = (key: string) => {
    console.log('jsonData.value', jsonData.value);
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


  //编辑备注
  const assaginOBj = (key: string, value: any, obj: any) => {
    if (Object.keys(comments.value).length === 0) {

      comments.value = obj
    } else {
      comments.value[key] = value
    }
  }
  // 检查嵌套属性是否存在
  function hasCommaNestedProperty(obj: Record<string, any>, path: string): boolean {
    // 直接检查是否有完全匹配的键
    if (path in obj) {
      return true;
    }

    // 检查是否有以逗号形式表示的嵌套属性
    for (const key of Object.keys(obj)) {
      if (key.includes(',')) {
        const parts = key.split(',');
        // 如果path作为任何部分出现在逗号分隔的键中
        if (parts.includes(path)) {
          return true;
        }
      }
    }

    return false;
  }

  // 防抖函数
  let updateNoteTimer: ReturnType<typeof setTimeout> | null = null

  const updateNote = (note: { value: string; path: string }) => {
    const { value, path } = note
    console.log('note', note);
    try {
      // 直接更新comments对象，不需要通过getKeysAsObject重新生成
      let isUpdated = false

      // 首先检查是否有完全匹配的路径
      if (comments.value[path] !== undefined) {
        comments.value[path] = value
        isUpdated = true
        console.log(`直接更新路径注释: ${path} = ${value}`)
      } else {
        // 检查是否有包含该路径的复合键
        for (const [key] of Object.entries(comments.value)) {
          if (key.includes(',') && key.includes(path)) {
            comments.value[key] = value
            isUpdated = true
            console.log(`更新复合路径注释: ${key} = ${value}`)
            break
          }
        }
      }

      // 如果没有找到匹配的路径，说明是新增的key，直接添加到注释对象中
      if (!isUpdated) {
        console.log(`新增路径注释: ${path} = ${value}`)
        comments.value[path] = value
        isUpdated = true
      }

      // 成功更新后，直接更新DOM中的注释显示，避免重新渲染整个编辑器
      if (isUpdated) {
        // 使用更安全的方法查找DOM元素，避免特殊字符导致的querySelector错误
        try {
          const elementId = `jsoneditor-desc${path}`
          let editorInput = document.getElementById(elementId)

          // 如果getElementById失败，尝试使用属性选择器
          if (!editorInput) {
            editorInput = document.querySelector(`[id="${elementId}"]`)
          }

          // 如果还是找不到，使用更通用的方法遍历查找
          if (!editorInput) {
            const allDescElements = document.querySelectorAll('[id^="jsoneditor-desc"]')
            for (const element of allDescElements) {
              if (element.id === elementId) {
                editorInput = element as HTMLElement
                break
              }
            }
          }

          if (editorInput instanceof HTMLElement) {
            editorInput.textContent = value
            console.log('注释更新完成，当前comments:', comments.value)
          } else {
            // 如果DOM中没有找到对应的注释元素（新增属性的情况），需要重新初始化注释显示
            console.log('未找到注释元素，重新初始化注释显示')
            if (updateNoteTimer) {
              clearTimeout(updateNoteTimer)
            }
            updateNoteTimer = setTimeout(() => {
              callChildMethod()
            }, 100)
          }
        } catch (domError) {
          console.warn('DOM操作失败，重新初始化注释显示:', domError)
          if (updateNoteTimer) {
            clearTimeout(updateNoteTimer)
          }
          updateNoteTimer = setTimeout(() => {
            callChildMethod()
          }, 100)
        }
      }

    } catch (error) {
      console.error('更新注释失败:', error)
    }
  }



  watch(() => defaultAppNo.value, (newV) => {
    if (newV) {
      activeApp.value = newV
      getAutoConfig()
    }
  })

  const getAutoConfig = async () => {
    try {
      loading.value = true
      const appNo = encodeURIComponent(activeApp.value)
      const params = {
        os: activeOS.value,
        channel: activeChannel.value,
        region: activeArea.value,
        timestamp: Date.now()
      }
      console.log('参数------', params);
      const paramStr = desEncrypt(JSON.stringify(params))
      showLoading.value = true
      const res = await service.get(`/appConfig/json/list/${appNo}`, {
        params: {
          enData: paramStr
        }
      })
      console.log('获取自动化配置列表', res);

      tableData.value = res.data.rows

      for (const item of tableData.value) {
        item.dateArr = [item.startTime, item.endTime]

        if (!item.configNote) {
          item.configNote = JSON.stringify({})
        }
      }
    } catch (err) {
      console.log('获取自动化配置列表', err);
    } finally {
      loading.value = false
      showLoading.value = false
    }
  }
  //编辑配置
  const dialogEditor = ref<boolean>(false)
  const addConfig = () => {
    editorFormData.value = null
    dialogEditor.value = true
  }

  watch(() => dialogEditor.value, (newV) => {
    if (!newV) {
      editorFormData.value = null
    }
  })

  const deleteConfig = async (item: any) => {
    try {
      showLoading.value = true
      const res = await service.post(`/appConfig/json/delete/${item.id}`)
      if (res.data.code === 200) {
        ElMessage.success('删除成功')
        getAutoConfig()
      } else {
        ElMessage.error('删除失败')
      }
    } catch (err) {
      ElMessage.error('删除失败')
    } finally {
      showLoading.value = false
    }

  }
  // watch(() => appList.value, (newV) => {
  //   console.log('刷新自动配置列表');
  //   if (newV.length > 0) {
  //     if (appList.value.length === 0) return
  //     activeApp.value = appList.value[0].appNo



  //     getAutoConfig()
  //   }
  // }, { deep: true })

  onMounted(() => {
    if (appList.value.length > 0) {
      // activeApp.value = appList.value[0].appNo
      activeApp.value = defaultAppNo.value
      getAutoConfig()
    }
  })


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



  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #EBEEF5;
  }

  .channel-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .channel-tag {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    font-size: 12px;
    line-height: 1.5;
    border-radius: 4px;
    color: #fff;
    background-color: #409EFF;
    white-space: nowrap;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;


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