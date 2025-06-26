<template>

    <el-dialog :model-value="dialogVisible" title="其他说明模板" width="1000" :before-close="handleClose">

        <div class="view">
            <otherTemplateEditor v-model:show-editor="showEditor" />
            <el-card class="filter-card">
                <div class="card-header" style="margin: 0;">
                    <div class="left-actions">
                        <el-button type="primary" @click="addTemplate" class="add-button">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            新增模板
                        </el-button>
                        <el-select v-model="language" placeholder="请选择语言" style="width: 150px;margin-left: 10px;">
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </div>
                    <div class="right-actions">
                        <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
                            @changeView="changeView" />
                    </div>
                </div>

                <!-- <el-divider class="divider" />

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


            </div> -->
            </el-card>
            <el-card class="content-card">
                <Transition enter-active-class="animate__animated animate__fadeIn"
                    leave-active-class="animate__animated animate__fadeOut" mode="out-in">
                    <component :is="componentName" :filterParams="filterParams" :tableData="roleData"
                        @editor="editorTemplate" @delete="doleteTemplate"></component>
                </Transition>

                <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                    :total="1000" />
            </el-card>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleComfirm">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>

    import tableAciton from '@/components/public/tableAciton.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';
    import otherTemplateEditor from './editor/otherTemplateEditor.vue';
    import { onMounted, ref } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessageBox } from 'element-plus';
    const counterStore = useCounterStore()
    const { showPagestion } = storeToRefs(counterStore)
    const props = defineProps<{
        dialogVisible: boolean
    }>()
    //新增说明模板
    const showEditor = ref(false)
    const addTemplate = () => {



        showEditor.value = true
        console.log('showEditor', showEditor.value);
    }
    //编辑说明模板
    const editorTemplate = (item: any) => {
        console.log('编辑说明模板', item);
        showEditor.value = true
    }


    //删除说明模板
    const doleteTemplate = (item: any) => {
        console.log('删除说明模板', item);
        ElMessageBox.confirm(
            '是否确认删除该模板？',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )
    }
    //选择语言
    const language = ref('')
    const options = ref([
        {
            value: '1',
            label: '中文'
        },
        {
            value: '2',
            label: '英文'
        }
    ])

    const emit = defineEmits<{

        'update:dialogVisible': [value: boolean]
    }>()



    const handleClose = () => {
        emit('update:dialogVisible', false)
    }

    const handleComfirm = () => {
        emit('update:dialogVisible', false)
    }



    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)
    interface Permission {
        name: string; // 权限名称

    }
    const userNote: any = {
        name: '权限名称',


    }
    // 生成角色数据
    const roleData = ref<Permission[]>([
        { name: "READ_USER" },
        { name: "WRITE_USER" },
        { name: "DELETE_USER" },
        { name: "MANAGE_ROLES" },
        { name: "VIEW_LOGS" },
        { name: "MANAGE_SETTINGS" },
        { name: "CREATE_CONTENT" },
        { name: "EDIT_CONTENT" },
        { name: "DELETE_CONTENT" },
        { name: "MANAGE_MEDIA" }
    ])
    interface filterParams {
        note: string
        isShow: boolean
        key: string
    }
    const filterParams = ref<filterParams[]>()
    const getUserList = async () => {
        console.log('获取用户列表');
        const dataItem = roleData.value[0]
        const keys = Object.keys(dataItem)
        filterParams.value = keys.map((item) => {
            return {
                note: userNote[item],
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

<style lang="scss" scoped>
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