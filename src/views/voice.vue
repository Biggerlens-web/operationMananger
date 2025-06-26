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
                        上传
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
                        <el-select filterable v-model="searchParams.companyNo" placeholder="分类" class="filter-select">
                            <el-option v-for="item in OSlist" :key="item.appNo" :label="item" :value="item" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-input v-model="searchParams.inputText" placeholder="包名"></el-input>

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
    interface AppContentItem {
        appName: string;       // 所属应用
        type: string;          // 类型
        level: number;         // 层级
        name: string;          // 名称
        thumbnail: string;     // 缩略图
        clickCount: number;    // 点击量
        favoriteCount: number; // 收藏量
        shareCount: number;    // 分享量
        createTime: string;    // 创建时间
    }


    const appNote: any = {
        appName: '所属应用',
        type: '类型',
        level: '层级',
        name: '名称',
        thumbnail: '缩略图',
        clickCount: '点击量',
        favoriteCount: '收藏量',
        shareCount: '分享量',
        createTime: '创建时间',
    }
    // 生成用户数据
    const appData = ref<AppContentItem[]>([
        {
            appName: "美图秀秀",
            type: "滤镜",
            level: 1,
            name: "自然阳光",
            thumbnail: "https://cdn.meitu.com/filters/sunlight.jpg",
            clickCount: 125846,
            favoriteCount: 23651,
            shareCount: 5423,
            createTime: "2023-03-15 10:30:22"
        },
        {
            appName: "美图秀秀",
            type: "贴纸",
            level: 2,
            name: "夏日元素",
            thumbnail: "https://cdn.meitu.com/stickers/summer.jpg",
            clickCount: 98754,
            favoriteCount: 15632,
            shareCount: 3897,
            createTime: "2023-05-20 14:45:36"
        },
        {
            appName: "轻颜相机",
            type: "美颜",
            level: 1,
            name: "精致妆容",
            thumbnail: "https://cdn.qingyan.com/beauty/makeup.jpg",
            clickCount: 187452,
            favoriteCount: 45612,
            shareCount: 12584,
            createTime: "2023-01-10 09:15:48"
        },
        {
            appName: "轻颜相机",
            type: "特效",
            level: 3,
            name: "梦幻虚化",
            thumbnail: "https://cdn.qingyan.com/effects/dreamy.jpg",
            clickCount: 76523,
            favoriteCount: 12453,
            shareCount: 2874,
            createTime: "2023-04-25 16:20:33"
        },
        {
            appName: "B612咔叽",
            type: "AR效果",
            level: 2,
            name: "可爱兔耳",
            thumbnail: "https://cdn.b612.com/ar/rabbit.jpg",
            clickCount: 234587,
            favoriteCount: 56234,
            shareCount: 15687,
            createTime: "2023-02-14 11:40:15"
        },
        {
            appName: "B612咔叽",
            type: "场景",
            level: 1,
            name: "霓虹派对",
            thumbnail: "https://cdn.b612.com/scenes/neon.jpg",
            clickCount: 145672,
            favoriteCount: 28456,
            shareCount: 7856,
            createTime: "2023-06-30 20:05:12"
        },
        {
            appName: "Faceu激萌",
            type: "装饰",
            level: 2,
            name: "童话花冠",
            thumbnail: "https://cdn.faceu.com/decor/crown.jpg",
            clickCount: 356982,
            favoriteCount: 87423,
            shareCount: 25478,
            createTime: "2023-03-08 12:25:44"
        },
        {
            appName: "Faceu激萌",
            type: "妆容",
            level: 1,
            name: "清透水润",
            thumbnail: "https://cdn.faceu.com/makeup/natural.jpg",
            clickCount: 198754,
            favoriteCount: 42365,
            shareCount: 9874,
            createTime: "2023-05-18 15:50:28"
        },
        {
            appName: "无他相机",
            type: "修图",
            level: 3,
            name: "专业修容",
            thumbnail: "https://cdn.wuta.com/retouch/pro.jpg",
            clickCount: 87456,
            favoriteCount: 15632,
            shareCount: 3254,
            createTime: "2023-04-12 13:15:36"
        },
        {
            appName: "无他相机",
            type: "滤镜",
            level: 2,
            name: "复古电影",
            thumbnail: "https://cdn.wuta.com/filters/vintage.jpg",
            clickCount: 123456,
            favoriteCount: 28765,
            shareCount: 6543,
            createTime: "2023-07-05 09:30:42"
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