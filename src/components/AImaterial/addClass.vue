<template>
    <el-dialog v-model="dialogVisible" title="新增分类" width="500" :before-close="() => { resetForm(ruleFormRef) }">
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto">
            <el-form-item label="应用" prop="appNo">
                <el-select v-model="defaultAppNo" placeholder="请选择应用" filterable :disabled="true">
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
                </el-select>
            </el-form-item>

            <el-form-item label="功能点" prop="functionValue">
                <el-select v-model="ruleForm.functionValue" placeholder="请选择功能点" @change="changeFunction">
                    <el-option v-for="item in functionList" :key="item.id" :label="item.name"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分类等级" prop="level">
                <el-select v-model="ruleForm.level" placeholder="请选择分类等级">
                    <el-option v-for="item in [1, 2]" :key="item" :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="一级分类" prop="supClassId" v-show="ruleForm.level === 2">
                <el-select v-model="ruleForm.supClassId" placeholder="请选择一级分类">
                    <el-option v-for="item in firstCategoryList" :key="item.id" :label="item.className"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分类名称" prop="className">
                <div class="li">

                    <el-input v-model="ruleForm.className"></el-input>

                    <el-input :disabled="true" v-model="ruleForm.international"></el-input>
                    <el-button @click="setLanguage('edit')">编辑</el-button>
                </div>
            </el-form-item>

        </el-form>
        <template #footer>

            <el-button type="primary" @click="submitForm(ruleFormRef)">
                确定
            </el-button>
            <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        </template>
    </el-dialog>
    <!-- 国际化编辑弹窗 -->
    <el-dialog title="编辑国际化" v-model="languageDialogVisible" width="550">
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
    import { ref, reactive, watch } from 'vue'
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    const counterStore = useCounterStore()
    const { defaultAppNo, functionList, showLoading, appList, regionList, international } = storeToRefs(counterStore)

    interface Props {
        editClassInfo: any
    }


    const languageData = ref<any>([
        {
            language: '',
            value: ''
        }

    ])
    const languageDialogVisible = ref<boolean>(false)

    const setLanguage = (type: string, item?: any) => {


        languageDialogVisible.value = true
    }



    const isLanguageSelected = (languageValue: string, currentLanguage: string) => {
        // 如果是当前行已选的语言，则不禁用
        if (languageValue === currentLanguage) {
            return false;
        }
        // 检查该语言是否已被其他行选择
        return languageData.value.some((dataItem: any) => dataItem.language === languageValue);
    }
    const removeLanguageLi = (index: number) => {
        if (languageData.value.length == 1) {

            ElMessage.warning('至少保留一行')
            return
        }
        languageData.value.splice(index, 1)
    }
    const addLanguageLi = () => {
        languageData.value.push({
            language: '',
            value: '',

        })
    }
    const parenti18n = ref('')
    const handleLanguageComfirm = async () => {
        const i18nObject = languageData.value.reduce((acc: any, cur: any) => {
            if (cur.language && cur.value) {
                acc[cur.language] = cur.value;
            }
            return acc;
        }, {} as Record<string, string>);
        parenti18n.value = JSON.stringify(i18nObject);
        console.log("🚀 ~ handleLanguageComfirm ~ parenti18n:", parenti18n.value)
        ruleForm.international = parenti18n.value

        languageDialogVisible.value = false;
    }


    const firstCategoryList = ref<any[]>([])
    const getFirstCategoryList = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                functionValue: ruleForm.functionValue,
                appNo: defaultAppNo.value
            }
            console.log('分类参数params', params);
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
        getFirstCategoryList()
    }




    const props = withDefaults(defineProps<Props>(), {

    })
    const dialogVisible = defineModel('dialogVisible', {
        type: Boolean,
        default: false
    })

    const ruleFormRef = ref<FormInstance>()
    const ruleForm = reactive({
        id: '',
        appNo: '',
        className: '',
        supClassId: '',
        functionValue: '',
        supClassName: '',
        level: 1,
        international: ''

    })

    watch(() => ruleForm.level, (newV) => {
        if (newV === 1) {
            ruleForm.supClassId = ''
        }
    })
    watch(() => dialogVisible.value, (newV) => {
        if (newV) {
            console.log('props', props.editClassInfo);
            if (!props.editClassInfo) return
            ruleForm.id = props.editClassInfo.id
            ruleForm.className = props.editClassInfo.className
            ruleForm.supClassId = props.editClassInfo.supClassId
            ruleForm.functionValue = props.editClassInfo.functionValue
            ruleForm.supClassName = props.editClassInfo.supClassName
            ruleForm.level = props.editClassInfo.supClassId ? 2 : 1

            ruleForm.international = props.editClassInfo.international

            const languageList = JSON.parse(ruleForm.international)
            console.log("🚀 ~ languageList:", languageList)
            languageData.value = []

            for (let key in languageList) {
                languageData.value.push({
                    language: key,
                    value: languageList[key]
                })
            }

        }
    })


    const rules = reactive<FormRules>({

        className: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
        functionValue: [
            { required: true, message: '请选择功能点', trigger: 'change' },
        ],


    })

    const submitForm = async (formEl: FormInstance | undefined) => {
        if (!formEl) return
        await formEl.validate(async (valid, fields) => {
            if (valid) {

                if (showLoading.value) return
                showLoading.value = true
                try {

                    const params = {
                        id: ruleForm.id,

                        timestamp: Date.now(),
                        appNo: defaultAppNo.value,
                        international: ruleForm.international,
                        className: ruleForm.className,
                        supClassId: ruleForm.supClassId,
                        functionValue: ruleForm.functionValue,
                        supClassName: firstCategoryList.value.find((item: any) => item.id === ruleForm.supClassId)?.className,
                    }
                    console.log("🚀 ~ submitForm ~ params:", params)
                    const enData = desEncrypt(JSON.stringify(params))
                    const res = await service.post('/hairMaterials/classification/add', {
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

                } finally { showLoading.value = false }
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
</script>

<style lang="scss" scoped>
    .li {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        .el-input {
            margin-right: 10px;
        }

        .el-input:first-of-type {
            width: 150px; // 设置第一个输入框的宽度
        }

        .el-input:nth-of-type(2) {
            flex-grow: 1; // 让第二个输入框占据剩余空间
        }

        .el-button {
            margin-left: auto; // 将编辑按钮推到最右边
        }
    }

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