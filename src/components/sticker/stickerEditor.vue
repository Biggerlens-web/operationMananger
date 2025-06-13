<template>
    <el-dialog :model-value="showEditor" title="编辑" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="所属应用" prop="appNo">
                <el-select v-model="formData.appNo">
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
                </el-select>
            </el-form-item>
            <el-form-item label="上传区域" prop="line">
                <el-select v-model="formData.appNo">
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
                </el-select>
            </el-form-item>


            <el-form-item label="贴纸分类名" prop="area">
                <el-input v-model="formData.area" />
            </el-form-item>
            <el-form-item label="贴纸访问名" prop="line">
                <el-input v-model="formData.line" />
            </el-form-item>

            <el-form-item label="类图" prop="keyFile">
                <el-upload v-model:file-list="formData.keyFile" class="upload-demo" action="#" list-type="picture-card"
                    :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :auto-upload="false" :limit="1"
                    :on-exceed="handleExceed">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="国际化" prop="line">
                <el-input :disabled="true" v-model="formData.i18n" />
                <el-button @click="setLanguage">编辑</el-button>
            </el-form-item>

            <el-form-item label="是否运营类" prop="line">
                <el-switch v-model="formData.line" />
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
    import { ref, watch } from 'vue'
    import { Plus } from '@element-plus/icons-vue'
    import type { UploadProps, UploadUserFile, UploadFiles } from 'element-plus'
    import { ElMessage } from 'element-plus'
    const props = defineProps<{
        showEditor: boolean
    }>()

    const dialogImageUrl = ref('')
    const dialogVisible = ref(false)

    const counterStore = useCounterStore()
    const { appList, OSlist, channelList, international } = storeToRefs(counterStore)
    const emit = defineEmits<{
        'update:showEditor': [value: boolean]
    }>()
    const formData = ref<any>({
        id: '',
        os: '',
        name: '',
        fields: '',
        probability: '',
        channel: '',
        appNo: '',
        i18n: ''
    })



    const ruleFormRef = ref<any>(null)
    const rules = ref({
        channelGroupName: [{ required: true, message: '请输入渠道组名称', trigger: 'blur' }],
        channelList: [{ required: true, message: '请选择渠道', trigger: 'blur' }]
    })

    const resetForm = () => {
        formData.value = {
            id: '',
            os: '',
            name: '',
            fields: '',
            probability: '',
            channel: '',
            appNo: ''
        }
        ruleFormRef.value?.resetFields()
    }
    const handleClose = () => {
        resetForm()
        emit('update:showEditor', false)
    }

    const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
        console.log(uploadFile, uploadFiles)
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
        if (formData.value.i18n) {
            try {
                const i18nObject = JSON.parse(formData.value.i18n);
                languageData.value = Object.entries(i18nObject).map(([key, value]) => ({
                    language: key,
                    value: value as string
                }));
            } catch (error) {
                console.error('Failed to parse i18n JSON string:', error);
                // 如果解析失败，可以重置为默认值或进行错误处理
                languageData.value = [{ language: 'zh', value: '' }];
            }
        } else {
            // 如果 formData.i18n 为空，则使用默认的初始值或清空
            languageData.value = [{ language: 'zh', value: '' }];
        }
        languageDialogVisible.value = true;
    };



    watch(() => languageDialogVisible.value, (newV) => {
        if (newV) {
            openLanguageDialog()
        }
    })
    const handleLanguageComfirm = () => {
        console.log('国际化信息', languageData.value);
        const i18nObject = languageData.value.reduce((obj: any, item: any) => {
            if (item.language && item.value) {
                obj[item.language] = item.value;
            }
            return obj;
        }, {});
        formData.value.i18n = JSON.stringify(i18nObject);
        languageDialogVisible.value = false;
    }

    const handleComfirm = (ruleFormRef: any) => {
        ruleFormRef.validate((valid: any) => {
            if (valid) {
                handleClose()
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
</style>