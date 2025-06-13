<template>
    <el-dialog :model-value="dialogVisible" title="编辑轮播图" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>


            <el-form-item label="路径" prop="path">
                <el-input v-model="formData.path" />
            </el-form-item>
            <el-form-item label="图片" prop="img">
                <el-upload class="image-uploader" :show-file-list="false" action="#">
                    <img v-if="formData.img" :src="formData.img" class="uploaded-image" />
                    <el-button v-else class="upload-placeholder">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        <span>上传轮播图</span>
                    </el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="图片名称" prop="bannerImg">
                <el-input v-model="formData.bannerImg" />
            </el-form-item>
            <el-form-item label="图片点击链接" prop="bannerUrl">
                <el-input v-model="formData.bannerUrl" />
            </el-form-item>
            <el-form-item label="图片标识" prop="bannerMark">
                <el-input v-model="formData.bannerMark" />
            </el-form-item>
            <el-form-item label="说明(英)" prop="desc_en">
                <el-input v-model="formData.desc_en" />
            </el-form-item>
            <el-form-item label="说明(中)" prop="desc_zh">
                <el-input v-model="formData.desc_zh" />
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

        path: '',
        img: '',
        desc: '',
        bannerName: "",
        bannerUrl: '',
        bannerMark: '',
        desc_zh: '',
        desc_en: ''


    })
    const ruleFormRef = ref<FormInstance>()
    const rules = ref<any>({
        bucket: [{ required: true, message: '请输入域', trigger: 'blur' }],
        path: [{ required: true, message: '请选择路径', trigger: 'change' }],
        img: [{ required: true, message: '请上传图片', trigger: 'blur' }],
        bannerName: [{ required: true, message: '请输入轮播图名称', trigger: 'blur' }]

    })

    const resetForm = () => {
        formData.value = {
            id: '',

            path: '',
            img: '',
            desc: '',
            bannerName: "",
            bannerUrl: '',
            bannerMark: '',
            desc_zh: '',
            desc_en: ''


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