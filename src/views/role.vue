<template>
  <div class="view">
    <el-card class="filter-card">
      <div>
        <el-button type="primary"> <el-icon>
            <Plus />
          </el-icon>新增角色</el-button>
        <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
          @changeView="changeView" />
      </div>


    </el-card>
    <el-card class="content-card">
      <Transition enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut" mode="out-in">
        <component :is="componentName" :filterParams="filterParams" :tableData="roleData"></component>
      </Transition>

      <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next" :total="1000" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import tableAciton from '@/components/public/tableAciton.vue';
  import userTable from '@/components/user/userTable.vue';
  import userList from '@/components/user/userList.vue';
  import { onMounted, ref } from 'vue';
  import { useCounterStore } from '@/stores/counter';
  import { storeToRefs } from 'pinia';
  const counterStore = useCounterStore()
  const { showPagestion } = storeToRefs(counterStore)
  const components: any = {
    userTable,
    userList
  }
  const componentStr = ref('userTable')
  const componentName = ref<any>(userTable)
  interface Role {
    id: number        // 编号
    name: string      // 角色名
    code: string      // 角色码
    remark: string    // 备注
  }
  const userNote: any = {
    id: '编号',
    name: '角色名',
    code: '角色码',
    remark: '备注',

  }
  // 生成角色数据
  const roleData = ref<Role[]>([
    {
      id: 1001,
      name: '超级管理员',
      code: 'SUPER_ADMIN',
      remark: '拥有系统所有权限，可以管理所有模块'
    },
    {
      id: 1002,
      name: '管理员',
      code: 'ADMIN',
      remark: '拥有大部分管理权限，无法管理系统配置'
    },
    {
      id: 1003,
      name: '开发人员',
      code: 'DEVELOPER',
      remark: '拥有开发相关模块的权限，可以访问开发工具和API文档'
    },
    {
      id: 1004,
      name: '测试人员',
      code: 'TESTER',
      remark: '拥有测试相关模块的权限，可以提交bug和测试报告'
    },
    {
      id: 1005,
      name: '运维人员',
      code: 'OPS',
      remark: '拥有系统运维权限，可以查看系统日志和性能监控'
    },
    {
      id: 1006,
      name: '普通用户',
      code: 'USER',
      remark: '基础用户权限，只能访问公共模块和个人信息'
    },
    {
      id: 1007,
      name: '访客',
      code: 'GUEST',
      remark: '最低权限，只能浏览公开内容，无法修改任何数据'
    },
    {
      id: 1008,
      name: '财务人员',
      code: 'FINANCE',
      remark: '拥有财务模块的操作权限，可以查看和管理财务数据'
    },
    {
      id: 1009,
      name: '人事专员',
      code: 'HR',
      remark: '拥有人事模块的操作权限，可以管理员工信息和组织架构'
    },
    {
      id: 1010,
      name: '销售经理',
      code: 'SALES_MANAGER',
      remark: '拥有销售模块的管理权限，可以查看所有销售数据和报表'
    },
    {
      id: 1011,
      name: '销售人员',
      code: 'SALES',
      remark: '拥有销售模块的基本权限，只能查看和管理自己的销售数据'
    },
    {
      id: 1012,
      name: '客服主管',
      code: 'CUSTOMER_SERVICE_MANAGER',
      remark: '拥有客服模块的管理权限，可以处理客户投诉和分配工单'
    },
    {
      id: 1013,
      name: '客服专员',
      code: 'CUSTOMER_SERVICE',
      remark: '拥有客服模块的基本权限，负责处理客户咨询和基础问题'
    },
    {
      id: 1014,
      name: '内容编辑',
      code: 'CONTENT_EDITOR',
      remark: '拥有内容管理模块的权限，可以编辑和发布内容'
    },
    {
      id: 1015,
      name: '数据分析师',
      code: 'DATA_ANALYST',
      remark: '拥有数据分析模块的权限，可以查看和导出各类数据报表'
    }
  ])
  interface filterParams {
    note: string
    isShow: boolean
    key: string
  }
  const filterParams = ref<filterParams[]>()
  const getUserList = async () => {
    console.log('获取用户列表');
    const dataItem = roleData.value[0]
    const keys = Object.keys(dataItem)
    filterParams.value = keys.map((item) => {
      return {
        note: userNote[item],
        isShow: true,
        key: item
      }
    })
    console.log('filterParams', filterParams.value);
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