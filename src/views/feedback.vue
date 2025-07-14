<template>
    <!-- 视图主容器 -->
    <div class="view">
        <!-- 过滤和操作卡片 -->
        <el-card class="filter-card">
            <!-- 卡片头部 -->
            <div class="card-header" style="margin: 0;">
                <!-- 左侧操作按钮 -->
                <div class="left-actions">
                    <!-- 导出Excel按钮 -->
                    <el-button type="primary" class="add-button" @click="exportExcel">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        导出Excel
                    </el-button>
                </div>
                <!-- 右侧表格操作组件 -->
                <div class="right-actions">
                    <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
                        @changeView="changeView" />
                </div>
            </div>

            <el-divider class="divider" />
            <!-- 过滤器容器 -->
            <div class="filter-container">
                <div class="filter-row">
                    <!-- 系统选择器 -->
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.os" placeholder="系统" class="filter-select">
                            <el-option v-for="item in OSlist" :key="item.value" :label="item.note"
                                :value="item.value" />
                        </el-select>
                    </div>

                    <!-- 查询和重置按钮 -->
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
        <!-- 内容展示卡片 -->
        <el-card class="content-card">
            <!-- 动态组件，带过渡效果 -->
            <Transition enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut" mode="out-in">
                <component :is="componentName" :filterParams="filterParams" :tableData="appData" :showAction="false">
                </component :showAction='false'>
            </Transition>
            <!-- 分页组件 -->
            <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                :total="totalData" v-model:current-page="pageNum" :page-size="pageSize" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    // 引入所需组件和模块
    import tableAciton from '@/components/public/tableAciton.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';
    import { onMounted, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    import { ElMessage } from 'element-plus';

    // 使用Pinia store
    const counterStore = useCounterStore()
    const { showPagestion, OSlist, defaultAppNo, showLoading } = storeToRefs(counterStore)

    // 动态组件定义
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)

    // 监听默认应用编号变化，并重置搜索
    watch(() => defaultAppNo.value, () => {
        searchParams.value.appNo = defaultAppNo.value
        resetSearch()
    })

    // 导出Excel
    const exportExcel = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                appNo: defaultAppNo.value,
                os: searchParams.value.os,
            }
            showLoading.value = true
            const res = await service.get('/feedback/exportExcel', {
                params,
                responseType: 'blob'
            })

            // 创建Blob对象并触发下载
            const blob = new Blob([res.data], { type: res.headers['content-type'] });
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = 'feedback.xlsx'
            link.click()
            URL.revokeObjectURL(link.href)
            ElMessage.success('导出成功')
        } catch (err) {
            console.log('导出失败', err);
        } finally {
            showLoading.value = false
        }
    }

    // 分页状态
    const pageNum = ref<number>(1)
    const pageSize = ref<number>(10)
    const totalData = ref<number>(0)
    watch(() => pageNum.value, () => {
        getUserList()
    })

    // 搜索参数接口定义
    interface SearchParams {
        appNo: string | number
        os: string
    }
    // 搜索参数
    const searchParams = ref<SearchParams>(
        {
            appNo: defaultAppNo.value,
            os: OSlist.value[0].value,
        }
    )

    // 重置搜索
    const resetSearch = () => {
        searchParams.value = {
            appNo: defaultAppNo.value,
            os: OSlist.value[0].value,
        }
        pageNum.value = 1
        getUserList()
    }

    // 用户反馈数据接口定义
    interface UserFeedback {
        appAbbreviation: string;         // 所属应用
        system: string;                  // 系统
        content: string;                 // 反馈内容
        uid: string;                     // 用户uid
        isMember: '';                    // 是否会员
        contact: string;                 // 联系方式
        phoneType: string;               // 机型
        systemVersion: string;           // 系统版本
        appVersion: string;              // 应用版本
        attaUrl: string[];               // 附件
        createTime: string;              // 反馈时间
    }

    // 表格列中文注释
    const appNote: any = {
        appAbbreviation: '所属应用',
        system: '系统',
        content: '反馈内容',
        uid: '用户uid',
        isMember: '是否会员',
        contact: '联系方式',
        phoneType: '机型',
        systemVersion: '系统版本',
        appVersion: '应用版本',
        attaUrl: '附件',
        createTime: '反馈时间',
    }

    // 用户反馈数据列表
    const appData = ref<UserFeedback[]>([])

    // 过滤参数接口定义
    interface filterParams {
        note: string
        isShow: boolean
        key: string
    }
    const filterParams = ref<filterParams[]>()

    // 获取用户反馈列表
    const getUserList = async () => {
        try {
            const params = {
                ...searchParams.value,
                pageNum: pageNum.value,
                pageSize: pageSize.value,
                timestamp: Date.now(),
            }

            const paramsStr = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/feedback/list', {
                enData: paramsStr
            })
            console.log('信息列表', res);
            res.data.rows.forEach((element: any) => {
                element.system = element.os.value
                element.isMember = element.isVip === 1 ? '是' : '否'
            });
            totalData.value = res.data.total
            appData.value = res.data.rows
            const keys = Object.keys(appNote)
            filterParams.value = keys.map((item) => {
                return {
                    note: appNote[item],
                    isShow: true,
                    key: item
                }
            })
            console.log('filterParams', filterParams.value);
        } catch (err) {
            console.log('获取信息列表', err);
        } finally {
            showLoading.value = false
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

        .content-card {
            height: calc(100vh - 220px);

            .pagesBox {
                margin-top: 30px;
            }
        }
    }
</style>