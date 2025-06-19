<template>
    <div class="view">
        <bucketEditor v-model:dialog-visible="showBucketEditor" />
        <el-card class="filter-card">
            <div class="card-header">
                <div class="left-actions">
                    <el-button type="primary" class="add-button" @click="addBucket">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增域(bucket)
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
                        <el-input v-model="searchParams.endpoint" placeholder="输入端点查询" clearable prefix-icon="Search" />
                    </div>
                    <div class="filter-item">
                        <el-input v-model="searchParams.bucketName" placeholder="输入域（bucket）查询" clearable
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
            <Transition enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut" mode="out-in">
                <component :is="componentName" :filterParams="filterParams" :tableData="bucketData"
                    @editor="eidtorBucket" @delete="deleteBucket"></component>

            </Transition>

            <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                v-model:current-page="pageNum" v-model:page-size="pageSize" :total="totalData" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import tableAciton from '@/components/public/tableAciton.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';
    import bucketEditor from '@/components/bucket/bucketEditor.vue';
    import { onMounted, ref } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessageBox } from 'element-plus';
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


    //分页
    const pageNum = ref<number>(1)
    const pageSize = ref<number>(10)
    const totalData = ref<number>(0)

    //新增域
    const showBucketEditor = ref<boolean>(false)
    const addBucket = () => {
        console.log('新增域');
        showBucketEditor.value = true
    }
    //编辑域
    const eidtorBucket = (row: any) => {
        console.log('编辑域', row);
        showBucketEditor.value = true
    }
    //删除域
    const deleteBucket = (row: any) => {
        ElMessageBox.confirm('确认删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(res => {

        }).catch(err => {

        })
    }

    //搜索参数
    interface SearchParams {
        endpoint: string
        bucketName: string

    }
    const searchParams = ref<SearchParams>(
        {
            endpoint: '',//端点
            bucketName: '',//域名

        }
    )
    //重置搜索
    const resetSearch = () => {
        searchParams.value = {
            endpoint: '',
            bucketName: '',

        }
        getUserList()
    }
    //定义域类型
    interface EndpointItem {
        id: number;        // 编号
        endpoint: string;  // 端点
        bucketName: string;    // 域
        remark: string; // 说明
    }
    const userNote: any = {
        id: '编号',
        endpoint: '端点',
        bucketName: '域',
        remark: '说明',


    }
    // 生成菜单数据
    const bucketData = ref<EndpointItem[]>([

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
                endpoint: searchParams.value.endpoint,
                bucketName: searchParams.value.bucketName,
            }

            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.get('/base/bucket/list', {
                params: {
                    enData
                }
            })


            console.log('获取域列表', res);

            totalData.value = res.data.total
            bucketData.value = res.data.rows

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