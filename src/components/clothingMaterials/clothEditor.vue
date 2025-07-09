<template>
    <el-dialog :model-value="showEditor" title="编辑" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="所属应用" prop="appNo">
                <el-select filterable v-model="formData.appNo" @change="getParentList" placeholder="请选择应用">
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
                </el-select>
            </el-form-item>
            <el-form-item label="上传区域" prop="region">
                <el-select v-model="formData.region" @change="getParentList" placeholder="请选择上传区域">
                    <el-option v-for="item in regionList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="系统" prop="os" v-if="type === 'template'">
                <el-select v-model="formData.os" @change="getParentList" placeholder="请选择系统">
                    <el-option v-for="item in OSlist" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="壁纸类类型" prop="classType" v-if="type === 'wallpapper'">
                <el-select v-model="formData.classType" placeholder="请选择壁纸类类型">
                    <el-option v-for="item in wallpapperTypes" :key="item.value" :label="item.note"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="父分类" prop="tids" v-if="!noHaveParent">
                <el-select v-model="formData.tids" placeholder="请选择父分类" multiple>
                    <el-option v-for="item in parentList" :key="item.id" :label="item.classType" :value="item.id" />
                </el-select>
            </el-form-item>

            <el-form-item label="子分类名" prop="name">
                <el-input v-model="formData.name" />
            </el-form-item>
            <el-form-item label="访问名" prop="field">
                <el-input v-model="formData.field" />
            </el-form-item>


            <el-form-item label="类图" prop="classImage">

                <div class="image-upload-container">
                    <el-upload class="image-uploader" :show-file-list="false" action="#" :on-remove="handleRemove"
                        :auto-upload="false" :on-change="handleChangeimge">
                        <img v-if="formData.classImageBase64" :src="formData.classImageBase64" class="uploaded-image" />
                        <div v-else class="upload-placeholder">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            <span>点击上传图片</span>
                        </div>
                    </el-upload>
                    <el-button v-if="formData.classImageBase64" type="danger" size="small" class="delete-image-btn"
                        @click="removeCoverImage">
                        <el-icon>
                            <Delete />
                        </el-icon>
                        删除
                    </el-button>
                </div>

            </el-form-item>
            <el-form-item label="国际化" prop="international">
                <el-input :disabled="true" v-model="formData.international" />
                <el-button @click="setLanguage">编辑</el-button>
            </el-form-item>

            <el-form-item label="是否运营类" prop="isOperationClass">
                <el-switch v-model="formData.isOperationClass" />
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
    <!-- 图片语言弹窗 -->
    <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>



    <!-- 国际化编辑弹窗 -->
    <el-dialog title="编辑国际化" v-model="languageDialogVisible" width="500">
        <ul class="language_select_list">
            <li v-for="(item, index) in languageData" :key="index">
                <el-select v-model="item.language">
                    <el-option v-for="langOption in international" :key="langOption.value" :label="langOption.language"
                        :value="langOption.value" :disabled="isLanguageSelected(langOption.value, item.language)" />
                </el-select>

                <el-input v-model="item.value" placeholder="请输入文本">

                </el-input>
                <el-button type="danger" @click="removeLanguageLi(index)">删除</el-button>
            </li>
            <li>
                <el-button style="width: 100%;" @click="addLanguageLi">添加一行</el-button>
            </li>

        </ul>
        <p style="display: flex;justify-content: flex-end;">
            <el-button type="primary" @click="handleLanguageComfirm">
                确定
            </el-button>
            <el-button @click="languageDialogVisible = false">
                取消
            </el-button>
        </p>

    </el-dialog>
</template>

