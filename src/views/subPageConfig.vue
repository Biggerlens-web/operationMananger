<template>
    <div class="view">
        <subPageEditor v-model:show-editor="showEditor" />
        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <el-button type="primary" @click="addConfig" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增
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
                        <el-select filterable v-model="searchParams.companyNo" placeholder="应用" class="filter-select">
                            <el-option v-for="item in appList" :key="item.appNo"
                                :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                                :value="item.appNo" />
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
                <component :is="componentName" :filterParams="filterParams" :tableData="appData" @editor="editorConfig"
                    @delete="deleteConfig"></component>
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
    import subPageEditor from '@/components/subPage/subPageEditor.vue';
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

    //新增配置
    const showEditor = ref<boolean>(false)
    const addConfig = () => {
        showEditor.value = true
    }

    //编辑配置
    const editorConfig = (item: any) => {
        console.log('编辑', item)
        showEditor.value = true
    }
    //删除配置

    const deleteConfig = (item: any) => {
        console.log('删除', item)
        ElMessageBox.confirm('确认删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
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
    interface MemberSystemConfig {
        appName: string;                  // 所属应用
        channel: string;                  // 渠道
        memberSystemDomain: string;       // 会员系统域名
        autoOpenPlan: string;  // 自动打开方案
        backButton: string;  // 返回按钮
        subscriptionLoginEnabled: boolean; // 订阅页登录开关
        productSorting: string; // 商品排序
    }


    const appNote: any = {
        appName: '所属应用',
        channel: '渠道',
        memberSystemDomain: '会员系统域名',
        autoOpenPlan: '自动打开方案',
        backButton: '返回按钮',
        subscriptionLoginEnabled: '订阅页登录开关',
        productSorting: '商品排序',



    }
    // 生成用户数据
    const appData = ref<MemberSystemConfig[]>([
        {
            appName: "美图秀秀",
            channel: "App Store",
            memberSystemDomain: "vip.meitu.com",
            autoOpenPlan: "delayed",
            backButton: "show",
            subscriptionLoginEnabled: true,
            productSorting: "recommended"
        },
        {
            appName: "美图秀秀",
            channel: "华为应用市场",
            memberSystemDomain: "vip.meitu.com",
            autoOpenPlan: "direct",
            backButton: "show",
            subscriptionLoginEnabled: false,
            productSorting: "price-asc"
        },
        {
            appName: "轻颜相机",
            channel: "App Store",
            memberSystemDomain: "member.qingyan.com",
            autoOpenPlan: "manual",
            backButton: "custom",
            subscriptionLoginEnabled: true,
            productSorting: "popular"
        },
        {
            appName: "轻颜相机",
            channel: "小米应用商店",
            memberSystemDomain: "member.qingyan.com",
            autoOpenPlan: "direct",
            backButton: "show",
            subscriptionLoginEnabled: true,
            productSorting: "price-desc"
        },
        {
            appName: "B612咔叽",
            channel: "App Store",
            memberSystemDomain: "vip.b612.com",
            autoOpenPlan: "delayed",
            backButton: "hide",
            subscriptionLoginEnabled: true,
            productSorting: "recommended"
        },
        {
            appName: "B612咔叽",
            channel: "应用宝",
            memberSystemDomain: "vip.b612.com",
            autoOpenPlan: "none",
            backButton: "custom",
            subscriptionLoginEnabled: false,
            productSorting: "price-asc"
        },
        {
            appName: "Faceu激萌",
            channel: "App Store",
            memberSystemDomain: "member.faceu.com",
            autoOpenPlan: "manual",
            backButton: "show",
            subscriptionLoginEnabled: true,
            productSorting: "popular"
        },
        {
            appName: "Faceu激萌",
            channel: "OPPO软件商店",
            memberSystemDomain: "member.faceu.com",
            autoOpenPlan: "direct",
            backButton: "hide",
            subscriptionLoginEnabled: false,
            productSorting: "price-desc"
        },
        {
            appName: "无他相机",
            channel: "App Store",
            memberSystemDomain: "vip.wuta.com",
            autoOpenPlan: "delayed",
            backButton: "custom",
            subscriptionLoginEnabled: true,
            productSorting: "recommended"
        },
        {
            appName: "无他相机",
            channel: "VIVO应用商店",
            memberSystemDomain: "vip.wuta.com",
            autoOpenPlan: "none",
            backButton: "show",
            subscriptionLoginEnabled: false,
            productSorting: "price-asc"
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