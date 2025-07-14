<template>
    <div class="privacy_config_page">
        <el-card>
            <el-tabs v-model="activePlatform" @tab-click="handlePlatformChange">
                <el-tab-pane label="Android" name="android"></el-tab-pane>
                <el-tab-pane label="iOS" name="ios"></el-tab-pane>
            </el-tabs>
            <div style="display: flex; justify-content: flex-end; margin-bottom: 10px;">
                <el-button type="primary" link @click="addSystem">+添加系统</el-button>
            </div>

            <el-form :model="privacyForm" label-width="100px" style="margin-top: 20px;">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="语言:">
                            <el-select v-model="privacyForm.language" placeholder="请选择语言">
                                <el-option v-for="item in international" :label="item.language" :value="item.value"
                                    :key="item.value"></el-option>


                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-button type="primary" link @click="manageLanguages">管理语言列表</el-button>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="更新时间">
                            <el-date-picker v-model="privacyForm.updateTime" type="date"
                                placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="邮箱">
                            <el-input v-model="privacyForm.email1"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="默认公司">
                            <el-input v-model="privacyForm.defaultCompany"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="邮箱">
                            <el-input v-model="privacyForm.email2"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="邮箱">
                            <el-input v-model="privacyForm.email3"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="渠道名:">
                    <el-tag v-for="channel in privacyForm.channels" :key="channel.name" closable
                        @close="removeChannel(channel)" style="margin-right: 5px;">
                        {{ channel.name }} <el-tag type="info" size="small">{{ channel.vendor }}</el-tag>
                    </el-tag>
                    <el-button size="small" @click="addChannel">+ 添加渠道名</el-button>
                </el-form-item>

                <!-- 第三方SDK -->
                <div class="config-section">
                    <div class="section-header">
                        <h3>第三方SDK</h3>
                        <el-button type="primary" text @click="addSDKField()" :icon="Plus">添加SDK</el-button>
                    </div>
                    <div v-for="(sdk, index) in privacyForm.thirdPartySDKs" :key="index" class="sdk-item-row">
                        <el-row :gutter="10" align="middle" style="width: 100%;">
                            <el-col :span="4">
                                <el-form-item label-width="0px">
                                    <el-input v-model="sdk.name" placeholder="SDK名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label-width="0px">
                                    <el-input v-model="sdk.usageDescription" placeholder="使用场景描述" type="textarea"
                                        :autosize="{ minRows: 1, maxRows: 2 }"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label-width="0px">
                                    <el-input v-model="sdk.sharedInfoType" placeholder="共享个人信息类型" type="textarea"
                                        :autosize="{ minRows: 1, maxRows: 2 }"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label-width="0px">
                                    <el-input v-model="sdk.privacyPolicyUrl" placeholder="隐私政策链接"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <el-form-item label-width="0px">
                                    <el-input v-model="sdk.company" placeholder="所属公司"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="3" class="actions-col">
                                <div class="actions">
                                    <el-icon @click="moveUp(privacyForm.thirdPartySDKs, index)" :disabled="index === 0">
                                        <ArrowUpBold />
                                    </el-icon>
                                    <el-icon @click="moveDown(privacyForm.thirdPartySDKs, index)"
                                        :disabled="index === privacyForm.thirdPartySDKs.length - 1">
                                        <ArrowDownBold />
                                    </el-icon>
                                    <el-icon @click="removeSDK(index)">
                                        <CloseBold />
                                    </el-icon>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>

                <!-- 权限 -->
                <div class="config-section">
                    <div class="section-header">
                        <h3>权限</h3>
                        <el-button type="primary" text @click="addPermissionField()" :icon="Plus">添加权限</el-button>
                    </div>
                    <div v-for="(permission, index) in privacyForm.permissions" :key="index" class="config-item-row">
                        <el-row :gutter="10" align="middle" style="width: 100%;">
                            <el-col :span="7">
                                <el-form-item label-width="0px">
                                    <el-input v-model="permission.name" placeholder="权限名"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label-width="0px">
                                    <el-input v-model="permission.description" placeholder="权限描述" type="textarea"
                                        :autosize="{ minRows: 1, maxRows: 2 }"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label-width="0px">
                                    <el-input v-model="permission.usageScenario" placeholder="权限使用场景" type="textarea"
                                        :autosize="{ minRows: 1, maxRows: 2 }"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="3" class="actions-col">
                                <div class="actions">
                                    <el-icon @click="moveUp(privacyForm.permissions, index)" :disabled="index === 0">
                                        <ArrowUpBold />
                                    </el-icon>
                                    <el-icon @click="moveDown(privacyForm.permissions, index)"
                                        :disabled="index === privacyForm.permissions.length - 1">
                                        <ArrowDownBold />
                                    </el-icon>
                                    <el-icon @click="removePermission(index)">
                                        <CloseBold />
                                    </el-icon>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>

                <!-- 其他说明 -->
                <div class="config-section">
                    <div class="section-header">
                        <h3>其他说明</h3>
                        <el-button type="primary" text @click="addOtherNoteField()" :icon="Plus">添加说明</el-button>
                    </div>
                    <div v-for="(note, index) in privacyForm.otherNotes" :key="index" class="config-item-row">
                        <el-row :gutter="10" align="middle" style="width: 100%;">
                            <el-col :span="21">
                                <el-form-item label-width="0px">
                                    <el-input v-model="note.content" placeholder="说明内容" type="textarea"
                                        :autosize="{ minRows: 1, maxRows: 3 }"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="3" class="actions-col">
                                <div class="actions">
                                    <el-icon @click="moveUp(privacyForm.otherNotes, index)" :disabled="index === 0">
                                        <ArrowUpBold />
                                    </el-icon>
                                    <el-icon @click="moveDown(privacyForm.otherNotes, index)"
                                        :disabled="index === privacyForm.otherNotes.length - 1">
                                        <ArrowDownBold />
                                    </el-icon>
                                    <el-icon @click="removeOtherNote(index)">
                                        <CloseBold />
                                    </el-icon>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-form>

            <div style="text-align: right; margin-top: 20px;">
                <el-button type="primary" @click="savePrivacyConfig">保存</el-button>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
    import { ref, reactive } from 'vue';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { Plus, ArrowUpBold, ArrowDownBold, CloseBold } from '@element-plus/icons-vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    const stores = useCounterStore()
    const { international } = storeToRefs(stores);
    const activePlatform = ref<string>('android'); // Default to Android

    interface Channel {
        name: string;
        vendor: string;
    }

    interface ThirdPartySDK {
        name: string;
        usageDescription: string;
        sharedInfoType: string;
        privacyPolicyUrl: string;
        company: string;
    }

    interface Permission {
        name: string;
        description: string;
        usageScenario: string;
    }

    interface OtherNote {
        content: string;
    }

    interface PrivacyForm {
        language: string;
        updateTime: string | Date;
        email1: string;
        email2: string;
        email3: string;
        defaultCompany: string;
        channels: Channel[];
        thirdPartySDKs: ThirdPartySDK[];
        permissions: Permission[];
        otherNotes: OtherNote[];
    }

    const privacyForm = reactive<PrivacyForm>({
        language: 'en',
        updateTime: '',
        email1: '',
        email2: '',
        email3: '',
        defaultCompany: '',
        channels: [
            { name: 'knockout', vendor: '小米' },
            { name: 'Proknockour 智能抠图', vendor: '华为' },
            { name: 'Proknockour 智能抠图', vendor: 'OPPO' },
        ],
        thirdPartySDKs: [
            { name: '', usageDescription: '', sharedInfoType: '', privacyPolicyUrl: '', company: '' }
        ],
        permissions: [
            { name: '', description: '', usageScenario: '' }
        ],
        otherNotes: [
            { content: '' }
        ],
    });

    const handlePlatformChange = (tab: any) => {
        console.log('Platform changed to:', tab.paneName);
        // Here you would typically load data for the selected platform
        // For now, we'll just log it
    };

    const addSystem = () => {

    };

    const manageLanguages = () => {

    };

    const addChannel = () => {
        ElMessageBox.prompt('请输入渠道名和厂商 (用空格分隔)', '添加渠道名', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: 'mychannel 小米'
        })
            .then(({ value }) => {
                if (value) {
                    const parts = value.split(' ');
                    const name = parts[0];
                    const vendor = parts.length > 1 ? parts.slice(1).join(' ') : '';
                    privacyForm.channels.push({ name, vendor });
                    ElMessage.success('渠道添加成功');
                }
            })
            .catch(() => { });
    };

    const removeChannel = (channel: Channel) => {
        const index = privacyForm.channels.indexOf(channel);
        if (index !== -1) {
            privacyForm.channels.splice(index, 1);
        }
    };

    // SDK Functions
    const addSDKField = () => { // Removed sectionIndex as it's adding a new SDK row
        const newSDK = { name: '', usageDescription: '', sharedInfoType: '', privacyPolicyUrl: '', company: '' };
        privacyForm.thirdPartySDKs.push(newSDK);
    };

    const removeSDK = (index: number) => {
        privacyForm.thirdPartySDKs.splice(index, 1);
    };

    // Permission Functions
    const addPermissionField = () => { // Removed sectionIndex
        const newPermission = { name: '', description: '', usageScenario: '' };
        privacyForm.permissions.push(newPermission);
    };

    const removePermission = (index: number) => {
        privacyForm.permissions.splice(index, 1);
    };

    // OtherNote Functions
    const addOtherNoteField = () => { // Removed sectionIndex
        const newNote = { content: '' };
        privacyForm.otherNotes.push(newNote);
    };

    const removeOtherNote = (index: number) => {
        privacyForm.otherNotes.splice(index, 1);
    };

    // Generic move up/down functions
    const moveUp = (list: any[], index: number) => {
        if (index > 0) {
            const item = list.splice(index, 1)[0];
            list.splice(index - 1, 0, item);
        }
    };

    const moveDown = (list: any[], index: number) => {
        if (index < list.length - 1) {
            const item = list.splice(index, 1)[0];
            list.splice(index + 1, 0, item);
        }
    };

    const savePrivacyConfig = () => {
        console.log('Saving privacy config:', JSON.parse(JSON.stringify(privacyForm)));
        ElMessage.success('隐私配置已保存 (查看控制台)');
        // Here you would typically send the data to a backend API
    };

