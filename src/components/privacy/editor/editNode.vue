<template>
    <el-dialog title="编辑节点" v-model="dialogVisable" width="1200px" :before-close="handleClose">
        <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px" class="edit-form">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="系统" prop="os">
                        <el-input v-model="formData.os" placeholder="请输入系统" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="语言" prop="language">
                        <el-input v-model="formData.language" placeholder="请输入语言" />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="更新时间" prop="updateData">
                        <el-date-picker v-model="formData.updateData" type="datetime" placeholder="选择更新时间"
                            format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="邮箱" prop="appEmail">
                        <el-input v-model="formData.appEmail" placeholder="请输入邮箱" />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-form-item label="默认公司" prop="companyName">
                <el-input v-model="formData.companyName" placeholder="请输入默认公司" />
            </el-form-item>

            <!-- <el-form-item label="使用公司" prop="companyName">
                <el-select v-model="formData.companyName" placeholder="请选择使用公司" style="width: 100%">
                    <el-option label="如不选择时为默认公司，可为空" value="" disabled />
                    <el-option label="深圳市贝格蓝斯科技有限公司" value="深圳市贝格蓝斯科技有限公司" />
           
                </el-select>
            </el-form-item> -->

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="应用名-1" prop="appName">
                        <el-input v-model="formData.appName" placeholder="请输入应用名称" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="应用名-2" prop="appName1">
                        <el-input v-model="formData.appName1" placeholder="请输入应用名称" />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-form-item label="渠道">
                <div class="channel-container">
                    <div v-for="(channel, index) in formData.channels" :key="index" class="channel-item">
                        <el-select v-model="channel.channelNo" placeholder="选择类型" class="channel-select">
                            <el-option v-for="(item, index) in channelList" :key="item.channelId"
                                :label="`${index + 1}-${item.channelName}`"
                                :value="`${index + 1}-${item.channelName}`" />


                        </el-select>
                        <el-input v-model="channel.channelAppName" placeholder="请输入渠道值" class="channel-input" />
                        <el-button type="danger" icon="Close" @click="removeChannel(index)" class="remove-btn" />
                    </div>
                    <el-button type="primary" icon="Plus" @click="addChannel" class="add-btn">添加渠道</el-button>
                </div>
            </el-form-item>

            <!-- 第三方SDK部分 -->
            <el-divider content-position="left">
                <span class="section-title">第三方SDK</span>
            </el-divider>

            <div class="sdk-container">
                <div v-for="(sdk, index) in formData.sdkList" :key="index" class="sdk-row">
                    <el-row :gutter="10">
                        <el-col :span="3">
                            <el-input v-model="sdk.text" type="textarea" :rows="3" placeholder="sdk名称"
                                class="sdk-input" />
                        </el-col>
                        <el-col :span="3">
                            <el-input v-model="sdk.text1" type="textarea" :rows="3" placeholder="sdk使用目的"
                                class="sdk-input" />
                        </el-col>
                        <el-col :span="3">
                            <el-input v-model="sdk.text2" type="textarea" :rows="3" placeholder="sdk共享信息"
                                class="sdk-input" />
                        </el-col>
                        <el-col :span="3">
                            <el-input v-model="sdk.text3" type="textarea" :rows="3" placeholder="sdk隐私政策"
                                class="sdk-input" />
                        </el-col>
                        <el-col :span="3">
                            <el-input v-model="sdk.text4" type="textarea" :rows="3" placeholder="sdk所属公司"
                                class="sdk-input" />
                        </el-col>
                        <el-col :span="3">
                            <el-input v-model="sdk.text5" type="textarea" :rows="3" placeholder="sdk使用场景"
                                class="sdk-input" />
                        </el-col>
                        <el-col :span="3">
                            <el-input v-model="sdk.text6" type="textarea" :rows="3" placeholder="信息收集方式"
                                class="sdk-input" />
                        </el-col>
                        <el-col :span="3">
                            <div class="sdk-actions">
                                <div class="dropdown-container">
                                    <el-button type="text" icon="ArrowDown" class="action-btn"
                                        @click="toggleSDKDropdown(index)" />
                                    <div v-show="sdk.showDropdown" class="sdk-dropdown">
                                        <div v-for="item in SDKList" :key="item.id" class="dropdown-item"
                                            @click="applySDKTemplate(index, item)">
                                            {{ item.sdkName }}
                                        </div>
                                    </div>
                                </div>
                                <el-button type="danger" icon="Close" @click="removeSdk(index)" class="action-btn" />
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <el-button type="primary" icon="Plus" @click="addSdk" class="add-sdk-btn">添加SDK</el-button>
            </div>

            <!-- 应用权限部分 -->
            <el-divider content-position="left">
                <span class="section-title">应用权限</span>
            </el-divider>

            <div class="permission-container">
                <div v-for="(permission, index) in formData.permissions" :key="index" class="permission-row">
                    <el-row :gutter="10">
                        <el-col :span="7">
                            <el-input v-model="permission.text" placeholder="权限名称" type="textarea" :rows="3"
                                class="permission-input" />
                        </el-col>
                        <el-col :span="7">
                            <el-input type="textarea" :rows="3" v-model="permission.text1" placeholder="权限描述"
                                class="permission-input" />
                        </el-col>
                        <el-col :span="7">
                            <el-input type="textarea" :rows="3" v-model="permission.text2" placeholder="权限使用场景"
                                class="permission-input" />
                        </el-col>
                        <el-col :span="3">
                            <div class="permission-actions">
                                <el-button type="text" icon="ArrowDown" class="action-btn" />
                                <el-button type="danger" icon="Close" @click="removePermission(index)"
                                    class="action-btn" />
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <el-button type="primary" icon="Plus" @click="addPermission" class="add-permission-btn">添加权限</el-button>
            </div>

            <!-- 其它说明部分 -->
            <el-divider content-position="left">
                <span class="section-title">其它说明</span>
            </el-divider>

            <div class="description-container">
                <div v-for="(desc, index) in formData.descriptions" :key="index" class="description-row">
                    <el-input v-model="desc.text" type="textarea" :rows="4" placeholder="请输入其它说明内容"
                        class="description-textarea" />
                    <div class="description-actions">

                        <el-button type="danger" icon="Close" @click="removeDescription(index)" class="action-btn" />
                    </div>
                </div>
                <el-button type="primary" icon="Plus" @click="addDescription"
                    class="add-description-btn">添加说明</el-button>
            </div>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleSubmit">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    import { ref, reactive, watch, onMounted } from 'vue'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import type { FormInstance, FormRules } from 'element-plus'
    import { ArrowDown, Close, Plus } from '@element-plus/icons-vue'
    import { useCounterStore } from '@/stores/counter'
    import { storeToRefs } from 'pinia'
    import { desEncrypt } from '@/utils/des'
    import service from '@/axios'
    const stores = useCounterStore()

    const { channelList } = storeToRefs(stores)
    const dialogVisable = defineModel('dialogVisable', {
        type: Boolean,
        default: false
    })

    const props = defineProps<{
        nodeInfo: any
    }>()

    const SDKList = ref<any>([])
    const getEditInfo = async () => {
        try {
            const res = await service.get('/privacy/getDetail')
            console.log('获取编辑信息', res);

            SDKList.value = res.data.data.threeSDKS
        } catch (err) {
            console.log('获取编辑信息失败', err);
        }
    }
    onMounted(() => {
        getEditInfo()
    })

    watch(() => dialogVisable.value, (newV) => {
        if (newV && props.nodeInfo) {
            console.log('编辑节点弹窗', props.nodeInfo);
            formData.id = props.nodeInfo.id
            formData.appNo = props.nodeInfo.appNo
            formData.os = props.nodeInfo.os
            formData.language = props.nodeInfo.language
            formData.updateData = props.nodeInfo.updateData
            formData.appEmail = props.nodeInfo.appEmail
            formData.companyName = props.nodeInfo.companyName
            formData.appName = props.nodeInfo.appName
            formData.appName1 = props.nodeInfo.appName1
            if (props.nodeInfo.threesdksVos.length) {
                formData.sdkList = props.nodeInfo.threesdksVos
            }
            if (props.nodeInfo.permissionstrsVos.length) {
                formData.permissions = props.nodeInfo.permissionstrsVos
            }
            if (props.nodeInfo.otherserversVos
            ) {
                formData.descriptions = props.nodeInfo.otherserversVos
            }
            if (props.nodeInfo.channelVos.length) {
                formData.channels = props.nodeInfo.channelVos
            }
        }
    })
    const formRef = ref<FormInstance>()

    // 表单数据
    const formData = reactive({
        id: '',
        appNo: '',
        os: '',
        language: '',
        updateData: '',
        appEmail: '',
        companyName: '',
        appName: '',
        appName1: '',

        channels: [
            { id: '', channelNo: '', channelAppName: '' },


        ],

        sdkList: [
            {
                id: '',
                text: '',
                text1: '',
                text2: '',
                text3: '',
                text4: '',
                text5: '',
                text6: '',
                selectedTemplate: '',
                showDropdown: false
            }
        ],
        permissions: [
            {
                id: '',
                text: '',
                text1: '',
                text2: ''
            }
        ],
        descriptions: [
            {
                id: '',
                text: ''
            }
        ]
    })

    // 表单验证规则
    const rules: FormRules = {

    }

    // 添加渠道
    const addChannel = () => {
        formData.channels.push({ id: '', channelNo: '', channelAppName: '' })
    }

    // 删除渠道
    const removeChannel = (index: number) => {
        if (formData.channels.length > 1) {
            formData.channels.splice(index, 1)
        } else {
            ElMessage.warning('至少保留一个渠道')
        }
    }

    // 添加SDK
    const addSdk = () => {
        formData.sdkList.push({
            id: '',
            text: '',
            text1: '',
            text2: '',
            text3: '',
            text4: '',
            text5: '',
            text6: '',
            selectedTemplate: '',
            showDropdown: false
        })
    }

    // 切换SDK下拉框显示状态
    const toggleSDKDropdown = (index: number) => {
        // 关闭其他下拉框
        formData.sdkList.forEach((sdk, i) => {
            if (i !== index) {
                sdk.showDropdown = false
            }
        })
        // 切换当前下拉框状态
        formData.sdkList[index].showDropdown = !formData.sdkList[index].showDropdown
    }

    // 应用SDK模板
    const applySDKTemplate = (index: number, template: any) => {
        const sdk = formData.sdkList[index]
        sdk.text = template.sdkName || ''
        sdk.text1 = template.usePurpose || ''
        sdk.text2 = template.sharedInfoScope || ''
        sdk.text3 = template.sdkPrivacyURL || ''
        sdk.text4 = template.sdkCompany || ''
        sdk.text5 = template.useScenario || ''
        sdk.text6 = template.infoCollected || ''
        sdk.showDropdown = false
        ElMessage.success('已应用SDK模板')
    }

    // 删除SDK
    const removeSdk = (index: number) => {
        if (formData.sdkList.length > 1) {
            formData.sdkList.splice(index, 1)
        } else {
            ElMessage.warning('至少保留一个SDK')
        }
    }

    // 添加权限
    const addPermission = () => {
        formData.permissions.push({
            id: '',
            text: '',
            text1: '',
            text2: ''
        })
    }

    // 删除权限
    const removePermission = (index: number) => {
        if (formData.permissions.length > 1) {
            formData.permissions.splice(index, 1)
        } else {
            ElMessage.warning('至少保留一个权限')
        }
    }

    // 添加说明
    const addDescription = () => {
        formData.descriptions.push({
            id: '',
            text: ''
        })
    }

    // 删除说明
    const removeDescription = (index: number) => {
        if (formData.descriptions.length > 1) {
            formData.descriptions.splice(index, 1)
        } else {
            ElMessage.warning('至少保留一个说明')
        }
    }

    // 关闭弹窗
    const handleClose = () => {
        formData.id = ''
        formData.appNo = ''
        formData.os = ''
        formData.language = ''
        formData.updateData = ''
        formData.appEmail = ''
        formData.companyName = ''
        formData.appName = ''
        formData.appName1 = ''
        formData.channels = [
            { id: '', channelNo: '', channelAppName: '' },
        ]
        formData.sdkList = [
            {
                id: '',
                text: '',
                text1: '',
                text2: '',
                text3: '',
                text4: '',
                text5: '',
                text6: '',
                selectedTemplate: '',
                showDropdown: false
            }
        ]
        formData.permissions = [
            {
                id: '',
                text: '',
                text1: '',
                text2: ''
            }
        ]
        formData.descriptions = [
            {
                id: '',
                text: ''
            }
        ]
        dialogVisable.value = false
    }

    // 提交表单
    const saveChange = async () => {
        try {

            const params = {
                timestamp: Date.now(),
                appNo: formData.appNo,
                id: formData.id,
                os: formData.os,
                language: formData.language,
                updateData: formData.updateData,
                appEmail: formData.appEmail,
                companyName: formData.companyName,
                appName: formData.appName,
                appName1: formData.appName1,
                channelNo: formData.channels.map(item =>
                    item.channelNo
                ),
                channelAppName: formData.channels.map(item =>
                    item.channelAppName
                ),
                threesdkIds: formData.sdkList.map(item =>
                    String(item.id)
                ),
                threesdkText: formData.sdkList.map(item =>
                    item.text
                ),
                threesdkText1: formData.sdkList.map(item =>
                    item.text1
                ),
                threesdkText2: formData.sdkList.map(item =>
                    item.text2
                ),
                threesdkText3: formData.sdkList.map(item =>
                    item.text3
                ),
                threesdkText4: formData.sdkList.map(item =>
                    item.text4
                ),
                threesdkText5: formData.sdkList.map(item =>
                    item.text5
                ),
                threesdkText6: formData.sdkList.map(item =>
                    item.text6
                ),
                permissionIds: formData.permissions.map(item =>
                    String(item.id)
                ),
                permissionText: formData.permissions.map(item =>
                    item.text
                ),
                permissionText1: formData.permissions.map(item =>
                    item.text1
                ),
                permissionText2: formData.permissions.map(item =>
                    item.text2
                ),
                otherServerIds: formData.descriptions.map(item =>
                    String(item.id)
                ),
                otherServerText: formData.descriptions.map(item =>
                    item.text
                ),


            }

            console.log('提交参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/privacy/saveDetail', {
                enData
            }

            )
            console.log('保存编辑', res);
        } catch (err) {
            console.log('保存失败', err);
        }
    }
    const handleSubmit = async () => {
        if (!formRef.value) return

        try {
            await formRef.value.validate()
            // 这里可以添加提交逻辑
            // console.log('表单数据:', formData)
            saveChange()
            // ElMessage.success('保存成功')
            // handleClose()
        } catch (error) {
            ElMessage.error('请检查表单填写是否正确')
        }
    }
