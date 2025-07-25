<!-- 应用管理视图 -->
<template>
    <div class="view">
        <!-- 应用编辑器弹窗 -->
        <appEditor v-model:dialog-visible="showAppEditor" />
        <!-- 过滤和操作卡片 -->
        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <!-- 新增应用按钮 -->
                    <el-button type="primary" @click="addApp" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增应用
                    </el-button>

                </div>


            </div>
            <el-divider class="divider" />
            <!-- 搜索过滤器容器 -->
            <div class="filter-container">
                <div class="filter-row">

                    <!-- 搜索输入框 -->
                    <div class="filter-item">
                        <el-input v-model="searchParams.searchInfo" placeholder="可查询内容：应用名|访问名|开发者|系统账号"></el-input>
                    </div>


                    <!-- 操作按钮 -->
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
        <!-- 内容显示卡片 -->
        <el-card class="content-card" v-loading="showLoading">

            <!-- 应用数据表格 -->
            <appTable :tableData="tableData" @goDetail="goDetail" @getPrivacyProtocol="getPrivacyProtocol" />
            <!-- 分页组件 -->
            <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                :total="totalData" v-model:current-page="pageNum" :page-size="pageSize" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    // 引入子组件
    import appTable from '@/components/app/appTable.vue'
    import tableAciton from '@/components/public/tableAciton.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';
    import appEditor from '@/components/app/appEditor.vue';
    // 引入Vue相关API
    import { onMounted, ref, watch } from 'vue';
    // 引入Pinia store
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    // 引入Element Plus组件
    import { ElMessageBox } from 'element-plus';
    // 引入加密工具
    import { desEncrypt } from '@/utils/des';
    // 引入axios实例
    import service from '@/axios';
    import { useRouter } from 'vue-router';
    // 使用Pinia store
    const counterStore = useCounterStore()
    const { showPagestion, defaultCompanyNo, showLoading, defaultAppNo } = storeToRefs(counterStore) // 从store中解构状态，保持响应式
    // 动态组件定义 (当前未使用)
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)

    const router = useRouter()
    const goDetail = (item: any) => {
        console.log('goDetail', item);
        defaultAppNo.value = item.appNo
        router.push('/appEdit/index')
    }

    const getPrivacyProtocol = (item: any) => {
        console.log('getPrivacyProtocol', item);
    }

    // 分页状态
    const pageNum = ref<number>(1) // 当前页码
    const pageSize = ref<number>(15) // 每页显示数量
    const totalData = ref<number>(0) // 总数据条数
    watch(pageNum, (newVal, oldVal) => {
        if (newVal !== oldVal) {
            getAppList()
        }
    })
    // 新增应用弹窗控制
    const showAppEditor = ref<boolean>(false)
    watch(() => showAppEditor.value, (newVal, oldVal) => {
        if (!newVal) {
            getAppList()
        }
    })
    // 打开新增应用弹窗
    const addApp = () => {
        showAppEditor.value = true
    }
    // 搜索参数
    const searchParams = ref<any>({
        searchInfo: ''
    })
    // 重置搜索参数并重新获取列表
    const resetSearch = () => {
        searchParams.value = {
            searchInfo: ''
        }
        getAppList()
    }



    // 表格数据 (此处为静态示例数据，应由API获取)
    const tableData = ref<any>([

    ])


    watch(() => defaultCompanyNo.value, () => {
        getAppList()
    })
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
            tableData.value = res.data.rows
            totalData.value = res.data.total
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
            height: max-content;

            .pagesBox {
                margin-top: 30px;
            }
        }
    }
</style>