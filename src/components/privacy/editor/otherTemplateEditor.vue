<template>
    <el-dialog :model-value="showEditor" title="编辑说明模板" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>

            <el-form-item label="语言" prop="language">
                <el-select v-model="formData.language">
                    <el-option v-for="item in international" :key="item.value" :label="item.language"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="其他内容说明" prop="otherInfoContent">
                <el-input type="textarea" v-model="formData.otherInfoContent" />
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
    import { ElMessage } from 'element-plus';
    import { storeToRefs } from 'pinia';
    import { ref, watch } from 'vue';
    const stores = useCounterStore()
    const { international } = storeToRefs(stores)
    const props = defineProps<{
        showEditor: boolean
        otherInfo: any
    }>()
    watch(() => props.showEditor, (newV) => {
        if (newV && props.otherInfo) {
            Object.assign(formData.value, props.otherInfo)
        }
    })
    const emit = defineEmits<{
        'update:showEditor': [value: boolean]
    }>()

    const formData = ref<any>({
        id: '',
        language: '',
        otherInfoContent: ''
    })

    const ruleFormRef = ref<any>(null)
    const rules = ref({

    })
    const handleClose = () => {
        formData.value = {
            id: '',
            language: '',
            otherInfoContent: ''
        }
        emit('update:showEditor', false)
    }

    const saveChange = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                ...formData.value
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/appInfoDetailOtherserversItems/save', {
                enData
            })
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
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
                saveChange()
            } else {
                console.log('error submit!!')
                return false
            }
        })
    }
</script>

<style lang="scss" scoped></style>