<template>
    <div class="view">
        <el-card class="filter-card">
            <div class="card-header">
                <div class="left-actions">
                    <el-button type="primary" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增轮播点
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
                        <el-select filterable v-model="searchParams.appNo" placeholder="请选择应用" clearable>
                            <el-option v-for="item in appList" :key="item.appNo"
                                :label="`应用:${item.appAbbreviation} 公司:${item.companyName}`" :value="item.appNo" />

                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.os" placeholder="请选择系统" clearable>
                            <el-option v-for="item in OSlist" :key="item" :label="item" :value="item" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.language" placeholder="请选择语言" clearable>
                            <el-option v-for="item in OSlist" :key="item" :label="item" :value="item" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.channel" placeholder="请选择渠道" clearable>
                            <el-option v-for="item in channelList" :key="item.id" :label="item.channelName"
                                :value="item.id" />
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
            <Transition enter-active-class="animate__animated animate__slideInLeft"
                leave-active-class="animate__animated animate__slideOutLeft">
                <component :is="componentName" :filterParams="filterParams" :tableData="carouseData"></component>
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
        appNo: string
        os: string
        language: string
        channel: string


    }
    const searchParams = ref<SearchParams>(
        {
            appNo: '',
            os: '',
            language: '',
            channel: '',

        }
    )
    //重置搜索
    const resetSearch = () => {
        searchParams.value = {
            appNo: '',
            os: '',
            language: '',
            channel: '',
        }
        getUserList()
    }
    interface CarouselItem {
        id: number;           // 编号
        appName: string;      // 所属应用
        system: string;       // 系统
        language: string;     // 语言
        channel: string;      // 渠道
        carouselName: string; // 轮播点名称
        carouselCode: string; // 轮播点编码
    }

    const carouseNote: any = {
        id: '编号',
        appName: '所属应用',
        system: '系统',
        language: '语言',
        channel: '渠道',
        carouselName: '轮播点名称',
        carouselCode: '轮播点编码',


    }
    // 生成用户数据
    const carouseData = ref<CarouselItem[]>([
        {
            id: 1,
            appName: '商城APP',
            system: 'iOS',
            language: '中文',
            channel: '微信',
            carouselName: '首页轮播',
            carouselCode: 'CAR_0001'
        },
        {
            id: 2,
            appName: '会员APP',
            system: 'Android',
            language: '英文',
            channel: '支付宝',
            carouselName: '商品轮播',
            carouselCode: 'CAR_0002'
        },
        {
            id: 3,
            appName: '支付APP',
            system: 'Web',
            language: '日文',
            channel: 'APP',
            carouselName: '活动轮播',
            carouselCode: 'CAR_0003'
        },
        {
            id: 4,
            appName: '管理后台',
            system: 'iOS',
            language: '韩文',
            channel: 'H5',
            carouselName: '广告轮播',
            carouselCode: 'CAR_0004'
        },
        {
            id: 5,
            appName: '商城APP',
            system: 'Android',
            language: '中文',
            channel: 'PC',
            carouselName: '首页轮播',
            carouselCode: 'CAR_0005'
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
        const dataItem = carouseData.value[0]
        const keys = Object.keys(dataItem)
        filterParams.value = keys.map((item) => {
            return {
                note: carouseNote[item],
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