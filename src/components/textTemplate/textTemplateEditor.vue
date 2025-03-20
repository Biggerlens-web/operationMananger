<template>
    <el-dialog :model-value="showEditor" title="编辑文字模板" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="所属应用" prop="appNo">
                <el-select v-model="formData.appNo">
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
                </el-select>
            </el-form-item>



            <el-form-item label="地区" prop="area">
                <el-input v-model="formData.area" />
            </el-form-item>
            <el-form-item label="类型" prop="line">
                <el-input v-model="formData.line" />
            </el-form-item>
            <el-form-item label="版本" prop="line">
                <el-input v-model="formData.line" />
            </el-form-item>
            <el-form-item label="颜色" prop="line">
                <el-input v-model="formData.line" />
            </el-form-item>
            <el-form-item label="颜色透明度" prop="line">
                <el-input v-model="formData.line" />
            </el-form-item>
            <el-form-item label="阴影半径" prop="line">
                <el-input v-model="formData.line" />
            </el-form-item>
            <el-form-item label="阴影透明度" prop="line">
                <el-input v-model="formData.line" />
            </el-form-item>
            <el-form-item label="阴影颜色" prop="line">
                <el-input v-model="formData.line" />
            </el-form-item>
            <el-form-item label="阴影角度" prop="line">
                <el-input v-model="formData.line" />
            </el-form-item>
            <el-form-item label="阴影水平偏移量" prop="line">
                <el-input v-model="formData.line" />
            </el-form-item>
            <el-form-item label="边框宽" prop="line">
                <el-input v-model="formData.line" />
            </el-form-item>
            <el-form-item label="边框颜色" prop="line">
                <el-input v-model="formData.line" />
            </el-form-item>
            <el-form-item label="边框透明度" prop="line">
                <el-input v-model="formData.line" />
            </el-form-item>
            <el-form-item label="背景颜色" prop="line">
                <el-input v-model="formData.line" />
            </el-form-item>
            <el-form-item label="背景透明度" prop="line">
                <el-input v-model="formData.line" />
            </el-form-item>
            <el-form-item label="背景半径" prop="line">
                <el-input v-model="formData.line" />
            </el-form-item>
            <el-form-item label="字间距" prop="line">
                <el-input v-model="formData.line" />
            </el-form-item>
            <el-form-item label="行间距" prop="line">
                <el-input v-model="formData.line" />
            </el-form-item>
            <el-form-item label="气泡索引" prop="line">
                <el-input v-model="formData.line" />
            </el-form-item>
            <el-form-item label="对齐" prop="line">
                <el-input v-model="formData.line" />
            </el-form-item>
            <el-form-item label="字体" prop="line">
                <el-input v-model="formData.line" />
            </el-form-item>
            <el-form-item label="是否垂直显示" prop="line">
                <el-switch v-model="formData.line" />
            </el-form-item>
            <el-form-item label="是否使用画笔颜色" prop="line">
                <el-switch v-model="formData.line" />
            </el-form-item>
            <el-form-item label="是否显示删除线" prop="line">
                <el-switch v-model="formData.line" />
            </el-form-item>
            <el-form-item label="是否变化字形" prop="line">
                <el-switch v-model="formData.line" />
            </el-form-item>
            <el-form-item label="是否显示下划线" prop="line">
                <el-switch v-model="formData.line" />
            </el-form-item>
            <el-form-item label="是否使用新的颜色格式" prop="line">
                <el-switch v-model="formData.line" />
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
        os: '',
        name: '',
        fields: '',
        probability: '',
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
            os: '',
            name: '',
            fields: '',
            probability: '',
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