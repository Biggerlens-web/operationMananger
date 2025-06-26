<template>
    <el-dialog :model-value="dialogVisible" title="编辑用户标签" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="所属应用" prop="appNo">
                <el-select v-model="formData.appNo">
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
                </el-select>
            </el-form-item>
            <el-form-item label="所属标签" prop="signName">
                <el-input v-model="formData.signName" />
            </el-form-item>
            <ul class="labelsList">
                <li class="label">
                    <p>
                        标签名称
                    </p>
                </li>
                <li v-for="(item, inex) in labelsList" :key="item.la" class="inputItem">
                    <el-input placeholder="请输入标签名称" v-model="item.label"></el-input>
                    <el-input placeholder="请输入标签名称(EN)" v-model="item.label_en"></el-input>
                    <el-button type="danger" @click="removeLabelName(inex)">删除</el-button>
                </li>
                <li class="addbuton">
                    <el-button @click="addLabelName">
                        添加标签
                    </el-button>
                </li>
            </ul>
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
    import { ref } from 'vue'
    const counterStore = useCounterStore()
    const { appList, OSlist, channelList } = storeToRefs(counterStore)
    const props = defineProps<{
        dialogVisible: boolean
    }>()
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()

    const formData = ref<any>({
        id: '',
        appNo: "",
        signName: '',
        keyFile: [],
        keypassword: "",
        otherName: '',
        otherNamePassword: '',
        packName: ''



    })

    const labelsList = ref<any>([
        {
            label: '',
            label_en: '',
        },
    ])
    //添加标签名
    const addLabelName = () => {
        labelsList.value.push({
            label: '',
            label_en: '',
        })
    }
    //删除标签名
    const removeLabelName = (index: number) => {
        labelsList.value.splice(index, 1)
    }
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

<style lang="scss" scoped>

    .labelsList {
        .label {
            margin-bottom: 10px;
        }

        .inputItem {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
        }


    }
</style>