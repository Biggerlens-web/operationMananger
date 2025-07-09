<template>
    <el-dialog :model-value="dialogVisible" title="编辑轮播图路径" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>


            <el-form-item label="域(bucket)" prop="bucketId">
                <el-select v-model="formData.bucketId" placeholder="请选择域">
                    <el-option v-for="item in bucketList" :key="item.bucketName" :label="item.bucketName"
                        :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="路径" prop="folder">
                <el-input v-model="formData.folder" />
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
    import { ElMessage, type FormInstance } from 'element-plus';
    import { storeToRefs } from 'pinia';
    import { onMounted, ref, watch } from 'vue'
    const stores = useCounterStore()
    const { showLoading } = storeToRefs(stores)
    const props = defineProps<{
        dialogVisible: boolean
        bannerPathInfo: any
    }>()
    watch(() => props.dialogVisible, (newV) => {
        if (newV && props.bannerPathInfo) {
            formData.value.id = props.bannerPathInfo.id
            formData.value.bucketId = props.bannerPathInfo.parentObj.id
            formData.value.folder = props.bannerPathInfo.folder
            formData.value.remark = props.bannerPathInfo.remark
        }
    })
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()



    //获取域列表
    const bucketList = ref<any>()
    const getBucketList = async () => {
        try {
            showLoading.value = true
            const params = {
                timestamp: Date.now(),
                pageNum: 1,
                pageSize: 999999,
                endpoint: '',
                bucketName: ''
            }

            console.log('参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.get('/base/bucket/list', {
                params: {
                    enData
                }
            })

            bucketList.value = res.data.rows
            console.log('bucketList.value', bucketList.value);

        } catch (err) {

        } finally {
            showLoading.value = false
        }
    }


    onMounted(() => {
        getBucketList()
    })
    const formData = ref<any>({
        id: '',
        bucketId: '',
        folder: '',
        remark: ''


    })
    const ruleFormRef = ref<FormInstance>()
    const rules = ref<any>({
        bucketId: [{ required: true, message: '请输入域', trigger: 'blur' }],
        folder: [{ required: true, message: '请输入路径', trigger: 'blur' }],

    })

    const resetForm = () => {
        formData.value = {
            id: '',
            bucketName: '',
            folder: '',
            remark: ''

        }
        ruleFormRef.value?.resetFields()
    }
    const handleClose = () => {
        resetForm()
        emit('update:dialogVisible', false)
    }



    const saveChange = async () => {
        try {
            showLoading.value = true
            const params = {
                timestamp: Date.now(),
                ...formData.value,
                type: formData.value.id ? "update" : 'add'
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/base/bannerImgFolder/save', {
                enData
            })

            console.log('保存轮播路径', res);
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
                handleClose()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {

        } finally {
            showLoading.value = false
        }
    }
    const handleComfirm = (ruleFormRef: any) => {
        ruleFormRef.validate((valid: any) => {
            if (valid) {
                console.log('submit!');
                saveChange()
            }
        })
    }
</script>

<style lang="scss" scoped></style>