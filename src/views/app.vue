<template>
    <div class="view">
        <appEditor v-model:dialog-visible="showAppEditor" />
        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <el-button type="primary" @click="addApp" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增应用
                    </el-button>

                </div>


            </div>
            <el-divider class="divider" />
            <div class="filter-container">
                <div class="filter-row">

                    <div class="filter-item">
                        <el-input v-model="searchParams.searchInfo" placeholder="可查询内容：应用名|访问名|开发者|系统账号"></el-input>
                    </div>


                    <div class="filter-item filter-actions">
                        <el-button type="primary" @click="getAppList">
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


            <appTable :tableData="tableData" /> <el-pagination v-show="showPagestion" class="pagesBox" background
                layout="prev, pager, next" :total="totalData" v-model:current-page="pageNum" :page-size="pageSize" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import appTable from '@/components/app/appTable.vue'
    import tableAciton from '@/components/public/tableAciton.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';
    import appEditor from '@/components/app/appEditor.vue';
    import { onMounted, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessageBox } from 'element-plus';
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    const counterStore = useCounterStore()
    const { showPagestion, defaultCompanyNo, showLoading } = storeToRefs(counterStore)
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

    //新增应用
    const showAppEditor = ref<boolean>(false)
    const addApp = () => {
        showAppEditor.value = true
    }
    const searchParams = ref<any>({
        searchInfo: ''
    })
    const resetSearch = () => {
        searchParams.value = {
            searchInfo: ''
        }
        getAppList()
    }



    const tableData = [
        {
            date: '2016-05-03',
            name: 'Tom',
            state: 'California',
            city: 'San Francisco',
            address: '3650 21st St, San Francisco',
            zip: 'CA 94114',
            family: [
                {
                    name: 'Jerry',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                },
                {
                    name: 'Spike',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                },
                {
                    name: 'Tyke',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                },
            ],
        },
        {
            date: '2016-05-02',
            name: 'Tom',
            state: 'California',
            city: 'San Francisco',
            address: '3650 21st St, San Francisco',
            zip: 'CA 94114',
            family: [
                {
                    name: 'Jerry',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                },
                {
                    name: 'Spike',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                },
                {
                    name: 'Tyke',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                },
            ],
        },
        {
            date: '2016-05-04',
            name: 'Tom',
            state: 'California',
            city: 'San Francisco',
            address: '3650 21st St, San Francisco',
            zip: 'CA 94114',
            family: [
                {
                    name: 'Jerry',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                },
                {
                    name: 'Spike',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                },
                {
                    name: 'Tyke',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                },
            ],
        },
        {
            date: '2016-05-01',
            name: 'Tom',
            state: 'California',
            city: 'San Francisco',
            address: '3650 21st St, San Francisco',
            zip: 'CA 94114',
            family: [
                {
                    name: 'Jerry',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                },
                {
                    name: 'Spike',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                },
                {
                    name: 'Tyke',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                },
            ],
        },
        {
            date: '2016-05-08',
            name: 'Tom',
            state: 'California',
            city: 'San Francisco',
            address: '3650 21st St, San Francisco',
            zip: 'CA 94114',
            family: [
                {
                    name: 'Jerry',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                },
                {
                    name: 'Spike',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                },
                {
                    name: 'Tyke',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                },
            ],
        },
        {
            date: '2016-05-06',
            name: 'Tom',
            state: 'California',
            city: 'San Francisco',
            address: '3650 21st St, San Francisco',
            zip: 'CA 94114',
            family: [
                {
                    name: 'Jerry',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                },
                {
                    name: 'Spike',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                },
                {
                    name: 'Tyke',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                },
            ],
        },
        {
            date: '2016-05-07',
            name: 'Tom',
            state: 'California',
            city: 'San Francisco',
            address: '3650 21st St, San Francisco',
            zip: 'CA 94114',
            family: [
                {
                    name: 'Jerry',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                },
                {
                    name: 'Spike',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                },
                {
                    name: 'Tyke',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                },
            ],
        },
    ]
    const getAppList = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                pageNum: pageNum.value,
                pageSize: pageSize.value,
                companyNo: defaultCompanyNo.value,
                searchInfo: searchParams.value.searchInfo
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/appInfo/list', {
                enData
            })
            console.log('应用列表', res);
        } catch (err) {
            console.log('获取应用列表失败', err);
        } finally {
            showLoading.value = false
        }
    }
    //监听公司变化
    watch(() => defaultCompanyNo.value, () => {
        getAppList()
    })
    onMounted(() => {
        getAppList();
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
                        width: 350px;
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

        .content-card {
            height: calc(100vh - 220px);

            .pagesBox {
                margin-top: 30px;
            }
        }
    }
</style>