<template>
  <div class="view">
    <RoleEditor v-model:dialog-visible="showRoleEditor" :roleInfo="roleInfo" />
    <AssginRole v-model:dialog-visible="isAssginRole" :roleId="roleId" />
    <el-card class="filter-card">
      <div>
        <el-button type="primary" @click="addRole"> <el-icon>
            <Plus />
          </el-icon>新增角色</el-button>
        <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
          @changeView="changeView" />
      </div>


    </el-card>
    <el-card class="content-card">
      <Transition enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut" mode="out-in">
        <component :is="componentName" :filterParams="filterParams" :tableData="roleData" :roleList="true"
          @editor="editorRole" @delete="deleteRole" @assginRole="assginRole"></component>
      </Transition>

      <el-pagination v-show="showPagestion" class="pagesBox" background v-model:current-page="pageNum"
        v-model:page-size="pageSize" layout="prev, pager, next" :total="totalData" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import tableAciton from '@/components/public/tableAciton.vue';
  import userTable from '@/components/user/userTable.vue';
  import userList from '@/components/user/userList.vue';
  import RoleEditor from '@/components/role/RoleEditor.vue';
  import AssginRole from '@/components/role/AssginRole.vue';
  import { onMounted, ref, watch } from 'vue';
  import { useCounterStore } from '@/stores/counter';
  import { storeToRefs } from 'pinia';
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


  //分页数据
  const pageSize = ref<number>(10)
  const pageNum = ref<number>(1)
  const totalData = ref<number>(0)

  watch(() => pageNum.value, (newV) => {
    if (newV) {
      getUserList()
    }
  })

  //新增角色
  const showRoleEditor = ref<boolean>(false)
  watch(() => showRoleEditor.value, (newV) => {
    if (!newV) {
      getUserList()
    }
  })
  const addRole = () => {
    console.log('新增角色');
    showRoleEditor.value = true
  }

  //编辑角色
  const roleInfo = ref<any>()
  const editorRole = (row: any) => {
    console.log('编辑角色', row);
    roleInfo.value = row
    showRoleEditor.value = true
  }
  //删除角色
  const deleteRoleFn = async (id: number) => {
    try {
      showLoading.value = true
      const res = await service.post(`/system/role/del/${id}`)
      console.log('删除角色', res);
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
  const deleteRole = (row: any) => {
    ElMessageBox.confirm(
      '此操作将永久删除该角色, 是否继续?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(res => {

      deleteRoleFn(row.id)
    }).catch(err => {
      console.log('删除角色', err);
    })
  }

  //分配权限
  const isAssginRole = ref<boolean>(false)
  const roleId = ref<number | string>('')
  const assginRole = (row: any) => {
    console.log('分配权限', row);
    roleId.value = row.id
    isAssginRole.value = true
  }
  interface Role {
    id: number        // 编号
    name: string      // 角色名
    roleCode: string      // 角色码
    mark: string    // 备注
    [key: string]: any
  }
  const userNote: any = {
    id: '编号',
    name: '角色名',
    roleCode: '角色码',
    mark: '备注',

  }
  // 生成角色数据
  const roleData = ref<Role[]>([

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
      showLoading.value = true
      const res = await service.get('/system/role/list', {
        params: {
          enData
        }
      })
      console.log('获取用户列表', res);
      roleData.value = res.data.rows
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
      console.log('获取用户列表失败', err);
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