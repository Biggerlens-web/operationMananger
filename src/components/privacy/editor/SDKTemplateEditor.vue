<template>
    <el-dialog :model-value="showEditor" title="编辑SDK模板" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="语言" prop="language">
                <el-select v-model="formData.language">
                    <el-option v-for="item in international" :key="item.value" :label="item.language"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="SDK名称" prop="sdkName">
                <el-input v-model="formData.sdkName" />
            </el-form-item>
            <el-form-item label="包名" prop="sdkPackage">
                <el-input v-model="formData.sdkPackage" />
            </el-form-item>
            <el-form-item label="使用目的" prop="usePurpose">
                <el-input v-model="formData.usePurpose" />
            </el-form-item>
            <el-form-item label="共享信息范围" prop="sharedInfoScope">
                <el-input v-model="formData.sharedInfoScope" />
            </el-form-item>
            <el-form-item label="SDK所属公司" prop="sdkCompany">
                <el-input v-model="formData.sdkCompany" />
            </el-form-item>
            <el-form-item label="隐私政策链接" prop="sdkPrivacyURL">
                <el-input v-model="formData.sdkPrivacyURL" />
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
    import { ref, watch } from 'vue'
    const stores = useCounterStore()
    const { international, showLoading } = storeToRefs(stores)
    const props = defineProps<{
        showEditor: boolean
        SDKInfo: any
    }>()
    watch(() => props.showEditor, (newV) => {
        if (newV && props.SDKInfo) {
            console.log('数据', props.SDKInfo);
            Object.assign(formData.value, props.SDKInfo)
        }
    })
    const emit = defineEmits<{
        'update:showEditor': [value: boolean]
    }>()
    const formData = ref<any>({
        id: '',
        language: '',
        sdkCompany: '',
        sdkName: "",
        sdkPackage: '',
        sdkPrivacyURL: "",
        sharedInfoScope: '',
        useScenario: ''

    })
    const languageList = ref([
        {
            value: '1',
            label: '中文'
        },
        {
            value: '2',
            label: '英文'
        }
    ])

    const ruleFormRef = ref<any>(null)
    const rules = ref({

    })

    const resetForm = () => {
        formData.value = {
            id: '',
            language: '',
            sdkCompany: '',
            sdkName: "",
            sdkPackage: '',
            sdkPrivacyURL: "",
            sharedInfoScope: '',
            useScenario: ''
        }
        ruleFormRef.value?.resetFields()
    }
    const handleClose = () => {
        resetForm()
        emit('update:showEditor', false)
    }

    const saveChange = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                ...formData.value
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/appInfoDetailThreesdksItems/save', {
                enData
            })
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
                handleClose()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('保存失败', err);
        } finally {
            showLoading.value = false
        }
    }
    const handleComfirm = (ruleFormRef: any) => {
        ruleFormRef.validate((valid: any) => {
            if (valid) {
                saveChange()
            }
        })
    }
</script>

<style lang="scss" scoped></style>