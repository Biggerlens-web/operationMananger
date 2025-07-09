<template>
    <el-dialog :model-value="dialogVisible" title="编辑域(bucket)" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="端点(endpoint)" prop="endpoint">
                <el-input v-model="formData.endpoint" />
            </el-form-item>
            <el-form-item label="域(bucket)" prop="bucketName">
                <el-input v-model="formData.bucketName" />
            </el-form-item>
            <el-form-item label="说明" prop="remark">
                <el-input type="textarea" v-model="formData.remark" />
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
    import { useCounterStore } from '@/stores/counter';
    import { desEncrypt } from '@/utils/des';
    import { ElMessage, type FormInstance } from 'element-plus';
    import { storeToRefs } from 'pinia';
    import { ref, watch } from 'vue'
    const stores = useCounterStore()
    const { showLoading } = storeToRefs(stores)
    const props = defineProps<{
        dialogVisible: boolean
        buckerInfo: any
    }>()
    watch(() => props.dialogVisible, (newV) => {
        if (newV && props.buckerInfo) {
            formData.value.id = props.buckerInfo.id
            formData.value.endpoint = props.buckerInfo.endpoint
            formData.value.bucketName = props.buckerInfo.bucketName
            formData.value.remark = props.buckerInfo.remark
        }
    })
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()

    const formData = ref<any>({
        id: '',
        endpoint: '',
        bucketName: '',
        remark: '',


    })
    const ruleFormRef = ref<FormInstance>()
    const rules = ref<any>({
        endpoint: [{ required: true, message: '请输入端点', trigger: 'blur' }],
        bucketName: [{ required: true, message: '请输入域', trigger: 'blur' }],
    })

    const resetForm = () => {
        formData.value = {
            id: '',
            endpoint: '',
            bucketName: '',
            remark: '',
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
            const params = {
                timestamp: Date.now(),
                type: formData.value.id ? 'update' : 'add',
                ...formData.value
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/base/bucket/save', {
                enData
            })
            console.log('保存bucket', res);
            if (res.data.code === 200) {
                handleClose()
                ElMessage.success('保存成功')
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

<style lang="scss" scoped></style>