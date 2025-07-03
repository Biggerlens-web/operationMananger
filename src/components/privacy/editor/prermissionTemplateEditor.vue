<template>
    <el-dialog :model-value="showEditor" title="编辑权限模板" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>

            <el-form-item label="语言" prop="language">
                <el-select v-model="formData.language">
                    <el-option v-for="item in international" :key="item.value" :label="item.language"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="权限名称" prop="permissionName">
                <el-input v-model="formData.permissionName" />
            </el-form-item>
            <el-form-item label="权限描述" prop="permissionDesc">
                <el-input v-model="formData.permissionDesc" />
            </el-form-item>
            <el-form-item label="权限用途" prop="permissionUsageScenarios">
                <el-input v-model="formData.permissionUsageScenarios" />
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
        prermissionInfo: any
    }>()

    watch(() => props.showEditor, (newV) => {
        if (newV && props.prermissionInfo) {
            Object.assign(formData.value, props.prermissionInfo)
        }
    })
    const emit = defineEmits<{
        'update:showEditor': [value: boolean]
    }>()
    const formData = ref<any>({
        id: '',
        language: '',
        permissionName: '',
        permissionDesc: "",
        permissionUsageScenarios: ''
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
        channelGroupName: [{ required: true, message: '请输入渠道组名称', trigger: 'blur' }],
        channelList: [{ required: true, message: '请选择渠道', trigger: 'blur' }]
    })

    const resetForm = () => {
        formData.value = {
            id: '',
            language: '',
            permissionName: '',
            desc: "",
            use: ''
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
            const res = await service.post('/appInfoDetailPermissionstrsItems/save', {
                enData
            })
            if (res.data.code === 200) {
                ElMessage({
                    message: '保存成功',
                    type: 'success'
                })
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