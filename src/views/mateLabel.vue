<template>
    <div class="view">
        <mateLabelEditor v-model:dialog-visible="showMateLabelEditor" :labelInfo="labelInfo" />
        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <el-button type="primary" @click="addMateLabel" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增标签
                    </el-button>
                </div>
                <div class="right-actions">
                    <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
                        @changeView="changeView" />
                </div>
            </div>


        </el-card>
        <el-card class="content-card">
            <Transition enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut" mode="out-in">
                <component :is="componentName" :filterParams="filterParams" :tableData="tagData"
                    @editor="editorMateLabel" @delete="deleteMateLabel"></component>
            </Transition>

            <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                :total="totalData" v-model:current-page="pageNum" v-model:page-size="pageSize" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import tableAciton from '@/components/public/tableAciton.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';
    import mateLabelEditor from '@/components/mateLabel/mateLabelEditor.vue';
    import { onMounted, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    const counterStore = useCounterStore()
    const { showPagestion, appList, OSlist, channelList, showLoading } = storeToRefs(counterStore)
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)




    //分页
    const pageNum = ref<number>(1)
    const pageSize = ref<number>(20)
    const totalData = ref<number>(0)
    watch(() => pageNum.value, () => {
        getUserList()
    })


    const showMateLabelEditor = ref<boolean>(false)
    watch(() => showMateLabelEditor.value, (newV) => {
        if (!newV) {
            labelInfo.value = {
                id: 0,
                label: '',
            }
            getUserList()
        }
    })
    //新增标签

    const addMateLabel = () => {
        showMateLabelEditor.value = true
    }

    //编辑标签
    const labelInfo = ref<{
        id: number,
        label: string
    }>()
    const editorMateLabel = (item: any) => {
        labelInfo.value = item
        showMateLabelEditor.value = true
    }

    //删除标签

    const delLabelFn = async (id: number) => {
        try {
            showLoading.value = true
            const res = await service.post(`/base/mateLabel/del/${id}`)
            console.log('删除标签', res);
            if (res.data.code === 200) {
                ElMessage({
                    message: '删除成功',
                    type: 'success',
                })
                getUserList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('删除失败', err);
        } finally {
            showLoading.value = false
        }
    }
    const deleteMateLabel = (item: any) => {
        ElMessageBox.confirm(
            '此操作将永久删除该标签, 是否继续?',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(res => {
            delLabelFn(item.id)
        })
    }
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
    interface TagItem {
        id: number | string;     // 编号
        label: string;    // 标签
    }

    const metaLabelNote: any = {
        id: '编号',
        label: '标签',

    }
    // 生成用户数据
    const tagData = ref<TagItem[]>([

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
                pageNum: pageNum.value,
                pageSize: pageSize.value,
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = false
            const res = await service.get('/base/mateLabel/list', {
                params: {
                    enData
                }

            })

            console.log('获取素材标签列表', res);
            totalData.value = res.data.total
            tagData.value = res.data.rows
            const keys = Object.keys(metaLabelNote)
            filterParams.value = keys.map((item) => {
                return {
                    note: metaLabelNote[item],
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
            height: max-content;

            .pagesBox {
                margin-top: 30px;
            }
        }
    }
</style>