<template>
    <el-dialog :model-value="dialogVisible" title="编辑渠道" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>

            <el-form-item label="渠道组名称" prop="channelName">
                <el-input v-model="formData.channelName" />
            </el-form-item>
        </el-form>
        <div class="channel-section">
            <div class="channel-header">
                <h4>渠道配置</h4>
                <el-button type="primary" size="small" @click="addChannelData">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    添加渠道
                </el-button>
            </div>

            <div class="channel-list" v-if="channelData.length > 0">
                <div v-for="(item, index) in channelData" :key="index" class="channel-item">
                    <div class="channel-inputs">
                        <el-input placeholder="渠道Key" v-model="item.channelKey" class="channel-input"></el-input>
                        <el-input placeholder="渠道Value" v-model="item.channelValue" class="channel-input"></el-input>
                        <el-input placeholder="描述信息" v-model="item.channelRemark" class="channel-input"></el-input>
                    </div>
                    <el-button type="danger" size="small" plain @click="removeChannelData(index)" class="remove-btn">
                        <el-icon>
                            <Delete />
                        </el-icon>
                    </el-button>
                </div>
            </div>

            <div v-else class="empty-state">
                <p>暂无渠道配置，点击上方按钮添加</p>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleComfirm(ruleFormRef)">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    import service from '@/axios';
    import { useCounterStore } from '@/stores/counter';
    import { desEncrypt } from '@/utils/des';
    import { ElMessage, type FormInstance } from 'element-plus';
    import { Plus, Delete } from '@element-plus/icons-vue';
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue'
    const counterStore = useCounterStore()
    const { appList, OSlist, channelList, showLoading } = storeToRefs(counterStore)
    const props = defineProps<{
        dialogVisible: boolean
    }>()
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()

    const formData = ref<any>({
        channelName: '',
        channelKeys: [],
        channelValues: [],
        channelRemarks: [],

    })
    const channelData = ref<any>([])

    const addChannelData = () => {
        const newData = {
            channelRemark: '',
            channelKey: '',
            channelValue: '',
        }
        channelData.value.push(newData)
    }

    const removeChannelData = (index: number) => {
        channelData.value.splice(index, 1)
    }
    const ruleFormRef = ref<FormInstance>()
    const rules = ref<any>({


    })

    const resetForm = () => {
        formData.value = {


            channelName: '',
            channelKeys: [],
            channelValues: [],
            channelRemarks: [],


        }
        ruleFormRef.value?.resetFields()
    }
    const handleClose = () => {
        resetForm()
        emit('update:dialogVisible', false)
    }


    const saveChange = async () => {
        try {
            showLoading.value = true
            formData.value.channelKeys = channelData.value.map((item: any) => item.channelKey)
            formData.value.channelValues = channelData.value.map((item: any) => item.channelValue)
            formData.value.channelRemarks = channelData.value.map((item: any) => item.channelRemark)
            const params = {
                timestamp: Date.now(),
                channelName: formData.value.channelName,
                channelKeys: formData.value.channelKeys,
                channelValues: formData.value.channelValues,
                channelRemarks: formData.value.channelRemarks,
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/apkSignChannels/save', {
                enData
            })
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
                handleClose()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('保存失败', err);
        } finally {
            showLoading.value = false
        }
    }
    const handleComfirm = (ruleFormRef: any) => {
        ruleFormRef.validate((valid: any) => {
            if (valid) {
                console.log('submit!');
                saveChange()
            }
        })
    }
</script>

<style lang="scss" scoped>
    .channel-section {
        margin-top: 20px;

        .channel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e4e7ed;

            h4 {
                margin: 0;
                color: #303133;
                font-size: 16px;
                font-weight: 600;
            }
        }

        .channel-list {
            .channel-item {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                margin-bottom: 12px;
                padding: 16px;
                background: #f8f9fa;
                border-radius: 8px;
                border: 1px solid #e4e7ed;
                transition: all 0.3s ease;

                &:hover {
                    border-color: #409eff;
                    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
                }

                .channel-inputs {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;

                    .channel-input {
                        :deep(.el-input__wrapper) {
                            border-radius: 6px;
                        }
                    }
                }

                .remove-btn {
                    margin-top: 4px;
                    min-width: 32px;
                    height: 32px;

                    &:hover {
                        background-color: #f56c6c;
                        border-color: #f56c6c;
                        color: white;
                    }
                }
            }
        }

        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: #909399;
            background: #fafafa;
            border-radius: 8px;
            border: 1px dashed #d9d9d9;

            p {
                margin: 0;
                font-size: 14px;
            }
        }
    }

    // 响应式设计
    @media (max-width: 768px) {
        .channel-section {
            .channel-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 12px;
            }

            .channel-list {
                .channel-item {
                    flex-direction: column;

                    .remove-btn {
                        align-self: flex-end;
                        margin-top: 8px;
                    }
                }
            }
        }
    }
</style>