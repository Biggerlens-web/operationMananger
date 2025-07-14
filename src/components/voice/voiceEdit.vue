<template>
    <el-dialog v-model="dialogVisible" width="500px" title="编辑语音包" :before-close="handleClose">
        <el-form :model="formData" ref="formRef" label-position="right" label-width="100px">
            <el-form-item label="语音包名称">
                <el-input v-model="formData.title" placeholder="请输入语音包名称" />
            </el-form-item>
            <el-form-item label="渠道">
                <el-select v-model="formData.os" placeholder="请选择">
                    <el-option v-for="item in OSlist" :key="item.value" :label="item.note" :value="item.value" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="submitForm">确定</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    import service from '@/axios';
    import { useCounterStore } from '@/stores/counter';
    import { desEncrypt } from '@/utils/des';
    import { ElMessage } from 'element-plus';
    import { storeToRefs } from 'pinia';
    import { reactive, watch } from 'vue';
    const stores = useCounterStore()
    const { OSlist, showLoading, defaultAppNo } = storeToRefs(stores)
    const dialogVisible = defineModel('dialogVisible', {
        type: Boolean,
        default: false
    })
    const props = defineProps<{
        editData: any
    }>()

    watch(() => dialogVisible.value, (newV) => {
        if (newV && props.editData) {
            Object.assign(formData, props.editData)
        }
    })
    const formData = reactive({
        title: '', os: '', id: ''

    })


    const resetFormData = () => {
        Object.assign(formData, {
            title: '',
            os: '',
            id: ''
        })
    }
    const handleClose = () => {
        resetFormData()
        dialogVisible.value = false

    }
    const submitForm = async () => {
        showLoading.value = true
        try {
            let url: string = ''
            const params = {
                timestamp: Date.now(),
                title: formData.title,
                os: formData.os,
                id: formData.id,
                type: formData.id ? 'update' : 'add',
                appNo: defaultAppNo.value
            }
            if (formData.id) {
                url = '/voice/save'
            } else {
                url = '/voice/cateAdd'
            }
            console.log('保存参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post(url, {
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
        } finally {
            showLoading.value = false
        }
    }
</script>

<style lang="scss" scoped></style>