<script lang="ts" setup>

    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { reactive, ref, watch, onMounted } from 'vue'
    import { Plus } from '@element-plus/icons-vue'
    import type { UploadProps, UploadUserFile, UploadFiles } from 'element-plus'
    import { ElMessage } from 'element-plus'
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    const props = defineProps<{
        showEditor: boolean
        editorInfo: any
        noHaveParent?: boolean
        type: string
        wallpapperTypes?: any
    }>()



    const setEditInfor = () => {
        if (props.editorInfo) {
            if (props.noHaveParent) {
                formData.value.id = props.editorInfo.id
                formData.value.name = props.editorInfo.name
                formData.value.field = props.editorInfo.field
                formData.value.international = props.editorInfo.international
                formData.value.isOperationClass = props.editorInfo.operationClass === 1 ? true : false
                formData.value.region = props.editorInfo.region === '国内' ? "domestic" : 'foreign'
                formData.value.appNo = props.editorInfo.appNo
                formData.value.os = props.editorInfo.os?.value
                formData.value.classType = props.editorInfo.classType

            } else {
                formData.value.id = props.editorInfo.id
                formData.value.name = props.editorInfo.name
                formData.value.field = props.editorInfo.field
                formData.value.international = props.editorInfo.international
                formData.value.isOperationClass = props.editorInfo.operationClass === 1 ? true : false
                formData.value.region = props.editorInfo.region === '国内' ? "domestic" : 'foreign'
                formData.value.tids = props.editorInfo.parentTypeIdList
                formData.value.appNo = props.editorInfo.appNo
            }

        }
    }

    const removeCoverImage = () => {
        formData.value.classImage = [];
        formData.value.classImageBase64 = '';
    }

    watch(() => props.showEditor, async (newV) => {
        if (newV) {

            if (props.editorInfo && props.editorInfo.classImageUrl) {
                // try {
                //     const response = await fetch(props.editorInfo.classImageUrl);
                //     const blob = await response.blob();
                //     const fileName = props.editorInfo.classImageName || props.editorInfo.classImageUrl.substring(props.editorInfo.classImageUrl.lastIndexOf('/') + 1) || 'image.png';
                //     const file = new File([blob], fileName, { type: blob.type });

                //     // 构造 UploadFile 对象以在 el-upload 中显示
                //     const uploadFile: UploadUserFile = {
                //         name: file.name,
                //         size: file.size,
                //         status: 'success', // 标记为已上传成功状态
                //         uid: Date.now(), // 生成唯一ID
                //         url: props.editorInfo.classImageUrl, // 用于预览
                //         raw: Object.assign(file, { uid: Date.now() }), // 为File对象添加uid属性
                //     };
                //     formData.value.classImage = [uploadFile]; // 更新file-list

                //     // 将下载的文件转为Base64
                //     const reader = new FileReader();
                //     reader.onload = (e) => {
                //         const base64 = e.target?.result as string
                //         formData.value.classImageBase64 = base64.split(',')[1]
                //     };
                //     reader.readAsDataURL(file);

                // } catch (error) {
                //     console.error('Failed to fetch or process image from URL:', error);
                //     ElMessage.error('从URL加载图片失败');
                // }
                formData.value.classImageBase64 = props.editorInfo.classImageUrl
            } else {
                // 如果没有图片URL，确保清空相关字段，以防上次编辑残留
                formData.value.classImage = [];
                formData.value.classImageBase64 = '';
            }
            setEditInfor()
            getParentList()

        }

    })


    const dialogImageUrl = ref('')
    const dialogVisible = ref(false)

    const counterStore = useCounterStore()
    const { appList, regionList, international, defaultAppNo, OSlist, showLoading } = storeToRefs(counterStore)




    const emit = defineEmits<{
        'update:showEditor': [value: boolean]
    }>()
    const formData = ref<any>({
        id: '',
        name: '',
        field: '',
        appNo: defaultAppNo.value,
        tids: [],
        classImage: [], // 初始化为数组
        classImageBase64: '', // 新增用于存储Base64的字段
        international: '',
        isOperationClass: false,
        region: '',
        os: '',
        classType: '',
    })



    onMounted(() => {
        if (props.noHaveParent) {
            delete formData.value.tids
        }
    })


    watch(() => defaultAppNo.value, () => {
        formData.value.appNo = defaultAppNo.value
    })
    //获取父类列表

    const parentList = ref<any>([])
    const getParentList = async () => {
        if (props.noHaveParent) {
            return
        }
        try {
            const params = {
                appNo: formData.value.appNo,
                region: formData.value.region,
                timestamp: new Date().getTime()
            }
            console.log('参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.get('/clothingMaterialsType/list', {
                params: {
                    enData
                }
            })

            console.log('获取父类', res);

            parentList.value = res.data.data.list
        } catch (err) {

            console.log('获取父类失败');
        } finally {
            showLoading.value = false
        }
    }

    const ruleFormRef = ref<any>(null)
    const rules = ref({

    })

    const resetForm = () => {
        if (props.noHaveParent) {
            formData.value = {
                id: '',
                name: '',
                field: '',
                appNo: defaultAppNo.value,
                classImage: [],
                classImageBase64: '',
                international: '',
                isOperationClass: false,
                region: '',
                os: '',
                classType: '',
            }
        } else {
            formData.value = {
                id: '',
                name: '',
                field: '',
                appNo: defaultAppNo.value,
                tids: [],
                classImage: [],
                classImageBase64: '',
                international: '',
                isOperationClass: false,
                region: ''
            }
        }

        ruleFormRef.value?.resetFields()
    }
    const handleClose = () => {
        resetForm()
        emit('update:showEditor', false)
    }

    const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
        console.log(uploadFile, uploadFiles)
        formData.value.classImageBase64 = ''
    }

    const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
        dialogImageUrl.value = uploadFile.url!
        dialogVisible.value = true
    }

    const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
        ElMessage.warning(
            `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + uploadFiles.length} 个文件`
        )
    }
    const handleChangeimge = (uploadFile: UploadUserFile, uploadFiles: UploadFiles) => {
        console.log(uploadFile.raw);

        if (uploadFile.raw) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const fullBase64 = e.target?.result as string;
                formData.value.classImageBase64 = fullBase64
            };
            reader.readAsDataURL(uploadFile.raw);
        }


    }

    //设置国际化
    const languageDialogVisible = ref<boolean>(false)

    const languageData = ref<any>([
        {
            language: 'zh',
            value: ''
        }

    ])
    const setLanguage = () => {
        languageDialogVisible.value = true
    }
    const addLanguageLi = () => {
        languageData.value.push({
            language: '',
            value: ''
        })
    }
    const removeLanguageLi = (index: number) => {
        if (languageData.value.length == 1) {
            ElMessage.warning('至少保留一行')
            return
        }
        languageData.value.splice(index, 1)
    }
    const isLanguageSelected = (languageValue: string, currentLanguage: string) => {
        // 如果是当前行已选的语言，则不禁用
        if (languageValue === currentLanguage) {
            return false;
        }
        // 检查该语言是否已被其他行选择
        return languageData.value.some((dataItem: any) => dataItem.language === languageValue);
    }
    const openLanguageDialog = () => {
        if (formData.value.international) {
            try {
                const i18nObject = JSON.parse(formData.value.international);
                languageData.value = Object.entries(i18nObject).map(([key, value]) => ({
                    language: key,
                    value: value as string
                }));
            } catch (error) {
                console.error('Failed to parse i18n JSON string:', error);
                // 如果解析失败，可以重置为默认值或进行错误处理
                languageData.value = [{ language: '', value: '' }];
            }
        } else {
            // 如果 formData.i18n 为空，则使用默认的初始值或清空
            languageData.value = [{ language: '', value: '' }];
        }
        languageDialogVisible.value = true;
    };



    watch(() => languageDialogVisible.value, (newV) => {
        if (newV) {
            openLanguageDialog()
        }
    })
    const handleLanguageComfirm = () => {
        const i18nObject = languageData.value.reduce((acc: any, cur: any) => {
            if (cur.language && cur.value) {
                acc[cur.language] = cur.value;
            }
            return acc;
        }, {} as Record<string, string>);
        console.log('languageData.value', languageData.value);
        console.log('i18nObject', i18nObject);
        formData.value.international = JSON.stringify(i18nObject);
        console.log('formData.value.international', formData.value.international);
        languageDialogVisible.value = false;
    }
    const addClothType = async () => {
        if (showLoading.value) {
            ElMessage.warning('正在保存。。。');
            return
        }
        try {

            const params: any = {
                id: formData.value.id,
                timestamp: Date.now(),
                appNo: formData.value.appNo,
                region: formData.value.region,
                name: formData.value.name,
                field: formData.value.field,
                tids: formData.value.tids,
                classImage: formData.value.classImageBase64.includes('http') ? formData.value.classImageBase64 : formData.value.classImageBase64.split(',')[1], // 使用Base64字符串

                international: formData.value.international,
                isOperationClass: formData.value.isOperationClass,

            }
            if (formData.value.classImageBase64.includes('http')) {
                params.classImageName = props.editorInfo.classImageName
            }
            if (props.noHaveParent) {
                delete params.tids
                params['type'] = params.id ? 'update' : 'add'
            }

            let url: string = ''
            switch (props.type) {
                case 'background':
                    url = '/background/save'
                    break;
                case 'sitcker':
                    url = '/sticker/save'
                    break;
                case 'clothing':
                    url = '/clothingMaterials/save'
                    break;
                case 'template':
                    url = '/templateUp/save'
                    params.os = formData.value.os.toLowerCase()
                    break
                case 'mask':
                    url = '/mask/save'
                    break
                case 'shape':
                    url = '/shape/save'
                    break
                case 'wallpapper':
                    url = '/wallpaper/save'
                    params.classType = formData.value.classType
                    break
                case 'othermaterial':
                    url = '/otherMaterial/save'
                    break
            }
            console.log('参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post(url, {
                enData
            })
            console.log('新增子分类', res);
            if (res.data.code === 200) {
                ElMessage.success('新增成功')
                handleClose()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('新增子分类失败', err);
        } finally {
            showLoading.value = false
        }
    }
    const handleComfirm = (ruleFormRef: any) => {
        ruleFormRef.validate(async (valid: any) => {
            if (valid) {
                console.log('props.noHaveParent', props.noHaveParent);
                if (formData.value.tids?.length === 0) {
                    ElMessage.warning('请选择父类')
                    return
                }
                addClothType()

            }
        })
    }
</script>

<style lang="scss" scoped>
    .language_select_list {
        list-style: none;
        padding: 0;

        li {
            display: flex;
            align-items: center;
            margin-bottom: 10px;

            .el-select {
                margin-right: 10px;
                width: 120px;
            }

            .el-input {
                margin-right: 10px;
            }
        }
    }

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