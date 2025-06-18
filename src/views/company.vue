<template>
    <div class="view">
        <companyInfoEditor v-model:dialog-visible="showCompanyEditor" :companyInfo="companyInfo" /> <el-card
            class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <el-button type="primary" @click="addCompany" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增公司
                    </el-button>
                    <el-button type="primary" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        EXECEL导入
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
                        <el-input v-model="searchParams.companyNo" placeholder="输入公司编号查询"></el-input>
                    </div>
                    <div class="filter-item">
                        <el-input v-model="searchParams.companyName" placeholder="输入公司名称查询"></el-input>
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
                <component :is="componentName" :filterParams="filterParams" :tableData="companyData"
                    @editor="editorCompany" @delete="deleteCompany"></component>
            </Transition>

            <el-pagination v-show="showPagestion" v-model:current-page="pageNum" v-model:page-size="pageSize"
                class="pagesBox" background layout="prev, pager, next" :total="totalData" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import tableAciton from '@/components/public/tableAciton.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';
    import companyInfoEditor from '@/components/companyInfo/companyInfoEditor.vue';
    import { onMounted, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import service from '@/axios';
    import { desEncrypt } from '@/utils/des';
    const counterStore = useCounterStore()
    const { showPagestion, appList, OSlist, channelList } = storeToRefs(counterStore)
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
    //新增公司
    const showCompanyEditor = ref<boolean>(false)

    watch(() => showCompanyEditor.value, (newV) => {
        if (!newV) {
            companyInfo.value = {}
            getUserList()
        }
    })
    const addCompany = () => {
        showCompanyEditor.value = true
    }

    //编辑公司
    const companyInfo = ref<any>()
    const editorCompany = (item: any) => {
        console.log('编辑公司', item);
        companyInfo.value = item
        showCompanyEditor.value = true
    }
    //删除公司
    const deleteCompanyFn = async (companyNo: string) => {
        try {
            const res = await service.post(`/companyInfo/del/${companyNo}`)
            if (res.data.code === 200) {
                ElMessage.success('删除成功')
                getUserList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('删除失败', err);
        }
    }
    const deleteCompany = (item: any) => {
        ElMessageBox.confirm(
            '此操作将永久删除该公司, 是否继续?',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(() => {
            deleteCompanyFn(item.companyNo)
        })
    }
    //搜索参数
    interface SearchParams {
        companyNo: string
        companyName: string



    }
    const searchParams = ref<SearchParams>(
        {
            companyNo: '',
            companyName: '',

        }
    )
    //重置搜索
    const resetSearch = () => {
        searchParams.value = {
            companyNo: '',
            companyName: '',

        }
        getUserList()
    }
    interface CompanyItem {
        companyNo: string;    // 公司编号
        companyName: string;  // 公司名称
        companyAdd: string;    // 公司简称
        companyEName: string;  // 公司名称（英）
        companyEmail: string;        // 公司邮箱
        appSum: number;     // 公司应用数
    }

    const companyNote: any = {
        companyNo: '公司编号',
        companyName: '公司名称',
        companyAdd: '公司简称',
        companyEName: '公司名称（英）',
        companyEmail: '公司邮箱',
        appSum: '公司应用数'

    }
    // 生成用户数据
    const companyData = ref<CompanyItem[]>([]
    )
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
                companyNo: searchParams.value.companyNo,
                companyName: searchParams.value.companyName,
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/companyInfo/list', {
                enData
            })

            console.log('获取公司列表', res);
            if (res.data.code === 200) {
                companyData.value = res.data.rows
                totalData.value = res.data.total
            }
            const keys = Object.keys(companyNote)
            filterParams.value = keys.map((item) => {
                return {
                    note: companyNote[item],
                    isShow: true,
                    key: item
                }
            })
            console.log('filterParams', filterParams.value);
        } catch (err) {

            console.log('获取公司列表失败');
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