<template>
    <el-dialog :model-value="showEditor" title="编辑好评弹窗配置" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="所属应用" prop="appNo">
                <el-select v-model="formData.appNo" placeholder="请选择应用">
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
                </el-select>
            </el-form-item>
            <el-form-item label="系统" prop="os">
                <el-select v-model="formData.os" placeholder="请选择系统">
                    <el-option v-for="item in OSlist" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="功能打开次数" prop="functionStartNum">
                <el-input type="number" v-model="formData.functionStartNum" min="0" />
            </el-form-item>
            <el-form-item label="计时打开(s)" prop="timeOn">
                <el-input type="number" v-model="formData.timeOn" min="0" />
            </el-form-item>
            <el-form-item label="弹窗名" prop="name">
                <el-input v-model="formData.name" />
            </el-form-item>
            <el-form-item label="弹窗访问字段" prop="field">
                <el-input v-model="formData.field" />
            </el-form-item>
            <el-form-item label="可选概率" prop="probabilitys">
                <el-select v-model="formData.probabilitys" multiple placeholder="可选概率">
                    <el-option v-for="item in probabilitys" :key="item" :label="item" :value="item" />
                </el-select>

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
        goodInfo: any
        defaultApp: any
    }>()
    watch(() => props.showEditor, (newV) => {
        if (newV && props.goodInfo) {
            console.log('props.goodInfo', props.goodInfo);
            formData.value.appNo = props.goodInfo.appNo
            formData.value.id = props.goodInfo.id
            formData.value.probabilitys = typeof props.goodInfo.probabilitys === 'string' ? JSON.parse(props.goodInfo.probabilitys) : props.goodInfo.probabilitys
            formData.value.functionStartNum = Number(formData.value.functionStartNum)
            formData.value.timeOn = Number(formData.value.timeOn)
            formData.value.os = props.goodInfo.os
            formData.value.name = props.goodInfo.name
            formData.value.field = props.goodInfo.field
            console.log('form', formData.value);
        }
        if (newV && props.defaultApp) {
            formData.value.appNo = props.defaultApp
        }
        console.log('formData.value', formData.value);
    })
    const counterStore = useCounterStore()
    const { appList, OSlist, channelList, showLoading } = storeToRefs(counterStore)
    const emit = defineEmits<{
        'update:showEditor': [value: boolean]
    }>()
    const formData = ref<any>({
        id: '',
        os: '',
        name: '',
        field: '',
        probabilitys: [],
        functionStartNum: 2,
        timeOn: 50,
        appNo: ''
    })
    const probabilitys = ref<any>([
        '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'
    ])

    const ruleFormRef = ref<any>(null)
    const rules = ref({

    })

    const resetForm = () => {
        formData.value = {
            id: '',
            os: '',
            name: '',
            field: '',
            probabilitys: [],
            functionStartNum: 2,
            timeOn: 50,
            appNo: ''
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
            params.probabilitys = params.probabilitys.join(',')
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/goodReputationGui/save', {
                enData
            })
            console.log('参数', params);
            console.log('保存', res);
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