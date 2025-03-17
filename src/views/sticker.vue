<template>
    <div class="view">
        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <el-button type="primary" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增
                    </el-button>
                    <el-button type="primary" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        导出
                    </el-button>
                    <el-button type="primary" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        导入国际化
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
                        <el-select filterable v-model="searchParams.companyNo" placeholder="国内外" class="filter-select">
                            <el-option v-for="item in appList" :key="item.appNo"
                                :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                                :value="item.appNo" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-input v-model="searchParams.inputText" placeholder="类名"></el-input>

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
                <component :is="componentName" :filterParams="filterParams" :tableData="appData"></component>
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
    interface AppContentConfig {
        appName: string;           // 所属应用
        sequence: number;          // 序号
        name: string;              // 名称
        region: string;            // 地区
        i18n: {                    // 国际化
            enabled: boolean;
            supportedLanguages: string[];
        };
        totalClicks: number;       // 总点击数
        lastUpdateTime: string;    // 最近更新时间
    }


    const appNote: any = {
        appName: '所属应用',
        sequence: '序号',
        name: '名称',
        region: '地区',
        i18n: '国际化',
        totalClicks: '总点击数',
        lastUpdateTime: '最近更新时间',
    }
    // 生成用户数据
    const appData = ref<AppContentConfig[]>([
        {
            appName: "美图秀秀",
            sequence: 1,
            name: "热门滤镜集",
            region: "中国大陆",
            i18n: {
                enabled: true,
                supportedLanguages: ["zh-CN", "en-US", "ja-JP"]
            },
            totalClicks: 1258463,
            lastUpdateTime: "2023-06-15 09:30:22"
        },
        {
            appName: "美图秀秀",
            sequence: 2,
            name: "人像美化工具",
            region: "全球",
            i18n: {
                enabled: true,
                supportedLanguages: ["zh-CN", "en-US", "ja-JP", "ko-KR", "fr-FR"]
            },
            totalClicks: 3452789,
            lastUpdateTime: "2023-07-22 14:15:36"
        },
        {
            appName: "轻颜相机",
            sequence: 1,
            name: "自然美颜",
            region: "亚洲",
            i18n: {
                enabled: true,
                supportedLanguages: ["zh-CN", "zh-TW", "ja-JP", "ko-KR"]
            },
            totalClicks: 978562,
            lastUpdateTime: "2023-05-18 11:45:03"
        },
        {
            appName: "轻颜相机",
            sequence: 2,
            name: "一键修图",
            region: "中国大陆",
            i18n: {
                enabled: false,
                supportedLanguages: ["zh-CN"]
            },
            totalClicks: 658942,
            lastUpdateTime: "2023-08-03 16:20:45"
        },
        {
            appName: "B612咔叽",
            sequence: 1,
            name: "AR贴纸包",
            region: "全球",
            i18n: {
                enabled: true,
                supportedLanguages: ["zh-CN", "en-US", "ja-JP", "ko-KR", "th-TH"]
            },
            totalClicks: 2564871,
            lastUpdateTime: "2023-07-05 08:55:17"
        },
        {
            appName: "B612咔叽",
            sequence: 2,
            name: "动态滤镜",
            region: "东南亚",
            i18n: {
                enabled: true,
                supportedLanguages: ["en-US", "th-TH", "vi-VN", "id-ID"]
            },
            totalClicks: 1236548,
            lastUpdateTime: "2023-08-12 10:10:33"
        },
        {
            appName: "Faceu激萌",
            sequence: 1,
            name: "趣味贴纸",
            region: "中国大陆",
            i18n: {
                enabled: false,
                supportedLanguages: ["zh-CN"]
            },
            totalClicks: 3987452,
            lastUpdateTime: "2023-06-28 15:40:21"
        },
        {
            appName: "Faceu激萌",
            sequence: 2,
            name: "特效相机",
            region: "亚洲",
            i18n: {
                enabled: true,
                supportedLanguages: ["zh-CN", "zh-TW", "ja-JP", "ko-KR"]
            },
            totalClicks: 2145698,
            lastUpdateTime: "2023-07-30 12:25:48"
        },
        {
            appName: "无他相机",
            sequence: 1,
            name: "专业修图工具",
            region: "中国大陆",
            i18n: {
                enabled: false,
                supportedLanguages: ["zh-CN"]
            },
            totalClicks: 856321,
            lastUpdateTime: "2023-05-25 09:15:27"
        },
        {
            appName: "无他相机",
            sequence: 2,
            name: "智能美颜",
            region: "全球",
            i18n: {
                enabled: true,
                supportedLanguages: ["zh-CN", "en-US", "ja-JP", "ko-KR", "ru-RU"]
            },
            totalClicks: 1458963,
            lastUpdateTime: "2023-08-08 17:30:52"
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