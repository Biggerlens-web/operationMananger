<template>
    <el-dialog :model-value="dialogVisible" title="编辑描边" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="所属应用" prop="appNo">
                <el-select v-model="formData.appNo">
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
                </el-select>
            </el-form-item>
            <el-form-item label="上传区域" prop="region">
                <el-select v-model="formData.region">
                    <el-option v-for="item in regionList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>


            <el-form-item label="缩略图" prop="small">
                <el-upload v-model:file-list="formData.small" list-type="picture-card" action="#" multiple
                    :auto-upload="false">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="描边图" prop="big">
                <el-upload v-model:file-list="formData.big" list-type="picture-card" action="#" multiple
                    :auto-upload="false">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-upload>
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
    import type { FormInstance } from 'element-plus';
    import { storeToRefs } from 'pinia';
    import { ref, watch } from 'vue'
    const counterStore = useCounterStore()
    const { appList, regionList, defaultAppNo } = storeToRefs(counterStore)
    const props = defineProps<{
        dialogVisible: boolean
    }>()
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()

    const formData = ref<any>({
        id: '',
        appNo: defaultAppNo.value,
        region: '',
        big: [],
        bigName: '',
        small: [],
        smallName: '',




    })
    watch(() => defaultAppNo.value, () => {
        formData.value.appNo = defaultAppNo.value
    })
    const ruleFormRef = ref<FormInstance>()
    const rules = ref<any>({
        bucket: [{ required: true, message: '请输入域', trigger: 'blur' }],
        path: [{ required: true, message: '请选择路径', trigger: 'change' }],
        img: [{ required: true, message: '请上传图片', trigger: 'blur' }],
        bannerName: [{ required: true, message: '请输入轮播图名称', trigger: 'blur' }]

    })

    const resetForm = () => {
        formData.value = {
            id: '',
            appNo: "",
            signName: '',
            keyFile: [],
            keypassword: "",
            otherName: '',
            otherNamePassword: '',
            packName: ''

        }
        ruleFormRef.value?.resetFields()
    }
    const handleClose = () => {
        resetForm()
        emit('update:dialogVisible', false)
    }
    const handleComfirm = (ruleFormRef: any) => {
        ruleFormRef.validate((valid: any) => {
            if (valid) {
                console.log('submit!');
                handleClose()
            }
        })
    }
</script>

<style lang="scss" scoped></style>