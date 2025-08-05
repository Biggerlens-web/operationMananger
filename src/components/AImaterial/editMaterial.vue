<template>
    <el-dialog v-model="dialogVisible" title="编辑素材" :before-close="() => resetForm(ruleFormRef)">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto">
            <el-form-item label="素材名称" prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入素材名称" />
            </el-form-item>
            <el-form-item label="应用" prop="appNo">
                <el-select :disabled="true" v-model="defaultAppNo" placeholder="请选择应用" filterable
                    @change="changeFunction">
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
                </el-select>
            </el-form-item>
            <el-form-item label="地区" prop="region">
                <el-select v-model="ruleForm.region" placeholder="请选择地区" filterable @change="changeFunction">
                    <el-option v-for="item in regionList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="功能点" prop="functionValue">
                <el-select v-model="ruleForm.functionValue" placeholder="请选择功能点" @change="changeFunction">
                    <el-option v-for="item in functionList" :key="item.id" :label="item.name"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分类" prop="classId">
                <el-select v-model="ruleForm.classId" placeholder="请选择一级分类" @change="changeClass">
                    <el-option v-for="item in firstCategoryList" :key="item.id" :label="item.className"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类" prop="secondClassId">
                <el-select v-model="ruleForm.secondClassId" placeholder="请选择二级分类">
                    <el-option v-for="item in secondCategoryList" :key="item.id" :label="item.className"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="素材图片" prop="imageUrl">
                <el-upload action="#" list-type="picture-card" :auto-upload="false" v-model:file-list="fileList" drag
                    :limit="1" :on-remove="handleRemove" :on-change="handleFileChange">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    <template #file="{ file }">
                        <div>
                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                            <span class="el-upload-list__item-actions">
                                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                </span>
                            </span>
                        </div>
                    </template>
                </el-upload>
            </el-form-item>
            <el-form-item label="其他语言" prop="language">
                <el-select v-model="ruleForm.language" placeholder="请选择其他语言">
                    <el-option v-for="langOption in international" :key="langOption.value" :label="langOption.language"
                        :value="langOption.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="输入其他语言" prop="languageText">
                <el-input v-model="ruleForm.languageText" placeholder="请输入其他语言" />
            </el-form-item>
            <el-form-item label="UID" prop="uid">
                <el-input v-model="ruleForm.uid" placeholder="" :disabled="true" />
            </el-form-item>
            <el-form-item label="提示词" prop="promptWords">
                <el-input type="textarea" v-model="ruleForm.promptWords" placeholder="请用英文逗号隔开每一个提示词','" />
            </el-form-item>
            <el-form-item label="反向提示词" prop="reversePrompts">
                <el-input type="textarea" v-model="ruleForm.reversePrompts" placeholder="请用英文逗号隔开每一个提示词','" />
            </el-form-item>
            <el-form-item label="扩散值" prop="diffusionValue">
                <el-input-number v-model="ruleForm.diffusionValue" />
            </el-form-item>


        </el-form>
        <template #footer>

            <el-button type="primary" @click="submitForm(ruleFormRef)">
                确定
            </el-button>
            <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    import { reactive, ref, watch } from 'vue'
    import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
    import { Plus, Delete } from '@element-plus/icons-vue'
    import { useCounterStore } from '@/stores/counter'
    import { storeToRefs } from 'pinia'
    import type { UploadFile } from 'element-plus'
    import { desEncrypt } from '@/utils/des'
    import service from '@/axios'
    const counterStore = useCounterStore()
    const { appList, functionList, international, regionList, showLoading, defaultAppNo } = storeToRefs(counterStore)
    const dialogVisible = defineModel('dialogVisible', {
        type: Boolean,
        default: false
    })
    interface Props {
        materialInfo: any
    }
    const props = defineProps<Props>()
    const ruleFormRef = ref<FormInstance>()
    const ruleForm = reactive<any>({
        id: '',
        name: '',
        appNo: '',
        functionValue: '',
        uid: '',
        language: '',
        classId: '',
        secondClassId: '',
        imageUrl: '',
        languageText: '',
        promptWords: '',
        reversePrompts: '',
        region: '',
        diffusionValue: 0,


    })

    const getUid = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                functionValue: ruleForm.functionValue,
                appNo: defaultAppNo.value,
                region: ruleForm.region
            }
            console.log("🚀 ~ getUid ~ params:", params)
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.get('/hairMaterials/getUid', {
                params: {
                    enData
                }
            })
            console.log("🚀 ~ getUid ~ res:", res)
            if (res.data.code === 200) {
                ruleForm.uid = res.data.data.uid
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log("🚀 ~ getUid ~ err:", err)

        }
    }
    watch(() => dialogVisible.value, (newV) => {

        if (newV) {

            if (props.materialInfo) {
                initEditData(props.materialInfo)
            }
        }
    })

    const rules = reactive<FormRules>({
        name: [
            { required: true, message: '请输入素材名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],

        functionValue: [
            { required: true, message: '请选择功能点', trigger: 'change' }
        ],
        region: [
            { required: true, message: '请选择区域', trigger: 'change' }
        ],
        imageUrl: [
            {
                validator: (rule: any, value: any, callback: any) => {
                    if (!ruleForm.imageUrl) {
                        callback(new Error('请上传素材图片'))
                    } else {
                        callback()
                    }
                },
                trigger: 'change'
            }
        ],
        diffusionValue: [
            // { required: true, message: '请输入扩散值', trigger: 'blur' },
            // { type: 'number', min: 0, max: 100, message: '扩散值必须在0-100之间', trigger: 'blur' }
        ]
    })

    const submitForm = async (formEl: FormInstance | undefined) => {
        if (!formEl) return
        await formEl.validate(async (valid, fields) => {
            if (valid) {
                if (!ruleForm.classId) {
                    ElMessage.error('请选择一级分类')
                    return
                }
                if (showLoading.value) return
                console.log('submit!')
                showLoading.value = true

                try {
                    const params: any = {
                        timestamp: Date.now(),
                        id: ruleForm.id,
                        name: ruleForm.name,
                        appNo: defaultAppNo.value,
                        functionValue: ruleForm.functionValue,
                        uid: ruleForm.uid,
                        promptWords: ruleForm.promptWords,
                        reversePrompts: ruleForm.reversePrompts,
                        region: ruleForm.region,
                        diffusionValue: ruleForm.diffusionValue,

                        classificationId: ruleForm.secondClassId ? ruleForm.secondClassId : ruleForm.classId,
                    }
                    console.log("🚀 ~ submitForm ~ params:", params)
                    console.log('ruleForm', ruleForm);

                    console.log("🚀 ~ submitForm ~ ruleForm.imageUrl:", ruleForm.imageUrl)

                    if (ruleForm.imageUrl.startsWith('data')) {

                        params.imageUrl = ruleForm.imageUrl.split(',')[1]
                    }
                    if (ruleForm.language) {
                        const langObj = {
                            [ruleForm.language]: ruleForm.languageText
                        }
                        params.international = JSON.stringify(langObj)
                    }


                    const enData = desEncrypt(JSON.stringify(params))
                    const res = await service.post('/hairMaterials/save', {
                        enData
                    })
                    console.log("🚀 ~ submitForm ~ res:", res)
                    if (res.data.code === 200) {
                        ElMessage.success('保存成功')
                        resetForm(ruleFormRef.value)
                    } else {
                        ElMessage.error(res.data.msg)
                    }
                } catch (err) {
                    console.log("🚀 ~ submitForm ~ err:", err)

                } finally {
                    showLoading.value = false
                }

            } else {
                console.log('error submit!', fields)
            }
        })
    }

    const resetForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.resetFields()
        // 清空文件列表和图片URL
        fileList.value = []
        ruleForm.imageUrl = ''
        dialogVisible.value = false
    }

    // 初始化编辑数据（用于编辑模式）
    const initEditData = (data: any) => {

        Object.assign(ruleForm, data)
        console.log("🚀 ~ initEditData ~ ruleForm:", ruleForm)
        getCategoryList(true)
        // 如果有图片URL，需要初始化文件列表
        if (data.imageUrl) {
            let imageUrl = data.imageUrl

            // 判断图片URL类型并正确处理
            if (data.imageUrl.startsWith('data:')) {
                // 已经是base64格式，直接使用
                imageUrl = data.imageUrl
            } else if (data.imageUrl.startsWith('http://') || data.imageUrl.startsWith('https://')) {
                // 在线图片地址，直接使用
                imageUrl = data.imageUrl
            } else {
                // 假设是base64编码字符串，添加前缀
                imageUrl = `data:image/jpeg;base64,${data.imageUrl}`
            }

            fileList.value = [{
                name: 'image',
                url: imageUrl,
                uid: Date.now(),
                status: 'success'
            }]
        } else {
            fileList.value = []
        }
        if (data.international) {
            const langObj = JSON.parse(data.international)
            ruleForm.language = Object.keys(langObj)[0]
            ruleForm.languageText = langObj[Object.keys(langObj)[0]]
        }
    }






    const firstCategoryList = ref<any>([])
    const getCategoryList = async (initEdit: boolean = false) => {
        if (!ruleForm.functionValue) return
        try {
            const params = {
                timestamp: Date.now(),
                appNo: defaultAppNo.value,
                functionValue: ruleForm.functionValue
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/hairMaterials/classification/list', {
                enData
            })
            console.log("🚀 ~ getCategoryList ~ res:", res)
            if (res.data.code === 200) {
                firstCategoryList.value = res.data.data.hairMaterialClassification
                ruleForm.classId = ''
                ruleForm.secondClassId = ''
                secondCategoryList.value = []
                if (initEdit) {
                    if (ruleForm.classificationId) {
                        const isFirstClass = firstCategoryList.value.some((item: any) => item.id === ruleForm.classificationId)
                        if (isFirstClass) {
                            ruleForm.classId = ruleForm.classificationId
                            secondCategoryList.value = firstCategoryList.value.find((item: any) => item.id === ruleForm.classificationId)?.children
                        } else {
                            ruleForm.secondClassId = ruleForm.classificationId
                            ruleForm.classId = firstCategoryList.value.find((item: any) => item.children.some((child: any) => child.id === ruleForm.classificationId))?.id
                            secondCategoryList.value = firstCategoryList.value.find((item: any) => item.id === ruleForm.classId)?.children
                        }
                    }
                }

            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log("🚀 ~ getCategoryList ~ err:", err)

        }
    }
    const changeFunction = () => {
        getCategoryList()
        if (ruleForm.functionValue) {
            getUid()
        }
    }


    const secondCategoryList = ref<any>([])
    const changeClass = () => {
        ruleForm.secondClassId = ''
        secondCategoryList.value = firstCategoryList.value.find((item: any) => item.id === ruleForm.classId)?.children
    }

    const disabled = ref(false)
    const fileList = ref<UploadFile[]>([])

    const handleRemove = (file: UploadFile) => {
        console.log('删除文件:', file)
        // 从文件列表中移除指定文件
        const index = fileList.value.findIndex(item => item.uid === file.uid)
        if (index > -1) {
            fileList.value.splice(index, 1)
        }
        // 清空表单中的图片字段
        ruleForm.imageUrl = ''
        console.log('文件已删除，当前文件列表:', fileList.value)

        // 触发表单验证
        ruleFormRef.value?.validateField('image')
    }

    // 文件变化时触发（选择文件时）
    const handleFileChange = (file: UploadFile, fileList: UploadFile[]) => {
        console.log('文件变化事件触发:', file, fileList)
        if (file.raw) {
            processFile(file.raw)
        }
    }

    // 处理文件的通用方法
    const processFile = (file: File) => {
        console.log('处理文件:', file)

        // 文件类型和大小验证
        // const isImage = file.type.startsWith('image/')
        // const isLt2M = file.size / 1024 / 1024 < 2

        // if (!isImage) {
        //     ElMessage.error('只能上传图片文件!')
        //     return false
        // }
        // if (!isLt2M) {
        //     ElMessage.error('图片大小不能超过 2MB!')
        //     return false
        // }

        // 将文件转换为 base64
        const reader = new FileReader()
        reader.onload = (e) => {
            ruleForm.imageUrl = e.target?.result as string

            ElMessage.success('图片上传成功')

            // 触发表单验证
            ruleFormRef.value?.validateField('image')
        }
        reader.onerror = () => {
            ElMessage.error('文件读取失败')
        }
        reader.readAsDataURL(file)

        return true
    }


</script>

<style lang="scss" scoped>


    :deep(.el-upload-dragger) {
        background-color: transparent;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

</style>