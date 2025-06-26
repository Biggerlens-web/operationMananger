<template>
  <div class="view">
    <permissionEditor v-model:dialog-visible="showPermissionEditor" :permissionInfo="permissionInfo" />
    <el-card class="filter-card">
      <div>
        <el-button type="primary" @click="addPermission"> <el-icon>
            <Plus />
          </el-icon>新增权限</el-button>
        <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
          @changeView="changeView" />
      </div>
    </el-card>
    <el-card class="content-card">
      <Transition enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut" mode="out-in">
        <component :is="componentName" :filterParams="filterParams" :tableData="permissionData"
          @editor="editorPermission" @delete="deletePermission"></component>
      </Transition>
      <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
        v-model:current-page="pageNum" v-model:page-size="pageSize" :total="totalData" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import tableAciton from '@/components/public/tableAciton.vue';
  import userTable from '@/components/user/userTable.vue';
  import userList from '@/components/user/userList.vue';
  import permissionEditor from '@/components/permission/permissionEditor.vue';
  import { onMounted, ref, watch } from 'vue';
  import { useCounterStore } from '@/stores/counter';
  import { storeToRefs } from 'pinia';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { desEncrypt } from '@/utils/des';
  import service from '@/axios';
  const counterStore = useCounterStore()
  const { showPagestion } = storeToRefs(counterStore)
  const components: any = {
    userTable,
    userList
  }
  const componentStr = ref('userTable')
  const componentName = ref<any>(userTable)


  //分页
  const pageNum = ref<number>(1)
  const pageSize = ref<number>(10)
  const totalData = ref<number>(0)
  watch(() => pageNum.value, () => {
    getUserList()
  })

  //新增权限
  const showPermissionEditor = ref<boolean>(false)
  watch(() => showPermissionEditor.value, (newV) => {
    if (!newV) {
      setTimeout(() => {
        permissionInfo.value = ''
        getUserList()
      }, 500)
    }
  })
  const addPermission = () => {
    console.log('新增权限');
    showPermissionEditor.value = true
  }

  //编辑权限
  const permissionInfo = ref<any>()
  const editorPermission = (row: any) => {
    console.log('编辑权限', row);
    permissionInfo.value = row
    showPermissionEditor.value = true
  }

  //删除权限
  const deletePermissionFn = async (id: number) => {
    try {
      const res = await service.post(`/system/permission/del/${id}`)

      console.log('删除', res);
      if (res.data.code === 200) {
        ElMessage.success('删除成功')
        setTimeout(() => {
          getUserList()
        }, 500)
      } else {
        ElMessage.error(res.data.msg)
      }
    } catch (err) {

    }
  }
  const deletePermission = (row: any) => {
    console.log('删除权限', row);
    ElMessageBox.confirm('是否删除该权限？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then((res) => {
      console.log('删除权限', res);
      deletePermissionFn(row.id)
    }).catch(err => {
      console.log('删除权限', err);
    })
  }

  // 定义权限类型
  interface Permission {
    id: number           // 编号
    type: string         // 权限类型
    subType: string      // 权限小类
    permissionName: string         // 权限名
    permissionCode: string         // 权限码
    [key: string]: any
  }
  const userNote: any = {
    id: '编号',
    permissionName: '权限名',
    permissionCode: '权限码',
    type: '权限类型',
    subType: '权限小类',



  }
  // 生成权限数据
  const permissionData = ref<Permission[]>([

  ])
  interface filterParams {
    note: string
    isShow: boolean
    key: string
  }
  const filterParams = ref<filterParams[]>()
  const getUserList = async () => {
    try {

      const params = {
        timestamp: Date.now(),
        pageNum: pageNum.value,
        pageSize: pageSize.value,
      }
      const enData = desEncrypt(JSON.stringify(params))
      const res = await service.get('/system/permission/list', {
        params: {
          enData
        }
      })
      console.log('获取权限列表', res);
      permissionData.value = res.data.rows
      permissionData.value.forEach((item) => {
        item.type = item.permissionType?.note
        item.subType = item.permissionType1?.note
      })
      totalData.value = res.data.total
      const keys = Object.keys(userNote)
      filterParams.value = keys.map((item) => {
        return {
          note: userNote[item],
          isShow: true,
          key: item
        }
      })
      console.log('filterParams', filterParams.value);
    } catch (err) {
      console.log('获取权限列表失败', err);
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

      div {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }

    .content-card {
      height: calc(100vh - 220px);

      .pagesBox {
        margin-top: 30px;
      }
    }
  }
</style>