<template>
    <el-dialog :model-value="dialogVisible" title="编辑语言" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>


            <el-form-item label="语言简称" prop="languageName">
                <el-input v-model="formData.languageName" />
            </el-form-item>

            <el-form-item label="语言说明" prop="remark">
                <el-input type="textarea" v-model="formData.remark" />
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
    import { desEncrypt } from '@/utils/des';
    import { ElMessage, type FormInstance } from 'element-plus';
    import { ref, watch } from 'vue'
    const props = defineProps<{
        dialogVisible: boolean
        languageInfo: any
    }>()

    watch(() => props.dialogVisible, (newV) => {
        if (newV && props.languageInfo) {
            formData.value = {
                id: props.languageInfo.id,
                languageName: props.languageInfo.languageName,
                remark: props.languageInfo.remark,
            }
        }
    })
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()

    const formData = ref<any>({
        id: '',
        languageName: '',
        remark: '',


    })
    const ruleFormRef = ref<FormInstance>()
    const rules = ref<any>({
        languageName: [{ required: true, message: '请输入语言简称', trigger: 'blur' }],

    })

    const resetForm = () => {
        formData.value = {
            id: '',
            languageName: '',
            remark: '',
        }
        ruleFormRef.value?.resetFields()
    }
    const handleClose = () => {
        resetForm()
        emit('update:dialogVisible', false)
    }


    const saveChange = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                type: formData.value.id ? 'update' : 'add',
                ...formData.value
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/base/language/save', {
                enData
            })
            console.log('保存语言', res);
            if (res.data.code === 200) {
                ElMessage({
                    message: '保存成功',
                    type: 'success',
                })
                handleClose()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {

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