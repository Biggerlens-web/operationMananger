<template>
    <el-dialog :model-value="dialogVisible" title="编辑字体" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="所属应用" prop="appNo">
                <el-select v-model="formData.appNo">
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
                </el-select>
            </el-form-item>
            <el-form-item label="地区" prop="region">
                <el-select v-model="formData.region">
                    <el-option v-for="item in regionList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item label="字体语言" prop="fontLanguage">
                <el-select v-model="formData.fontLanguage">
                    <el-option v-for="item in fontLanguage" :key="item.value" :label="item.note" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item v-if="!batchAdd" label="字体类型" prop="fontType">
                <el-select v-model="formData.fontType">
                    <el-option v-for="item in fontTypeList" :key="item.value" :label="item.note" :value="item.value" />
                </el-select>
            </el-form-item>


            <el-form-item v-if="!batchAdd" label="字体预览图">

                <div class="image-upload-container">
                    <el-upload class="image-uploader" v-model:file-list="formData.coverImg" :show-file-list="false"
                        action="#" :on-remove="handleRemove" :auto-upload="false" :on-change="handleChangeimge">
                        <img v-if="formData.coverImgBase64" :src="formData.coverImgBase64" class="uploaded-image" />
                        <div v-else class="upload-placeholder">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            <span>点击上传图片</span>
                        </div>
                    </el-upload>
                    <el-button v-if="formData.coverImgBase64" type="danger" size="small" class="delete-image-btn"
                        @click="removeCoverImage">
                        <el-icon>
                            <Delete />
                        </el-icon>
                        删除
                    </el-button>
                </div>

            </el-form-item>

            <el-form-item v-if="!batchAdd" label="字体文件">
                <el-upload v-model:file-list="formData.font" class="upload-demo" action="#" :auto-upload="false"
                    :on-change="handleChangeFont" :limit="1">
                    <p v-if="formData.fontName">
                        {{ formData.fontName }}
                    </p>
                    <el-button v-else type="primary">上传文件</el-button>
                </el-upload>
            </el-form-item>

            <el-form-item v-if="batchAdd" label="批量字体预览图">

                <div class="image-upload-container">
                    <el-upload v-model:file-list="formData.coverImg" list-type="picture-card" action="#" multiple
                        :on-remove="handleRemove" :auto-upload="false">
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </el-upload>
                    <el-button v-if="formData.coverImgBase64" type="danger" size="small" class="delete-image-btn"
                        @click="removeCoverImage">
                        <el-icon>
                            <Delete />
                        </el-icon>
                        删除
                    </el-button>
                </div>

            </el-form-item>

            <el-form-item v-if="batchAdd" label="批量字体文件">
                <el-upload v-model:file-list="formData.font" class="upload-demo" action="#" :auto-upload="false"
                    multiple>

                    <el-button type="primary">上传文件</el-button>
                </el-upload>
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
    import { ElMessage, type FormInstance } from 'element-plus';
    import { storeToRefs } from 'pinia';
    import { ref, watch } from 'vue'
    import type { UploadUserFile, UploadFiles, UploadProps } from 'element-plus'
    import service from '@/axios';
    import axios from 'axios';
    const counterStore = useCounterStore()

    const { appList, defaultAppNo, regionList, showLoading } = storeToRefs(counterStore)
    const props = defineProps<{
        dialogVisible: boolean
        fontTypeList: any
        fontLanguage: any
        editInfo: any
        batchAdd: boolean
    }>()

    watch(() => props.dialogVisible, (newV) => {
        if (newV && props.editInfo) {
            console.log('props.editInfo', props.editInfo);
            Object.assign(formData.value, props.editInfo)
            formData.value.coverImgBase64 = props.editInfo.coverImgUrl
            formData.value.appNo = defaultAppNo.value
        }
    })
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()

    const formData = ref<any>({
        id: '',
        appNo: defaultAppNo.value,
        region: '',
        fontLanguage: '',
        coverImg: [],
        coverImgBase64: '',
        coverImgName: '',
        "font": [],
        "fontName": "",
        fontType: ''




    })
    const handleChangeFont = () => {
        formData.value.fontName = ''
    }

    const handleChangeimge = (uploadFile: UploadUserFile, uploadFiles: UploadFiles) => {
        console.log(uploadFile.raw);

        if (uploadFile.raw) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const fullBase64 = e.target?.result as string;
                formData.value.coverImgBase64 = fullBase64
                formData.value.coverImgName = ''
            };
            reader.readAsDataURL(uploadFile.raw);
        }


    }
    const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {

        console.log(uploadFile, uploadFiles)
        if (!props.batchAdd) {
            formData.value.coverImgBase64 = ''
            formData.value.coverImg = []
        }

    }
    const removeCoverImage = () => {
        formData.value.coverImgBase64 = '';
        formData.value.coverImg = []
    }



    const ruleFormRef = ref<FormInstance>()
    const rules = ref<any>({


    })

    const resetForm = () => {
        formData.value = {
            id: '',
            appNo: defaultAppNo.value,
            region: '',
            fontLanguage: '',
            coverImg: [],
            coverImgBase64: '',
            coverImgName: '',
            "font": [],
            "fontName": "",
            fontType: ''

        }

    }
    const handleClose = () => {
        resetForm()
        emit('update:dialogVisible', false)
    }

    const saveChange = async () => {
        if (showLoading.value) {
            ElMessage.warning('正在保存。。。')
            return
        }
        showLoading.value = true
        try {
            console.log('formData.value.appNo', formData.value.appNo);

            const form = new FormData()
            form.append('fontLanguage', formData.value.fontLanguage)
            form.append('appNo', String(formData.value.appNo))
            form.append('region', formData.value.region)
            form.append('id', formData.value.id)
            form.append('fontType', formData.value.fontType)

            if (formData.value.id) {
                form.append('type', 'update')

            } else {
                form.append('type', 'add')
            }
            if (formData.value.coverImgName) {
                form.append('coverImgName', formData.value.coverImgName)
            } else {
                form.append('coverImg', formData.value.coverImg[0].raw)
            }
            if (formData.value.fontName) {
                form.append('fontName', formData.value.fontName)

            } else {
                form.append('font', formData.value.font[0].raw)
            }

            const res = await service.post('/font/save', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log('保存', res);
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

    // 使用DataTransfer API创建真正的FileList对象
    const createFileListFromArray = (files: File[]): FileList => {
        const dataTransfer = new DataTransfer()
        files.forEach(file => dataTransfer.items.add(file))
        return dataTransfer.files
    }
    const batchAddSave = async () => {
        if (showLoading.value) {
            ElMessage.warning('正在保存。。。')
            return
        }
        showLoading.value = true

        try {
            const form = new FormData()
            console.log('formData.value.coverImg', formData.value.coverImg);
            console.log('formData.value.font', formData.value.font);
            console.log(' formData.value.region', formData.value.region);
            console.log('formData.value.fontLanguage', formData.value.fontLanguage);
            const coverImgs = formData.value.coverImg.map((item: any) => item.raw)
            const fonts = formData.value.font.map((item: any) => item.raw)
            const fontList = createFileListFromArray(fonts)
            const coverImgList = createFileListFromArray(coverImgs)


            console.log('coverImgs', coverImgList);
            console.log('fonts', fontList);

            form.append('appNo', formData.value.appNo)
            form.append('region', formData.value.region)
            form.append('fontLanguage', formData.value.fontLanguage)

            coverImgs.forEach((item: any, index: number) => {
                form.append(`coverImgs`, item)
            })
            fonts.forEach((item: any, index: number) => {
                form.append(`fonts`, item)
            })
            form.append('fonts', fontList as any)
            form.append('coverImgs', coverImgList as any)
            const res = await service.post('/font/saveBatch', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

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
    const handleComfirm = (ruleFormRef: any) => {
        ruleFormRef.validate((valid: any) => {
            if (valid) {
                console.log('submit!');
                if (props.batchAdd) {
                    batchAddSave()
                } else {
                    saveChange()
                }

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