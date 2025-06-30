<template>
    <el-dialog :model-value="dialogVisible" title="权限模板" width="1000" :before-close="handleClose">
        <div class="view">
            <prermissionTemplateEditor v-model:showEditor="showEditor" :prermissionInfo="prermissionInfo" />
            <el-card class="filter-card">
                <div class="card-header" style="margin: 0;">
                    <div class="left-actions">
                        <el-button type="primary" @click="addPermission" class="add-button">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            新增模板
                        </el-button>
                        <el-select @change="getUserList" v-model="language" placeholder="请选择语言"
                            style="width: 150px;margin-left: 10px;">
                            <el-option v-for="item in international" :key="item.value" :label="item.language"
                                :value="item.value" />
                        </el-select>
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
                    <component :is="componentName" :filterParams="filterParams" :tableData="roleData"
                        @editor="editorTemplate" @delete="deleteTemplate"></component>
                </Transition>

                <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                    :total="totalData" v-model="pageNum" :page-size="pageSize" />
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
    import prermissionTemplateEditor from './editor/prermissionTemplateEditor.vue';
    import { onMounted, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    import { ElMessage, ElMessageBox } from 'element-plus';
    const counterStore = useCounterStore()
    const { showPagestion, international } = storeToRefs(counterStore)
    const props = defineProps<{
        dialogVisible: boolean
    }>()


    //分页
    const pageNum = ref<number>(1)
    const pageSize = ref<number>(10)
    const totalData = ref<number>(0)
    watch(() => pageNum.value, () => {
        getUserList()

    })

    //新增权限模板
    const showEditor = ref<boolean>(false)
    watch(() => showEditor.value, (newV) => {
        if (!newV) {
            prermissionInfo.value = ''
            getUserList()
        }
    })
    const prermissionInfo = ref<any>('')
    const addPermission = () => {
        showEditor.value = true
    }



    //编辑
    const editorTemplate = (data: any) => {
        console.log('data', data);
        prermissionInfo.value = data
        showEditor.value = true
    }
    //删除
    const deleteFn = async (id: number) => {
        try {
            const res = await service.post(`/appInfoDetailPermissionstrsItems//del/${id}`)
            if (res.data.code === 200) {
                ElMessage.success('删除成功')
                getUserList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {

        }
    }
    const deleteTemplate = (data: any) => {
        ElMessageBox.confirm('确定删除该模板吗？',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(res => {
                console.log('删除');
                deleteFn(data.id)
            })
    }
    //选择语言
    const language = ref('')


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
        permissionName: string; // 权限名称
        permissionDesc: string; // 权限描述
        permissionUsageScenarios: string;    // 权限用途
    }
    const permissionNote: any = {
        permissionName: '权限名称',
        permissionDesc: '权限描述',
        permissionUsageScenarios: '权限用途',


    }
    // 生成角色数据
    const roleData = ref<Permission[]>([

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
                language: language.value,
                pageNum: pageNum.value,
                pageSize: pageSize.value,
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/appInfoDetailPermissionstrsItems/list', {
                enData
            })
            console.log('获取权限列表', res);
            roleData.value = res.data.rows
            totalData.value = res.data.total

            const keys = Object.keys(permissionNote)
            filterParams.value = keys.map((item) => {
                return {
                    note: permissionNote[item],
                    isShow: true,
                    key: item
                }
            })
            console.log('filterParams', filterParams.value);

        } catch (err) {
            console.log('获取权限列表失败', err);
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
        language.value = international.value[0].value
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