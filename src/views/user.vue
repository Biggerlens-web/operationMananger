<template>
  <div class="view">
    <el-card class="filter-card">
      <div>
        <el-button type="primary"> <el-icon>
            <Plus />
          </el-icon>新增用户</el-button>
        <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
          @changeView="changeView" />
      </div>


    </el-card>
    <el-card class="content-card">
      <Transition enter-active-class="animate__animated animate__slideInLeft"
        leave-active-class="animate__animated animate__slideOutLeft">
        <component :is="componentName" :filterParams="filterParams" :tableData="userData"></component>
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
  // 定义用户类型
  interface User {
    id: number                // 编号
    name: string              // 名称
    avatar: string            // 状态头像
    username: string          // 用户名
    gender: '男' | '女' | '保密'       // 性别
    phone: string             // 电话
    email: string             // 邮箱
    remark: string            // 备注
    loginCount: number        // 登录次数
    lastLoginIp: string       // 最近一次登录ip
    lastLoginTime: string     // 最近一次登录时间
  }
  const userNote: any = {
    id: '编号',
    name: '名称',
    avatar: '状态头像',
    username: '用户名',
    gender: '性别',
    phone: '电话',
    email: '邮箱',
    remark: '备注',
    loginCount: '登录次数',
    lastLoginIp: '最近一次登录ip',
    lastLoginTime: '最近一次登录时间'
  }
  // 生成用户数据
  const userData = ref<User[]>([
    {
      id: 1001,
      name: '张三',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      username: 'zhangsan',
      gender: '男',
      phone: '13812345678',
      email: 'zhangsan@example.com',
      remark: '系统管理员，拥有所有权限',
      loginCount: 158,
      lastLoginIp: '192.168.1.100',
      lastLoginTime: '2023-06-15 14:30:45'
    },
    {
      id: 1002,
      name: '李四',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      username: 'lisi',
      gender: '女',
      phone: '13987654321',
      email: 'lisi@example.com',
      remark: '技术部门主管',
      loginCount: 86,
      lastLoginIp: '192.168.1.101',
      lastLoginTime: '2023-06-14 09:15:22'
    },
    {
      id: 1003,
      name: '王五',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      username: 'wangwu',
      gender: '男',
      phone: '13567891234',
      email: 'wangwu@example.com',
      remark: '产品经理，负责产品规划',
      loginCount: 120,
      lastLoginIp: '192.168.1.102',
      lastLoginTime: '2023-05-30 16:42:10'
    },
    {
      id: 1004,
      name: '赵六',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      username: 'zhaoliu',
      gender: '男',
      phone: '13612378945',
      email: 'zhaoliu@example.com',
      remark: 'UI设计师',
      loginCount: 65,
      lastLoginIp: '192.168.1.103',
      lastLoginTime: '2023-06-15 11:20:35'
    },
    {
      id: 1005,
      name: '钱七',
      avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
      username: 'qianqi',
      gender: '女',
      phone: '13567891234',
      email: 'qianqi@example.com',
      remark: '测试工程师，负责系统测试',
      loginCount: 92,
      lastLoginIp: '192.168.1.104',
      lastLoginTime: '2023-06-10 13:45:50'
    },
    {
      id: 1006,
      name: '孙八',
      avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
      username: 'sunba',
      gender: '男',
      phone: '13612378945',
      email: 'sunba@example.com',
      remark: '运维工程师，负责系统维护',
      loginCount: 210,
      lastLoginIp: '192.168.1.105',
      lastLoginTime: '2023-06-14 17:30:12'
    },
    {
      id: 1007,
      name: '周九',
      avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
      username: 'zhoujiu',
      gender: '女',
      phone: '13898765432',
      email: 'zhoujiu@example.com',
      remark: '人力资源专员',
      loginCount: 45,
      lastLoginIp: '192.168.1.106',
      lastLoginTime: '2023-06-13 09:05:18'
    },
    {
      id: 1008,
      name: '吴十',
      avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
      username: 'wushi',
      gender: '男',
      phone: '13898765432',
      email: 'wushi@example.com',
      remark: '财务主管',
      loginCount: 78,
      lastLoginIp: '192.168.1.107',
      lastLoginTime: '2023-05-25 14:20:30'
    },
    {
      id: 1009,
      name: '郑十一',
      avatar: 'https://randomuser.me/api/portraits/women/9.jpg',
      username: 'zhengshiyi',
      gender: '女',
      phone: '13756781234',
      email: 'zhengshiyi@example.com',
      remark: '市场营销专员',
      loginCount: 36,
      lastLoginIp: '192.168.1.108',
      lastLoginTime: '2023-06-15 10:15:40'
    },
    {
      id: 1010,
      name: '王十二',
      avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
      username: 'wangshier',
      gender: '男',
      phone: '13756781234',
      email: 'wangshier@example.com',
      remark: '销售经理，负责华南区域',
      loginCount: 145,
      lastLoginIp: '192.168.1.109',
      lastLoginTime: '2023-06-14 16:30:25'
    },
    {
      id: 1011,
      name: '刘十三',
      avatar: 'https://randomuser.me/api/portraits/women/11.jpg',
      username: 'liushisan',
      gender: '女',
      phone: '13923456789',
      email: 'liushisan@example.com',
      remark: '客户服务代表',
      loginCount: 68,
      lastLoginIp: '192.168.1.110',
      lastLoginTime: '2023-06-12 11:45:30'
    },
    {
      id: 1012,
      name: '陈十四',
      avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
      username: 'chenshisi',
      gender: '男',
      phone: '13834567890',
      email: 'chenshisi@example.com',
      remark: '前端开发工程师',
      loginCount: 112,
      lastLoginIp: '192.168.1.111',
      lastLoginTime: '2023-06-15 08:20:15'
    },
    {
      id: 1013,
      name: '杨十五',
      avatar: 'https://randomuser.me/api/portraits/women/13.jpg',
      username: 'yangshiwu',
      gender: '女',
      phone: '13745678901',
      email: 'yangshiwu@example.com',
      remark: '后端开发工程师',
      loginCount: 95,
      lastLoginIp: '192.168.1.112',
      lastLoginTime: '2023-06-14 14:10:25'
    },
    {
      id: 1014,
      name: '黄十六',
      avatar: 'https://randomuser.me/api/portraits/men/14.jpg',
      username: 'huangshiliu',
      gender: '男',
      phone: '13656789012',
      email: 'huangshiliu@example.com',
      remark: '数据分析师',
      loginCount: 73,
      lastLoginIp: '192.168.1.113',
      lastLoginTime: '2023-06-13 16:35:40'
    },
    {
      id: 1015,
      name: '赵十七',
      avatar: 'https://randomuser.me/api/portraits/women/15.jpg',
      username: 'zhaoshiqi',
      gender: '女',
      phone: '13567890123',
      email: 'zhaoshiqi@example.com',
      remark: '项目协调员',
      loginCount: 42,
      lastLoginIp: '192.168.1.114',
      lastLoginTime: '2023-06-11 09:50:20'
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
    const dataItem = userData.value[0]
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