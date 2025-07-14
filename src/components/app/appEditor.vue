<template>
    <el-dialog :model-value="dialogVisible" title="编辑应用" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="应用简称" prop="appAbbreviation">
                <el-input v-model="formData.appAbbreviation" />
            </el-form-item>
            <el-form-item label="应用访问名" prop="appName">
                <el-input v-model="formData.appName" />
            </el-form-item>
            <el-form-item label="系统账号ID" prop="systemId">
                <el-input v-model="formData.systemId" />
            </el-form-item>
            <el-form-item label="开发者" prop="developer">
                <el-input v-model="formData.developer" />
            </el-form-item>
            <el-form-item label="所属公司" prop="companyNo">
                <el-select v-model="formData.companyNo">
                    <el-option v-for="item in companyList" :key="item.companyNo" :label="item.companyName"
                        :value="item.companyNo">
                    </el-option>
                </el-select>
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
    import service from '@/axios';
    import { useCounterStore } from '@/stores/counter';
    import { desEncrypt } from '@/utils/des';
    import { ElMessage, type FormInstance } from 'element-plus';
    import { storeToRefs } from 'pinia';
    import { ref, watch } from 'vue'
    const counterStore = useCounterStore()
    const { defaultCompanyNo, companyList, showLoading } = storeToRefs(counterStore)
    const props = defineProps<{
        dialogVisible: boolean
    }>()
    watch(() => props.dialogVisible, (newV) => {
        if (newV) {
            formData.value.companyNo = defaultCompanyNo.value
        }
    })
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()

    const formData = ref<any>({

        appAbbreviation: "",
        appName: '',
        systemId: '',
        developer: "",
        companyNo: ''


    })
    const ruleFormRef = ref<FormInstance>()
    const rules = ref<any>({
        bucket: [{ required: true, message: '请输入域', trigger: 'blur' }],
        path: [{ required: true, message: '请选择路径', trigger: 'change' }],
        img: [{ required: true, message: '请上传图片', trigger: 'blur' }],
        bannerName: [{ required: true, message: '请输入轮播图名称', trigger: 'blur' }]

    })

    const resetForm = () => {
        formData.value = {

            appAbbreviation: "",
            appName: '',
            systemId: '',
            developer: "",
            companyNo: ''

        }
        ruleFormRef.value?.resetFields()
    }
    const handleClose = () => {
        resetForm()
        emit('update:dialogVisible', false)
    }

    const saveChange = async () => {
        if (showLoading.value) {
            ElMessage.warning('正在保存')
            return
        }
        showLoading.value = true
        try {

            const params = {
                timestamp: Date.now(),
                type: 'add',
                ...formData.value
            }

            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/appInfo/save', {
                enData
            })
            if (res.data.code === 200) {
                ElMessage.success('添加成功,请重新登录')
                handleClose()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('添加应用失败', err);
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

<style lang="scss" scoped></style>