<template>
    <div class="view">
        <mosaicEditor v-model:dialog-visible="showEditor" />
        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <el-button type="primary" @click="addMosaic" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        批量新增
                    </el-button>

                    <el-button type="primary" @click="addMosaic" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增马赛克
                    </el-button>
                    <el-button type="primary" class="add-button">
                        全部选中
                    </el-button>
                    <el-button type="danger" class="add-button">
                        <el-icon>
                            <Minus />
                        </el-icon>
                        删除所选
                    </el-button>
                    <el-button type="primary" class="add-button">
                        保存改动
                    </el-button>
                </div>
                <div class="right-actions">
                    <!-- <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
                        @changeView="changeView" /> -->
                </div>
            </div>

            <el-divider class="divider" />

            <div class="filter-container">
                <div class="filter-row">


                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.companyNo" placeholder="应用" class="filter-select">
                            <el-option v-for="item in appList" :key="item.appNo"
                                :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                                :value="item.appNo" />
                        </el-select>
                    </div>

                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.companyNo" placeholder="国内外" class="filter-select">
                            <el-option v-for="item in OSlist" :key="item.appNo" :label="item" :value="item" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.companyNo" placeholder="语言" class="filter-select">
                            <el-option v-for="item in channelList" :key="item.id" :label="item.channelName"
                                :value="item.id" />
                        </el-select>
                    </div>


                    <!-- <div class="filter-item filter-actions">
                        <el-button type="primary" @click="getUserList">
                            <el-icon>
                                <Search />
                            </el-icon>
                            批量添加
                        </el-button>

                    </div> -->
                </div>


            </div>
        </el-card>
        <el-card class="content-card">
            <!-- <Transition enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut" mode="out-in">
                <component :is="componentName" :filterParams="filterParams" :tableData="appData"></component>
            </Transition>

            <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                :total="1000" /> -->
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import tableAciton from '@/components/public/tableAciton.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';
    import mosaicEditor from '@/components/mosaic/mosaicEditor.vue';
    import { onMounted, ref } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    const counterStore = useCounterStore()
    const { showPagestion, appList, OSlist, channelList } = storeToRefs(counterStore)
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)

    //新增马赛克
    const showEditor = ref<boolean>(false)

    const addMosaic = () => {
        showEditor.value = true
    }

    //搜索参数
    interface SearchParams {
        inputText: string
        companyNo: string



    }
    const searchParams = ref<SearchParams>(
        {
            inputText: '',
            companyNo: '',

        }
    )
    //重置搜索
    const resetSearch = () => {
        searchParams.value = {
            inputText: '',
            companyNo: '',

        }
        getUserList()
    }
    interface AppItem {
        appId: string;        // 应用编号
        shortName: string;    // 应用简称
        companyName: string;  // 所属公司
        accessName: string;   // 应用访问名
        systemId: string;     // 系统账号id
        developer: string;    // 开发者
    }


    const appNote: any = {
        appId: '应用编号',
        shortName: '应用简称',
        companyName: '所属公司',
        accessName: '应用访问名',
        systemId: '系统账号id',
        developer: '开发者'

    }
    // 生成用户数据
    const appData = ref<AppItem[]>([
        {
            appId: 'APP_0001',
            shortName: '商城系统',
            companyName: '科技有限公司',
            accessName: 'app1.example.com',
            systemId: 'SYS_0001',
            developer: '张三'
        },
        {
            appId: 'APP_0002',
            shortName: '会员系统',
            companyName: '网络科技有限公司',
            accessName: 'app2.example.com',
            systemId: 'SYS_0002',
            developer: '李四'
        },
        {
            appId: 'APP_0003',
            shortName: '支付系统',
            companyName: '软件开发有限公司',
            accessName: 'app3.example.com',
            systemId: 'SYS_0003',
            developer: '王五'
        },
        {
            appId: 'APP_0004',
            shortName: '管理系统',
            companyName: '信息技术有限公司',
            accessName: 'app4.example.com',
            systemId: 'SYS_0004',
            developer: '赵六'
        },
        {
            appId: 'APP_0005',
            shortName: '客服系统',
            companyName: '科技有限公司',
            accessName: 'app5.example.com',
            systemId: 'SYS_0005',
            developer: '钱七'
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
        const dataItem = appData.value[0]
        const keys = Object.keys(dataItem)
        filterParams.value = keys.map((item) => {
            return {
                note: appNote[item],
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