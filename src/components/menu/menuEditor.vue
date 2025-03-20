<template>
    <el-dialog :model-value="dialogVisible" title="编辑菜单" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="菜单文本" prop="menuText">
                <el-input v-model="formData.menuText" />
            </el-form-item>
            <el-form-item label="菜单类型" prop="menuType">
                <el-select v-model="formData.menuType" placeholder="请选择菜单类型">
                    <el-option label="目录" value="1" />
                    <el-option label="菜单" value="2" />
                    <el-option label="按钮" value="3" />
                </el-select>
            </el-form-item>
            <el-form-item label="说明" prop="desc">
                <el-input type="textarea" v-model="formData.menuText" />
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
    import { reactive, ref } from 'vue';
    import type { FormInstance } from 'element-plus';
    const props = defineProps<{
        dialogVisible: boolean
    }>()

    const ruleFormRef = ref<FormInstance>()
    const formData = ref<any>({
        id: '',
        menuText: '',
        menuType: '',
        desc: ''
    })
    const rules = ref<any>({
        menuText: [{ required: true, message: '请输入菜单文本', trigger: 'blur' }],
        menuType: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],

    })
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()


    //重置表单
    const resetForm = () => {
        formData.value = {
            id: '',
            menuText: '',
            menuType: '',
            desc: ''
        }
        ruleFormRef.value?.resetFields()
    }
    const handleClose = () => {
        resetForm()
        emit('update:dialogVisible', false)
    }
    const handleComfirm = (formEl: any) => {
        formEl.validate((valid: any) => {
            if (valid) {
                handleClose()
            }
        })

    }
</script>

<style lang="scss" scoped></style>