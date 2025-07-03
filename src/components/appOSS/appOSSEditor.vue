<template>
    <el-dialog :model-value="showEditor" title="编辑配置连接" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="BUCKET域" prop="bucketId">
                <el-select v-model="formData.bucketId" placeholder="请选择BUCKET域">
                    <el-option v-for="item in bucketList" :key="item.id" :label="item.bucketName" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="文件夹" prop="folder">
                <el-input v-model="formData.folder" />
            </el-form-item>
            <el-form-item label="文件名" prop="name">
                <el-input v-model="formData.name" @input="handleNameInput" />
            </el-form-item>
            <el-form-item label="注释文件名" prop="noteName">
                <el-input v-model="formData.noteName" :disabled="true" />
            </el-form-item>

            <el-form-item label="所属应用" prop="appNo">
                <el-select v-model="formData.appNo" filterable placeholder="请选择应用">
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
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
    import { onMounted, ref, watch } from 'vue'
    const stores = useCounterStore()
    const { showLoading } = storeToRefs(stores)
    const props = defineProps<{
        showEditor: boolean
        configInfo: any
    }>()

    const bucketList = ref<any>([])
    const getBucketList = async () => {
        try {
            showLoading.value = true
            const params = {
                timestamp: Date.now(),
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.get('/oss/edit', {
                params: {
                    enData
                }

            })
            console.log('域列表', res);
            bucketList.value = res.data.data.buckets

        } catch (err) {
            console.log('获取域列表失败', err);
        } finally {
            showLoading.value = false
        }
    }



    onMounted(() => {
        getBucketList()
    })

    watch(() => props.showEditor, (newV) => {
        if (newV && props.configInfo) {
            formData.value.id = props.configInfo.id
            if (props.configInfo.bucket) {
                const bucket = bucketList.value.find((item: any) => item.bucketName === props.configInfo.bucket)
                formData.value.bucketId = bucket.id
            }
            formData.value.noteName = props.configInfo.noteName
            formData.value.name = props.configInfo.name
            formData.value.folder = props.configInfo.folder
            formData.value.appNo = props.configInfo.appNo

        }
    })
    const counterStore = useCounterStore()
    const { appList, defaultAppNo } = storeToRefs(counterStore)
    const emit = defineEmits<{
        'update:showEditor': [value: boolean]
    }>()
    const formData = ref<any>({
        id: '',
        bucketId: '',
        noteName: '',
        name: "",
        folder: '',
        appNo: defaultAppNo.value
    })


    const ruleFormRef = ref<any>(null)
    const rules = ref({

    })

    const resetForm = () => {
        formData.value = {
            id: '',
            bucketId: '',
            noteName: '',
            name: "",
            folder: '',
            appNo: defaultAppNo.value
        }
        ruleFormRef.value?.resetFields()
    }


    watch(() => defaultAppNo.value, (newValue) => {
        if (newValue) {
            formData.value.appNo = newValue
        }
    })

    //修改注释
    const handleNameInput = (val: string) => {
        const names = val.split('.')
        if (names.length > 1) {
            formData.value.noteName = names[0] + "-note." + names[1];
        } else {
            formData.value.noteName = names[0] + "-note";
        }
    }



    const handleClose = () => {
        resetForm()
        emit('update:showEditor', false)
    }


    const saveChange = async () => {
        try {
            showLoading.value = true
            const params = {
                timestamp: Date.now(),
                ...formData.value,
                type: formData.value.id ? 'update' : 'add'
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/oss/save', {
                enData
            })
            console.log('保存', res);
            if (res.data.code === 200) {
                ElMessage({
                    message: '保存成功',
                    type: 'success',
                })
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