<template>
    <el-dialog :model-value="showEditor" title="编辑自动打开方案" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>


            <el-form-item label="编码" prop="channel">
                <el-select v-model="formData.channel">
                    <el-option v-for="item in channelList" :key="item.id" :label="item.channelName" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="名称" prop="host">
                <el-input v-model="formData.host" />
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
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue'
    const props = defineProps<{
        showEditor: boolean
    }>()

    const counterStore = useCounterStore()
    const { appList, OSlist, channelList } = storeToRefs(counterStore)
    const emit = defineEmits<{
        'update:showEditor': [value: boolean]
    }>()
    const formData = ref<any>({
        id: '',

        host: '',

        channel: '',
        appNo: ''
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

            host: '',

            channel: '',
            appNo: ''
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