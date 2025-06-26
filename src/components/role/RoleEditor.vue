<template>
    <el-dialog :model-value="dialogVisible" title="编辑角色" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="角色名" prop="name">
                <el-input v-model="formData.name" />
            </el-form-item>
            <el-form-item label="角色码" prop="roleCode">
                <el-input v-model="formData.roleCode" />
            </el-form-item>
            <el-form-item label="" prop="autoAssignAppPerm">
                是否自动分配新创建APP权限
                <el-switch v-model="formData.autoAssignAppPerm" :active-value="true" :inactive-value="false">
                </el-switch>
            </el-form-item>
            <el-form-item label="状态" prop="status">

                <el-switch v-model="formData.status" active-text="启用" inactive-text="停用" :active-value="1"
                    :inactive-value="2">
                </el-switch>
            </el-form-item>
            <el-form-item label="备注" prop="description">
                <el-input type="textarea" v-model="formData.description" />
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
    import { ref, watch } from 'vue';
    import { ElMessage, type FormInstance } from 'element-plus';
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    const props = defineProps<{
        dialogVisible: boolean
        roleInfo: any
    }>()
    watch(() => props.dialogVisible, (newVal) => {
        if (newVal && props.roleInfo) {
            formData.value.id = props.roleInfo.id
            formData.value.name = props.roleInfo.name
            formData.value.roleCode = props.roleInfo.roleCode
            formData.value.autoAssignAppPerm = props.roleInfo.autoAssignAppPerm
            formData.value.description = props.roleInfo.description
            formData.value.status = props.roleInfo.status
        }
    })
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()
    const formData = ref<any>({
        id: '',
        name: '',
        roleCode: '',
        autoAssignAppPerm: false,
        description: '',
        status: 1
    })
    const ruleFormRef = ref<FormInstance>()

    const rules = ref<any>({
        name: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
        roleCode: [{ required: true, message: '请输入角色码', trigger: 'blur' }],
    })

    //重置表单
    const resetForm = () => {
        if (!ruleFormRef.value) return;

        formData.value = {
            id: '',
            name: '',
            roleCode: '',
            autoAssignAppPerm: false,
            description: '',
            status: 1
        }
        ruleFormRef.value.resetFields();
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
                type: formData.value.id ? "update" : 'add'
            }


            console.log('保存参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/system/role/save', {
                enData
            })
            console.log('保存角色', res);
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
                handleClose()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('err', err);
        }
    }
    const handleComfirm = (formEl: any) => {
        formEl.validate((valid: any) => {
            if (valid) {
                console.log('提交', formData.value);
                saveChange()
            }
        })
    }
</script>

<style lang="scss" scoped></style>