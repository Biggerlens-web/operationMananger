<template>
    <el-dialog :model-value="dialogAdd" title="批量新增素材" width="1000" :before-close="handleClose">

        <div class="upload-container">
            <div class="upload-box bigImg">
                <p class="label">
                    大图 (可多张)
                </p>
                <!-- Big Image Upload Section -->
                <div v-if="formData.bigImgs.length > 0" class="image-preview-grid">
                    <div v-for="(imgSrc, index) in formData.bigImgs" :key="`big-${index}`"
                        class="image-preview-container-item">
                        <img :src="imgSrc" class="uploaded-image-item" />
                        <el-button class="delete-image-btn" type="danger" :icon="Delete" circle
                            @click.stop="removeBigImage(index)" />
                    </div>
                </div>
                <el-upload class="uploader-instance" action="#" :show-file-list="false"
                    v-model:file-list="formData.bigFileList" :before-upload="beforeImageUpload" :auto-upload="false"
                    multiple>

                    <el-button type="primary">添加大图</el-button>
                </el-upload>
            </div>

            <div class="upload-box smallImg">
                <p class="label">
                    小图 (可多张)
                </p>
                <!-- Small Image Upload Section -->
                <div v-if="formData.smallImgs.length > 0" class="image-preview-grid">
                    <div v-for="(imgSrc, index) in formData.smallImgs" :key="`small-${index}`"
                        class="image-preview-container-item">
                        <img :src="imgSrc" class="uploaded-image-item" />
                        <el-button class="delete-image-btn" type="danger" :icon="Delete" circle
                            @click.stop="removeSmallImage(index)" />
                    </div>
                </div>
                <el-upload class="uploader-instance" action="#" :show-file-list="false"
                    v-model:file-list="formData.smallFileList" :before-upload="beforeImageUpload" :auto-upload="false"
                    multiple>
                    <!-- <div class="smallImg_upload upload-placeholder">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        <span>添加小图</span>
                    </div> -->
                    <el-button type="primary">添加小图</el-button>
                </el-upload>
            </div>

        </div>
        <el-form-item label="是否付费" v-if="showpayBtn()">
            <el-switch v-model="formData.isPay" :active-value="true" :inactive-value="false" active-text="是"
                inactive-text="否" />
        </el-form-item>
        <el-form-item label="会员" v-if="showVipBtn()">
            <el-switch v-model="formData.vip" :active-value="true" :inactive-value="false" active-text="是"
                inactive-text="否" />
        </el-form-item>
        <div class="dialog_comfirm">
            <el-button type="primary" @click="handleComfirm">确认</el-button>
            <el-button @click="handleClose">取消</el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
    import { onMounted, reactive, ref, watch } from 'vue';
    import type { UploadProps, UploadUserFile, UploadRawFile, UploadFile } from 'element-plus';
    import { ElMessage, ElButton } from 'element-plus';
    import { Delete, Plus } from '@element-plus/icons-vue';
    import { useRoute } from 'vue-router';
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    const stores = useCounterStore()
    const { showLoading } = storeToRefs(stores)
    const props = withDefaults(defineProps<{
        dialogAdd: boolean
        editData?: any
    }>(), {
        dialogAdd: false
    })

    const route = useRoute()
    const emit = defineEmits<{
        'update:dialogAdd': [value: boolean]
        'update': []
    }>()


    //显示是否付费
    const showArr = ['sitcker', 'background']
    const showpayBtn = () => {
        return showArr.includes(route.query.type as string)
    }

    //显示会员
    const showVipArr = ['otherMaterial']
    const showVipBtn = () => {
        return showVipArr.includes(route.query.type as string)
    }



    interface FormDataType {
        bigImgs: string[], // For preview
        smallImgs: string[], // For preview
        bigFileList: UploadUserFile[], // Bound to el-upload
        smallFileList: UploadUserFile[], // Bound to el-upload
        isPay: boolean
        vip: boolean
    }

    const formData = reactive<FormDataType>({
        bigImgs: [],
        smallImgs: [],
        bigFileList: [],
        smallFileList: [],
        isPay: false,
        vip: false
    })

    const resetFormData = () => {
        formData.bigImgs = [];
        formData.smallImgs = [];
        formData.bigFileList = [];
        formData.smallFileList = [];
        formData.isPay = false;
        formData.vip = false;
    };

    const handleClose = () => {
        resetFormData();
        emit('update:dialogAdd', false)
    }

    // Helper function to update previews from a file list
    const updatePreviews = (fileList: UploadUserFile[], targetImgsArray: string[]) => {
        targetImgsArray.splice(0, targetImgsArray.length); // Clear existing previews
        const promises = fileList.map(file => {
            return new Promise<string>((resolve, reject) => {
                if (file.raw) {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target?.result as string || '');
                    reader.onerror = reject;
                    reader.readAsDataURL(file.raw);
                } else if (file.url) {
                    resolve(file.url);
                } else {
                    resolve('');
                }
            });
        });
        Promise.all(promises).then(results => {
            results.forEach(src => {

                if (src) targetImgsArray.push(src);
            });
        }).catch(error => {
            console.error('Error generating previews:', error);
            ElMessage.error('生成图片预览失败');
        });
    };

    // Watch for changes in file lists and update previews accordingly
    watch(() => formData.bigFileList, (newFileList) => {
        updatePreviews(newFileList, formData.bigImgs);
    }, { deep: true });

    watch(() => formData.smallFileList, (newFileList) => {
        updatePreviews(newFileList, formData.smallImgs);
    }, { deep: true });

    watch(() => props.dialogAdd, async (newV) => {
        if (newV) {
            resetFormData();
            if (props.editData) {
                const loadImageToState = async (imageUrl: string, targetFileList: UploadUserFile[], imgNamePrefix: string) => {
                    if (!imageUrl) return;
                    try {
                        const res = await fetch(imageUrl);
                        const blob = await res.blob();
                        const fileName = `${imgNamePrefix}_edit_${Date.now()}`;
                        const file = new File([blob], fileName, { type: blob.type });

                        const uploadUserFile: UploadUserFile = {
                            name: file.name,
                            raw: file as UploadRawFile, // Important for watcher to generate preview
                            size: file.size,
                            status: 'ready',
                            uid: Date.now() + Math.random(), // Ensure unique UID
                            url: imageUrl // Store original URL, useful if raw isn't immediately processed by watcher
                        };
                        targetFileList.push(uploadUserFile); // This will trigger the watcher
                    } catch (err) {
                        console.error(`读取编辑 ${imgNamePrefix} 失败`, err);
                        ElMessage.error(`读取编辑 ${imgNamePrefix} 失败`);
                    }
                };

                // Assuming props.editData.bigImg and smallImg are single URLs
                if (props.editData.bigImg) {
                    await loadImageToState(props.editData.bigImg, formData.bigFileList, '大图');
                }
                if (props.editData.smallImg) {
                    await loadImageToState(props.editData.smallImg, formData.smallFileList, '小图');
                }
            }
        }
    })

    const beforeImageUpload: UploadProps['beforeUpload'] = (rawFile: UploadRawFile) => {

        return true;
    };

    const removeBigImage = (index: number) => {
        formData.bigFileList.splice(index, 1);
        // Preview will be updated by the watcher
    };

    const removeSmallImage = (index: number) => {
        formData.smallFileList.splice(index, 1);
        // Preview will be updated by the watcher
    };

    const fileListTransform = (files: File[]): FileList => {
        const dataTransfer = new DataTransfer()
        files.forEach(file => dataTransfer.items.add(file))
        return dataTransfer.files
    }
    const handleComfirm = async () => {
        if (formData.bigFileList.length === 0 || formData.smallFileList.length === 0) {
            ElMessage.warning('请至少上传一张大图和一张小图');
            return;
        }
        if (showLoading.value) {
            return ElMessage.warning('正在上传。。。');
        }
        try {
            showLoading.value = true
            // const getBase64 = (file: UploadUserFile): Promise<string> => {
            //     return new Promise((resolve, reject) => {
            //         if (file.raw) {
            //             const reader = new FileReader();
            //             reader.onload = () => resolve((reader.result as string).split(',')[1]);
            //             reader.onerror = error => reject(error);
            //             reader.readAsDataURL(file.raw);
            //         } else {
            //             ElMessage.error(`文件 ${file.name} 缺少原始数据，无法转换。`);
            //             reject(new Error(`Raw file not found for ${file.name}`));
            //         }
            //     });
            // };
            // const bigImgBase64Promises = formData.bigFileList.map(file => getBase64(file));
            // const smallImgBase64Promises = formData.smallFileList.map(file => getBase64(file));
            // const bigImgsBase64 = await Promise.all(bigImgBase64Promises);
            // const smallImgsBase64 = await Promise.all(smallImgBase64Promises);.
            // const params: any = {
            //     timestamp: Date.now(),
            //     big: bigImgsBase64,
            //     small: smallImgsBase64,
            //     clothingMaterialsId: parseInt(route.query.id as string)
            // };


            const bigList = formData.bigFileList.map((item: any) => item.raw)
            const smallList = formData.smallFileList.map((item: any) => item.raw)

            const bigFileList = fileListTransform(bigList)
            const smallFileList = fileListTransform(smallList)

            const form = new FormData()
            form.append('big', bigFileList as any)
            form.append('small', smallFileList as any)
            bigList.forEach((element: any) => {
                form.append('big', element)
            });
            smallList.forEach((element: any) => {
                form.append('small', element)
            });


            const { type } = route.query
            const id = route.query.id
            let url: string = ''
            switch (type) {
                case 'clothing':
                    form.append('clothingMaterialsId', id as string)
                    url = '/clothingMaterialsDetail/saveBatch'
                    break;
                case 'sitcker':
                    form.append('stickerId', id as string)
                    form.append('isPay', String(formData.isPay))
                    url = '/stickerDetail/saveBatch'
                    break;
                case 'background':
                    console.log('图库');
                    form.append('backId', id as string)
                    url = '/backgroundDetail/saveBatch'
                    form.append('isPay', String(formData.isPay))
                    break

                case 'mask':
                    console.log('遮罩');
                    form.append('maskId', id as string)
                    url = '/maskDetail/saveBatch'
                    break

                case 'wallpapper':
                    console.log('壁纸');
                    form.append('wallpaperId', id as string)
                    url = '/wallpaperDetail/saveBatch'
                    break

                case 'shape':
                    console.log('形状');
                    form.append('shapeId', id as string)
                    url = '/shapeDetail/saveBatch'
                    break

                case 'otherMaterial':
                    console.log('其他素材');
                    form.append('materialId', id as string)
                    url = '/otherMaterialDetail/saveBatch'
                    form.append('vip', String(formData.vip))
                    break
            }




            const res = await service.post(url, form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });


            if (res.data.code === 200) {
                ElMessage.success('批量新增成功');
                emit('update:dialogAdd', false);
                emit('update');
                resetFormData();
            } else {
                ElMessage.error(res.data?.msg || '批量新增失败，请稍后再试');
            }
        } catch (err: any) {
            console.error('批量新增操作失败:', err);
            ElMessage.error(`操作失败: ${err || '请查看控制台获取更多信息'}`);
        } finally {
            showLoading.value = false
        }
    };