</script>

<style lang="scss" scoped>
    .edit-form {
        padding: 20px 0;

        .el-form-item {
            margin-bottom: 20px;
        }

        .channel-container {
            .channel-item {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;

                .channel-select {
                    width: 120px;
                    flex-shrink: 0;
                }

                .channel-input {
                    flex: 1;
                }

                .remove-btn {
                    width: 32px;
                    height: 32px;
                    padding: 0;
                    flex-shrink: 0;
                }
            }

            .add-btn {
                width: 100%;
                margin-top: 10px;
                border-style: dashed;

                &:hover {
                    border-style: solid;
                }
            }
        }

        // 分割线样式
        .section-title {
            font-size: 14px;
            font-weight: 600;
            color: #409eff;
        }

        // SDK容器样式
        .sdk-container {
            margin-bottom: 30px;

            .sdk-row {
                margin-bottom: 15px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
                border: 1px solid #e9ecef;
                transition: all 0.3s;

                &:hover {
                    border-color: #409eff;
                    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
                }

                .sdk-input {
                    margin-bottom: 8px;
                }

                .sdk-actions {
                    display: flex;
                    flex-direction: row;
                    gap: 8px;
                    align-items: center;
                    justify-content: center;

                    .dropdown-container {
                        position: relative;

                        .sdk-dropdown {
                            position: absolute;
                            top: 100%;
                            left: 0;
                            width: 150px;
                            background: white;
                            border: 1px solid #dcdfe6;
                            border-radius: 4px;
                            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                            z-index: 1000;
                            max-height: 200px;
                            overflow-y: auto;

                            .dropdown-item {
                                padding: 8px 12px;
                                cursor: pointer;
                                font-size: 12px;
                                border-bottom: 1px solid #f5f7fa;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;

                                &:hover {
                                    background-color: #f5f7fa;
                                }

                                &:last-child {
                                    border-bottom: none;
                                }
                            }
                        }
                    }

                    .action-btn {
                        width: 32px;
                        height: 32px;
                        border-radius: 6px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                }
            }

            .add-sdk-btn {
                width: 100%;
                margin-top: 15px;
                border-style: dashed;
                height: 40px;
                font-size: 14px;

                &:hover {
                    border-style: solid;
                }
            }
        }

        // 权限容器样式
        .permission-container {
            margin-bottom: 30px;

            .permission-row {
                margin-bottom: 15px;
                padding: 15px;
                background: #f0f9ff;
                border-radius: 8px;
                border: 1px solid #e0f2fe;
                transition: all 0.3s;

                &:hover {
                    border-color: #0ea5e9;
                    box-shadow: 0 2px 8px rgba(14, 165, 233, 0.1);
                }

                .permission-input {
                    margin-bottom: 8px;
                }

                .permission-actions {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 5px;

                    .action-btn {
                        width: 28px;
                        height: 28px;
                        padding: 0;
                        border-radius: 4px;
                    }
                }
            }

            .add-permission-btn {
                width: 100%;
                margin-top: 15px;
                border-style: dashed;
                height: 40px;
                font-size: 14px;

                &:hover {
                    border-style: solid;
                }
            }
        }

        // 说明容器样式
        .description-container {
            margin-bottom: 30px;

            .description-row {
                margin-bottom: 15px;
                padding: 15px;
                background: #fefce8;
                border-radius: 8px;
                border: 1px solid #fef3c7;
                transition: all 0.3s;
                position: relative;

                &:hover {
                    border-color: #f59e0b;
                    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.1);
                }

                .description-textarea {
                    margin-bottom: 10px;
                }

                .description-actions {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    display: flex;
                    gap: 5px;

                    .action-btn {
                        width: 28px;
                        height: 28px;
                        padding: 0;
                        border-radius: 4px;
                        background: rgba(255, 255, 255, 0.8);
                        backdrop-filter: blur(4px);
                    }
                }
            }

            .add-description-btn {
                width: 100%;
                margin-top: 15px;
                border-style: dashed;
                height: 40px;
                font-size: 14px;

                &:hover {
                    border-style: solid;
                }
            }
        }
    }

    .dialog-footer {
        text-align: right;

        .el-button {
            margin-left: 10px;
        }
    }

    :deep(.el-dialog) {
        border-radius: 8px;
        max-height: 90vh;
        display: flex;
        flex-direction: column;

        .el-dialog__header {
            padding: 20px 20px 10px;
            border-bottom: 1px solid #ebeef5;
            flex-shrink: 0;

            .el-dialog__title {
                font-size: 16px;
                font-weight: 600;
                color: #303133;
            }
        }

        .el-dialog__body {
            padding: 10px 20px;
            overflow-y: auto;
            flex: 1;
            max-height: calc(90vh - 140px);
        }

        .el-dialog__footer {
            padding: 10px 20px 20px;
            border-top: 1px solid #ebeef5;
            flex-shrink: 0;
        }
    }

    :deep(.el-form-item__label) {
        font-weight: 500;
        color: #606266;
    }

    :deep(.el-input__wrapper) {
        border-radius: 6px;
        transition: all 0.3s;

        &:hover {
            border-color: #c0c4cc;
        }

        &.is-focus {
            border-color: #409eff;
            box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
        }
    }

    :deep(.el-select) {
        .el-input__wrapper {
            border-radius: 6px;
        }
    }

    :deep(.el-date-editor) {
        .el-input__wrapper {
            border-radius: 6px;
        }
    }
</style>