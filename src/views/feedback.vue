<template>
    <div class="view">
        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <el-button type="primary" class="add-button" @click="exportExcel">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        导出Excel
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
                        <el-select filterable v-model="searchParams.os" placeholder="系统" class="filter-select">
                            <el-option v-for="item in OSlist" :key="item" :label="item" :value="item" />
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
                <component :is="componentName" :filterParams="filterParams" :tableData="appData" :showAction="false">
                </component :showAction='false'>
            </Transition>
            <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                :total="totalData" v-model:current-page="pageNum" :page-size="pageSize" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import tableAciton from '@/components/public/tableAciton.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';
    import { onMounted, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    import { ElMessage } from 'element-plus';
    const counterStore = useCounterStore()
    const { showPagestion, OSlist, defaultAppNo, showLoading } = storeToRefs(counterStore)
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)
    watch(() => defaultAppNo.value, () => {
        searchParams.value.appNo = defaultAppNo.value
        getUserList()
    })


    //导出excell
    const exportExcel = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                appNo: searchParams.value.appNo,
                os: searchParams.value.os,
            }
            console.log('导出参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.get('/feedback/exportExcel', {
                params: {
                    enData
                },
                responseType: 'blob'
            })

            const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
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

    //分页
    const pageNum = ref<number>(1)
    const pageSize = ref<number>(10)
    const totalData = ref<number>(0)
    watch(() => pageNum.value, () => {
        getUserList()
    })

    //搜索参数
    interface SearchParams {
        appNo: string | number
        os: string


    }
    const searchParams = ref<SearchParams>(
        {

            appNo: defaultAppNo.value,
            os: OSlist.value[0],

        }
    )
    //重置搜索
    const resetSearch = () => {
        searchParams.value = {

            appNo: defaultAppNo.value,
            os: OSlist.value[0],

        }
        getUserList()
    }
    interface UserFeedback {
        appName: string;         // 所属应用
        system: string;// 系统
        feedbackContent: string;  // 反馈内容
        userUid: string;          // 用户uid
        isMember: boolean;        // 是否会员
        contactInfo: string;      // 联系方式
        deviceModel: string;      // 机型
        osVersion: string;        // 系统版本
        appVersion: string;       // 应用版本
        attachments: string[];    // 附件
        feedbackTime: string;     // 反馈时间
    }


    const appNote: any = {
        appName: '所属应用',
        system: '系统',
        feedbackContent: '反馈内容',
        userUid: '用户uid',
        isMember: '是否会员',
        contactInfo: '联系方式',
        deviceModel: '机型',
        osVersion: '系统版本',
        appVersion: '应用版本',
        attachments: '附件',
        feedbackTime: '反馈时间',
    }
    // 生成用户数据
    const appData = ref<UserFeedback[]>([

    ])
    interface filterParams {
        note: string
        isShow: boolean
        key: string
    }
    const filterParams = ref<filterParams[]>()
    //获取查询用户信息列表
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