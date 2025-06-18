<template>
  <div class="view">
    <userEditor v-model:dialog-visible="showEditor" :userInfo="userInfo" />
    <roleEditor v-model:dialog-visible="showRole" />
    <el-card class="filter-card">
      <div>
        <el-button type="primary" @click="addUser"> <el-icon>
            <Plus />
          </el-icon>新增用户</el-button>
        <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
          @changeView="changeView" />
      </div>


    </el-card>
    <el-card class="content-card">
      <Transition enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut" mode="out-in">
        <component :is="componentName" :filterParams="filterParams" :tableData="userData" @editor="editorUser"
          @delete="deleteUser" :userList="true" @rolesEditor="rolesEditor" @ban="banUser"></component>
      </Transition>

      <el-pagination v-show="showPagestion" class="pagesBox" v-model:current-page="currentPage"
        v-model:page-size="pageSize" background layout="prev, pager, next" :total="totalData" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import tableAciton from '@/components/public/tableAciton.vue';
  import userTable from '@/components/user/userTable.vue';
  import userList from '@/components/user/userList.vue';
  import userEditor from '@/components/user/userEditor.vue';
  import roleEditor from '@/components/user/roleEditor.vue';
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


  //当前页码
  const currentPage = ref<number>(1)

  watch(() => currentPage.value, () => {
    getUserList()
  })
  //每页条数
  const pageSize = ref<number>(10)
  //总条数
  const totalData = ref<number>(0)
  //编辑用户
  const showEditor = ref<boolean>(false)
  watch(() => showEditor.value, (newV) => {
    if (!newV) {
      getUserList()
      userInfo.value = ''
    }
  })
  const addUser = () => {
    showEditor.value = true
  }

  //编辑用户
  const userInfo = ref<any>()
  const editorUser = (item: any) => {
    console.log('父组件编辑', item);
    userInfo.value = item
    showEditor.value = true
  }


  //删除用户
  const deleteUserFn = async (item: any) => {
    try {
      const res = await service.post(`/system/user/del/${item.id}`)

      console.log('删除用户', res);
      if (res.data.code == 200) {
        ElMessage.success('删除成功')
        getUserList()
      } else {
        ElMessage.error(res.data.msg)
      }
    } catch (err) {
      console.log('删除失败', err);
    }
  }
  const deleteUser = (item: any) => {
    console.log('父组件删除', item);
    ElMessageBox.confirm('确定删除吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then((res) => {
      console.log('删除', res)
      deleteUserFn(item)
    }).catch(err => {
      console.log('取消', err)
    })
  }

  //角色分配
  const showRole = ref<boolean>(false)
  const rolesEditor = (item: any) => {
    console.log('父组件分配角色', item);
    showRole.value = true
  }


  //禁用用户
  const banUser = async (item: any) => {
    console.log('父组件禁用用户', item);
    try {
      const params = {
        timestamp: Date.now(),
        id: item.id,

      }
      const enData = desEncrypt(JSON.stringify(params))
      const res = await service.post('/system/user/updateStatus', {
        enData
      })
      if (res.data.code === 200) {
        ElMessage.success('禁用成功')
        getUserList()
      } else {
        ElMessage.error(res.data.msg)
      }
    } catch (err) {
      console.log('禁用/启动失败', err);
    }

  }

  // 定义用户类型
  interface User {
    id: number                // 编号
    name: string              // 名称
    avatar: string            // 状态头像
    username: string          // 用户名
    gender: any      // 性别
    phone: string             // 电话
    email: string             // 邮箱
    description: string            // 备注
    loginNum: number        // 登录次数
    loginIp: string       // 最近一次登录ip
    loginTime: string     // 最近一次登录时间
  }
  const userNote: any = {
    id: '编号',
    name: '名称',
    avatar: '状态头像',
    username: '用户名',
    gender: '性别',
    phone: '电话',
    email: '邮箱',

    description: '备注',
    loginNum: '登录次数',
    loginIp: '最近一次登录ip',
    loginTime: '最近一次登录时间'
  }
  // 生成用户数据
  const userData = ref<User[]>([

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
        pageNum: currentPage.value,
        pageSize: pageSize.value,
      }
      const enData = desEncrypt(JSON.stringify(params))

      const res = await service.get('/system/user/list', {
        params: {
          enData
        }
      })

      totalData.value = res.data.total




      userData.value = res.data.rows
      userData.value.forEach((item: Record<string, any>) => {

        if (item.gender && typeof item.gender === 'object' && Object.prototype.hasOwnProperty.call(item.gender, 'note')) {
          item.gender = item.gender.note;
        }


      });


      console.log('获取用户列表', res);
      // const dataItem = userData.value[0]
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