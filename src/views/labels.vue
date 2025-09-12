<template>
    <!-- 视图主容器 -->
    <div class="view">
        <!-- 标签编辑器弹窗 -->
        <labelsEditor v-model:dialog-visible="showLabelsEditor" :editInfo="editInfo" />
        <!-- 过滤和操作卡片 -->
        <el-card class="filter-card">
            <!-- 卡片头部 -->
            <div class="card-header" style="margin: 0;">
                <!-- 左侧操作按钮 -->
                <div class="left-actions">
                    <!-- 新增按钮 -->
                    <el-button type="primary" @click="addLabels" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增
                    </el-button>
                </div>
                <!-- 右侧表格操作组件 -->
                <div class="right-actions">
                    <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
                        @changeView="changeView" />
                </div>
            </div>

            <el-divider class="divider" />

            <!-- 注释掉的过滤器容器 -->
            <!-- <div class="filter-container">
                ...
            </div> -->
        </el-card>
        <!-- 内容展示卡片 -->
        <el-card class="content-card" v-loading="showLoading">
            <!-- 动态组件，带过渡效果 -->
            <Transition enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut" mode="out-in">
                <component :is="componentName" :filterParams="filterParams" :tableData="appData" @editor="editorLabels"
                    @delete="deleteLabels"></component>
            </Transition>

            <!-- 注释掉的分页组件 -->
            <!-- <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                :total="totalData" v-model:current-page="searchParams.pageNum"
                v-model:page-size="searchParams.pageSize" /> -->
        </el-card>
    </div>
</template>

<script setup lang="ts">
    // 引入所需组件和模块
    import tableAciton from '@/components/public/tableAciton.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';
    import labelsEditor from '@/components/labels/labelsEditor.vue';
    import { onMounted, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';

    // 使用Pinia store
    const counterStore = useCounterStore()
    const { showPagestion, defaultAppNo, showLoading } = storeToRefs(counterStore)

    // 动态组件定义
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)

    // 数据总数
    const totalData = ref<number>(0)

    // 新增标签
    const showLabelsEditor = ref<boolean>(false)
    const addLabels = () => {
        showLabelsEditor.value = true
    }

    // 编辑标签
    const editInfo = ref<any>()
    watch(() => showLabelsEditor.value, (newV) => {
        if (!newV) {
            editInfo.value = ''
            getUserList()
        }
    })
    const editorLabels = (item: any) => {
        editInfo.value = item
        showLabelsEditor.value = true
    }

    // 删除标签
    const deleteLabels = (item: any) => {
        ElMessageBox.confirm(
            '确定删除该标签吗？',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        ).then(async () => {
            showLoading.value = true
            try {
                const res = await service.post(`/labels/del/${item.id}`)
                if (res.data.code === 200) {
                    ElMessage.success('删除成功')
                    getUserList()
                } else {
                    ElMessage.error(res.data.msg)
                }
            } catch (err) {
                console.log('删除失败', err);
            } finally {
                showLoading.value = false
            }
        })
    }

    // 搜索参数接口定义
    interface SearchParams {
        pageNum: number
        pageSize: number
    }

    // 搜索参数
    const searchParams = ref<SearchParams>(
        {
            pageNum: 1,
            pageSize: 10
        }
    )

    // 重置搜索
    const resetSearch = () => {
        searchParams.value = {
            pageNum: 1,
            pageSize: 10
        }
        getUserList()
    }

    // 应用标签配置接口定义
    interface AppTagConfig {
        appAbbreviation: string;       // 所属应用
        pidName: string;     // 父标签
        label: string;       // 标签名
        labelEn: string;     // 标签名（英）
        labelIndex: number;         // 排序
    }

    // 表格列中文注释
    const appNote: any = {
        appAbbreviation: '所属应用',
        pidName: '父标签',
        label: '标签名',
        labelEn: '标签名（英）',
        labelIndex: '排序',
    }

    // 标签数据列表
    const appData = ref<AppTagConfig[]>([])

    // 过滤参数接口定义
    interface filterParams {
        note: string
        isShow: boolean
        key: string
    }
    const filterParams = ref<filterParams[]>()

    // 监听默认应用编号变化，并重置搜索
    watch(() => defaultAppNo.value, () => {
        resetSearch()
    })
    const getUserList = async () => {
        try {
            const params = {
                timestamp: Date.now(),

                appNo: defaultAppNo.value
            }
            console.log('参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/labels/list', {
                enData
            })
            appData.value = res.data.data.list

            console.log('获取用户标签', res);

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
            console.log('获取用户标签失败', err);
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
            height: max-content;

            .pagesBox {
                margin-top: 30px;
            }
        }
    }
</style>