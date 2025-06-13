<template>
    <el-dialog :model-value="dialogAdd" title="批量新增素材" width="1000" :before-close="handleClose">

        <div class="upload-container">
            <div class="upload-box bigImg">
                <p class="label">
                    大图
                </p>
                <el-upload class="uploader-instance" action="#" :show-file-list="false"
                    :on-change="handleBigImageChange" :before-upload="beforeImageUpload" :auto-upload="false"
                    v-model="formData.bigFileList">
                    <div v-if="formData.bigImg" class="image-preview-container">
                        <img :src="formData.bigImg" class="uploaded-image" />
                        <el-button class="delete-image-btn" type="danger" :icon="Delete" circle
                            @click.stop="removeBigImage" />
                    </div>
                    <div v-else class="bigImg_upload upload-placeholder">
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </div>
                </el-upload>

            </div>
            <div class="upload-box smallImg">
                <p class="label">
                    小图
                </p>
                <el-upload class="uploader-instance" action="#" :show-file-list="false"
                    :on-change="handleSmallImageChange" :before-upload="beforeImageUpload" :auto-upload="false"
                    v-model="formData.smallFileList">
                    <div v-if="formData.smallImg" class="image-preview-container">
                        <img :src="formData.smallImg" class="uploaded-image" />
                        <el-button class="delete-image-btn" type="danger" :icon="Delete" circle
                            @click.stop="removeSmallImage" />
                    </div>
                    <div v-else class="smallImg_upload upload-placeholder">
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </div>
                </el-upload>
            </div>

        </div>
        <div class="dialog_comfirm">
            <el-button type="primary" @click="handleComfirm">确认</el-button>
            <el-button @click="handleClose">取消</el-button>
        </div>

    </el-dialog>
</template>

<script lang="ts" setup>
    import { reactive, ref, watch } from 'vue';
    import type { UploadProps, UploadUserFile, UploadRawFile } from 'element-plus';
    import { ElMessage, ElButton } from 'element-plus';
    import { Delete } from '@element-plus/icons-vue';
    const props = withDefaults(defineProps<{
        dialogAdd: boolean
    }>(), {
        dialogAdd: false
    })
    const emit = defineEmits<{

        'update:dialogAdd': [value: boolean]
    }>()

    const handleClose = () => {
        emit('update:dialogAdd', false)
    }






    interface formDataType {
        bigImg: string,
        smallImg: string,
        bigFileList: any,
        smallFileList: any
    }

    const formData = reactive<formDataType>({
        bigImg: '',
        smallImg: '',
        bigFileList: '',
        smallFileList: '',
    })
    const handleBigImageChange: UploadProps['onChange'] = (uploadFile) => {
        if (uploadFile.raw) {


            const render = new FileReader()
            render.onload = (e) => {
                console.log('render', e.target?.result);
                formData.bigImg = e.target?.result as string || ''
            }
            render.readAsDataURL(uploadFile.raw)


        }
    };

    const handleSmallImageChange: UploadProps['onChange'] = (uploadFile) => {
        if (uploadFile.raw) {


            console.log('uploadFile', uploadFile.raw);

            const render = new FileReader()

            render.onload = (e) => {
                console.log('render', e.target?.result);
                formData.smallImg = e.target?.result as string || ''

            }
            render.readAsDataURL(uploadFile.raw)


            // formData.smallFileList = [uploadFile]; // 如果只需要保留当前上传的文件，取消注释这行
        }
    };

    const beforeImageUpload: UploadProps['beforeUpload'] = (rawFile: UploadRawFile) => {

        return true;



    };

    const removeBigImage = () => {
        formData.bigImg = '';
        formData.bigFileList = [];
    };

    const removeSmallImage = () => {
        formData.smallImg = '';
        formData.smallFileList = [];
    };

    const handleComfirm = () => {
        console.log('Form Data:', formData);

    }
</script>

<style lang="scss" scoped>
    .upload-container {
        display: flex;
        justify-content: space-around;
        gap: 20px;
        /* 控制两个上传盒子之间的间距 */
    }

    .upload-box {
        flex: 1;
        /* 让两个上传盒子平分空间 */
        display: flex;
        flex-direction: column;
        align-items: center;
        /* 标签和上传区域居中对齐 */
        padding: 15px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        background-color: #f9f9f9;
    }

    .label {
        font-size: 14px;
        color: #606266;
        margin-bottom: 10px;
    }

    .uploader-instance {
        width: 100%;

        :deep(.el-upload) {
            width: 100%;
        }
    }

    .upload-placeholder {
        width: 100%;
        height: 150px;
        /* 根据需要调整高度 */
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        transition: border-color 0.3s;

        &:hover {
            border-color: #409eff;
        }

        .el-icon {
            font-size: 28px;
            color: #8c939d;
        }
    }



    .uploaded-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        /* 图片完整显示在容器内 */
        border-radius: 6px;
    }

    .image-preview-container {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        /* Ensure image and button are within this container */
        justify-content: center;
        align-items: center;

    }

    .delete-image-btn {
        position: absolute;
        top: 5px;
        right: 5px;
        opacity: 0.8;
        transition: opacity 0.3s;

        &:hover {
            opacity: 1;
        }
    }

    .dialog_comfirm {
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
    }
</style>