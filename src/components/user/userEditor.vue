<template>
    <el-dialog :model-value="dialogVisible" title="编辑用户" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="用户名" prop="userName">
                <el-input v-model="formData.userName" />
            </el-form-item>
            <el-form-item label="名称" prop="userText">
                <el-input v-model="formData.userText" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="formData.password" type="password" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="formData.email" />
            </el-form-item>
            <el-form-item label="手机" prop="phone">
                <el-input v-model="formData.phone" />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-select v-model="formData.sex" placeholder="请选择性别">
                    <el-option label="男" value="男" />
                    <el-option label="女" value="女" />
                </el-select>
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
                <div>
                    <el-upload class="avatar-uploader" action="#" :show-file-list="false">
                        <img v-if="formData.avatar" :src="formData.avatar" class="avatar" />
                        <el-button v-else class="avatar-uploader-icon">
                            上传头像
                        </el-button>
                    </el-upload>
                </div>

            </el-form-item>
            <el-form-item label="说明" prop="desc">
                <el-input v-model="formData.desc" type="textarea" />
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
    const ruleFormRef = ref<FormInstance>()
    const formData = ref<any>({
        id: '',
        userName: '',
        password: '',
        avatar: '',
        userText: '',
        email: '',
        phone: '',
        sex: '',
        desc: ''
    })
    const rules = ref<any>({
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        avatar: [{ required: true, message: '请上传头像', trigger: 'blur' }],
        userText: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        desc: [{ required: true, message: '请输入说明', trigger: 'blur' }],
    })


    //重置表单
    const resetForm = () => {
        formData.value = {
            id: '',
            userName: '',
            password: '',
            avatar: '',
            userText: '',
            email: '',
            phone: '',
            sex: '',
            desc: ''
        }
        ruleFormRef.value?.resetFields()
    }
    //关闭对话框
    const handleClose = () => {
        resetForm()
        emit('update:dialogVisible', false)
    }

    //确认提交
    const handleComfirm = (formEl: any) => {
        formEl.validate((valid: any) => {
            if (valid) {
                handleClose()
            }
        })

    }
</script>

<style lang="scss" scoped></style>