<template>
  <div class="view">
    <menuEditor v-model:dialog-visible="showEditor" :menuInfo="menuInfo" />
    <el-card class="filter-card">
      <div class="card-header">
        <div class="left-actions">
          <el-button type="primary" class="add-button" @click="addMenu">
            <el-icon>
              <Plus />
            </el-icon>
            新增菜单
          </el-button>
        </div>
        <div class="right-actions">
          <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
            @changeView="changeView" />
        </div>
      </div>

      <el-divider class="divider" />

      <div class="filter-container">
        <div class="filter-row">
          <div class="filter-item">
            <el-input v-model="searchParams.menuText" placeholder="输入菜单文本查询" clearable prefix-icon="Search" />
          </div>
          <div class="filter-item">
            <el-select v-model="searchParams.menuType" placeholder="请选择菜单类型" clearable>
              <el-option label="文件夹" :value="0" />
              <el-option label="链接" :value="1" />

            </el-select>
          </div>
          <div class="filter-item">
            <el-input v-model="searchParams.menuUrl" placeholder="输入菜单链接查询" clearable prefix-icon="Link" />
          </div>
          <div class="filter-item">
            <el-select v-model="searchParams.menuUrlType" placeholder="请选择菜单链接类型" clearable>
              <el-option label="内部路由" :value="1" />
              <el-option label="外部链接" :value="0" />

            </el-select>
          </div>
          <!-- <div class="filter-item">
            <el-select v-model="searchParams.parentId" placeholder="请选择上级菜单" clearable>

              <el-option v-for="item in menuFolderList" :label="item.menuText" :value="item.id" />
            </el-select>
          </div> -->
          <div class="filter-item filter-actions">
            <el-button type="primary" @click="getUserList">
              <el-icon>
                <Search />
              </el-icon>
              查询
            </el-button>
            <el-button @click="resetSearch">
              <el-icon>
                <Refresh />
              </el-icon>
              重置
            </el-button>

          </div>
        </div>


      </div>
    </el-card>
    <el-card class="content-card">
      <Transition enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut" mode="out-in">
        <component :is="componentName" :filterParams="filterParams" :tableData="menuData" @editor='editorMenu'
          @delete="deleteMenu">
        </component>

      </Transition>
      <el-pagination style="position: sticky; right: 0; margin-top: 10px;" v-show="showPagestion"
        v-model:current-page="currentPage" :page-size="pageSize" class="pagesBox" background layout="prev, pager, next"
        :total="totalData" />

    </el-card>

  </div>
</template>

