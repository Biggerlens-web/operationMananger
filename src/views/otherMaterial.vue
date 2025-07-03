<template>
    <div class="view">
        <clothEditor v-model:show-editor="showEditor" :editorInfo="editorItemInfo" :noHaveParent='true'
            :type="'othermaterial'" />

        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <el-button type="primary" @click="addEditor" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增
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
                        <el-select filterable v-model="searchParams.region" placeholder="国内外" class="filter-select">
                            <el-option v-for="item in regionList" :key="item.value" :label="item.label"
                                :value="item.value" />
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
                <component :is="componentName" :filterParams="filterParams" :tableData="appData" @editor="editorEditor"
                    @delete="deleteEditor"></component>
            </Transition>

            <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                :total="totalData" v-model:current-page="searchParams.pageNum"
                v-model:page-size="searchParams.pageSize" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import tableAciton from '@/components/public/tableAciton.vue';
    import clothEditor from '@/components/clothingMaterials/clothEditor.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';

    import { onMounted, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessageBox } from 'element-plus';
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    const counterStore = useCounterStore()
    const { showPagestion, regionList, showLoading, defaultAppNo } = storeToRefs(counterStore)
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)

    //数据总数
    const totalData = ref<number>(0)


    //新增其他素材配置
    const showEditor = ref<boolean>(false)
    const addEditor = () => {
        showEditor.value = true
    }
    //编辑其他素材配置
    const editorItemInfo = ref<any>()
    const editorEditor = (item: any) => {
        editorItemInfo.value = item
        showEditor.value = true
    }
    //删除其他素材配置
    const deleteEditor = (item: any) => {
        console.log('删除其他素材配置', item);
        ElMessageBox.confirm(
            '确定删除吗？',
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
        region: string
        pageNum: number
        pageSize: number



    }
    const searchParams = ref<SearchParams>(
        {

            region: '',
            pageNum: 1,
            pageSize: 10,

        }
    )

    watch(() => searchParams.value.pageNum, () => {
        getUserList()

    })
    watch(() => defaultAppNo.value, () => {
        resetSearch()
    })
    //重置搜索
    const resetSearch = () => {
        searchParams.value = {

            region: '',
            pageNum: 1,
            pageSize: 10,

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

    ])
    interface filterParams {
        note: string
        isShow: boolean
        key: string
    }
    const filterParams = ref<filterParams[]>()
    const getUserList = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                appNo: defaultAppNo.value,
                pageNum: searchParams.value.pageNum,
                pageSize: searchParams.value.pageSize,
                region: searchParams.value.region,
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('', {
                enData
            })
            console.log('获取其他素材列表', res);
            appData.value = res.data.rows
            totalData.value = res.data.total

            const keys = Object.keys(appNote)
            filterParams.value = keys.map((item) => {
                return {
                    note: appNote[item],
                    isShow: true,
                    key: item
                }
            })
            console.log('filterParams', filterParams.value);
        } catch (err) {

        } finally {
            showLoading.value = false
        }

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