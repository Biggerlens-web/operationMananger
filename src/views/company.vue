<template>
    <div class="view">
        <companyInfoEditor v-model:dialog-visible="showCompanyEditor" /> <el-card class="filter-card">
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

            <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                :total="1000" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import tableAciton from '@/components/public/tableAciton.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';
    import companyInfoEditor from '@/components/companyInfo/companyInfoEditor.vue';
    import { onMounted, ref } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessageBox } from 'element-plus';
    const counterStore = useCounterStore()
    const { showPagestion, appList, OSlist, channelList } = storeToRefs(counterStore)
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)
    //新增公司
    const showCompanyEditor = ref<boolean>(false)
    const addCompany = () => {
        showCompanyEditor.value = true
    }

    //编辑公司
    const editorCompany = () => {
        showCompanyEditor.value = true
    }
    //删除公司
    const deleteCompany = (item: any) => {
        ElMessageBox.confirm(
            '此操作将永久删除该公司, 是否继续?',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
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
        companyId: string;    // 公司编号
        companyName: string;  // 公司名称
        shortName: string;    // 公司简称
        englishName: string;  // 公司名称（英）
        email: string;        // 公司邮箱
        appCount: number;     // 公司应用数
    }

    const companyNote: any = {
        companyId: '公司编号',
        companyName: '公司名称',
        shortName: '公司简称',
        englishName: '公司名称（英）',
        email: '公司邮箱',
        appCount: '公司应用数'

    }
    // 生成用户数据
    const companyData = ref<CompanyItem[]>([
        {
            companyId: 'COM_0001',
            companyName: '科技有限公司',
            shortName: '科技',
            englishName: 'Technology Co., Ltd.',
            email: 'contact@tech.com',
            appCount: 3
        },
        {
            companyId: 'COM_0002',
            companyName: '网络科技有限公司',
            shortName: '网络',
            englishName: 'Network Technology Co., Ltd.',
            email: 'contact@network.com',
            appCount: 5
        },
        {
            companyId: 'COM_0003',
            companyName: '软件开发有限公司',
            shortName: '软件',
            englishName: 'Software Development Co., Ltd.',
            email: 'contact@software.com',
            appCount: 2
        },
        {
            companyId: 'COM_0004',
            companyName: '信息技术有限公司',
            shortName: '信息',
            englishName: 'Information Technology Co., Ltd.',
            email: 'contact@info.com',
            appCount: 4
        },
        {
            companyId: 'COM_0005',
            companyName: '电子商务有限公司',
            shortName: '电商',
            englishName: 'E-commerce Co., Ltd.',
            email: 'contact@ecommerce.com',
            appCount: 6
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
        const dataItem = companyData.value[0]
        const keys = Object.keys(dataItem)
        filterParams.value = keys.map((item) => {
            return {
                note: companyNote[item],
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

        .content-card {
            height: calc(100vh - 220px);

            .pagesBox {
                margin-top: 30px;
            }
        }
    }
</style>