<script setup lang="ts">
  import tableAciton from '@/components/public/tableAciton.vue';
  import userTable from '@/components/user/userTable.vue';
  import userList from '@/components/user/userList.vue';
  import { onMounted, ref, watch } from 'vue';
  import { useCounterStore } from '@/stores/counter';
  import { storeToRefs } from 'pinia';
  import menuEditor from '@/components/menu/menuEditor.vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import service from '@/axios';
  import { desEncrypt } from '@/utils/des';
  const counterStore = useCounterStore()
  const { showPagestion, showLoading } = storeToRefs(counterStore)
  const components: any = {
    userTable,
    userList
  }
  const componentStr = ref('userTable')
  const componentName = ref<any>(userTable)



  // //菜单类型列表
  // const menuTypeList = ref<any>([])
  // //菜单链接类型列表
  // const menuUrlTypeList = ref<any>([])
  //父级菜单
  const menuFolderList = ref<any>([])
  const showEditor = ref<boolean>(false)



  watch(() => showEditor.value, (newV) => {

    if (!newV) {
      menuInfo.value = ''
      getUserList()
    }
  })
  //页码
  const currentPage = ref<number>(1)
  watch(() => currentPage.value, (newV) => {
    getUserList()
  })
  //最大条数
  const pageSize = ref<number>(20)
  //数据总数
  const totalData = ref<number>(0)

  //新增菜单
  const addMenu = () => {
    showEditor.value = true
  }


  //编辑菜单
  const menuInfo = ref<any>()
  const editorMenu = (item: any) => {
    console.log('编辑菜单父组件', item)
    menuInfo.value = item
    showEditor.value = true

  }


  //删除菜单
  const deleteMenuFn = async (item: any) => {
    try {
      showLoading.value = true
      const res = await service.post(`/system/menu/del/${item.id}`)
      console.log('删除成功', res);
      if (res.data.code === 200) {
        ElMessage.success('删除成功')
        getUserList()

      } else {
        ElMessage.error(res.data.msg)
      }
    } catch (err) {
      console.log('删除失败', err);
    } finally {
      showLoading.value = false
    }
  }
  const deleteMenu = (item: any) => {
    console.log('删除菜单父组件', item);

    ElMessageBox.confirm('确定删除该菜单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(res => {

      deleteMenuFn(item)
    }).catch(err => {

    })
  }
  //搜索参数
  interface SearchParams {
    menuText: string
    menuType: string
    menuUrl: string
    menuUrlType: string
    parentId: number | string
  }
  const searchParams = ref<SearchParams>(
    {
      menuText: '',
      menuType: '',
      menuUrl: '',
      menuUrlType: '',
      parentId: ''
    }
  )
  //重置搜索
  const resetSearch = () => {
    searchParams.value = {
      menuText: '',
      menuType: '',
      menuUrl: '',
      menuUrlType: '',
      parentId: ''
    }
    getUserList()
  }
  // 定义菜单类型
  interface Menu {
    id: number           // 编号
    menuText: string         // 菜单文本
    menuType: string         // 菜单类型（目录、菜单、按钮）
    menuIdentify: string     // 菜单标识
    menuUrl: string          // 菜单链接
    menuUrlType: string      // 菜单链接类型（内部路由、外部链接、iframe）
    parentId: number     // 上级菜单ID（0表示顶级菜单）

    parentName: string
    remark: string  // 说明
  }
  const userNote: any = {
    id: '编号',
    menuText: '菜单文本',
    menuType: '菜单类型',
    menuIdentify: '菜单标识',
    menuUrl: '菜单链接',
    menuUrlType: '菜单链接类型',
    parentId: '上级菜单ID',
    parentName: '上级菜单',
    remark: '说明',

  }
  // 生成菜单数据
  const menuData = ref<Menu[]>([

  ])
  interface filterParams {
    note: string
    isShow: boolean
    key: string
  }
  const filterParams = ref<filterParams[]>()
  const getUserList = async () => {
    try {

      showLoading.value = true
      const menuInfo = await service.get('/system/menu/menuInfo')
      console.log('获取菜单信息', menuInfo);
      // menuTypeList.value = menuInfo.data.data.menuTypes.map((item: any) => {
      //   return {
      //     label: item.menuTypeName === '',
      //     value: item.menuType
      //   }
      // })
      menuFolderList.value = menuInfo.data.data.menus

      const params = {
        pageNum: currentPage.value,
        pageSize: pageSize.value,
        menuText: searchParams.value.menuText,
        menuUrl: searchParams.value.menuUrl,
        menuType: searchParams.value.menuType,
        menuUrlType: searchParams.value.menuUrlType,
        // parentId: searchParams.value.menuUrlType,
        timestamp: Date.now()
      }
      console.log('搜索参数', params);
      const paramsStr = desEncrypt(JSON.stringify(params))

      const res = await service.post('/system/menu/list', {

        enData: paramsStr

      })
      console.log('菜单列表', res.data);
      totalData.value = res.data.total
      for (let item of res.data.rows) {
        if (item.menuType === 0) {
          item.menuType = '文件夹'
        } else if (item.menuType === 1) {
          item.menuType = '链接'
        }

      }


      menuData.value = res.data.rows
      const dataItem = menuData.value[0]



      const keys = Object.keys(dataItem)
      filterParams.value = keys.map((item) => {
        return {
          note: userNote[item],
          isShow: true,
          key: item
        }
      })
      console.log('filterParams', filterParams.value);
    } catch (err) {
      console.log('获取菜单列表失败', err);
    } finally {
      showLoading.value = false
    }

  }
  //参数显影
  const checkedParams = ({ key, checked }: any) => {
    console.log('修改参数', key, checked);
    const item = filterParams.value?.find((item) => item.key === key)
    if (item) {
      item.isShow = checked
    }

  }
  //切换显示模式
  const changeView = () => {

    const keys = Object.keys(components)
    const keyItem = keys.find((item) => item !== componentStr.value)
    if (keyItem) {
      componentStr.value = keyItem
      componentName.value = components[keyItem]
    }
    console.log('keyItem', keyItem);
  }
  onMounted(() => {
    getUserList();
    showPagestion.value = true
  })
</script>

<style scoped lang="scss">
  .view {
    .filter-card {
      width: 100%;
      margin-bottom: 20px;

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;

        .left-actions {
          .add-button {
            font-weight: 500;

            .el-icon {
              margin-right: 4px;
            }
          }
        }

        .right-actions {
          display: flex;
          align-items: center;
        }
      }

      .divider {
        margin: 12px 0;
      }

      .filter-container {
        .filter-row {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;

          &:last-child {
            margin-bottom: 0;
          }

          .filter-item {
            // flex: 1;
            width: 200px;
            /* 允许元素收缩到比内容更小 */
          }

          .button-group {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            width: 100%;
          }
        }
      }
    }

    /* 确保select组件占满宽度 */
    :deep(.el-select) {
      width: 100%;
    }

    .content-card {
      height: calc(100vh - 220px);

      .pagesBox {
        margin-top: 30px;
      }
    }
  }
</style>