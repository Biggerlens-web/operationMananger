<template>
    <el-dialog v-model="dialogVisible" title="新增分类" width="500" :before-close="() => { resetForm(ruleFormRef) }">
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto">
            <el-form-item label="应用" prop="appNo">
                <el-select v-model="ruleForm.appNo" placeholder="请选择应用" filterable>
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
                </el-select>
            </el-form-item>

            <el-form-item label="功能点" prop="functionValue">
                <el-select v-model="ruleForm.functionValue" placeholder="请选择功能点" @change="changeFunction">
                    <el-option v-for="item in functionList" :key="item.value" :label="item.note"
                        :value="item.value"></el-option>
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
                <el-input v-model="ruleForm.className" placeholder="请输入素材名称" />
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
    import { ref, reactive, watch } from 'vue'
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    const counterStore = useCounterStore()
    const { defaultAppNo, functionList, showLoading, appList, regionList } = storeToRefs(counterStore)

    interface Props {

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
        level: 1
    })

    watch(() => ruleForm.level, (newV) => {
        if (newV === 1) {
            ruleForm.supClassId = ''
        }
    })


    const rules = reactive<FormRules>({
        appNo: [
            { required: true, message: '请选择应用', trigger: 'change' },
        ],
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
                        timestamp: Date.now(),
                        appNo: ruleForm.appNo,
                        className: ruleForm.className,
                        supClassId: ruleForm.supClassId,
                        functionValue: ruleForm.functionValue,
                        supClassName: firstCategoryList.value.find((item: any) => item.id === ruleForm.supClassId)?.className,
                    }
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

<style lang="scss" scoped></style>