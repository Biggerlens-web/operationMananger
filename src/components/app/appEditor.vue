<template>
    <el-dialog :model-value="dialogVisible" title="编辑应用" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="应用简称" prop="appAbbreviation">
                <el-input v-model="formData.appAbbreviation" />
            </el-form-item>
            <el-form-item label="应用访问名" prop="appAccessName">
                <el-input v-model="formData.appAccessName" />
            </el-form-item>
            <el-form-item label="系统账号ID" prop="systemId">
                <el-input v-model="formData.systemId" />
            </el-form-item>
            <el-form-item label="开发者" prop="developer">
                <el-input v-model="formData.developer" />
            </el-form-item>
            <el-form-item label="所属公司" prop="company">
                <el-select v-model="formData.company">
                    <el-option></el-option>
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
    import { useCounterStore } from '@/stores/counter';
    import type { FormInstance } from 'element-plus';
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue'
    const counterStore = useCounterStore()
    const { appList, OSlist, channelList } = storeToRefs(counterStore)
    const props = defineProps<{
        dialogVisible: boolean
    }>()
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()

    const formData = ref<any>({
        id: '',
        appAbbreviation: "",
        appAccessName: '',
        systemId: '',
        developer: "",
        company: ''



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
            id: '',
            appAbbreviation: "",
            appAccessName: '',
            systemId: '',
            developer: "",
            company: ''

        }
        ruleFormRef.value?.resetFields()
    }
    const handleClose = () => {
        resetForm()
        emit('update:dialogVisible', false)
    }
    const handleComfirm = (ruleFormRef: any) => {
        ruleFormRef.validate((valid: any) => {
            if (valid) {
                console.log('submit!');
                handleClose()
            }
        })
    }
</script>

<style lang="scss" scoped></style>