</script>

<style lang="scss" scoped>
    .upload-container {
        display: flex;
        justify-content: space-around;
        gap: 20px;
    }

    .upload-box {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 15px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        background-color: #f9f9f9;
    }

    .label {
        font-size: 14px;
        color: #606266;
        margin-bottom: 10px;
        align-self: flex-start;
        /* Align label to the start of the box */
    }

    .uploader-instance {
        width: 100%;

        :deep(.el-upload) {
            /* Targets the root of el-upload component */
            width: 100%;
            display: block;
            /* Ensure it takes full width for the placeholder */
        }
    }

    .upload-placeholder {
        width: 100%;
        height: 150px;
        display: flex;
        flex-direction: column;
        /* Stack icon and text vertically */
        justify-content: center;
        align-items: center;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        transition: border-color 0.3s;
        background-color: #fff;
        /* Placeholder background */

        &:hover {
            border-color: #409eff;
        }

        .el-icon {
            font-size: 28px;
            color: #8c939d;
        }

        span {
            margin-top: 8px;
            /* Space between icon and text */
            font-size: 14px;
            color: #8c939d;
        }
    }

    .image-preview-grid {
        display: flex;
        flex-direction: column;
        // flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 10px;
        justify-content: flex-start;
        width: 100%;
        /* Ensure grid takes full width */
    }

    .image-preview-container-item {
        position: relative;
        width: 200px;
        height: 200px;
        border: 1px solid #d9d9d9;
        border-radius: 6px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;

        .uploaded-image-item {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 6px;
            /* Consistent rounding */
        }

        .delete-image-btn {
            position: absolute;
            top: 2px;
            right: 2px;
            opacity: 0.7;
            /* Slightly more transparent */
            transform: scale(0.8);
            background-color: rgba(0, 0, 0, 0.4);
            /* Darker background for better visibility */
            color: white;
            border: none;

            &:hover {
                opacity: 1;
                background-color: rgba(0, 0, 0, 0.6);
            }
        }
    }

    .dialog_comfirm {
        margin-top: 20px;
        /* Increased margin */
        display: flex;
        justify-content: flex-end;
    }
</style>