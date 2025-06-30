<template>
    <el-dialog :model-value="dialogVisible" title="第三方SDK模板" width="1000" :before-close="handleClose">
        <div class="view">
            <SDKTemplateEditor v-model:show-editor="showEditor" :SDKInfo="SDKInfo" />
            <el-card class="filter-card">
                <div class="card-header" style="margin: 0;">
                    <div class="left-actions">
                        <el-button type="primary" @click="addTemplate" class="add-button">
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
                    :total="totalData" v-model:current-page="pageNum" v-model:page-size="pageSize" />
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
    import SDKTemplateEditor from './editor/SDKTemplateEditor.vue';
    import { onMounted, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    const counterStore = useCounterStore()
    const { showPagestion, international } = storeToRefs(counterStore)
    const props = defineProps<{
        dialogVisible: boolean
    }>()
    console.log('international', international);

    //分页
    const pageNum = ref<number>(1)
    const pageSize = ref<number>(10)
    const totalData = ref<number>(0)
    watch(() => pageNum.value, () => {
        getUserList()
    })
    //新增模板
    const showEditor = ref<boolean>(false)
    watch(() => showEditor.value, (newV) => {
        if (!newV) {
            SDKInfo.value = ''
            getUserList()
        }
    })
    const SDKInfo = ref<any>()
    const addTemplate = (item: any) => {
        showEditor.value = true
    }
    const editorTemplate = (item: any) => {
        SDKInfo.value = item
        showEditor.value = true

    }
    const deleteFn = async (id: number) => {
        try {
            const res = await service.post(`/appInfoDetailThreesdksItems/del/${id}`)
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
        }
    }
    const deleteTemplate = (item: any) => {
        ElMessageBox.confirm(
            '确定删除该模板吗？',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(res => {
            deleteFn(item.id)
        })
    }


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
    interface SDKItem {
        sdkName: string;        // SDK名称
        sdkPackage: string;    // 包名
        usePurpose: string;        // 使用目的
        sharedInfoScope: string; // 共享信息范围
        sdkCompany: string;        // SDK所属公司
        sdkPrivacyURL: string; // 隐私政策链接
    }
    const userNote: any = {
        sdkName: 'SDK名称',
        sdkPackage: '包名',
        usePurpose: '使用目的',
        sharedInfoScope: '共享信息范围',
        sdkCompany: 'SDK所属公司',
        sdkPrivacyURL: '隐私政策链接',

    }
    //语言
    const language = ref<string>('')


    // 生成角色数据
    const roleData = ref<SDKItem[]>([

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
                language: language.value,
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/appInfoDetailThreesdksItems/list', {
                enData
            })
            console.log('获取列表', res);

            roleData.value = res.data.rows
            totalData.value = res.data.total
            const keys = Object.keys(userNote)
            filterParams.value = keys.map((item) => {
                return {
                    note: userNote[item],
                    isShow: true,
                    key: item
                }
            })
            console.log('filterParams', filterParams.value);

        } catch (err) {
            console.log('获取第三方sdk模板失败', err);
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