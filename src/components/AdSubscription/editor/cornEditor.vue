<template>
    <el-dialog :model-value="showEditor" title="编辑定时任务" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="所属应用" prop="appNo">
                <el-select v-model="formData.appNo">
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
                </el-select>
            </el-form-item>
            <el-form-item label="渠道" prop="channel">
                <el-select v-model="formData.channel">
                    <el-option v-for="item in channelList" :key="item.id" :label="item.channelName" :value="item.id" />
                </el-select>
            </el-form-item>




        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleComfirm()">
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
    showEditor: boolean,
    type: string,
}>()

const counterStore = useCounterStore()
const { appList, OSlist, channelList } = storeToRefs(counterStore)
const emit = defineEmits<{
    'update:showEditor': [value: boolean]
}>()
const formData = ref<any>({
    id: '',
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
        channel: '',

        appNo: ''
    }
    ruleFormRef.value?.resetFields()
}
const handleClose = () => {
    resetForm()
    emit('update:showEditor', false)
}
const handleComfirm = () => {
    console.log('handleComfirm', formData.value, props.type);
    if (!ruleFormRef.value) {
        console.error('表单引用不存在');
        return;
    }

    ruleFormRef.value.validate((valid: boolean) => {
        console.log('验证结果:', valid);
        if (valid) {
            // 在这里添加数据提交逻辑
            let data = {}
            // 提交成功后再关闭对话框
            if (props.type === 'add') {
                data = {
                    timestamp: Date.now(),
                    type: 'add',
                    appNo: '',
                    pageId: '',
                    loadProgram: '',
                    noLoadAfterSeveralTimesClose: ''
                }
            } else if (props.type === 'update') {
                data = {
                    timestamp: Date.now(),
                    type: 'update',
                    id: '',
                    appNo: '',
                    pageId: '',
                    loadProgram: '',
                    noLoadAfterSeveralTimesClose: ''
                }
            }
            console.log('data', data);



        } else {
            console.log('表单验证失败');
            return false;
        }
    });
}
</script>

<style lang="scss" scoped></style>