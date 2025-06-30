<template>
    <div class="view">
        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <el-button type="primary" class="add-button">
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
                        <el-select filterable v-model="searchParams.companyNo" placeholder="应用" class="filter-select">
                            <el-option v-for="item in appList" :key="item.appNo"
                                :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                                :value="item.appNo" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.companyNo" placeholder="系统" class="filter-select">
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
                <component :is="componentName" :filterParams="filterParams" :tableData="appData" :showAction="false">
                </component>
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
        {
            appName: "美图秀秀",
            system: "iOS",
            feedbackContent: "人像美颜功能在使用时偶尔会闪退，希望能够修复这个问题。",
            userUid: "MT10023456",
            isMember: true,
            contactInfo: "user1@example.com",
            deviceModel: "iPhone 13 Pro",
            osVersion: "iOS 15.4.1",
            appVersion: "9.2.3",
            attachments: ["https://cdn.feedback.com/mt/crash_log_12345.txt"],
            feedbackTime: "2023-07-15 14:32:45"
        },
        {
            appName: "美图秀秀",
            system: "Android",
            feedbackContent: "最新版本中的滤镜特效加载很慢，以前的版本没有这个问题。",
            userUid: "MT25678901",
            isMember: false,
            contactInfo: "13812345678",
            deviceModel: "Xiaomi 12",
            osVersion: "Android 12",
            appVersion: "9.1.8",
            attachments: [],
            feedbackTime: "2023-08-02 10:15:38"
        },
        {
            appName: "轻颜相机",
            system: "iOS",
            feedbackContent: "建议增加更多的美妆模板，现有的有些单调。",
            userUid: "QY56781234",
            isMember: true,
            contactInfo: "user3@example.com",
            deviceModel: "iPhone 12",
            osVersion: "iOS 16.0.1",
            appVersion: "6.3.5",
            attachments: ["https://cdn.feedback.com/qy/suggestion_makeup.jpg"],
            feedbackTime: "2023-08-10 19:27:33"
        },
        {
            appName: "轻颜相机",
            system: "Android",
            feedbackContent: "应用在三星S22上打开很慢，比其他手机慢很多。",
            userUid: "QY34567890",
            isMember: false,
            contactInfo: "13987654321",
            deviceModel: "Samsung Galaxy S22",
            osVersion: "Android 13",
            appVersion: "6.2.9",
            attachments: ["https://cdn.feedback.com/qy/startup_log.txt"],
            feedbackTime: "2023-06-28 08:41:15"
        },
        {
            appName: "B612咔叽",
            system: "iOS",
            feedbackContent: "支付功能异常，尝试购买会员但是扣款后没有到账。",
            userUid: "B612876543",
            isMember: false,
            contactInfo: "user5@example.com",
            deviceModel: "iPhone 14",
            osVersion: "iOS 16.1",
            appVersion: "10.5.6",
            attachments: ["https://cdn.feedback.com/b612/payment_screenshot.jpg", "https://cdn.feedback.com/b612/order_id.txt"],
            feedbackTime: "2023-07-25 15:30:22"
        },
        {
            appName: "B612咔叽",
            system: "Android",
            feedbackContent: "最新的AR特效非常好用，但希望能增加更多动物主题的。",
            userUid: "B612654321",
            isMember: true,
            contactInfo: "15898765432",
            deviceModel: "OPPO Find X5",
            osVersion: "Android 12",
            appVersion: "10.4.8",
            attachments: [],
            feedbackTime: "2023-08-05 20:12:40"
        },
        {
            appName: "Faceu激萌",
            system: "iOS",
            feedbackContent: "视频录制功能有时会卡顿，尤其是在使用高级特效的时候。",
            userUid: "FC75319246",
            isMember: true,
            contactInfo: "user7@example.com",
            deviceModel: "iPhone 13 mini",
            osVersion: "iOS 15.5",
            appVersion: "7.8.3",
            attachments: ["https://cdn.feedback.com/faceu/video_issue.mp4"],
            feedbackTime: "2023-06-18 11:23:57"
        },
        {
            appName: "Faceu激萌",
            system: "Android",
            feedbackContent: "字体显示异常，某些特效文字在高分辨率屏幕上显示模糊。",
            userUid: "FC98765432",
            isMember: false,
            contactInfo: "13598765432",
            deviceModel: "Vivo X80",
            osVersion: "Android 13",
            appVersion: "7.7.9",
            attachments: ["https://cdn.feedback.com/faceu/font_issue.jpg"],
            feedbackTime: "2023-07-09 16:45:33"
        },
        {
            appName: "无他相机",
            system: "iOS",
            feedbackContent: "最新更新后无法保存照片到相册，每次都提示权限问题。",
            userUid: "WT56781234",
            isMember: true,
            contactInfo: "user9@example.com",
            deviceModel: "iPhone SE (2nd generation)",
            osVersion: "iOS 15.6",
            appVersion: "4.8.2",
            attachments: ["https://cdn.feedback.com/wuta/permission_error.jpg"],
            feedbackTime: "2023-08-12 09:08:21"
        },
        {
            appName: "无他相机",
            system: "Android",
            feedbackContent: "电池消耗太快，使用应用15分钟消耗了将近20%的电量。",
            userUid: "WT12345678",
            isMember: false,
            contactInfo: "13756781234",
            deviceModel: "Huawei P50 Pro",
            osVersion: "Android 12",
            appVersion: "4.7.5",
            attachments: ["https://cdn.feedback.com/wuta/battery_usage.jpg"],
            feedbackTime: "2023-08-01 13:27:48"
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