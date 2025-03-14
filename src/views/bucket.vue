<template>
    <div class="view">
        <el-card class="filter-card">
            <div class="card-header">
                <div class="left-actions">
                    <el-button type="primary" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增菜单
                    </el-button>
                    <el-button type="primary" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        EXECL导入
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
                        <el-input v-model="searchParams.menuText" placeholder="输入端点查询" clearable prefix-icon="Search" />
                    </div>
                    <div class="filter-item">
                        <el-input v-model="searchParams.menuText" placeholder="输入域（bucket）查询" clearable
                            prefix-icon="Search" />
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
            <Transition enter-active-class="animate__animated animate__slideInLeft"
                leave-active-class="animate__animated animate__slideOutLeft">
                <component :is="componentName" :filterParams="filterParams" :tableData="bucketData"></component>

            </Transition>

            <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                :total="1000" />
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
    //定义域类型
    interface EndpointItem {
        id: number;        // 编号
        endpoint: string;  // 端点
        domain: string;    // 域
        description: string; // 说明
    }
    const userNote: any = {
        id: '编号',
        endpoint: '端点',
        domain: '域',
        description: '说明',


    }
    // 生成菜单数据
    const bucketData = ref<EndpointItem[]>([
        {
            id: 1,
            endpoint: '/users',
            domain: 'api.example.com',
            description: '这是第 1 个端点的说明信息'
        },
        {
            id: 2,
            endpoint: '/products',
            domain: 'test.example.com',
            description: '这是第 2 个端点的说明信息'
        },
        {
            id: 3,
            endpoint: '/orders',
            domain: 'dev.example.com',
            description: '这是第 3 个端点的说明信息'
        },
        {
            id: 4,
            endpoint: '/categories',
            domain: 'api.example.com',
            description: '这是第 4 个端点的说明信息'
        },
        {
            id: 5,
            endpoint: '/settings',
            domain: 'test.example.com',
            description: '这是第 5 个端点的说明信息'
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
        const dataItem = bucketData.value[0]
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