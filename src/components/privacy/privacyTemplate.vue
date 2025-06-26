<template>
    <el-dialog :model-value="dialogVisible" title="第三方SDK模板" width="1000" :before-close="handleClose">
        <div class="view">
            <SDKTemplateEditor v-model:show-editor="showEditor" />
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
                        @editor="editorTemplate" @delete="deleteTemplate"></component>
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
    import SDKTemplateEditor from './editor/SDKTemplateEditor.vue';
    import { onMounted, ref } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessageBox } from 'element-plus';
    const counterStore = useCounterStore()
    const { showPagestion } = storeToRefs(counterStore)
    const props = defineProps<{
        dialogVisible: boolean
    }>()
    //新增模板
    const showEditor = ref<boolean>(false)
    const addTemplate = (item: any) => {
        showEditor.value = true
    }
    const editorTemplate = (item: any) => {
        showEditor.value = true

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
    interface SDKItem {
        sdkName: string;        // SDK名称
        packageName: string;    // 包名
        purpose: string;        // 使用目的
        sharedInfoScope: string; // 共享信息范围
        company: string;        // SDK所属公司
        privacyPolicyUrl: string; // 隐私政策链接
    }
    const userNote: any = {
        sdkName: 'SDK名称',
        packageName: '包名',
        purpose: '使用目的',
        sharedInfoScope: '共享信息范围',
        company: 'SDK所属公司',
        privacyPolicyUrl: '隐私政策链接',

    }
    // 生成角色数据
    const roleData = ref<SDKItem[]>([
        {
            sdkName: 'Firebase Analytics',
            packageName: 'com.google.firebase.analytics',
            purpose: '数据分析与统计',
            sharedInfoScope: '设备信息、应用使用情况、用户行为',
            company: 'Google LLC',
            privacyPolicyUrl: 'https://firebase.google.com/support/privacy'
        },
        {
            sdkName: 'Tencent Bugly',
            packageName: 'com.tencent.bugly',
            purpose: '崩溃分析与错误报告',
            sharedInfoScope: '设备信息、应用错误日志',
            company: '腾讯科技(深圳)有限公司',
            privacyPolicyUrl: 'https://privacy.qq.com/document/preview/fc748b3d96224fdb825ea79e132c1a56'
        },
        {
            sdkName: 'Umeng Analytics',
            packageName: 'com.umeng.analytics',
            purpose: '用户行为分析',
            sharedInfoScope: '设备信息、应用使用情况、用户行为',
            company: '阿里巴巴集团',
            privacyPolicyUrl: 'https://www.umeng.com/page/policy'
        },
        {
            sdkName: 'JPush',
            packageName: 'cn.jpush.android',
            purpose: '消息推送服务',
            sharedInfoScope: '设备信息、推送标识符',
            company: '极光推送',
            privacyPolicyUrl: 'https://www.jiguang.cn/license/privacy'
        },
        {
            sdkName: 'WeChat SDK',
            packageName: 'com.tencent.mm.opensdk',
            purpose: '微信登录与分享',
            sharedInfoScope: '用户授权信息',
            company: '腾讯科技(深圳)有限公司',
            privacyPolicyUrl: 'https://weixin.qq.com/cgi-bin/readtemplate?lang=zh_CN&t=weixin_agreement&s=privacy'
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