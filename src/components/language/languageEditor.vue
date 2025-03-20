<template>
    <el-dialog :model-value="dialogVisible" title="编辑语言" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>


            <el-form-item label="语言简称" prop="languageName">
                <el-input v-model="formData.languageName" />
            </el-form-item>

            <el-form-item label="语言说明" prop="desc">
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
        languageName: '',
        desc: '',


    })
    const ruleFormRef = ref<FormInstance>()
    const rules = ref<any>({
        languageName: [{ required: true, message: '请输入语言简称', trigger: 'blur' }],

    })

    const resetForm = () => {
        formData.value = {
            id: '',
            languageName: '',
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