<template>
    <el-dialog :model-value="dialogVisible" title="编辑描边" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="所属应用" prop="appNo">
                <el-select v-model="formData.appNo">
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
                </el-select>
            </el-form-item>
            <el-form-item label="上传区域" prop="region">
                <el-select v-model="formData.region">
                    <el-option v-for="item in regionList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>

            <template v-if="isBatch">
                <el-form-item label="缩略图" prop="small">
                    <el-upload v-model:file-list="formData.small" list-type="picture-card" action="#" multiple
                        :auto-upload="false">
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="描边图" prop="big">
                    <el-upload v-model:file-list="formData.big" list-type="picture-card" action="#" multiple
                        :auto-upload="false">
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </template>
            <template v-else>
                <el-form-item label="缩略图" prop="small">

                    <div class="image-upload-container">
                        <el-upload class="image-uploader" :on-change="handleSmallChange"
                            v-model:file-list="formData.small" :show-file-list="false" action="#" :auto-upload="false">
                            <img v-if="formData.smallUrl" :src="formData.smallUrl" class="uploaded-image" />
                            <div v-else class="upload-placeholder">
                                <el-icon>
                                    <Plus />
                                </el-icon>
                                <span>点击上传图片</span>
                            </div>
                        </el-upload>
                        <el-button v-if="formData.smallUrl" type="danger" size="small" class="delete-image-btn"
                            @click="removeImage('small')">
                            <el-icon>
                                <Delete />
                            </el-icon>
                            删除
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item label="描边图" prop="big">
                    <div class="image-upload-container">
                        <el-upload class="image-uploader" v-model:file-list="formData.big" :show-file-list="false"
                            :on-change="handleBigChange" action="#" :auto-upload="false">
                            <img v-if="formData.bigUrl" :src="formData.bigUrl" class="uploaded-image" />
                            <div v-else class="upload-placeholder">
                                <el-icon>
                                    <Plus />
                                </el-icon>
                                <span>点击上传图片</span>
                            </div>
                        </el-upload>
                        <el-button v-if="formData.bigUrl" type="danger" size="small" class="delete-image-btn"
                            @click="removeImage('big')">
                            <el-icon>
                                <Delete />
                            </el-icon>
                            删除
                        </el-button>
                    </div>
                </el-form-item>
            </template>


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
    import service from '@/axios';
    import { useCounterStore } from '@/stores/counter';
    import { ElMessage, type FormInstance } from 'element-plus';
    import { storeToRefs } from 'pinia';
    import { ref, watch } from 'vue'
    import type { UploadUserFile } from 'element-plus'
    const counterStore = useCounterStore()
    const { appList, regionList, defaultAppNo, showLoading } = storeToRefs(counterStore)
    const props = defineProps<{
        dialogVisible: boolean
        isBatch: boolean
        editInfo: any
    }>()
    watch(() => props.dialogVisible, (newVal) => {
        if (newVal && props.editInfo) {
            formData.value.id = props.editInfo.id
            formData.value.appNo = props.editInfo.appNo
            formData.value.region = props.editInfo.region
            formData.value.bigName = props.editInfo.bigName
            formData.value.smallName = props.editInfo.smallName
            formData.value.bigUrl = props.editInfo.bigUrl
            formData.value.smallUrl = props.editInfo.smallUrl
        }
    })
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()

    const formData = ref<any>({
        id: '',
        appNo: defaultAppNo.value,
        region: '',
        big: [],
        bigName: '',
        small: [],
        smallName: '',
        bigUrl: '',
        smallUrl: ''





    })
    watch(() => defaultAppNo.value, () => {
        formData.value.appNo = defaultAppNo.value
    })
    const ruleFormRef = ref<FormInstance>()
    const rules = ref<any>({


    })

    const removeImage = (type: string) => {
        switch (type) {
            case 'small':
                formData.value.smallUrl = ''
                formData.value.small = []
                formData.value.smallName = ''
                break;
            case 'big':
                formData.value.bigUrl = ''
                formData.value.big = []
                formData.value.bigName = ''
                break;
        }

    }


    const handleBigChange = (uploadFile: UploadUserFile) => {
        formData.value.bigName = ''
        const file = uploadFile.raw
        const reader = new FileReader()
        if (file) {
            reader.readAsDataURL(file)
        }
        reader.onload = () => {
            formData.value.bigUrl = reader.result
        }
    }
    const handleSmallChange = (uploadFile: UploadUserFile) => {
        formData.value.smallName = ''
        const file = uploadFile.raw
        const reader = new FileReader()
        if (file) {
            reader.readAsDataURL(file)
        }
        reader.onload = () => {
            formData.value.smallUrl = reader.result
        }
    }
    const resetForm = () => {
        formData.value = {
            id: '',
            appNo: defaultAppNo.value,
            region: '',
            big: [],
            bigName: '',
            small: [],
            smallName: '',
            bigUrl: '',
            smallUrl: ''

        }
        ruleFormRef.value?.resetFields()
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

            const params: any = {
                timestamp: Date.now(),
                appNo: formData.value.appNo,
                region: formData.value.region,
                id: formData.value.id,

            }
            const form = new FormData()
            form.append('type', formData.value.id ? 'update' : 'add')
            form.append('appNo', params.appNo)
            form.append('region', params.region)
            form.append('id', params.id)
            if (formData.value.bigName) {
                form.append('bigName', formData.value.bigName)
            } else {
                form.append('big', formData.value.big[0].raw)
            }
            if (formData.value.smallName) {
                form.append('smallName', formData.value.smallName)
            } else {
                form.append('small', formData.value.small[0].raw)
            }
            const res = await service.post('/outline/save', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            console.log('res', res);
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
                handleClose()
            } else {
                ElMessage.error(res.data.code)
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
    const batchSaveChange = async () => {
        if (showLoading.value) {
            ElMessage.warning('正在保存。。。')
            return
        }
        showLoading.value = true
        try {
            const form = new FormData()
            const big = formData.value.big.map((item: any) => item.raw)
            const small = formData.value.small.map((item: any) => item.raw)
            const bigList = createFileListFromArray(big)
            const smallList = createFileListFromArray(small)
            form.append('appNo', formData.value.appNo)
            form.append('region', formData.value.region)
            form.append('big', bigList as any)
            form.append('small', smallList as any)
            big.forEach((item: any, index: number) => {
                form.append(`big`, item)
            })
            small.forEach((item: any, index: number) => {
                form.append(`small`, item)
            })
            const res = await service.post('/outline/saveBatch', form, {
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
            console.log('批量保存失效', err);
        } finally {
            showLoading.value = false
        }
    }
    const handleComfirm = (ruleFormRef: any) => {
        ruleFormRef.validate((valid: any) => {
            if (valid) {
                console.log('submit!');
                if (props.isBatch) {
                    batchSaveChange()
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