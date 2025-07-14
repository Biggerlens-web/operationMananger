<template>
    <el-dialog :model-value="dialogVisible" title="编辑轮播图" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>



            <el-form-item label="路径" prop="imgfolderId">
                <el-select v-model="formData.imgfolderId" placeholder="请选择路径" clearable>
                    <el-option v-for="item in bannerFolderList"
                        :label="`${item.parentObj.bucketName}.${item.parentObj.endpoint}.${item.folder}`"
                        :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="图片" prop="img">
                <div class="image-upload-container">
                    <el-upload class="image-uploader" v-model:file-list="formData.imgFiles" :show-file-list="false"
                        action="#" :on-remove="handleRemove" :auto-upload="false" :on-change="handleChangeimge">
                        <img v-if="formData.img" :src="formData.img" class="uploaded-image" />
                        <div v-else class="upload-placeholder">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            <span>点击上传图片</span>
                        </div>
                    </el-upload>
                    <el-button v-if="formData.img" type="danger" size="small" class="delete-image-btn"
                        @click="removeCoverImage">
                        <el-icon>
                            <Delete />
                        </el-icon>
                        删除
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item label="图片名称" prop="imgName">
                <el-input v-model="formData.imgName" placeholder="请输入图片名称" clearable />


            </el-form-item>
            <el-form-item label="图片点击链接" prop="imgClickUrl">
                <el-input v-model="formData.imgClickUrl" placeholder="请输入图片点击链接" clearable />
            </el-form-item>
            <el-form-item label="图片标识" prop="funcType">
                <el-input v-model="formData.funcType" placeholder="请输入图片标识" clearable />
            </el-form-item>
            <el-form-item label="英文说明" prop="remarkEN">
                <el-input v-model="formData.remarkEN" placeholder="请输入英文说明" clearable />
            </el-form-item>
            <el-form-item label="中文说明" prop="remarkCH">
                <el-input v-model="formData.remarkCH" placeholder="请输入中文说明" clearable />
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
    import { useCounterStore } from '@/stores/counter';
    import { ElMessage, type FormInstance, type UploadFile, type UploadProps } from 'element-plus';
    import { storeToRefs } from 'pinia';
    import { ref, watch } from 'vue'
    import { Plus } from '@element-plus/icons-vue'
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    import type { UploadFiles, UploadUserFile } from 'element-plus'
    const counterStore = useCounterStore()
    const { appList, OSlist, channelList, showLoading } = storeToRefs(counterStore)
    const props = defineProps<{
        dialogVisible: boolean
        bannerInfo: any
        bannerFolderList: any
    }>()


    const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {

        console.log(uploadFile, uploadFiles)

        formData.value.img = ''
        formData.value.imgFiles = []
    }


    const handleChangeimge = (uploadFile: UploadUserFile, uploadFiles: UploadFiles) => {
        console.log(uploadFile.raw);

        if (uploadFile.raw) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const fullBase64 = e.target?.result as string;
                formData.value.img = fullBase64
            };
            reader.readAsDataURL(uploadFile.raw);
        }


    }

    const removeCoverImage = () => {
        formData.value.img = '';
        formData.value.imgFiles = []
    }





    watch(() => props.dialogVisible, async (newV) => {
        if (newV && props.bannerInfo) {
            formData.value.id = props.bannerInfo.id
            formData.value.imgfolderId = props.bannerInfo.parentObj.id
            formData.value.imgName = props.bannerInfo.imgName
            formData.value.imgClickUrl = props.bannerInfo.imgClickUrl
            formData.value.funcType = props.bannerInfo.funcType
            formData.value.remarkEN = props.bannerInfo.remarkEN
            formData.value.remarkCH = props.bannerInfo.remarkCH
            formData.value.img = props.bannerInfo.imgUrl


        }
    })
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()

    const formData = ref<any>({
        id: '',
        imgfolderId: '', //图片文件路径id
        img: '',//图片文件
        imgFiles: [],
        imgName: '',//图片名称,
        imgClickUrl: '',//图片点击链接
        funcType: '',//图片标识
        remarkEN: '',//英文说明
        remarkCH: '',//中文说明



    })
    const ruleFormRef = ref<FormInstance>()
    const rules = ref<any>({

    })




    const resetForm = () => {
        formData.value = {
            id: '',
            imgfolderId: '', //图片文件路径id
            img: '',//图片文件
            imgFiles: [],
            imgName: '',//图片名称
            imgClickUrl: '',//图片点击链接
            funcType: '',//图片标识
            remarkEN: '',//英文说明
            remarkCH: '',//中文说明
        }

        ruleFormRef.value?.resetFields()
    }
    const handleClose = () => {
        resetForm()
        emit('update:dialogVisible', false)
    }



    const saveChange = async () => {
        try {

            showLoading.value = true
            const params = {
                timestamp: Date.now(),
                ...formData.value,
                type: formData.value.id ? 'update' : 'add'
            }
            if (formData.value.img.includes('base64')) {
                params.img = params.img.split(',')[1]
            } else {
                delete params.img
                params.imgUrl = props.bannerInfo.imgUrl
            }
            console.log('参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/base/bannerImg/save', {
                enData
            })

            console.log('保存', res);
            if (res.data.code === 200) {
                ElMessage({
                    message: '保存成功',
                    type: 'success',
                })
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
    const handleComfirm = (ruleFormRef: any) => {
        ruleFormRef.validate((valid: any) => {
            if (valid) {
                console.log('submit!');
                saveChange()

            }
        })
    }
</script>

<style lang="scss" scoped>
    .image-upload-container {
        position: relative;
        display: inline-block;
        width: 100%;
    }

    .image-uploader {
        width: 100%;
    }

    .delete-image-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        z-index: 10;
        opacity: 0;
        transition: opacity 0.3s;
    }

    .image-upload-container:hover .delete-image-btn {
        opacity: 1;
    }

    .image-uploader :deep(.el-upload) {
        width: 100%;
        border: 2px dashed var(--el-border-color);
        border-radius: 8px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration);
    }

    .image-uploader :deep(.el-upload:hover) {
        border-color: var(--el-color-primary);
    }

    .uploaded-image {
        width: 100%;
        height: 200px;
        object-fit: contain;
        border-radius: 6px;
        background-color: #f5f7fa;
    }

    .upload-placeholder {
        height: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--el-text-color-secondary);
    }

    .upload-placeholder .el-icon {
        font-size: 28px;
        margin-bottom: 8px;
    }
</style>