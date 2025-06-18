<template>
    <el-dialog :model-value="dialogVisible" title="编辑公司" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>



            <el-form-item label="公司名称" prop="companyName">
                <el-input v-model="formData.companyName" />
            </el-form-item>
            <el-form-item label="公司简称" prop="companyAdd">
                <el-input v-model="formData.companyAdd" />
            </el-form-item>
            <el-form-item label="公司名称(英)" prop="companyEName">
                <el-input v-model="formData.companyEName" />
            </el-form-item>
            <el-form-item label="邮箱" prop="companyEmail">
                <el-input v-model="formData.companyEmail" />
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
    const { appList, OSlist, channelList } = storeToRefs(counterStore)
    const props = defineProps<{
        dialogVisible: boolean
        companyInfo: any
    }>()
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()



    watch(() => props.dialogVisible, (newV) => {
        if (newV && props.companyInfo) {
            formData.value = props.companyInfo
        }
    })
    const formData = ref<any>({
        companyNo: '',
        companyName: "",
        companyAdd: '',
        companyEName: "",
        companyEmail: ''



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
            companyNo: '',
            companyName: "",
            companyAdd: '',
            companyEName: "",
            companyEmail: ''

        }
        ruleFormRef.value?.resetFields()
    }
    const handleClose = () => {
        resetForm()
        emit('update:dialogVisible', false)
    }


    const saveCompany = async () => {
        try {
            const params = {
                ...formData.value,
                timestamp: Date.now(),
                type: formData.value.companyNo ? 'update' : 'add'
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/companyInfo/save', {
                enData
            })

            console.log('保存公司', res);
            if (res.data.code === 200) {
                ElMessage({
                    type: 'success',
                    message: '保存成功'
                })
                handleClose()
            } else {
                ElMessage({
                    type: 'error',
                    message: res.data.msg
                })
            }
        } catch (err) {
            console.log('保存失败', err);
        }
    }
    const handleComfirm = (ruleFormRef: any) => {
        ruleFormRef.validate((valid: any) => {
            if (valid) {
                console.log('submit!');
                saveCompany()
            }
        })
    }
</script>

<style lang="scss" scoped></style>