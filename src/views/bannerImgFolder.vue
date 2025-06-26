<template>
    <div class="view">
        <bannerPathEditor v-model:dialog-visible="showBannerPathEditor" :bannerPathInfo />
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
                :total="totalData" v-model:current-page="pageNum" v-model:page-size="pageSize" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import tableAciton from '@/components/public/tableAciton.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';
    import bannerPathEditor from '@/components/bannerPath/bannerPathEditor.vue';

    import { onMounted, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { useRouter } from 'vue-router';
    import service from '@/axios';
    import { desEncrypt } from '@/utils/des';
    const counterStore = useCounterStore()
    const router = useRouter()
    const { showPagestion, menuList } = storeToRefs(counterStore)
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

    //新增轮播图路径
    const showBannerPathEditor = ref<boolean>(false)

    watch(() => showBannerPathEditor.value, (newV) => {
        if (!newV) {
            bannerPathInfo.value = ''
            getUserList()
        }
    })
    const addBannerPath = () => {
        showBannerPathEditor.value = true
    }

    //编辑轮播图路径
    const bannerPathInfo = ref<any>()
    const editorBannerPath = (item: any) => {
        console.log('编辑轮播图路径', item);
        showBannerPathEditor.value = true
        bannerPathInfo.value = item
    }
    //删除轮播图路径
    const delBannerFolderFn = async (id: number) => {
        try {
            const res = await service.post(`/base/bannerImgFolder/del/${id}`)
            if (res.data.code === 200) {
                ElMessage.success('删除成功')
                getUserList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {

        }
    }
    const delelteBannerPath = (item: any) => {
        ElMessageBox.confirm('确认删除该条路径吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(res => {
            delBannerFolderFn(item.id)
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
                }
            })

        }
    }
    interface EndpointItem {
        id: number;        // 编号
        endpoint: string;  // 端点
        bucketName: string;    // 域
        folder: string;      // 路径
    }

    const bannerNote: any = {
        id: '编号',
        endpoint: '端点',
        bucketName: '域',
        folder: '路径',

    }
    // 生成用户数据
    const bannerData = ref<EndpointItem[]>([

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
            const res = await service.get('/base/bannerImgFolder/list', {
                params: {
                    enData
                }
            })
            console.log('获取轮播图路径列表', res);
            res.data.rows.forEach((item: any) => {
                item.bucketName = item.parentObj.bucketName
                item.endpoint = item.parentObj.endpoint
            })
            totalData.value = res.data.total
            bannerData.value = res.data.rows
            const keys = Object.keys(bannerNote)
            filterParams.value = keys.map((item) => {
                return {
                    note: bannerNote[item],
                    isShow: true,
                    key: item
                }
            })
            console.log('filterParams', filterParams.value);

        } catch (err) {
            console.log('获取列表失败', err);
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