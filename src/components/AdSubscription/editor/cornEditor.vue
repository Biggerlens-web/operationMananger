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
import service from '@/axios';
import { desEncrypt } from '@/utils/des';
import { useCounterStore } from '@/stores/counter';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus';
const props = defineProps<{
    showEditor: boolean,
    type: string,
    rowList: any,
}>()

const counterStore = useCounterStore()
const { appList, defaultAppNo, channelList } = storeToRefs(counterStore)
const emit = defineEmits<{
    'update:showEditor': [value: boolean],
    'refresh': []
}>()
const formData = ref<any>({
    id: '',
    channel: '',
    appNo: defaultAppNo.value,
})
// 监听编辑器显示状态和类型，处理数据初始化
watch(() => [props.showEditor, props.type, props.rowList], ([showEditor, type, rowList]) => {
    if (showEditor) {
        if (type === 'update' && rowList) {

            formData.value = {
                id: rowList.id || '',
                channel: rowList.channels.id || '',
                appNo: rowList.appNo || defaultAppNo.value,
            }
        } else {
            // 新增模式：重置表单数据
            resetForm()
        }
    }
}, { immediate: true, deep: true })
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
    appNo: [{ required: true, message: '请选择应用', trigger: 'blur' }],
    channel: [{ required: true, message: '请选择渠道', trigger: 'blur' }]
})

const resetForm = () => {
    formData.value = {
        id: '',
        channel: '',
        appNo: defaultAppNo.value,
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
                    appNo: formData.value.appNo,
                    channelId: formData.value.channel,
                }

            } else if (props.type === 'update') {
                data = {
                    timestamp: Date.now(),
                    type: 'update',
                    appNo: formData.value.appNo,
                    channelId: formData.value.channel,
                    id: formData.value.id,
                }
            }
            console.log('data', data);
            saveData(data)


        } else {
            console.log('表单验证失败');
            return false;
        }
    });
}

// 新增or编辑保存数据
const saveData = (data: any) => {
    console.log('保存数据', data);
    const paramStr = desEncrypt(JSON.stringify(data))
    service.post('/advChannelTaskConfig/save', {
        enData: paramStr
    }).then((res: any) => {
        console.log('res', res);
        if (res.data.code === 200) {
            emit('update:showEditor', false)
            emit('refresh')
            ElMessage.success('保存成功')
            resetForm()
        }
    })
}

</script>

<style lang="scss" scoped></style>