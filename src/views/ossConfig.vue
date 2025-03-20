<template>
    <div class="view">
        <appOSSEditor v-model:show-editor="showEditor" />
        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <el-button type="primary" @click="addOSSConfig" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增配置链接
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
                        <el-select filterable v-model="searchParams.companyNo" placeholder="请选择所属公司"
                            class="filter-select">
                            <el-option v-for="item in appList" :key="item.appNo"
                                :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                                :value="item.appNo" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.companyNo" placeholder="请选择所属应用"
                            class="filter-select">
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
                <component :is="componentName" :filterParams="filterParams" :tableData="appData"
                    @editor="editorOSSConfig" @delete="deleteOSSConfig"></component>
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
    import appOSSEditor from '@/components/appOSS/appOSSEditor.vue';
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
    //新增配置链接
    const showEditor = ref<boolean>(false)
    const addOSSConfig = () => {
        showEditor.value = true
    }

    //编辑配置链接
    const editorOSSConfig = (item: any) => {
        showEditor.value = true

    }
    //删除配置链接
    const deleteOSSConfig = (item: any) => {
        ElMessageBox.confirm(
            '此操作将永久删除该配置, 是否继续?',
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
    interface ApplicationData {
        companyName: string;   // 公司名称
        appName: string;       // 应用名称
        endpoint: string;      // 端点
        domain: string;        // 域
        folderPath: string;    // 文件夹
        fileName: string;      // 文件名
    }


    const appNote: any = {
        companyName: '公司名称',
        appName: '应用名称',
        endpoint: '端点',
        domain: '域',
        folderPath: '文件夹',
        fileName: '文件名'

    }
    // 生成用户数据
    const appData = ref<ApplicationData[]>([
        {
            companyName: "腾讯科技",
            appName: "微信",
            endpoint: "/api/messages",
            domain: "wechat.com",
            folderPath: "/apps/wechat",
            fileName: "messages.json"
        },
        {
            companyName: "阿里巴巴",
            appName: "淘宝",
            endpoint: "/api/products",
            domain: "taobao.com",
            folderPath: "/apps/taobao",
            fileName: "products.xml"
        },
        {
            companyName: "字节跳动",
            appName: "抖音",
            endpoint: "/api/videos",
            domain: "douyin.com",
            folderPath: "/apps/douyin",
            fileName: "videos.mp4"
        },
        {
            companyName: "百度",
            appName: "百度地图",
            endpoint: "/api/location",
            domain: "map.baidu.com",
            folderPath: "/apps/maps",
            fileName: "locations.dat"
        },
        {
            companyName: "美团",
            appName: "美团外卖",
            endpoint: "/api/restaurants",
            domain: "waimai.meituan.com",
            folderPath: "/apps/meituan",
            fileName: "restaurants.db"
        },
        {
            companyName: "京东",
            appName: "京东商城",
            endpoint: "/api/orders",
            domain: "jd.com",
            folderPath: "/apps/jd",
            fileName: "orders.csv"
        },
        {
            companyName: "网易",
            appName: "网易云音乐",
            endpoint: "/api/music",
            domain: "music.163.com",
            folderPath: "/apps/netease",
            fileName: "songs.mp3"
        },
        {
            companyName: "小米",
            appName: "小米商城",
            endpoint: "/api/devices",
            domain: "mi.com",
            folderPath: "/apps/xiaomi",
            fileName: "devices.yaml"
        },
        {
            companyName: "滴滴出行",
            appName: "滴滴打车",
            endpoint: "/api/rides",
            domain: "didi.com",
            folderPath: "/apps/didi",
            fileName: "trips.log"
        },
        {
            companyName: "哔哩哔哩",
            appName: "B站",
            endpoint: "/api/anime",
            domain: "bilibili.com",
            folderPath: "/apps/bilibili",
            fileName: "streams.ts"
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