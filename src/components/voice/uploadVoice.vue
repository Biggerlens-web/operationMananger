<template>
    <el-dialog v-model="dialogVisible" title="上传语音" width="500px">
        <el-form label-width="100px">
            <el-form-item label="所属应用" prop="appNo">
                <el-select filterable v-model="formData.appNo" placeholder="请选择应用">
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
                </el-select>

            </el-form-item>
            <el-form-item label="所属分类" prop="voiceCate">
                <el-select v-model="formData.voiceCate" placeholder="请选择分类">
                    <el-option v-for="item in typeList" :key="item.cid" :label="item.title" :value="item.cid" />
                </el-select>
            </el-form-item>
            <el-form-item label="系统" prop="os">
                <el-select v-model="formData.os" placeholder="请选择系统">
                    <el-option v-for="item in OSlist" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="语音包名称" prop="title">
                <el-input v-model="formData.title" placeholder="请输入语音包名称" />
            </el-form-item>
            <el-form-item label="语音包" prop="file">
                <el-upload v-model:file-list="formData.file" action="#" :auto-upload="false" :limit="1">
                    <el-button slot="trigger" type="primary">点击上传</el-button>
                </el-upload>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="handleConfirm">确定</el-button>
            <el-button type="danger" @click="handleCancel">取消</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>

    import service from '@/axios'
    import { useCounterStore } from '@/stores/counter'
    import { ElMessage } from 'element-plus'
    import { storeToRefs } from 'pinia'
    import { ref } from 'vue'
    const stores = useCounterStore()
    const { showLoading, appList, OSlist } = storeToRefs(stores)
    const dialogVisible = defineModel('dialogVisible', {
        type: Boolean,
        default: false
    })
    const props = defineProps<{
        typeList: any
    }>()
    const formData = ref<any>({
        appNo: '',
        os: '',
        voiceCate: '',
        title: '',
        voices: []
    })

    const resetForm = () => {
        formData.value = {
            appNo: '',
            os: '',
            voiceCate: '',
            title: '',
            voices: []
        }
    }
    const handleConfirm = async () => {
        try {
            showLoading.value = true

            const form = new FormData()
            form.append('appNo', formData.value.appNo)
            form.append('os', formData.value.os)
            form.append('voiceCate', formData.value.voiceCate)
            form.append('title', formData.value.title)
            form.append('voices', formData.value.file[0].raw)

            const res = await service.post('/voice/importVoices', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (res.data.code === 200) {
                ElMessage.success('上传成功')
                handleCancel()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('上传失败', err);
        } finally {
            showLoading.value = false
        }
    }
    const handleCancel = () => {

        dialogVisible.value = false
        resetForm()
    }
</script>

<style lang="scss" scoped></style>