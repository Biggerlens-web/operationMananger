<template>
    <el-dialog :model-value="showEditor" title="编辑SDK模板" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="语言" prop="language">
                <el-select v-model="formData.language">
                    <el-option v-for="item in languageList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="SDK名称" prop="permissionName">
                <el-input v-model="formData.permissionName" />
            </el-form-item>
            <el-form-item label="包名" prop="desc">
                <el-input v-model="formData.desc" />
            </el-form-item>
            <el-form-item label="使用目的" prop="use">
                <el-input v-model="formData.desc" />
            </el-form-item>
            <el-form-item label="共享信息范围" prop="use">
                <el-input v-model="formData.desc" />
            </el-form-item>
            <el-form-item label="SDK所属公司" prop="use">
                <el-input v-model="formData.desc" />
            </el-form-item>
            <el-form-item label="隐私政策链接" prop="use">
                <el-input v-model="formData.desc" />
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
    import { ref } from 'vue'
    const props = defineProps<{
        showEditor: boolean
    }>()
    const emit = defineEmits<{
        'update:showEditor': [value: boolean]
    }>()
    const formData = ref<any>({
        id: '',
        language: '',
        permissionName: '',
        desc: "",
        use: ''
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
    const handleComfirm = (ruleFormRef: any) => {
        ruleFormRef.validate((valid: any) => {
            if (valid) {
                handleClose()
            }
        })
    }
</script>

<style lang="scss" scoped></style>