<template>
    <div class="view">
        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <!-- <el-button type="primary" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增配置连接
                    </el-button>
                    <el-button type="primary" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        EXECEL导入
                    </el-button> -->
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
                            <el-option v-for="item in OSlist" :key="item" :label="item" :value="item" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.companyNo" placeholder="是否收费" class="filter-select">
                            <el-option label="是" :value="1" />
                            <el-option label="否" :value="0" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.companyNo" placeholder="是否开启淘宝"
                            class="filter-select">
                            <el-option label="是" :value="1" />
                            <el-option label="否" :value="0" />
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
                </component>
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
    interface PhotoEditingAppData {
        appName: string;                 // 所属应用
        system: string;                  // 系统
        photoEditTitle: string;          // 帮我修图标题
        isCharged: boolean;              // 是否收费
        price: number;                   // 价格
        showTaobaoPage: boolean;         // 是否显示淘宝页面
        taobaoPageLink: string;          // 淘宝页面链接
        wechatServiceLink: string;       // 帮我修图微信客服链接
        versionNumber: string;           // 版本号
        nonPaymentTime: number;          // 不支付时间（小时）
        channelPhotoUrl: string;         // 渠道照片
        i18nConfig: {                    // 国际化配置
            languages: string[];
            defaultLanguage: string;
        };
    }


    const appNote: any = {
        appName: '所属应用',
        system: '系统',
        photoEditTitle: '帮我修图标题',
        isCharged: '是否收费',
        price: '价格',
        showTaobaoPage: '是否显示淘宝页面',
        taobaoPageLink: '淘宝页面链接',
        wechatServiceLink: '帮我修图微信客服链接',
        versionNumber: '版本号',
        nonPaymentTime: '不支付时间',
        channelPhotoUrl: '渠道照片',
        i18nConfig: '国际化配置'

    }
    // 生成用户数据
    const appData = ref<PhotoEditingAppData[]>([
        {
            appName: "美图秀秀",
            system: "Android",
            photoEditTitle: "一键美化",
            isCharged: true,
            price: 19.9,
            showTaobaoPage: true,
            taobaoPageLink: "https://item.taobao.com/item.htm?id=12345",
            wechatServiceLink: "https://wx.meitu.com/customer-service",
            versionNumber: "9.2.1",
            nonPaymentTime: 72,
            channelPhotoUrl: "https://cdn.meitu.com/channel/android.jpg",
            i18nConfig: {
                languages: ["zh-CN", "en-US", "ja-JP"],
                defaultLanguage: "zh-CN"
            }
        },
        {
            appName: "美图秀秀",
            system: "iOS",
            photoEditTitle: "一键美化Pro",
            isCharged: true,
            price: 25.9,
            showTaobaoPage: false,
            taobaoPageLink: "",
            wechatServiceLink: "https://wx.meitu.com/customer-service",
            versionNumber: "9.3.0",
            nonPaymentTime: 48,
            channelPhotoUrl: "https://cdn.meitu.com/channel/ios.jpg",
            i18nConfig: {
                languages: ["zh-CN", "en-US", "ja-JP", "ko-KR"],
                defaultLanguage: "zh-CN"
            }
        },
        {
            appName: "轻颜相机",
            system: "Android",
            photoEditTitle: "智能修图",
            isCharged: false,
            price: 0,
            showTaobaoPage: false,
            taobaoPageLink: "",
            wechatServiceLink: "https://wx.qingyan.com/service",
            versionNumber: "5.1.2",
            nonPaymentTime: 0,
            channelPhotoUrl: "https://cdn.qingyan.com/channel/android.jpg",
            i18nConfig: {
                languages: ["zh-CN", "en-US"],
                defaultLanguage: "zh-CN"
            }
        },
        {
            appName: "轻颜相机",
            system: "iOS",
            photoEditTitle: "智能修图Pro",
            isCharged: true,
            price: 15.9,
            showTaobaoPage: true,
            taobaoPageLink: "https://item.taobao.com/item.htm?id=67890",
            wechatServiceLink: "https://wx.qingyan.com/service",
            versionNumber: "5.2.0",
            nonPaymentTime: 24,
            channelPhotoUrl: "https://cdn.qingyan.com/channel/ios.jpg",
            i18nConfig: {
                languages: ["zh-CN", "en-US", "zh-TW"],
                defaultLanguage: "zh-CN"
            }
        },
        {
            appName: "Faceu激萌",
            system: "Android",
            photoEditTitle: "一键修图",
            isCharged: true,
            price: 12.9,
            showTaobaoPage: true,
            taobaoPageLink: "https://item.taobao.com/item.htm?id=23456",
            wechatServiceLink: "https://wx.faceu.com/customer",
            versionNumber: "7.0.1",
            nonPaymentTime: 36,
            channelPhotoUrl: "https://cdn.faceu.com/channel/android.jpg",
            i18nConfig: {
                languages: ["zh-CN"],
                defaultLanguage: "zh-CN"
            }
        },
        {
            appName: "Faceu激萌",
            system: "iOS",
            photoEditTitle: "一键修图专业版",
            isCharged: true,
            price: 18.9,
            showTaobaoPage: false,
            taobaoPageLink: "",
            wechatServiceLink: "https://wx.faceu.com/customer",
            versionNumber: "7.1.0",
            nonPaymentTime: 48,
            channelPhotoUrl: "https://cdn.faceu.com/channel/ios.jpg",
            i18nConfig: {
                languages: ["zh-CN", "en-US"],
                defaultLanguage: "zh-CN"
            }
        },
        {
            appName: "B612咔叽",
            system: "Android",
            photoEditTitle: "智能美颜",
            isCharged: false,
            price: 0,
            showTaobaoPage: false,
            taobaoPageLink: "",
            wechatServiceLink: "https://wx.b612.com/service",
            versionNumber: "10.2.3",
            nonPaymentTime: 0,
            channelPhotoUrl: "https://cdn.b612.com/channel/android.jpg",
            i18nConfig: {
                languages: ["zh-CN", "en-US", "ja-JP", "ko-KR"],
                defaultLanguage: "zh-CN"
            }
        },
        {
            appName: "B612咔叽",
            system: "iOS",
            photoEditTitle: "智能美颜高级版",
            isCharged: true,
            price: 22.9,
            showTaobaoPage: true,
            taobaoPageLink: "https://item.taobao.com/item.htm?id=78901",
            wechatServiceLink: "https://wx.b612.com/service",
            versionNumber: "10.3.0",
            nonPaymentTime: 72,
            channelPhotoUrl: "https://cdn.b612.com/channel/ios.jpg",
            i18nConfig: {
                languages: ["zh-CN", "en-US", "ja-JP", "ko-KR", "th-TH"],
                defaultLanguage: "zh-CN"
            }
        },
        {
            appName: "无他相机",
            system: "Android",
            photoEditTitle: "专业修图",
            isCharged: true,
            price: 9.9,
            showTaobaoPage: true,
            taobaoPageLink: "https://item.taobao.com/item.htm?id=34567",
            wechatServiceLink: "https://wx.wuta.com/customer",
            versionNumber: "4.5.6",
            nonPaymentTime: 24,
            channelPhotoUrl: "https://cdn.wuta.com/channel/android.jpg",
            i18nConfig: {
                languages: ["zh-CN", "en-US"],
                defaultLanguage: "zh-CN"
            }
        },
        {
            appName: "无他相机",
            system: "iOS",
            photoEditTitle: "专业修图大师",
            isCharged: true,
            price: 16.9,
            showTaobaoPage: false,
            taobaoPageLink: "",
            wechatServiceLink: "https://wx.wuta.com/customer",
            versionNumber: "4.6.0",
            nonPaymentTime: 48,
            channelPhotoUrl: "https://cdn.wuta.com/channel/ios.jpg",
            i18nConfig: {
                languages: ["zh-CN", "en-US", "zh-TW"],
                defaultLanguage: "zh-CN"
            }
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