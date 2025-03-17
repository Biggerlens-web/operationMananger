<template>
    <div class="view">
        <el-card class="filter-card">
            <div>
                <el-button type="primary"> <el-icon>
                        <Plus />
                    </el-icon>新增路径</el-button>
                <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
                    @changeView="changeView" />
            </div>
        </el-card>
        <el-card class="content-card">
            <Transition enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut" mode="out-in">
                <component :is="componentName" :filterParams="filterParams" :tableData="bannerData"></component>
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
    interface EndpointItem {
        id: number;        // 编号
        endpoint: string;  // 端点
        domain: string;    // 域
        path: string;      // 路径
    }

    const bannerNote: any = {
        id: '编号',
        endpoint: '端点',
        domain: '域',
        path: '路径',

    }
    // 生成用户数据
    const bannerData = ref<EndpointItem[]>([
        {
            id: 1,
            endpoint: '/api/v1/users',
            domain: 'api.example.com',
            path: '/api/v1/products'
        },
        {
            id: 2,
            endpoint: '/api/v1/orders',
            domain: 'test.example.com',
            path: '/api/v1/categories'
        },
        {
            id: 3,
            endpoint: '/api/v1/settings',
            domain: 'dev.example.com',
            path: '/api/v1/auth'
        },
        {
            id: 4,
            endpoint: '/api/v1/payments',
            domain: 'staging.example.com',
            path: '/api/v1/inventory'
        },
        {
            id: 5,
            endpoint: '/api/v1/reports',
            domain: 'prod.example.com',
            path: '/api/v1/analytics'
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
        const dataItem = bannerData.value[0]
        const keys = Object.keys(dataItem)
        filterParams.value = keys.map((item) => {
            return {
                note: bannerNote[item],
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