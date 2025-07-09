<template>
    <el-dialog :model-value="dialogVisible" title="编辑用户" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="formData.username" />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="formData.name" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="formData.password" :disabled="!!formData.id" type="password" />
            </el-form-item>

            <el-form-item label="性别" prop="gender">
                <el-select v-model="formData.gender" placeholder="请选择性别">
                    <el-option label="男" :value="1"></el-option>
                    <el-option label="女" :value="2"></el-option>
                    <el-option label="保密" :value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="formData.email" type="email" />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
                <el-input v-model="formData.phone" type="phone" />
            </el-form-item>
            <el-form-item label="备注" prop="description">
                <el-input v-model="formData.description" type="text" />
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
                <div class="avatar-container">
                    <el-upload class="avatar-uploader" action="#" :show-file-list="false" :auto-upload="false"
                        :before-upload="handleBeforeUpload" :on-change="handleAvatarChange">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                        <el-button v-if="!imageUrl" type="primary" :icon="Plus"
                            class="avatar-uploader-icon">上传图片</el-button>
                    </el-upload>
                    <el-button v-if="imageUrl" type="danger" :icon="Delete" circle class="delete-avatar-button"
                        @click="handleRemoveAvatar"></el-button>
                </div>
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
    import type { FormInstance, UploadProps, UploadRawFile } from 'element-plus';
    import { ElMessage } from 'element-plus';
    import { Delete, Plus } from '@element-plus/icons-vue'; // 引入Delete和Plus图标
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    const stores = useCounterStore()
    const { showLoading } = storeToRefs(stores)
    const props = defineProps<{
        dialogVisible: boolean
        userInfo: any
    }>()




    watch(() => props.dialogVisible, async (newV) => {
        console.log('formData.value.id', formData.value.id);
        if (newV && props.userInfo) {
            formData.value.id = props.userInfo.id
            formData.value.username = props.userInfo.username
            formData.value.password = props.userInfo.password
            formData.value.phone = props.userInfo.phone
            formData.value.email = props.userInfo.email
            formData.value.name = props.userInfo.name
            formData.value.password = props.userInfo.password
            formData.value.description = props.userInfo.description
            switch (props.userInfo.gender) {
                case '男':
                    formData.value.gender = 1
                    break;
                case '女':
                    formData.value.gender = 2
                    break;
                case '保密':
                    formData.value.gender = 3
                    break;
            }
            imageUrl.value = props.userInfo.avatar

        }
    })
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()
    const ruleFormRef = ref<FormInstance>()
    const formData = ref<any>({
        id: '',
        username: '',
        gender: '',
        password: '',
        phone: '',
        name: '',
        email: '',
        description: '',
        avatar: '', // 将用于存储最终的头像 URL 或 Base64

    })
    const imageUrl = ref('') // 用于预览图片

    const rules = ref<any>({
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],

    })

    const handleAvatarChange: UploadProps['onChange'] = (uploadFile) => {
        if (uploadFile.raw) {
            imageUrl.value = URL.createObjectURL(uploadFile.raw);

            const reader = new FileReader();
            reader.onload = (e) => {
                formData.value.avatar = e.target?.result as string;
            };
            reader.readAsDataURL(uploadFile.raw);
        }
    };

    const handleBeforeUpload: UploadProps['beforeUpload'] = (rawFile: UploadRawFile) => {

        return true;
    };

    const handleRemoveAvatar = () => {
        imageUrl.value = '';
        formData.value.avatar = '';
    };


    //重置表单
    const resetForm = () => {
        formData.value = {
            id: '',
            username: '',
            gender: '',
            password: '',
            phone: '',
            name: '',
            email: '',
            description: '',
            avatar: '', // 将用于存储最终的头像 URL 或 Base64

        }
        imageUrl.value = ''; // 重置预览图片
        ruleFormRef.value?.resetFields()
    }
    //关闭对话框
    const handleClose = () => {
        resetForm()
        emit('update:dialogVisible', false)
    }
    //保存


    const saveUser = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                id: formData.value.id,
                username: formData.value.username,
                gender: formData.value.gender,
                password: formData.value.password,
                phone: formData.value.phone,
                name: formData.value.name,
                email: formData.value.email,
                avatar: formData.value.avatar.split(',')[1],
                description: formData.value.description,
                type: formData.value.id ? 'update' : 'add'
            }
            if (!params.avatar) {
                delete params.avatar
            }
            console.log('参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/system/user/save', {
                enData
            })
            console.log('保存yonghu', res);
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
                handleClose()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {

            console.log('保存失败', err);
        } finally {
            showLoading.value = false
        }
    }
    //确认提交
    const handleComfirm = (formEl: any) => {
        formEl.validate((valid: any) => {
            if (valid) {
                // 在这里处理表单提交，formData.value.avatar 包含了图片的 Base64 或 URL
                console.log('提交的表单数据:', formData.value);
                saveUser()
            }
        })

    }
</script>

<style lang="scss" scoped>
    .avatar-container {
        position: relative;
        display: inline-block;
        width: 178px;
        height: 178px;
        border-radius: 6px;
        /* 为容器也添加圆角，以便内部元素继承 */
        overflow: hidden;
        /* 确保子元素不会超出圆角范围 */
    }

    .delete-avatar-button {
        position: absolute;
        top: 8px;
        right: 8px;
        z-index: 10;
        background-color: rgba(0, 0, 0, 0.5);
        border-color: transparent;
        color: white;
        width: 28px;
        height: 28px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .delete-avatar-button:hover {
        background-color: rgba(0, 0, 0, 0.7);
        border-color: transparent;
    }

    .avatar-uploader .avatar {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    .avatar-uploader .el-upload {
        border: 2px dashed #d9d9d9;
        /* 将普通状态边框颜色修改为明确的 #d9d9d9 */
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: border-color 0.3s, background-color 0.3s;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fafafa;
    }

    .avatar-uploader .el-upload:hover {
        border-color: var(--el-color-primary);
        /* 悬停时使用主题色 */
        background-color: #f0f0f0;
    }

    .avatar-uploader-icon-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #8c939d;
        transition: color 0.3s;
    }

    .avatar-uploader .el-upload:hover .avatar-uploader-icon-container {
        color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
        font-size: 32px;
    }

    .el-upload__text {
        font-size: 14px;
        margin-top: 10px;
    }
</style>