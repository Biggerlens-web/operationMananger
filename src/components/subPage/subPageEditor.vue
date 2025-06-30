<template>
    <el-dialog :model-value="showEditor" title="编辑订阅页配置" width="500" :before-close="handleClose">
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
                <el-select v-model="formData.channel" :multiple="!formData.id">
                    <el-option v-for="item in channelList" :key="item.id" :label="item.channelName" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="会员服务域名" prop="baseRoot">
                <el-input v-model="formData.baseRoot" />
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
    const props = defineProps<{
        showEditor: boolean
        subInfo: any
    }>()

    watch(() => props.showEditor, (newV) => {
        if (newV && props.subInfo) {
            formData.value.id = props.subInfo.id
            formData.value.channel = props.subInfo.channel
            formData.value.baseRoot = props.subInfo.baseRoot
        }
    })

    const counterStore = useCounterStore()
    const { appList, channelList, defaultAppNo } = storeToRefs(counterStore)
    const emit = defineEmits<{
        'update:showEditor': [value: boolean]
    }>()
    const formData = ref<any>({
        id: '',

        baseRoot: '',
        channel: '',
        channels: [],
        appNo: defaultAppNo.value
    })


    const ruleFormRef = ref<any>(null)
    const rules = ref({

    })

    //监听应用变化
    watch(() => defaultAppNo.value, () => {
        formData.value.appNo = defaultAppNo.value
    })
    const resetForm = () => {
        formData.value = {
            id: '',

            baseRoot: '',
            channels: [],
            channel: '',
            appNo: defaultAppNo.value
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
                ...formData.value,
                type: formData.value.id ? 'update' : 'add'

            }

            if (formData.value.id) {
                console.log('props.subInfo', props.subInfo);
                params.backBtnVisible = String(props.subInfo.backBtnVisible)
                params.loginBeforeMemPage = String(props.subInfo.loginBeforeMemPage)
                params.autoOpen = String(props.subInfo.autoOpen)
            } else {
                params.channels = formData.value.channel
                params.channel = ''
            }
            console.log('新增参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/subPageConfig/save', {
                enData
            })

            console.log('保存', res);
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

                saveChange()
            }
        })
    }
</script>

<style lang="scss" scoped></style>