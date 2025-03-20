<template>
    <div class="view">
        <freeConfigEditor v-model:show-editor="showEditor" />
        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <el-button type="primary" @click="addConfig" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增付费弹窗配置
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
                        <el-select filterable v-model="searchParams.companyNo" placeholder="请选择应用"
                            class="filter-select">
                            <el-option v-for="item in appList" :key="item.appNo"
                                :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                                :value="item.appNo" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.companyNo" placeholder="请选择系统"
                            class="filter-select">
                            <el-option v-for="item in OSlist" :key="item.appNo" :label="item" :value="item" />
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

    import freeConfigEditor from '@/components/freeConfig/freeConfigEditor.vue';
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
        showEditor.value = true
    }
    //删除配置
    const deleteConfig = (item: any) => {
        console.log('删除', item)
        ElMessageBox.confirm(
            '此操作将永久删除该配置, 是否继续?',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )
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
    interface FeatureConfig {
        appName: string;                // 所属应用
        fieldName: string;              // 字段名
        fieldDescription: string;       // 字段说明
        system: string;                 // 系统
        directOpenVipPage: boolean;     // 是否直接打开vip界面
        showUpgradeVipPage: boolean;    // 是否显示升级vip界面
        showUpgradeVip: boolean;        // 是否显示升级vip
        freeUsageCount: number;         // 免费次数
        paymentAmount: number;          // 支付金额
        paidUnlockCount: number;        // 可付费解锁次数
        unlockCountByPayment: number;   // 付费可解锁次数
        directShowAd: boolean;          // 是否直接显示广告
        adUnlockCount: number;          // 可广告解锁次数
        unlockCountByAd: number;        // 广告可解锁次数
        shareUnlockCount: number;       // 可分享解锁次数
        unlockCountByShare: number;     // 分享可解锁次数
        surveyUnlockCount: number;      // 可使用调查问卷解说次数
        unlockCountBySurvey: number;    // 调查问卷可解锁次数
        onlineConfigText: string;       // 在线配置文案
    }


    const appNote: any = {
        appName: '所属应用',
        fieldName: '字段名',
        fieldDescription: '字段说明',
        system: '系统',
        directOpenVipPage: '是否直接打开vip界面',
        showUpgradeVipPage: '是否显示升级vip界面',
        showUpgradeVip: '是否显示升级vip',
        freeUsageCount: '免费次数',
        paymentAmount: '支付金额',
        paidUnlockCount: '可付费解锁次数',
        unlockCountByPayment: '付费可解锁次数',
        directShowAd: '是否直接显示广告',
        adUnlockCount: '可广告解锁次数',
        unlockCountByAd: '广告可解锁次数',
        shareUnlockCount: '可分享解锁次数',
        unlockCountByShare: '分享可解锁次数',
        surveyUnlockCount: '可使用调查问卷解说次数',
        unlockCountBySurvey: '调查问卷可解锁次数',
        onlineConfigText: '在线配置文案'

    }
    // 生成用户数据
    const appData = ref<FeatureConfig[]>([
        {
            appName: "美图秀秀",
            fieldName: "aiBeauty",
            fieldDescription: "AI一键美颜",
            system: "Android",
            directOpenVipPage: false,
            showUpgradeVipPage: true,
            showUpgradeVip: true,
            freeUsageCount: 3,
            paymentAmount: 18.8,
            paidUnlockCount: 50,
            unlockCountByPayment: 50,
            directShowAd: true,
            adUnlockCount: 5,
            unlockCountByAd: 1,
            shareUnlockCount: 3,
            unlockCountByShare: 1,
            surveyUnlockCount: 2,
            unlockCountBySurvey: 1,
            onlineConfigText: "使用AI一键美颜，让你的照片更加精致"
        },
        {
            appName: "美图秀秀",
            fieldName: "faceSwap",
            fieldDescription: "AI换脸",
            system: "iOS",
            directOpenVipPage: true,
            showUpgradeVipPage: true,
            showUpgradeVip: true,
            freeUsageCount: 1,
            paymentAmount: 28.8,
            paidUnlockCount: 100,
            unlockCountByPayment: 100,
            directShowAd: false,
            adUnlockCount: 3,
            unlockCountByAd: 1,
            shareUnlockCount: 2,
            unlockCountByShare: 1,
            surveyUnlockCount: 0,
            unlockCountBySurvey: 0,
            onlineConfigText: "AI换脸，一键变身你喜欢的明星"
        },
        {
            appName: "轻颜相机",
            fieldName: "bodySlim",
            fieldDescription: "AI瘦身",
            system: "Android",
            directOpenVipPage: false,
            showUpgradeVipPage: true,
            showUpgradeVip: false,
            freeUsageCount: 5,
            paymentAmount: 15.8,
            paidUnlockCount: 30,
            unlockCountByPayment: 30,
            directShowAd: true,
            adUnlockCount: 10,
            unlockCountByAd: 2,
            shareUnlockCount: 5,
            unlockCountByShare: 1,
            surveyUnlockCount: 3,
            unlockCountBySurvey: 1,
            onlineConfigText: "AI智能瘦身，一键让你更苗条"
        },
        {
            appName: "轻颜相机",
            fieldName: "skinSmooth",
            fieldDescription: "AI磨皮",
            system: "iOS",
            directOpenVipPage: false,
            showUpgradeVipPage: false,
            showUpgradeVip: true,
            freeUsageCount: 10,
            paymentAmount: 12.8,
            paidUnlockCount: 50,
            unlockCountByPayment: 50,
            directShowAd: true,
            adUnlockCount: 8,
            unlockCountByAd: 2,
            shareUnlockCount: 4,
            unlockCountByShare: 1,
            surveyUnlockCount: 2,
            unlockCountBySurvey: 1,
            onlineConfigText: "AI智能磨皮，让肌肤更加细腻"
        },
        {
            appName: "B612咔叽",
            fieldName: "backgroundRemove",
            fieldDescription: "AI抠图",
            system: "Android",
            directOpenVipPage: true,
            showUpgradeVipPage: true,
            showUpgradeVip: true,
            freeUsageCount: 2,
            paymentAmount: 19.9,
            paidUnlockCount: 40,
            unlockCountByPayment: 40,
            directShowAd: false,
            adUnlockCount: 4,
            unlockCountByAd: 1,
            shareUnlockCount: 3,
            unlockCountByShare: 1,
            surveyUnlockCount: 1,
            unlockCountBySurvey: 1,
            onlineConfigText: "AI一键抠图，轻松更换背景"
        },
        {
            appName: "B612咔叽",
            fieldName: "styleTransfer",
            fieldDescription: "AI风格迁移",
            system: "iOS",
            directOpenVipPage: false,
            showUpgradeVipPage: true,
            showUpgradeVip: true,
            freeUsageCount: 3,
            paymentAmount: 25.9,
            paidUnlockCount: 60,
            unlockCountByPayment: 60,
            directShowAd: true,
            adUnlockCount: 6,
            unlockCountByAd: 1,
            shareUnlockCount: 3,
            unlockCountByShare: 1,
            surveyUnlockCount: 2,
            unlockCountBySurvey: 1,
            onlineConfigText: "AI风格迁移，一键变身艺术大师"
        },
        {
            appName: "无他相机",
            fieldName: "aiPortrait",
            fieldDescription: "AI人像修饰",
            system: "Android",
            directOpenVipPage: false,
            showUpgradeVipPage: true,
            showUpgradeVip: false,
            freeUsageCount: 5,
            paymentAmount: 16.8,
            paidUnlockCount: 35,
            unlockCountByPayment: 35,
            directShowAd: true,
            adUnlockCount: 7,
            unlockCountByAd: 1,
            shareUnlockCount: 4,
            unlockCountByShare: 1,
            surveyUnlockCount: 2,
            unlockCountBySurvey: 1,
            onlineConfigText: "AI人像修饰，让你的照片更加出彩"
        },
        {
            appName: "无他相机",
            fieldName: "hdEnhance",
            fieldDescription: "AI高清增强",
            system: "iOS",
            directOpenVipPage: true,
            showUpgradeVipPage: false,
            showUpgradeVip: true,
            freeUsageCount: 2,
            paymentAmount: 22.8,
            paidUnlockCount: 45,
            unlockCountByPayment: 45,
            directShowAd: false,
            adUnlockCount: 5,
            unlockCountByAd: 1,
            shareUnlockCount: 3,
            unlockCountByShare: 1,
            surveyUnlockCount: 0,
            unlockCountBySurvey: 0,
            onlineConfigText: "AI高清增强，让照片更加清晰"
        },
        {
            appName: "Faceu激萌",
            fieldName: "ageTransform",
            fieldDescription: "AI变老变小",
            system: "Android",
            directOpenVipPage: false,
            showUpgradeVipPage: true,
            showUpgradeVip: true,
            freeUsageCount: 1,
            paymentAmount: 18.8,
            paidUnlockCount: 30,
            unlockCountByPayment: 30,
            directShowAd: true,
            adUnlockCount: 3,
            unlockCountByAd: 1,
            shareUnlockCount: 2,
            unlockCountByShare: 1,
            surveyUnlockCount: 1,
            unlockCountBySurvey: 1,
            onlineConfigText: "AI变老变小，看看未来的你"
        },
        {
            appName: "Faceu激萌",
            fieldName: "cartoonTransform",
            fieldDescription: "AI卡通化",
            system: "iOS",
            directOpenVipPage: true,
            showUpgradeVipPage: true,
            showUpgradeVip: true,
            freeUsageCount: 2,
            paymentAmount: 26.8,
            paidUnlockCount: 50,
            unlockCountByPayment: 50,
            directShowAd: false,
            adUnlockCount: 4,
            unlockCountByAd: 1,
            shareUnlockCount: 3,
            unlockCountByShare: 1,
            surveyUnlockCount: 2,
            unlockCountBySurvey: 1,
            onlineConfigText: "AI卡通化，一键变身动漫角色"
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