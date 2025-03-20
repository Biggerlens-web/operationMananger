<template>
    <div class="view">
        <bannerPathEditor v-model:dialog-visible="showBannerPathEditor" />
        <el-card class="filter-card">
            <div>
                <el-button type="primary" @click="addBannerPath"> <el-icon>
                        <Plus />
                    </el-icon>新增路径</el-button>
                <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
                    @changeView="changeView" />
            </div>
        </el-card>
        <el-card class="content-card">
            <Transition enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut" mode="out-in">
                <component :is="componentName" :filterParams="filterParams" :tableData="bannerData"
                    @editor="editorBannerPath" @delete="delelteBannerPath" :bannerPath="true" @scanImg="scanImg">
                </component>
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
    import bannerPathEditor from '@/components/bannerPath/bannerPathEditor.vue';

    import { onMounted, ref } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessageBox } from 'element-plus';
    import { useRouter } from 'vue-router';
    const counterStore = useCounterStore()
    const router = useRouter()
    const { showPagestion, menuList } = storeToRefs(counterStore)
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)


    //新增轮播图路径
    const showBannerPathEditor = ref<boolean>(false)
    const addBannerPath = () => {
        showBannerPathEditor.value = true
    }

    //编辑轮播图路径
    const editorBannerPath = (item: any) => {
        console.log('编辑轮播图路径', item);
        showBannerPathEditor.value = true
    }
    //删除轮播图路径
    const delelteBannerPath = (item: any) => {
        ElMessageBox.confirm('确认删除该条路径吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
    }

    //扫描图片
    const scanImg = (item: any) => {
        console.log('扫描图片', item);
        console.log('菜单', menuList.value);
        const menuItem = menuList.value.find((item: any) => item.parentName
            === '基础配置')
        const bannerImgItem = menuItem.children.find((item: any) => item.menuIdentify === 'bannerImg')
        console.log('bannerImgItem', bannerImgItem);
        if (bannerImgItem) {
            console.log('轮播图管理', bannerImgItem);

            router.push({
                path: bannerImgItem.menuUrl,
                query: {
                    id: item.id,
                    bucket: item.bucket,
                    path: item.path
                }
            })

        }
    }
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