<template>
  <div class="view">
    <menuEditor v-model:dialog-visible="showEditor" />
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
              <el-option label="目录" value="目录" />
              <el-option label="菜单" value="菜单" />
              <el-option label="按钮" value="按钮" />
            </el-select>
          </div>
          <div class="filter-item">
            <el-input v-model="searchParams.menuUrl" placeholder="输入菜单链接查询" clearable prefix-icon="Link" />
          </div>
          <div class="filter-item">
            <el-select v-model="searchParams.menuUrlType" placeholder="请选择菜单链接类型" clearable>
              <el-option label="内部路由" value="内部路由" />
              <el-option label="外部链接" value="外部链接" />
              <el-option label="iframe" value="iframe" />
            </el-select>
          </div>
          <div class="filter-item">
            <el-select v-model="searchParams.parentId" placeholder="请选择上级菜单" clearable>
              <el-option label="顶级菜单" value="0" />
              <el-option label="菜单1" value="1" />
              <el-option label="菜单2" value="2" />
            </el-select>
          </div>
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

      <el-pagination v-show="showPagestion" v-model:current-page="currentPage" :page-size="pageSize" class="pagesBox"
        background layout="prev, pager, next" :total="1000" />
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
  import menuEditor from '@/components/menu/menuEditor.vue';
  import { ElMessageBox } from 'element-plus';
  import service from '@/axios';
  import { desEncrypt } from '@/utils/des';
  const counterStore = useCounterStore()
  const { showPagestion } = storeToRefs(counterStore)
  const components: any = {
    userTable,
    userList
  }
  const componentStr = ref('userTable')
  const componentName = ref<any>(userTable)


  const showEditor = ref<boolean>(false)

  //页码
  const currentPage = ref<number>(1)
  //最大条数
  const pageSize = ref<number>(20)


  //新增菜单
  const addMenu = () => {
    showEditor.value = true
  }


  //编辑菜单
  const editorMenu = (item: any) => {
    console.log('编辑菜单父组件', item)
    showEditor.value = true
  }


  //删除菜单
  const deleteMenu = (item: any) => {
    console.log('删除菜单父组件', item);

    ElMessageBox.confirm('确定删除该菜单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(res => {
      console.log('删除菜单', res);
    }).catch(err => {
      console.log('删除菜单', err);
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
    text: string         // 菜单文本
    type: string         // 菜单类型（目录、菜单、按钮）
    identify: string     // 菜单标识
    url: string          // 菜单链接
    urlType: string      // 菜单链接类型（内部路由、外部链接、iframe）
    parentId: number     // 上级菜单ID（0表示顶级菜单）
    description: string  // 说明
  }
  const userNote: any = {
    id: '编号',
    text: '菜单文本',
    type: '菜单类型',
    identify: '菜单标识',
    url: '菜单链接',
    urlType: '菜单链接类型',
    parentId: '上级菜单ID',
    description: '说明',

  }
  // 生成菜单数据
  const menuData = ref<Menu[]>([
    // 顶级菜单
    {
      id: 1,
      text: '系统管理',
      type: '目录',
      identify: 'system',
      url: '/system',
      urlType: '内部路由',
      parentId: 0,
      description: '系统管理模块，包含用户、角色、权限等管理功能'
    },
    {
      id: 2,
      text: '内容管理',
      type: '目录',
      identify: 'content',
      url: '/content',
      urlType: '内部路由',
      parentId: 0,
      description: '内容管理模块，包含文章、分类、标签等管理功能'
    },
    {
      id: 3,
      text: '业务管理',
      type: '目录',
      identify: 'business',
      url: '/business',
      urlType: '内部路由',
      parentId: 0,
      description: '业务管理模块，包含订单、产品、客户等管理功能'
    },
    {
      id: 4,
      text: '数据统计',
      type: '目录',
      identify: 'statistics',
      url: '/statistics',
      urlType: '内部路由',
      parentId: 0,
      description: '数据统计模块，包含各类数据报表和分析功能'
    },
    {
      id: 5,
      text: '系统工具',
      type: '目录',
      identify: 'tools',
      url: '/tools',
      urlType: '内部路由',
      parentId: 0,
      description: '系统工具模块，包含代码生成、系统监控等功能'
    },

    // 系统管理子菜单
    {
      id: 101,
      text: '用户管理',
      type: '菜单',
      identify: 'system:user',
      url: '/system/user',
      urlType: '内部路由',
      parentId: 1,
      description: '用户信息管理，包含用户的增删改查操作'
    },
    {
      id: 102,
      text: '角色管理',
      type: '菜单',
      identify: 'system:role',
      url: '/system/role',
      urlType: '内部路由',
      parentId: 1,
      description: '角色信息管理，包含角色的增删改查和权限分配'
    },
    {
      id: 103,
      text: '菜单管理',
      type: '菜单',
      identify: 'system:menu',
      url: '/system/menu',
      urlType: '内部路由',
      parentId: 1,
      description: '菜单信息管理，包含菜单的增删改查操作'
    },
    {
      id: 104,
      text: '部门管理',
      type: '菜单',
      identify: 'system:dept',
      url: '/system/dept',
      urlType: '内部路由',
      parentId: 1,
      description: '部门信息管理，包含部门的增删改查操作'
    },
    {
      id: 105,
      text: '岗位管理',
      type: '菜单',
      identify: 'system:post',
      url: '/system/post',
      urlType: '内部路由',
      parentId: 1,
      description: '岗位信息管理，包含岗位的增删改查操作'
    },
    {
      id: 106,
      text: '字典管理',
      type: '菜单',
      identify: 'system:dict',
      url: '/system/dict',
      urlType: '内部路由',
      parentId: 1,
      description: '字典信息管理，包含字典类型和字典数据的维护'
    },
    {
      id: 107,
      text: '参数设置',
      type: '菜单',
      identify: 'system:config',
      url: '/system/config',
      urlType: '内部路由',
      parentId: 1,
      description: '系统参数配置，包含参数的增删改查操作'
    },
    {
      id: 108,
      text: '通知公告',
      type: '菜单',
      identify: 'system:notice',
      url: '/system/notice',
      urlType: '内部路由',
      parentId: 1,
      description: '通知公告管理，包含公告的增删改查操作'
    },
    {
      id: 109,
      text: '日志管理',
      type: '菜单',
      identify: 'system:log',
      url: '/system/log',
      urlType: '内部路由',
      parentId: 1,
      description: '系统日志管理，包含操作日志、登录日志等'
    },

    // 内容管理子菜单
    {
      id: 201,
      text: '文章管理',
      type: '菜单',
      identify: 'content:article',
      url: '/content/article',
      urlType: '内部路由',
      parentId: 2,
      description: '文章信息管理，包含文章的增删改查和发布操作'
    },
    {
      id: 202,
      text: '分类管理',
      type: '菜单',
      identify: 'content:category',
      url: '/content/category',
      urlType: '内部路由',
      parentId: 2,
      description: '文章分类管理，包含分类的增删改查操作'
    },
    {
      id: 203,
      text: '标签管理',
      type: '菜单',
      identify: 'content:tag',
      url: '/content/tag',
      urlType: '内部路由',
      parentId: 2,
      description: '文章标签管理，包含标签的增删改查操作'
    },
    {
      id: 204,
      text: '评论管理',
      type: '菜单',
      identify: 'content:comment',
      url: '/content/comment',
      urlType: '内部路由',
      parentId: 2,
      description: '文章评论管理，包含评论的查看、回复和删除操作'
    },
    {
      id: 205,
      text: '附件管理',
      type: '菜单',
      identify: 'content:attachment',
      url: '/content/attachment',
      urlType: '内部路由',
      parentId: 2,
      description: '附件资源管理，包含附件的上传、下载和删除操作'
    },

    // 业务管理子菜单
    {
      id: 301,
      text: '订单管理',
      type: '菜单',
      identify: 'business:order',
      url: '/business/order',
      urlType: '内部路由',
      parentId: 3,
      description: '订单信息管理，包含订单的查看、处理和导出操作'
    },
    {
      id: 302,
      text: '产品管理',
      type: '菜单',
      identify: 'business:product',
      url: '/business/product',
      urlType: '内部路由',
      parentId: 3,
      description: '产品信息管理，包含产品的增删改查和上下架操作'
    },
    {
      id: 303,
      text: '客户管理',
      type: '菜单',
      identify: 'business:customer',
      url: '/business/customer',
      urlType: '内部路由',
      parentId: 3,
      description: '客户信息管理，包含客户的增删改查操作'
    },
    {
      id: 304,
      text: '合同管理',
      type: '菜单',
      identify: 'business:contract',
      url: '/business/contract',
      urlType: '内部路由',
      parentId: 3,
      description: '合同信息管理，包含合同的增删改查和审批操作'
    },
    {
      id: 305,
      text: '项目管理',
      type: '菜单',
      identify: 'business:project',
      url: '/business/project',
      urlType: '内部路由',
      parentId: 3,
      description: '项目信息管理，包含项目的增删改查和进度跟踪'
    },

    // 数据统计子菜单
    {
      id: 401,
      text: '访问统计',
      type: '菜单',
      identify: 'statistics:visit',
      url: '/statistics/visit',
      urlType: '内部路由',
      parentId: 4,
      description: '网站访问统计，包含PV、UV、IP等数据分析'
    },
    {
      id: 402,
      text: '销售统计',
      type: '菜单',
      identify: 'statistics:sales',
      url: '/statistics/sales',
      urlType: '内部路由',
      parentId: 4,
      description: '销售数据统计，包含销售额、订单量等数据分析'
    },
    {
      id: 403,
      text: '用户统计',
      type: '菜单',
      identify: 'statistics:user',
      url: '/statistics/user',
      urlType: '内部路由',
      parentId: 4,
      description: '用户数据统计，包含用户增长、活跃度等数据分析'
    },
    {
      id: 404,
      text: '内容统计',
      type: '菜单',
      identify: 'statistics:content',
      url: '/statistics/content',
      urlType: '内部路由',
      parentId: 4,
      description: '内容数据统计，包含文章阅读量、评论量等数据分析'
    },

    // 系统工具子菜单
    {
      id: 501,
      text: '代码生成',
      type: '菜单',
      identify: 'tools:gen',
      url: '/tools/gen',
      urlType: '内部路由',
      parentId: 5,
      description: '代码生成工具，根据数据库表结构生成对应的代码'
    },
    {
      id: 502,
      text: '系统接口',
      type: '菜单',
      identify: 'tools:swagger',
      url: '/tools/swagger',
      urlType: '内部路由',
      parentId: 5,
      description: 'Swagger接口文档，展示系统的API接口信息'
    },
    {
      id: 503,
      text: '系统监控',
      type: '菜单',
      identify: 'tools:monitor',
      url: '/tools/monitor',
      urlType: '内部路由',
      parentId: 5,
      description: '系统监控工具，实时监控服务器的CPU、内存、磁盘等状态'
    },
    {
      id: 504,
      text: '表单构建',
      type: '菜单',
      identify: 'tools:build',
      url: '/tools/build',
      urlType: '内部路由',
      parentId: 5,
      description: '表单构建工具，通过拖拽方式生成表单代码'
    },
    {
      id: 505,
      text: '在线终端',
      type: '菜单',
      identify: 'tools:terminal',
      url: '/tools/terminal',
      urlType: '内部路由',
      parentId: 5,
      description: '在线终端工具，提供SSH连接服务器的功能'
    },

    // 用户管理按钮
    {
      id: 10101,
      text: '用户查询',
      type: '按钮',
      identify: 'system:user:query',
      url: '',
      urlType: '',
      parentId: 101,
      description: '用户管理查询操作'
    },
    {
      id: 10102,
      text: '用户新增',
      type: '按钮',
      identify: 'system:user:add',
      url: '',
      urlType: '',
      parentId: 101,
      description: '用户管理新增操作'
    },
    {
      id: 10103,
      text: '用户修改',
      type: '按钮',
      identify: 'system:user:edit',
      url: '',
      urlType: '',
      parentId: 101,
      description: '用户管理修改操作'
    },
    {
      id: 10104,
      text: '用户删除',
      type: '按钮',
      identify: 'system:user:remove',
      url: '',
      urlType: '',
      parentId: 101,
      description: '用户管理删除操作'
    },
    {
      id: 10105,
      text: '用户导出',
      type: '按钮',
      identify: 'system:user:export',
      url: '',
      urlType: '',
      parentId: 101,
      description: '用户管理导出操作'
    },
    {
      id: 10106,
      text: '用户导入',
      type: '按钮',
      identify: 'system:user:import',
      url: '',
      urlType: '',
      parentId: 101,
      description: '用户管理导入操作'
    },
    {
      id: 10107,
      text: '重置密码',
      type: '按钮',
      identify: 'system:user:resetPwd',
      url: '',
      urlType: '',
      parentId: 101,
      description: '用户管理重置密码操作'
    },

    // 角色管理按钮
    {
      id: 10201,
      text: '角色查询',
      type: '按钮',
      identify: 'system:role:query',
      url: '',
      urlType: '',
      parentId: 102,
      description: '角色管理查询操作'
    },
    {
      id: 10202,
      text: '角色新增',
      type: '按钮',
      identify: 'system:role:add',
      url: '',
      urlType: '',
      parentId: 102,
      description: '角色管理新增操作'
    },
    {
      id: 10203,
      text: '角色修改',
      type: '按钮',
      identify: 'system:role:edit',
      url: '',
      urlType: '',
      parentId: 102,
      description: '角色管理修改操作'
    },
    {
      id: 10204,
      text: '角色删除',
      type: '按钮',
      identify: 'system:role:remove',
      url: '',
      urlType: '',
      parentId: 102,
      description: '角色管理删除操作'
    },
    {
      id: 10205,
      text: '角色导出',
      type: '按钮',
      identify: 'system:role:export',
      url: '',
      urlType: '',
      parentId: 102,
      description: '角色管理导出操作'
    },

    // 外部链接示例
    {
      id: 601,
      text: '官方网站',
      type: '菜单',
      identify: 'external:official',
      url: 'https://www.example.com',
      urlType: '外部链接',
      parentId: 0,
      description: '跳转到官方网站'
    },
    {
      id: 602,
      text: '在线文档',
      type: '菜单',
      identify: 'external:docs',
      url: 'https://docs.example.com',
      urlType: '外部链接',
      parentId: 0,
      description: '跳转到在线文档'
    },
    {
      id: 603,
      text: '帮助中心',
      type: '菜单',
      identify: 'external:help',
      url: 'https://help.example.com',
      urlType: 'iframe',
      parentId: 0,
      description: '在iframe中打开帮助中心'
    }
  ])
  interface filterParams {
    note: string
    isShow: boolean
    key: string
  }
  const filterParams = ref<filterParams[]>()
  const getUserList = async () => {
    try {

      const menuInfo = await service.get('/system/menu/menuInfo')
      console.log('获取菜单信息', menuInfo);

      const params = {
        pageNum: currentPage.value,
        pageSize: pageSize.value,
        menuText: searchParams.value.menuText,
        menuUrl: searchParams.value.menuUrl,
        menuType: searchParams.value.menuType,
        menuUrlType: searchParams.value.menuUrlType,
        parentId: searchParams.value.menuUrlType,
        timestamp: Date.now()
      }
      const paramsStr = desEncrypt(JSON.stringify(params))
      const res = await service.post('/system/menu/list', {

        enData: paramsStr

      })
      console.log('菜单列表', res);
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