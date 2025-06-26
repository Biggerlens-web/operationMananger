<template>
    <el-dialog :model-value="dialogVisible" title="权限模板" width="1000" :before-close="handleClose">
        <div class="view">
            <prermissionTemplateEditor v-model:showEditor="showEditor" />
            <el-card class="filter-card">
                <div class="card-header" style="margin: 0;">
                    <div class="left-actions">
                        <el-button type="primary" @click="addPermission" class="add-button">
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
                        :showAction="false"></component>
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
    import prermissionTemplateEditor from './editor/prermissionTemplateEditor.vue';
    import { onMounted, ref } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    const counterStore = useCounterStore()
    const { showPagestion } = storeToRefs(counterStore)
    const props = defineProps<{
        dialogVisible: boolean
    }>()


    //新增权限模板
    const showEditor = ref<boolean>(false)
    const addPermission = () => {
        showEditor.value = true
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
        description: string; // 权限描述
        purpose: string;    // 权限用途
    }
    const permissionNote: any = {
        name: '权限名称',
        description: '权限描述',
        purpose: '权限用途',


    }
    // 生成角色数据
    const roleData = ref<Permission[]>([
        {
            name: "READ_USER",
            description: "读取用户信息",
            purpose: "允许查看用户的基本信息，如用户名、邮箱等"
        },
        {
            name: "WRITE_USER",
            description: "修改用户信息",
            purpose: "允许更新用户的个人信息，如修改密码、更新资料等"
        },
        {
            name: "DELETE_USER",
            description: "删除用户",
            purpose: "允许删除用户账号及其相关数据"
        },
        {
            name: "MANAGE_ROLES",
            description: "管理角色",
            purpose: "允许创建、修改和删除系统角色，分配权限"
        },
        {
            name: "VIEW_LOGS",
            description: "查看日志",
            purpose: "允许查看系统操作日志和审计记录"
        },
        {
            name: "MANAGE_SETTINGS",
            description: "管理系统设置",
            purpose: "允许修改系统配置参数和全局设置"
        },
        {
            name: "CREATE_CONTENT",
            description: "创建内容",
            purpose: "允许创建新的内容，如文章、评论等"
        },
        {
            name: "EDIT_CONTENT",
            description: "编辑内容",
            purpose: "允许修改已存在的内容"
        },
        {
            name: "DELETE_CONTENT",
            description: "删除内容",
            purpose: "允许删除已存在的内容"
        },
        {
            name: "MANAGE_MEDIA",
            description: "管理媒体文件",
            purpose: "允许上传、删除和管理系统中的媒体文件"
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
        const dataItem = roleData.value[0]
        const keys = Object.keys(dataItem)
        filterParams.value = keys.map((item) => {
            return {
                note: permissionNote[item],
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