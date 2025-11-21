<template>
    <el-dialog v-model="dialogVisible" title="密钥编辑" width="600px">

        <el-form :model="formData" ref="formRef" label-width="auto" :rules="rules" label-position="left">
            <el-form-item label="appId" prop="appId">
                <el-select v-model="formData.appId" placeholder="请选择需要分配的应用" :multiple="isBatchAdd">
                    <el-option v-for="app in appListInCom" :key="app.appNo"
                        :label="`${app.appAbbreviation}  [appName:${app.appName}] [appNo:${app.appNo}]`"
                        :value="app.appNo" />

                </el-select>
            </el-form-item>
            <el-form-item label="appKey" prop="appKey">
                <el-input v-model="formData.appKey" />
            </el-form-item>
            <el-form-item label="appSecret" prop="appSecret">
                <el-input v-model="formData.appSecret" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="submitForm">确定</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
        </template>

    </el-dialog>
</template>

<script lang="ts" setup>

    import { useCounterStore } from '@/stores/counter'
    import { storeToRefs } from 'pinia'
    import { onMounted, reactive, ref } from 'vue'
    const homeCounter = useCounterStore()
    const { showLoading, appListInCom } = storeToRefs(homeCounter)
    const dialogVisible = defineModel('visible', {
        type: Boolean,
        default: false
    })


    interface Prop {
        isBatchAdd: boolean
    }
    const props = defineProps<Prop>()
    const formData = reactive({
        appId: '',
        appKey: '',
        appSecret: ''
    })


    const rules = reactive({
        appId: [{ required: true, message: '请选择需要分配的应用', trigger: 'blur' }],
        appKey: [{ required: true, message: '请输入appKey', trigger: 'blur' }],
        appSecret: [{ required: true, message: '请输入appSecret', trigger: 'blur' }],
    })
    const formRef = ref()

    const submitForm = () => {
        if (!formRef.value) return
        formRef.value.validate((valid: any) => {
            if (valid) {
                console.log('formData', formData);
            } else {
                console.log('校验失败');
            }
        })
    }
    onMounted(() => {
        console.log('应用列表', appListInCom.value);
    })
</script>

<style lang="scss" scoped></style>