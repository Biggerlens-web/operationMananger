<template>
    <div class="view">
        <labelsEditor v-model:dialog-visible="showLabelsEditor" />
        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <el-button type="primary" @click="addLabels" class="add-button">
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
                <component :is="componentName" :filterParams="filterParams" :tableData="appData" @editor="editorLabels"
                    @delete="deleteLabels"></component>
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
    import labelsEditor from '@/components/labels/labelsEditor.vue';
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

    //新增标签
    const showLabelsEditor = ref<boolean>(false)
    const addLabels = () => {
        showLabelsEditor.value = true
    }

    //编辑标签
    const editorLabels = (item: any) => {
        showLabelsEditor.value = true
    }

    //删除标签
    const deleteLabels = (item: any) => {
        ElMessageBox.confirm(
            '确定删除该标签吗？',
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
    interface AppTagConfig {
        appName: string;       // 所属应用
        parentTag: string;     // 父标签
        tagName: string;       // 标签名
        tagNameEn: string;     // 标签名（英）
        order: number;         // 排序
    }


    const appNote: any = {
        appName: '所属应用',
        parentTag: '父标签',
        tagName: '标签名',
        tagNameEn: '标签名（英）',
        order: '排序',

    }
    // 生成用户数据
    const appData = ref<AppTagConfig[]>([
        {
            appName: "美图秀秀",
            parentTag: "滤镜",
            tagName: "人像",
            tagNameEn: "Portrait",
            order: 1
        },
        {
            appName: "美图秀秀",
            parentTag: "滤镜",
            tagName: "风景",
            tagNameEn: "Landscape",
            order: 2
        },
        {
            appName: "美图秀秀",
            parentTag: "滤镜",
            tagName: "美食",
            tagNameEn: "Food",
            order: 3
        },
        {
            appName: "美图秀秀",
            parentTag: "贴纸",
            tagName: "可爱",
            tagNameEn: "Cute",
            order: 1
        },
        {
            appName: "美图秀秀",
            parentTag: "贴纸",
            tagName: "节日",
            tagNameEn: "Holiday",
            order: 2
        },
        {
            appName: "轻颜相机",
            parentTag: "美颜",
            tagName: "自然",
            tagNameEn: "Natural",
            order: 1
        },
        {
            appName: "轻颜相机",
            parentTag: "美颜",
            tagName: "精致",
            tagNameEn: "Delicate",
            order: 2
        },
        {
            appName: "轻颜相机",
            parentTag: "特效",
            tagName: "复古",
            tagNameEn: "Vintage",
            order: 1
        },
        {
            appName: "轻颜相机",
            parentTag: "特效",
            tagName: "梦幻",
            tagNameEn: "Dreamy",
            order: 2
        },
        {
            appName: "B612咔叽",
            parentTag: "AR效果",
            tagName: "动物",
            tagNameEn: "Animal",
            order: 1
        },
        {
            appName: "B612咔叽",
            parentTag: "AR效果",
            tagName: "卡通",
            tagNameEn: "Cartoon",
            order: 2
        },
        {
            appName: "B612咔叽",
            parentTag: "场景",
            tagName: "派对",
            tagNameEn: "Party",
            order: 1
        },
        {
            appName: "B612咔叽",
            parentTag: "场景",
            tagName: "旅行",
            tagNameEn: "Travel",
            order: 2
        },
        {
            appName: "Faceu激萌",
            parentTag: "装饰",
            tagName: "萌趣",
            tagNameEn: "Cute",
            order: 1
        },
        {
            appName: "Faceu激萌",
            parentTag: "装饰",
            tagName: "潮流",
            tagNameEn: "Trendy",
            order: 2
        },
        {
            appName: "Faceu激萌",
            parentTag: "妆容",
            tagName: "日常",
            tagNameEn: "Daily",
            order: 1
        },
        {
            appName: "Faceu激萌",
            parentTag: "妆容",
            tagName: "舞台",
            tagNameEn: "Stage",
            order: 2
        },
        {
            appName: "无他相机",
            parentTag: "修图",
            tagName: "基础",
            tagNameEn: "Basic",
            order: 1
        },
        {
            appName: "无他相机",
            parentTag: "修图",
            tagName: "高级",
            tagNameEn: "Advanced",
            order: 2
        },
        {
            appName: "无他相机",
            parentTag: "滤镜",
            tagName: "时尚",
            tagNameEn: "Fashion",
            order: 1
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