</script>

<style lang="scss" scoped>
    .privacy_config_page {
        padding: 20px;
    }

    .el-form-item {
        margin-bottom: 18px;
    }

    .config-section {
        border: 1px solid #ebeef5;
        padding: 15px;
        margin-bottom: 20px;
        border-radius: 4px;
    }

    .sdk-item-row,
    .config-item-row {
        display: flex;
        align-items: flex-start;
        /* Align items to the start for textarea height */
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px dashed #eee;
        /* Optional: separator for rows */
    }

    .sdk-item-row:last-child,
    .config-item-row:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }

    .actions-col {
        display: flex;
        align-items: center;
        /* Vertically center icons with inputs */
        justify-content: flex-end;
        height: 100%;
        /* Ensure it takes full height of the row for alignment */

        .actions .el-icon {
            margin-left: 10px;
            /* Increased spacing between icons */
            font-size: 18px;
            /* Slightly larger icons */
            color: #73767a;
            /* Softer color */
            transition: color 0.2s ease-in-out;
        }

        .actions .el-icon:hover {
            color: #409EFF;
        }

        .actions .el-icon[disabled] {
            color: #c8c9cc;
            cursor: not-allowed;
        }

        .actions .el-icon:first-child {
            margin-left: 0;
        }
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        h3 {
            margin: 0;
            font-size: 16px;
        }

        .actions {
            .el-icon {
                cursor: pointer;
                margin-left: 8px;
                font-size: 16px;
                color: #409EFF;

                &:hover {
                    color: #66b1ff;
                }

                &[disabled] {
                    color: #c0c4cc;
                    cursor: not-allowed;
                }
            }
        }
    }
</style>