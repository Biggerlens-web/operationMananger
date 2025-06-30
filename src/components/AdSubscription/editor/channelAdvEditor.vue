<template>
    <el-dialog :model-value="showEditor" title="渠道广告" width="700" :before-close="handleClose">
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
                <el-select v-model="formData.channel" placeholder="请选择渠道">
                    <el-option v-for="item in channelList" :key="item.id" :label="item.channelName" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="版本" prop="version">
                <el-input v-model="formData.version" placeholder="版本号（整数或浮点数，通过开发人员获取），可留空，留空默认为default" />
            </el-form-item>
            <el-form-item label="添加广告" prop="advArray">
                <div class="adv-checkbox-container">
                    <el-checkbox-group v-model="formData.advArray">
                        <el-checkbox v-for="item in advertList" :key="item.id" :label="item.id"
                            class="adv-checkbox-item">
                            {{ item.typeName }}
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
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
import { onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus';
const props = defineProps<{
    showEditor: boolean,
    type: string,
    rowList: any,
}>()

const counterStore = useCounterStore()
const { appList, defaultAppNo, channelList, advertList } = storeToRefs(counterStore)
const emit = defineEmits<{
    'update:showEditor': [value: boolean],
    'refresh': []
}>()
const formData = ref<any>({
    id: '',
    channel: '',
    version: '',
    appNo: defaultAppNo.value,
    adv: '',
    advArray: []
})

// 监听advArray变化，更新adv字段（用于提交）
watch(() => formData.value.advArray, (newVal) => {
    // 将选中的广告ID数组转换为逗号分隔的字符串
    formData.value.adv = newVal.join(',');
}, { deep: true })

// 监听编辑器显示状态和类型，处理数据初始化
watch(() => [props.showEditor, props.type, props.rowList], ([showEditor, type, rowList]) => {
    if (showEditor) {
        if (type === 'update' && rowList) {
            // 编辑模式：将传入的数据赋值给formData
            const advArray = (() => {
                if (!rowList.optionals) return [];

                // 统一转换为数组处理
                const optionalsArray = Array.isArray(rowList.optionals)
                    ? rowList.optionals
                    : [rowList.optionals];

                return optionalsArray
                    .map((item: { advType: { id: any; }; }) => item.advType?.id)
                    .filter((id: undefined) => id !== undefined);
            })();
            formData.value = {
                id: rowList.id || '',
                channel: rowList.channels.id || '',
                version: rowList.version || '',
                appNo: rowList.appNo || defaultAppNo.value,
                adv: advArray.join(','),
                advArray: advArray
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
    appNo: [{ required: true, message: '请选择所属应用', trigger: ['change', 'blur', 'submit'] }],
    channel: [{ required: true, message: '请选择渠道', trigger: ['change', 'blur', 'submit'] }],
    version: [{ pattern: /^(default|\d+(\.\d+)?)$/, message: '版本号格式不正确（需为整数、浮点数或"default"）', trigger: ['blur', 'submit'] }]
})
const resetForm = () => {
    formData.value = {
        id: '',
        channel: '',
        version: '',
        appNo: defaultAppNo.value,
        adv: '',
        advArray: []
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
                    version: formData.value.version,
                    optionals: formData.value.adv // 这里使用转换后的逗号分隔字符串
                }
            } else if (props.type === 'update') {
                data = {
                    timestamp: Date.now(),
                    type: 'update',
                    id: formData.value.id,
                    appNo: formData.value.appNo,
                    channelId: formData.value.channel,
                    version: formData.value.version,
                    optionals: formData.value.adv // 这里使用转换后的逗号分隔字符串
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
    service.post('/advChannelConfig/save', {
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

onMounted(() => {
})
</script>

<style lang="scss" scoped></style>