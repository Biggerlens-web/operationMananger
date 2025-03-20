<template>
    <el-dialog :model-value="dialogVisible" title="编辑角色" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="角色名" prop="roleName">
                <el-input v-model="formData.roleName" />
            </el-form-item>
            <el-form-item label="角色码" prop="roleCode">
                <el-input v-model="formData.roleCode" />
            </el-form-item>
            <el-form-item label="" prop="isAutoAssign">
                是否自动分配新创建APP权限
                <el-switch v-model="formData.isAutoAssign">
                </el-switch>
            </el-form-item>
            <el-form-item label="备注" prop="desc">
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
        roleName: '',
        roleCode: '',
        isAutoAssign: false,
        desc: ''
    })
    const ruleFormRef = ref<FormInstance>()

    const rules = ref<any>({
        roleName: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
        roleCode: [{ required: true, message: '请输入角色码', trigger: 'blur' }],
    })

    //重置表单
    const resetForm = () => {
        if (!ruleFormRef.value) return;

        formData.value = {
            id: '',
            userName: '',
            password: '',
        }
        ruleFormRef.value.resetFields();
    }

    const handleClose = () => {
        resetForm()
        emit('update:dialogVisible', false)
    }

    const handleComfirm = (formEl: any) => {
        formEl.validate((valid: any) => {
            if (valid) {
                console.log('提交', formData.value);
                handleClose()
            }
        })
    }
</script>

<style lang="scss" scoped></style>