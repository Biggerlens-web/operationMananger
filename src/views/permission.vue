<template>
  <div class="view">
    <permissionEditor v-model:dialog-visible="showPermissionEditor" />
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
      <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next" :total="1000" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import tableAciton from '@/components/public/tableAciton.vue';
  import userTable from '@/components/user/userTable.vue';
  import userList from '@/components/user/userList.vue';
  import permissionEditor from '@/components/permission/permissionEditor.vue';
  import { onMounted, ref } from 'vue';
  import { useCounterStore } from '@/stores/counter';
  import { storeToRefs } from 'pinia';
  import { ElMessageBox } from 'element-plus';
  const counterStore = useCounterStore()
  const { showPagestion } = storeToRefs(counterStore)
  const components: any = {
    userTable,
    userList
  }
  const componentStr = ref('userTable')
  const componentName = ref<any>(userTable)


  //新增权限
  const showPermissionEditor = ref<boolean>(false)
  const addPermission = () => {
    console.log('新增权限');
    showPermissionEditor.value = true
  }

  //编辑权限
  const editorPermission = (row: any) => {
    console.log('编辑权限', row);
    showPermissionEditor.value = true
  }

  //删除权限
  const deletePermission = (row: any) => {
    console.log('删除权限', row);
    ElMessageBox.confirm('是否删除该权限？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then((res) => {
      console.log('删除权限', res);
    }).catch(err => {
      console.log('删除权限', err);
    })
  }

  // 定义权限类型
  interface Permission {
    id: number           // 编号
    type: string         // 权限类型
    subType: string      // 权限小类
    name: string         // 权限名
    code: string         // 权限码
  }
  const userNote: any = {
    id: '编号',
    type: '权限类型',
    subType: '权限小类',
    name: '权限名',
    code: '权限码',

  }
  // 生成权限数据
  const permissionData = ref<Permission[]>([
    {
      id: 10001,
      type: '系统管理',
      subType: '用户管理',
      name: '查看用户',
      code: 'system:user:view'
    },
    {
      id: 10002,
      type: '系统管理',
      subType: '用户管理',
      name: '创建用户',
      code: 'system:user:create'
    },
    {
      id: 10003,
      type: '系统管理',
      subType: '用户管理',
      name: '编辑用户',
      code: 'system:user:edit'
    },
    {
      id: 10004,
      type: '系统管理',
      subType: '用户管理',
      name: '删除用户',
      code: 'system:user:delete'
    },
    {
      id: 10005,
      type: '系统管理',
      subType: '角色管理',
      name: '查看角色',
      code: 'system:role:view'
    },
    {
      id: 10006,
      type: '系统管理',
      subType: '角色管理',
      name: '创建角色',
      code: 'system:role:create'
    },
    {
      id: 10007,
      type: '系统管理',
      subType: '角色管理',
      name: '编辑角色',
      code: 'system:role:edit'
    },
    {
      id: 10008,
      type: '系统管理',
      subType: '角色管理',
      name: '删除角色',
      code: 'system:role:delete'
    },
    {
      id: 10009,
      type: '系统管理',
      subType: '权限管理',
      name: '查看权限',
      code: 'system:permission:view'
    },
    {
      id: 10010,
      type: '系统管理',
      subType: '权限管理',
      name: '分配权限',
      code: 'system:permission:assign'
    },
    {
      id: 10011,
      type: '系统管理',
      subType: '菜单管理',
      name: '查看菜单',
      code: 'system:menu:view'
    },
    {
      id: 10012,
      type: '系统管理',
      subType: '菜单管理',
      name: '创建菜单',
      code: 'system:menu:create'
    },
    {
      id: 10013,
      type: '系统管理',
      subType: '菜单管理',
      name: '编辑菜单',
      code: 'system:menu:edit'
    },
    {
      id: 10014,
      type: '系统管理',
      subType: '菜单管理',
      name: '删除菜单',
      code: 'system:menu:delete'
    },
    {
      id: 10015,
      type: '系统管理',
      subType: '部门管理',
      name: '查看部门',
      code: 'system:dept:view'
    },
    {
      id: 10016,
      type: '系统管理',
      subType: '部门管理',
      name: '创建部门',
      code: 'system:dept:create'
    },
    {
      id: 10017,
      type: '系统管理',
      subType: '部门管理',
      name: '编辑部门',
      code: 'system:dept:edit'
    },
    {
      id: 10018,
      type: '系统管理',
      subType: '部门管理',
      name: '删除部门',
      code: 'system:dept:delete'
    },
    {
      id: 10019,
      type: '系统管理',
      subType: '日志管理',
      name: '查看操作日志',
      code: 'system:log:operation:view'
    },
    {
      id: 10020,
      type: '系统管理',
      subType: '日志管理',
      name: '查看登录日志',
      code: 'system:log:login:view'
    },
    {
      id: 10021,
      type: '内容管理',
      subType: '文章管理',
      name: '查看文章',
      code: 'content:article:view'
    },
    {
      id: 10022,
      type: '内容管理',
      subType: '文章管理',
      name: '创建文章',
      code: 'content:article:create'
    },
    {
      id: 10023,
      type: '内容管理',
      subType: '文章管理',
      name: '编辑文章',
      code: 'content:article:edit'
    },
    {
      id: 10024,
      type: '内容管理',
      subType: '文章管理',
      name: '删除文章',
      code: 'content:article:delete'
    },
    {
      id: 10025,
      type: '内容管理',
      subType: '文章管理',
      name: '发布文章',
      code: 'content:article:publish'
    },
    {
      id: 10026,
      type: '内容管理',
      subType: '分类管理',
      name: '查看分类',
      code: 'content:category:view'
    },
    {
      id: 10027,
      type: '内容管理',
      subType: '分类管理',
      name: '创建分类',
      code: 'content:category:create'
    },
    {
      id: 10028,
      type: '内容管理',
      subType: '分类管理',
      name: '编辑分类',
      code: 'content:category:edit'
    },
    {
      id: 10029,
      type: '内容管理',
      subType: '分类管理',
      name: '删除分类',
      code: 'content:category:delete'
    },
    {
      id: 10030,
      type: '内容管理',
      subType: '标签管理',
      name: '查看标签',
      code: 'content:tag:view'
    },
    {
      id: 10031,
      type: '内容管理',
      subType: '标签管理',
      name: '创建标签',
      code: 'content:tag:create'
    },
    {
      id: 10032,
      type: '内容管理',
      subType: '标签管理',
      name: '编辑标签',
      code: 'content:tag:edit'
    },
    {
      id: 10033,
      type: '内容管理',
      subType: '标签管理',
      name: '删除标签',
      code: 'content:tag:delete'
    },
    {
      id: 10034,
      type: '内容管理',
      subType: '评论管理',
      name: '查看评论',
      code: 'content:comment:view'
    },
    {
      id: 10035,
      type: '内容管理',
      subType: '评论管理',
      name: '回复评论',
      code: 'content:comment:reply'
    },
    {
      id: 10036,
      type: '内容管理',
      subType: '评论管理',
      name: '审核评论',
      code: 'content:comment:audit'
    },
    {
      id: 10037,
      type: '内容管理',
      subType: '评论管理',
      name: '删除评论',
      code: 'content:comment:delete'
    },
    {
      id: 10038,
      type: '业务管理',
      subType: '订单管理',
      name: '查看订单',
      code: 'business:order:view'
    },
    {
      id: 10039,
      type: '业务管理',
      subType: '订单管理',
      name: '创建订单',
      code: 'business:order:create'
    },
    {
      id: 10040,
      type: '业务管理',
      subType: '订单管理',
      name: '编辑订单',
      code: 'business:order:edit'
    },
    {
      id: 10041,
      type: '业务管理',
      subType: '订单管理',
      name: '取消订单',
      code: 'business:order:cancel'
    },
    {
      id: 10042,
      type: '业务管理',
      subType: '订单管理',
      name: '删除订单',
      code: 'business:order:delete'
    },
    {
      id: 10043,
      type: '业务管理',
      subType: '产品管理',
      name: '查看产品',
      code: 'business:product:view'
    },
    {
      id: 10044,
      type: '业务管理',
      subType: '产品管理',
      name: '创建产品',
      code: 'business:product:create'
    },
    {
      id: 10045,
      type: '业务管理',
      subType: '产品管理',
      name: '编辑产品',
      code: 'business:product:edit'
    },
    {
      id: 10046,
      type: '业务管理',
      subType: '产品管理',
      name: '上架产品',
      code: 'business:product:publish'
    },
    {
      id: 10047,
      type: '业务管理',
      subType: '产品管理',
      name: '下架产品',
      code: 'business:product:unpublish'
    },
    {
      id: 10048,
      type: '业务管理',
      subType: '产品管理',
      name: '删除产品',
      code: 'business:product:delete'
    },
    {
      id: 10049,
      type: '业务管理',
      subType: '客户管理',
      name: '查看客户',
      code: 'business:customer:view'
    },
    {
      id: 10050,
      type: '业务管理',
      subType: '客户管理',
      name: '创建客户',
      code: 'business:customer:create'
    },
    {
      id: 10051,
      type: '业务管理',
      subType: '客户管理',
      name: '编辑客户',
      code: 'business:customer:edit'
    },
    {
      id: 10052,
      type: '业务管理',
      subType: '客户管理',
      name: '删除客户',
      code: 'business:customer:delete'
    },
    {
      id: 10053,
      type: '财务管理',
      subType: '收入管理',
      name: '查看收入',
      code: 'finance:income:view'
    },
    {
      id: 10054,
      type: '财务管理',
      subType: '收入管理',
      name: '录入收入',
      code: 'finance:income:create'
    },
    {
      id: 10055,
      type: '财务管理',
      subType: '收入管理',
      name: '编辑收入',
      code: 'finance:income:edit'
    },
    {
      id: 10056,
      type: '财务管理',
      subType: '收入管理',
      name: '删除收入',
      code: 'finance:income:delete'
    },
    {
      id: 10057,
      type: '财务管理',
      subType: '支出管理',
      name: '查看支出',
      code: 'finance:expense:view'
    },
    {
      id: 10058,
      type: '财务管理',
      subType: '支出管理',
      name: '录入支出',
      code: 'finance:expense:create'
    },
    {
      id: 10059,
      type: '财务管理',
      subType: '支出管理',
      name: '编辑支出',
      code: 'finance:expense:edit'
    },
    {
      id: 10060,
      type: '财务管理',
      subType: '支出管理',
      name: '删除支出',
      code: 'finance:expense:delete'
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
    const dataItem = permissionData.value[0]
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