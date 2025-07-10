<template>
    <el-dialog v-model="dialogVisible" title="上传语音条" width="500">
        <el-form :model="formData" ref="formRef" label-position="top">
            <el-form-item label="语音条通用名称" prop="title">
                <el-input v-model="formData.title" placeholder="请输入语音名称"></el-input>
            </el-form-item>
            <el-form-item label="语音条" prop="file">
                <div style="width: 100%;">
                    <el-upload action="#" :before-upload="beforeUpload" :limit="1">
                        <el-button type="primary">上传语音条</el-button>
                    </el-upload>
                    <div v-if="audioUrl">
                        <audio :src="audioUrl" controls style="width: 100%; margin-top: 10px;"></audio>
                        <div class="audio-controls">
                            <el-button type="danger" @click="removeAudioFile" size="small" style="margin-top: 8px;">
                                <el-icon>
                                    <Delete />
                                </el-icon>
                                删除音频
                            </el-button>

                        </div>
                    </div>
                </div>


            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="submitForm">确定</el-button>
            <el-button type="primary" @click="dialogVisible = false">取消</el-button>
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
    const { showLoading } = storeToRefs(stores)
    const dialogVisible = defineModel('dialogVisible', {
        type: Boolean,
        default: false
    })
    const props = defineProps<{
        voiceType: any
    }>()

    const formData = ref<any>(
        {
            title: '',
            file: []
        }
    )

    const submitForm = async () => {
        showLoading.value = true
        try {
            const form = new FormData()
            console.log('formData.value', formData.value);
            form.append('voices', formData.value.file[0])
            form.append('title', formData.value.title)
            form.append('voiceCate', props.voiceType.aid)

            const res = await service.post('/voice/importVoice', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (res.data.code === 200) {
                ElMessage.success('上传成功')
                dialogVisible.value = false
            } else {
                ElMessage.error(res.data.msg)

            }
        } catch (err) {
            console.log('上传失败', err);
        } finally {
            showLoading.value = false
        }
    }

    const audioUrl = ref<string>()
    const beforeUpload = (file: File) => {
        console.log('file', file);
        formData.value.file.push(file)
        audioUrl.value = URL.createObjectURL(file)
        console.log('audioUrl', audioUrl.value);
        return false
    }
    const removeAudioFile = () => {
        formData.value.file = []
        audioUrl.value = ''
    }
</script>

<style lang="scss" scoped></style>