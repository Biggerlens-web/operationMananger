<template>
    <el-dialog :model-value="dialogVisible" title="编辑域(bucket)" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>


            <el-form-item label="端点(endpoint)" prop="endpoint">
                <el-input v-model="formData.endpoint" />
            </el-form-item>
            <el-form-item label="域(bucket)" prop="bucket">
                <el-input v-model="formData.bucket" />
            </el-form-item>
            <el-form-item label="说明" prop="desc">
                <el-input type="textarea" v-model="formData.desc" />
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
    import type { FormInstance } from 'element-plus';
    import { ref } from 'vue'
    const props = defineProps<{
        dialogVisible: boolean
    }>()
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()

    const formData = ref<any>({
        id: '',
        endpoint: '',
        bucket: '',
        desc: '',


    })
    const ruleFormRef = ref<FormInstance>()
    const rules = ref<any>({
        endpoint: [{ required: true, message: '请输入端点', trigger: 'blur' }],
        bucket: [{ required: true, message: '请输入域', trigger: 'blur' }],
    })

    const resetForm = () => {
        formData.value = {
            id: '',
            endpoint: '',
            bucket: '',
            desc: '',
        }
        ruleFormRef.value?.resetFields()
    }
    const handleClose = () => {
        resetForm()
        emit('update:dialogVisible', false)
    }
    const handleComfirm = (ruleFormRef: any) => {
        ruleFormRef.validate((valid: any) => {
            if (valid) {
                console.log('submit!');
                handleClose()
            }
        })
    }
</script>

<style lang="scss" scoped></style>