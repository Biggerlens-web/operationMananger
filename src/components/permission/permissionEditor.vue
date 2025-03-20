<template>
    <el-dialog :model-value="dialogVisible" title="权限编辑" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="权限类型" prop="permissionType">
                <el-select v-model="formData.permissionType" placeholder="请选择权限类型">
                    <el-option label="菜单" value="menu" />
                    <el-option label="按钮" value="button" />
                </el-select>
            </el-form-item>
            <el-form-item label="权限小类" prop="permissionSubType">
                <el-select v-model="formData.permissionSubType" placeholder="请选择权限类型">
                    <el-option label="菜单" value="menu" />
                    <el-option label="按钮" value="button" />
                </el-select>
            </el-form-item>
            <el-form-item label="权限名" prop="permissionName">
                <el-input v-model="formData.permissionName" />
            </el-form-item>
            <el-form-item label="权限编码" prop="permissionCode">
                <el-input v-model="formData.permissionCode" />
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
    import { ref } from 'vue';
    import type { FormInstance } from 'element-plus';
    const props = defineProps<{
        dialogVisible: boolean
    }>()
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()



    const formData = ref<any>({
        id: '',
        permissionType: '',
        permissionSubType: '',
        permissionName: '',
        permissionCode: '',

    })

    const rules = ref<any>({
        permissionType: [{ required: true, message: '请输入权限类型', trigger: 'change' }],
        permissionSubType: [{ required: true, message: '请输入角色码', trigger: 'blur' }],
    })

    const ruleFormRef = ref<FormInstance>()

    const resetForm = () => {
        ruleFormRef.value?.resetFields()
        formData.value = {
            id: '',
            permissionType: '',
            permissionSubType: '',
            permissionName: '',
            permissionCode: '',
        }
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