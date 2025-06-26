<template>
    <el-dialog :model-value="dialogVisible" title="编辑轮播点" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>



            <el-form-item label="应用" prop="appNp">
                <el-select v-model="formData.appNo">
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
                </el-select>
            </el-form-item>
            <el-form-item label="轮播图名称" prop="bannerName">
                <el-input v-model="formData.bannerName" />
            </el-form-item>

            <el-form-item label="轮播图编码" prop="bannerCode">
                <el-input v-model="formData.bannerCode" />
            </el-form-item>

            <el-form-item label="系统" prop="os">
                <el-select filterable v-model="formData.os" placeholder="请选择系统" class="filter-select">
                    <el-option v-for="item in OSlist" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="语言" prop="language">
                <el-select v-model="formData.language">
                    <el-option v-for="langOption in international" :key="langOption.value" :label="langOption.language"
                        :value="langOption.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="渠道" prop="channelId">
                <el-select v-model="formData.channelId">
                    <el-option v-for="item in channelList" :key="item.id" :label="item.channelName" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="说明" prop="remark">
                <el-input type="textarea" v-model="formData.remark" />
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
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { storeToRefs } from 'pinia';
    import { ref, watch } from 'vue'
    const stores = useCounterStore()
    const { appList, OSlist, international, channelList } = storeToRefs(stores)
    const props = defineProps<{
        dialogVisible: boolean
        bannerPointInfo: any
    }>()

    watch(() => props.dialogVisible, (newV) => {
        if (newV && props.bannerPointInfo) {

            formData.value.id = props.bannerPointInfo.id
            formData.value.os = props.bannerPointInfo.os
            formData.value.channelId = props.bannerPointInfo.channels?.id
            formData.value.bannerName = props.bannerPointInfo.bannerName
            formData.value.bannerCode = props.bannerPointInfo.bannerCode
            formData.value.remark = props.bannerPointInfo.remark
            formData.value.appNo = props.bannerPointInfo.parentObj.appNo
            formData.value.language = props.bannerPointInfo.languageVo.languageName
        }
    })
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()


    const ruleFormRef = ref<any>(null)
    const formData = ref<any>({
        id: '',
        "os": "",
        "appNo": "",
        "language": "",
        "channelId": "",
        "bannerName": "",
        "bannerCode": "",
        "remark": ""
    })
    const resetForm = () => {
        formData.value = {
            id: '',
            "os": "",
            "appNo": "",
            "language": "",
            "channelId": "",
            "bannerName": "",
            "bannerCode": "",
            "remark": ""
        }
    }
    const handleClose = () => {
        resetForm()
        emit('update:dialogVisible', false)
    }

    const saveChange = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                ...formData.value,
                type: formData.value.id ? 'update' : 'add'
            }

            console.log('参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/base/banner/save', {
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




    const handleComfirm = (form: any) => {
        if (form) {
            form.validate().then(() => {
                console.log('校验通过')
                saveChange()
            }).catch(() => {
                console.log('校验失败')
            })
        }
    }




    const rules = ref({})
</script>

<style lang="scss" scoped></style>