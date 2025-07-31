<template>
    <el-dialog v-model="dialogVisible" title="编辑素材" :before-close="() => resetForm(ruleFormRef)">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto">
            <el-form-item label="素材名称" prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入素材名称" />
            </el-form-item>
            <el-form-item label="应用" prop="appNo">
                <el-select v-model="ruleForm.appNo" placeholder="请选择应用" filterable @change="changeFunction">
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
                    <el-option v-for="item in functionList" :key="item.value" :label="item.note"
                        :value="item.value"></el-option>
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
            <el-form-item label="素材图片" prop="image">
                <el-upload action="#" list-type="picture-card" :auto-upload="false" v-model:file-list="fileList" drag
                    :limit="1" :on-remove="handleRemove" :before-upload="beforeUpload">
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
            <el-form-item label="提示词" prop="prompt">
                <el-input type="textarea" v-model="ruleForm.prompt" placeholder="请用英文逗号隔开每一个提示词','" />
            </el-form-item>
            <el-form-item label="反向提示词" prop="exPrompt">
                <el-input type="textarea" v-model="ruleForm.exPrompt" placeholder="请用英文逗号隔开每一个提示词','" />
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
    import { reactive, ref } from 'vue'
    import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
    import { Plus, Delete } from '@element-plus/icons-vue'
    import { useCounterStore } from '@/stores/counter'
    import { storeToRefs } from 'pinia'
    import type { UploadFile } from 'element-plus'
    import { desEncrypt } from '@/utils/des'
    import service from '@/axios'
    const counterStore = useCounterStore()
    const { appList, functionList, international, regionList } = storeToRefs(counterStore)
    const dialogVisible = defineModel('dialogVisible', {
        type: Boolean,
        default: false
    })

    const ruleFormRef = ref<FormInstance>()
    const ruleForm = reactive<any>({
        id: '',
        name: '',
        appNo: '',
        functionValue: '',
        language: '',
        classId: '',
        secondClassId: '',
        image: [],
        languageText: '',
        prompt: '',
        exPrompt: '',
        region: '',
        diffusionValue: 0

    })
    const rules = reactive<FormRules>({
        name: [
            { required: true, message: '请输入素材名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        diffusionValue: [

            // { required: true, message: '请输入扩散值', trigger: 'blur' },
            // { type: 'number', min: 0, max: 100, message: '扩散值必须在0-100之间', trigger: 'blur' }
        ]
    })

    const submitForm = async (formEl: FormInstance | undefined) => {
        if (!formEl) return
        await formEl.validate((valid, fields) => {
            if (valid) {
                console.log('submit!')
            } else {
                console.log('error submit!', fields)
            }
        })
    }

    const resetForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.resetFields()
        dialogVisible.value = false
    }




    const firstCategoryList = ref<any>([])
    const getCategoryList = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                appNo: ruleForm.appNo,
                functionValue: ruleForm.functionValue
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/hairMaterials/classification/list', {
                enData
            })
            console.log("🚀 ~ getCategoryList ~ res:", res)
            if (res.data.code === 200) {
                firstCategoryList.value = res.data.data.hairMaterialClassification
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log("🚀 ~ getCategoryList ~ err:", err)

        }
    }
    const changeFunction = () => {
        getCategoryList()
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
        ruleForm.image = ''
        console.log('文件已删除，当前文件列表:', fileList.value)
    }

    const beforeUpload = (file: File) => {
        console.log('准备上传文件:', file)
        // 可以在这里添加文件类型和大小验证
        const isImage = file.type.startsWith('image/')
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isImage) {
            console.error('只能上传图片文件!')
            return false
        }
        if (!isLt2M) {
            console.error('图片大小不能超过 2MB!')
            return false
        }

        // 将文件转换为 base64 或处理文件上传逻辑
        const reader = new FileReader()
        reader.onload = (e) => {
            ruleForm.image = e.target?.result as string
        }
        reader.readAsDataURL(file)

        return false // 阻止自动上传
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