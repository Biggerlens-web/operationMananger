<template>
    <el-dialog :model-value="showEditor" title="编辑付费弹窗配置" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="所属应用" prop="appNo">
                <el-select v-model="formData.appNo">
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
                </el-select>
            </el-form-item>
            <el-form-item label="系统" prop="os">
                <el-select v-model="formData.os">
                    <el-option v-for="item in OSlist" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="字段名" prop="feePointField">
                <el-input v-model="formData.feePointField" />
            </el-form-item>
            <el-form-item label="字段说明" prop="feePointName">
                <el-input v-model="formData.feePointName" />
            </el-form-item>
            <el-form-item label="在线配置文案" prop="configTextDefault">
                <el-input type="textarea" v-model="formData.configTextDefault"
                    placeholder='"*"代表输入框,通过英文状态下","隔开多条文本,例：每日*次,每月*次' />
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
    }>()

    const counterStore = useCounterStore()
    const { appList, OSlist, defaultAppNo } = storeToRefs(counterStore)
    const emit = defineEmits<{
        'update:showEditor': [value: boolean]
    }>()
    const formData = ref<any>({
        id: '',
        os: '',
        feePointField: '',
        feePointName: "",
        configTextDefault: '',
        appNo: defaultAppNo.value
    })
    //监听应用变化
    watch(() => defaultAppNo.value, () => {
        formData.value.appNo = defaultAppNo.value
    })

    const ruleFormRef = ref<any>(null)
    const rules = ref({

    })

    const resetForm = () => {
        formData.value = {
            id: '',
            os: '',
            feePointField: '',
            feePointName: "",
            configTextDefault: '',
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
                ...formData.value
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/feeConfig/save', {
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