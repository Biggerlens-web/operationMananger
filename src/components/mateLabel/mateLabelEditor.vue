<template>
    <el-dialog :model-value="dialogVisible" title="编辑标签" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>



            <el-form-item label="标签" prop="label">
                <el-input v-model="formData.label" />
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
        labelInfo: any
    }>()


    watch(() => props.dialogVisible, (newV) => {
        if (newV && props.labelInfo) {
            formData.value = {

                ...props.labelInfo
            }
        }
    })
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()

    const formData = ref<any>({
        id: '',

        label: ""



    })
    const ruleFormRef = ref<FormInstance>()
    const rules = ref<any>({
        label: [{ required: true, message: '请输入标签', trigger: 'blur' }],

    })

    const resetForm = () => {
        formData.value = {
            id: '',

            label: ""

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
                ...formData.value,
                type: formData.value.id ? 'update' : 'add'
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/base/mateLabel/save', {
                enData
            })
            console.log('保存标签', res);
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
                handleClose()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('保存失败', err);
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