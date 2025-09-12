<template>
    <el-dialog :model-value="dialogVisible" title="编辑水印" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon label-position="left">
            <el-form-item label="所属应用" prop="appNo">
                <el-select v-model="formData.appNo" :disabled="true">
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

            <el-form-item label="版本" prop="version">
                <el-input v-model="formData.version" />
            </el-form-item>
            <el-form-item label="水印Alpha" prop="watermarkAlph">
                <el-input v-model="formData.watermarkAlph" type="number" />
            </el-form-item>
            <el-form-item label="水印gap" prop="gap">
                <el-input v-model="formData.gap" type="number" />
            </el-form-item>
            <el-form-item label="水印miscut" prop="miscut">
                <el-input v-model="formData.miscut" type="number" />
            </el-form-item>
            <el-form-item label="水印rotate" prop="rotate">
                <el-input v-model="formData.rotate" type="number" />
            </el-form-item>
            <el-form-item label="水印文字rotate" prop="textRotate">
                <el-input v-model="formData.textRotate" type="number" />
            </el-form-item>
            <el-form-item label="封面图" prop="keyFile">
                <div class="image-upload-container">
                    <el-upload class="image-uploader" v-model:file-list="formData.coverFile" :show-file-list="false"
                        action="#" :on-remove="handleRemoveBig" :auto-upload="false" :on-change="handleChangeBigImge"
                        :limit="1">
                        <img v-if="formData.coverUrl" :src="formData.coverUrl" class="uploaded-image" />
                        <div v-else class="upload-placeholder">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            <span>点击上传图片</span>
                        </div>
                    </el-upload>
                    <el-button v-if="formData.coverUrl" type="danger" size="small" class="delete-image-btn"
                        @click="removeCoverBigImage">
                        <el-icon>
                            <Delete />
                        </el-icon>
                        删除
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item label="背景图" prop="keyFile">
                <div class="image-upload-container">
                    <el-upload class="image-uploader" v-model:file-list="formData.backgroundFile"
                        :show-file-list="false" action="#" :on-remove="handleRemoveSmall" :auto-upload="false"
                        :on-change="handleChangeSmallImge" :limit="1">
                        <img v-if="formData.backgroundUrl" :src="formData.backgroundUrl" class="uploaded-image" />
                        <div v-else class="upload-placeholder">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            <span>点击上传图片</span>
                        </div>
                    </el-upload>
                    <el-button v-if="formData.backgroundUrl" type="danger" size="small" class="delete-image-btn"
                        @click="removeCoverSmallImage">
                        <el-icon>
                            <Delete />
                        </el-icon>
                        删除
                    </el-button>
                </div>
            </el-form-item>

        </el-form>
        <ul class="fontList">
            <li class="fontItem" v-for="(item, index) in fontFormData" :key="index">
                <div class="font-item-header" @click="toggleFontItem(index)">
                    <span class="font-item-title">字体配置 {{ index + 1 }} - {{ item.text || '未设置文字' }}</span>
                    <div class="header-actions">
                        <el-icon class="collapse-icon" :class="{ 'is-expanded': !item._collapsed }">
                            <ArrowDown />
                        </el-icon>
                        <el-button type="danger" size="small" class="delete-font-btn"
                            @click.stop="removeFontItem(index)" :icon="Delete" circle />
                    </div>
                </div>
                <el-collapse-transition>
                    <div v-show="!item._collapsed" class="font-item-content">
                        <el-form :model="item" label-position="top">
                            <el-form-item label="文字内容" prop="text">
                                <el-input v-model="item.text" />
                            </el-form-item>
                            <el-form-item label="文字rect" prop="rect">
                                <el-input v-model="item.rect" />
                            </el-form-item>
                            <el-form-item label="字体颜色" prop="color">
                                <el-color-picker v-model="item.color" />
                            </el-form-item>
                            <el-form-item label="颜色透明度" prop="colorAlpha">
                                <el-input v-model="item.colorAlpha" type="number" />
                            </el-form-item>
                            <el-form-item label="阴影半径" prop="shadowRadius">
                                <el-input v-model="item.shadowRadius" type="number" />
                            </el-form-item>
                            <el-form-item label="阴影透明度" prop="shadowAlpha">
                                <el-input v-model="item.shadowAlpha" type="number" />
                            </el-form-item>
                            <el-form-item label="阴影颜色" prop="shadowColor">
                                <el-color-picker v-model="item.shadowColor" />
                            </el-form-item>
                            <el-form-item label="阴影角度" prop="shadowAngle">
                                <el-input v-model="item.shadowAngle" type="number" />
                            </el-form-item>
                            <el-form-item label="阴影水平偏移量" prop="shadowOffsetX">
                                <el-input v-model="item.shadowOffsetX" type="number" />
                            </el-form-item>
                            <el-form-item label="边框宽" prop="borderWidth">
                                <el-input v-model="item.borderWidth" type="number" />
                            </el-form-item>
                            <el-form-item label="边框颜色" prop="borderColor">
                                <el-color-picker v-model="item.borderColor" />
                            </el-form-item>
                            <el-form-item label="边框透明度" prop="borderAlpha">
                                <el-input v-model="item.borderAlpha" type="number" />
                            </el-form-item>
                            <el-form-item label="背景颜色" prop="backgroundColor">
                                <el-color-picker v-model="item.backgroundColor" />
                            </el-form-item>
                            <el-form-item label="背景透明度" prop="backgroundAlpha">
                                <el-input v-model="item.backgroundAlpha" type="number" />
                            </el-form-item>
                            <el-form-item label="背景半径" prop="backgroundRadius">
                                <el-input v-model="item.backgroundRadius" type="number" />
                            </el-form-item>
                            <el-form-item label="字间距" prop="charSpacing">
                                <el-input v-model="item.charSpacing" type="number" />
                            </el-form-item>
                            <el-form-item label="行间距" prop="lineSpacing">
                                <el-input v-model="item.lineSpacing" type="number" />
                            </el-form-item>
                            <el-form-item label="气泡索引" prop="bubbleIndex">
                                <el-input v-model="item.bubbleIndex" type="number" />
                            </el-form-item>
                            <el-form-item label="对齐" prop="alignment">
                                <el-input v-model="item.alignment" type="number" />
                            </el-form-item>
                            <el-form-item label="字体" prop="textFont">
                                <div style="display: flex;width: 100%;column-gap: 5px;">
                                    <el-input :disabled="true" v-model="item.textFont" style="flex: 2.5;" /> <el-button
                                        @click="editFont(index)" type="primary" style="flex: .5;">编辑</el-button>
                                </div>

                            </el-form-item>
                            <el-form-item label="是否垂直显示" prop="verticalForm">
                                <el-checkbox v-model="item.verticalForm" />
                            </el-form-item>
                            <el-form-item label="是否使用画笔颜色" prop="useStrokeColor">
                                <el-checkbox v-model="item.useStrokeColor" />
                            </el-form-item>
                            <el-form-item label="是否显示删除线" prop="strikethrough">
                                <el-checkbox v-model="item.strikethrough" />
                            </el-form-item>
                            <el-form-item label="是否变化字形" prop="glyphTransform">
                                <el-checkbox v-model="item.glyphTransform" />
                            </el-form-item>
                            <el-form-item label="是否显示下划线" prop="underline">
                                <el-checkbox v-model="item.underline" />
                            </el-form-item>
                            <el-form-item label="是否使用新的颜色格式" prop="newColorFormat">
                                <el-checkbox v-model="item.newColorFormat" />
                            </el-form-item>
                        </el-form>
                    </div>
                </el-collapse-transition>
            </li>
            <li class="addFont-btn">
                <el-button style="width: 100%;" @click="addFontItem">添加字体</el-button>
            </li>
        </ul>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleComfirm(ruleFormRef)">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
    <el-dialog v-model="isEditFont" title="编辑字体" width="500" :before-close="handleCloseFont">
        <el-form ref="fontFormRef" :model="editFontInfo" label-position="top">
            <el-form-item label="字体文件名" prop="fileId">
                <el-input v-model="editFontInfo.fileId" />
            </el-form-item>
            <el-form-item label="字体名" prop="fontname">
                <el-input v-model="editFontInfo.fontname" />
            </el-form-item>
            <el-form-item label="字体类型" prop="fontType">
                <el-input v-model="editFontInfo.fontType" type="number" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleCloseFont">取消</el-button>
                <el-button type="primary" @click="handleComfirmFont">
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
    import type { UploadUserFile, UploadProps } from 'element-plus'
    import { Delete, ArrowDown } from '@element-plus/icons-vue'
    import service from '@/axios';
    const counterStore = useCounterStore()
    const { appList, defaultAppNo, regionList, showLoading } = storeToRefs(counterStore)
    const props = defineProps<{
        dialogVisible: boolean
        editInfo: any
        isPublic?: boolean
    }>()
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()







    watch(() => props.dialogVisible, (newV) => {
        if (newV && props.editInfo) {
            console.log('props.editInfo', props.editInfo);
            formData.value.id = props.editInfo.id
            formData.value.region = props.editInfo.region
            formData.value.watermarkAlph = props.editInfo.watermarkAlph
            formData.value.gap = props.editInfo.gap
            formData.value.miscut = props.editInfo.miscut
            formData.value.rotate = props.editInfo.rotate
            formData.value.coverUrl = props.editInfo.coverUrl
            formData.value.coverName = props.editInfo.coverName
            formData.value.backgroundUrl = props.editInfo.backgroundUrl
            formData.value.backgroundName = props.editInfo.backgroundName
            formData.value.textRotate = props.editInfo.textRotate
            formData.value.version = props.editInfo.version
            // 为每个字体项添加折叠状态
            fontFormData.value = props.editInfo.watermarkDetailVos.map((item: any) => ({
                ...item,
                _collapsed: true // 默认展开状态
            }))
        }
    })


    //编辑字体
    const setIndex = ref<number>(0)
    const isEditFont = ref<boolean>(false)
    const editFont = (index: number) => {
        const textFont = fontFormData.value[index].textFont
        console.log('textFont', textFont);
        setIndex.value = index
        if (textFont) {
            editFontInfo.value = JSON.parse(textFont)
        }
        isEditFont.value = true
    }
    const editFontInfo = ref<any>({
        fileId: '',
        fontname: '',
        fontType: 0,
    })
    const handleCloseFont = () => {
        console.log('handleCloseFont');
        isEditFont.value = false
        Object.assign(editFontInfo.value, {
            fileId: '',
            fontname: '',
            fontType: 0,
        })
    }
    const handleComfirmFont = () => {
        console.log('editFontInfo', editFontInfo.value);

        fontFormData.value[setIndex.value].textFont = JSON.stringify(editFontInfo.value)
        handleCloseFont()

    }






    const formData = ref<any>({
        id: '',
        appNo: defaultAppNo.value,
        region: '',
        version: '',
        "watermarkAlph": '',
        "gap": "",
        "miscut": '',
        "rotate": "",
        textRotate: '',
        coverUrl: '',
        coverName: '',
        backgroundUrl: "",
        backgroundName: '',
        coverFile: [],
        backgroundFile: [],


    })

    const fontFormData = ref<any>([

    ])

    const addFontItem = () => {
        fontFormData.value.push({
            id: '',
            text: '',
            rect: '',
            color: '#000000',
            colorAlpha: 1,
            shadowRadius: 0,
            shadowAlpha: 0,
            shadowColor: '#000000',
            shadowAngle: 0,
            shadowOffsetX: 0,
            borderWidth: 0,
            borderColor: '#000000',
            borderAlpha: 0,
            backgroundColor: '#ffffff',
            backgroundAlpha: 0,
            backgroundRadius: 0,
            charSpacing: 0,
            lineSpacing: 1,
            bubbleIndex: 1,
            alignment: 0,
            textFont: '',
            verticalForm: false,
            useStrokeColor: false,
            strikethrough: false,
            glyphTransform: false,
            underline: false,
            newColorFormat: false,
            _collapsed: false // 默认展开状态
        })
    }

    // 切换字体项的折叠状态
    const toggleFontItem = (index: number) => {
        fontFormData.value[index]._collapsed = !fontFormData.value[index]._collapsed
    }


    const handleChangeBigImge = (uploadFile: UploadUserFile) => {
        console.log(uploadFile.raw);

        if (uploadFile.raw) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const fullBase64 = e.target?.result as string;
                formData.value.coverUrl = fullBase64
                formData.value.coverName = ''
            };
            reader.readAsDataURL(uploadFile.raw);
        }


    }

    const handleRemoveBig: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
        console.log(uploadFile, uploadFiles)
        formData.value.coverFile = []
        formData.value.coverUrl = ''
        formData.value.coverName = ''

    }


    const removeCoverBigImage = () => {
        formData.value.coverFile = []
        formData.value.coverUrl = ''
        formData.value.coverName = ''
    }

    const handleChangeSmallImge = (uploadFile: UploadUserFile) => {
        console.log(uploadFile.raw);

        if (uploadFile.raw) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const fullBase64 = e.target?.result as string;
                formData.value.backgroundUrl = fullBase64
                formData.value.backgroundName = ''
            };
            reader.readAsDataURL(uploadFile.raw);
        }


    }

    const handleRemoveSmall: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
        console.log(uploadFile, uploadFiles)
        formData.value.backgroundUrl = ''
        formData.value.backgroundName = ''
        formData.value.backgroundFile = []
    }


    const removeCoverSmallImage = () => {
        formData.value.backgroundUrl = ''
        formData.value.backgroundName = ''
        formData.value.backgroundFile = []
    }

    // 删除字体项
    const removeFontItem = (index: number) => {
        fontFormData.value.splice(index, 1)
    }

    watch(() => defaultAppNo.value, () => {
        formData.value.appNo = defaultAppNo.value
    })
    const ruleFormRef = ref<FormInstance>()
    const rules = ref<any>({


    })

    const resetForm = () => {
        formData.value = {
            id: '',
            appNo: defaultAppNo.value,
            region: '',
            version: '',
            "watermarkAlph": '',
            "gap": "",
            "miscut": '',
            "rotate": "",
            textRotate: '',
            coverUrl: '',
            coverName: '',
            backgroundUrl: "",
            backgroundName: '',
            coverFile: [],
            backgroundFile: [],

        }
        fontFormData.value = []
        ruleFormRef.value?.resetFields()
    }
    const handleClose = () => {
        resetForm()
        emit('update:dialogVisible', false)
    }

    const dataTransform = (file: File[]): FileList => {
        const dataTran = new DataTransfer()
        file.forEach(item => {
            dataTran.items.add(item)
        })
        return dataTran.files
    }
    const saveChange = async () => {

        showLoading.value = true
        try {
            //处理图片
            const coverFileList = formData.value.coverFile.map((item: any) => item.raw)
            const backgroundFileList = formData.value.backgroundFile.map((item: any) => item.raw)

            const coverList = dataTransform(coverFileList)
            const backgroundList = dataTransform(backgroundFileList)


            const form = new FormData()
            form.append('id', formData.value.id)
            form.append('type', formData.value.id ? 'update' : 'add')
            form.append('version', formData.value.version)
            form.append('watermarkAlph', formData.value.watermarkAlph)
            form.append('gap', formData.value.gap)
            form.append('miscut', formData.value.miscut)
            form.append('rotate', formData.value.rotate)
            form.append('textRotate', formData.value.textRotate)
            form.append('appNo', formData.value.appNo)
            form.append('region', formData.value.region)
            if (props.isPublic) {
                form.append('isPublic', 'true')
            }
            if (formData.value.coverName) {
                form.append('coverName', formData.value.coverName)
            } else {
                // form.append('cover', coverList as any)
                console.log('formData.value.coverFile', formData.value.coverFile);
                form.append('cover', formData.value.coverFile[0].raw)
            }
            if (formData.value.backgroundName) {
                form.append('backgroundName', formData.value.backgroundName)

            } else {
                // form.append('background', backgroundList as any)
                form.append('background', formData.value.backgroundFile[0].raw)
            }
            console.log('fontList', fontFormData.value);
            const detailDtoListStr = JSON.stringify(fontFormData.value)
            form.append('detailDtoListStr', detailDtoListStr)
            fontFormData.value.forEach((item: any) => {
                for (let key in item) {
                    if (key === 'id') {
                        form.append('detailId', item[key])
                    } else {
                        form.append(key, item[key])
                    }
                }
            })

            const res = await service.post('/watermark/save', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (res.data.code === 200) {

                ElMessage.success(res.data.msg)
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

    .fontList {
        display: flex;
        flex-direction: column;
        row-gap: 10px;

        .fontItem {
            position: relative;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
            background: #fff;
        }
    }

    .font-item-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
            background: #e9ecef;
        }

        .font-item-title {
            font-weight: 500;
            color: #495057;
            font-size: 14px;
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .collapse-icon {
            transition: transform 0.3s ease;
            color: #6c757d;

            &.is-expanded {
                transform: rotate(180deg);
            }
        }

        .delete-font-btn {
            opacity: 0;
            transition: opacity 0.3s;
        }

        &:hover .delete-font-btn {
            opacity: 1;
        }
    }

    .font-item-content {
        padding: 20px 16px;
    }

</style>