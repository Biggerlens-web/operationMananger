<template>
    <el-dialog :model-value="dialogVisible" title="编辑广告类型" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>


            <el-form-item label="广告类型编号" prop="advTypeId">
                <el-input v-model="formData.advTypeId" />
            </el-form-item>

            <el-form-item label="广告类型名称" prop="advTypeName">
                <el-input type="textarea" v-model="formData.advTypeName" />
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
        advTypeId: '',
        advTypeName: '',


    })
    const ruleFormRef = ref<FormInstance>()
    const rules = ref<any>({
        advTypeId: [{ required: true, message: '请输入广告类型编号', trigger: 'blur' }],
        advTypeName: [{ required: true, message: '请输入广告类型名称', trigger: 'blur' }],

    })

    const resetForm = () => {
        formData.value = {
            id: '',
            advTypeId: '',
            advTypeName: '',
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