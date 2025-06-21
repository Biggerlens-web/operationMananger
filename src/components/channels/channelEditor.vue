<template>
    <el-dialog :model-value="dialogVisible" title="编辑渠道" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>


            <el-form-item label="渠道编号" prop="channelId">
                <el-input v-model="formData.channelId" />
            </el-form-item>
            <el-form-item label="渠道名称" prop="channelName">
                <el-input v-model="formData.channelName" />
            </el-form-item>
            <el-form-item label="渠道说明" prop="channelRemark">
                <el-input type="textarea" v-model="formData.channelRemark" />
            </el-form-item>
        </el-form>
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
    import { desEncrypt } from '@/utils/des';
    import { ElMessage, type FormInstance } from 'element-plus';
    import { ref, watch } from 'vue'
    const props = defineProps<{
        dialogVisible: boolean
        channelInfo: any
    }>()
    watch(() => props.dialogVisible, (newV) => {
        if (newV && props.channelInfo) {
            formData.value = {
                ...props.channelInfo
            }
        }
    })
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()

    const formData = ref<any>({
        id: '',
        channelId: '',
        channelName: '',
        channelRemark: ''


    })
    const ruleFormRef = ref<FormInstance>()
    const rules = ref<any>({
        channelId: [{ required: true, message: '请输入渠道编号', trigger: 'blur' }],
        channelName: [{ required: true, message: '请输入渠道名称', trigger: 'blur' }],

    })

    const resetForm = () => {
        formData.value = {
            id: '',
            channelId: '',
            channelName: '',
            channelRemark: ''
        }
        ruleFormRef.value?.resetFields()
    }
    const handleClose = () => {
        resetForm()
        emit('update:dialogVisible', false)
    }


    const saveChange = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                ...formData.value,
                type: formData.value.id ? 'update' : 'add'
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/base/channels/save', {
                enData
            })
            console.log('保存', res);
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
                handleClose()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('保存失败', err);
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

<style lang="scss" scoped></style>