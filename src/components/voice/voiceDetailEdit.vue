<template>
    <el-dialog v-model="dialogVisible" title="语音详情编辑" width="600px" :before-close="handleClose">
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" label-position="left">
            <el-form-item label="编号" prop="id">
                <el-input v-model="formData.id" placeholder="请输入编号" :disabled="true" />
            </el-form-item>

            <el-form-item label="语音条名称" prop="title">
                <el-input v-model="formData.title" placeholder="语言文本" />
            </el-form-item>

            <el-form-item label="语音" prop="file">
                <div class="audio-upload-container">
                    <el-upload v-if="!formData.id" class="upload-demo" action="#" :before-upload="beforeUpload"
                        :on-error="handleUploadError" accept=".mp3,.wav,.m4a">
                        <el-button :disabled="formData.id" type="primary">选择文件</el-button>
                        <template #tip>
                            <div class="el-upload__tip">支持上传音频文件</div>
                        </template>
                    </el-upload>

                    <div v-if="formData.file" class="audio-player">
                        <audio controls :src="formData.file" style="width: 100%; margin-top: 10px;">
                            您的浏览器不支持音频播放
                        </audio>
                        <div class="audio-controls" v-if="!formData.id">
                            <el-button type="danger" size="small" @click="removeAudioFile" style="margin-top: 8px;">
                                <el-icon>
                                    <Delete />
                                </el-icon>
                                删除音频
                            </el-button>
                        </div>
                    </div>
                </div>
            </el-form-item>

            <el-form-item label="播放总量" prop="playCount">
                <el-input v-model.number="formData.playCount" type="number" placeholder="请输入播放总量" min="0" />
            </el-form-item>

            <el-form-item label="收藏总量" prop="likeCount">
                <el-input v-model.number="formData.likeCount" type="number" placeholder="请输入收藏总量" min="0" />
            </el-form-item>

            <el-form-item label="分享总量" prop="shareCount">
                <el-input v-model.number="formData.shareCount" type="number" placeholder="请输入分享总量" min="0" />
            </el-form-item>

            <el-form-item label="点击总量" prop="clickCount">
                <el-input v-model.number="formData.clickCount" type="number" placeholder="请输入点击总量" min="0" />
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleCancel">返回</el-button>
                <el-button type="primary" @click="handleSubmit">提交</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    import { ref, reactive, watch, onUnmounted } from 'vue'
    import type { FormInstance, FormRules, UploadProps } from 'element-plus'
    import { ElMessage } from 'element-plus'
    import { Delete } from '@element-plus/icons-vue'
    import service from '@/axios'
    import { useCounterStore } from '@/stores/counter'
    import { storeToRefs } from 'pinia'
    import { desEncrypt } from '@/utils/des'
    const stores = useCounterStore()
    const { showLoading } = storeToRefs(stores)
    // Props
    interface Props {
        voiceData?: VoiceData
    }

    interface VoiceData {
        id: string
        title: string
        file: string
        playCount: number
        likeCount: number
        shareCount: number
        clickCount: number
    }

    const props = withDefaults(defineProps<Props>(), {


    })


    // Refs
    const formRef = ref<FormInstance>()
    const dialogVisible = defineModel('dialogVisible', {
        type: Boolean,
        default: false
    })


    watch(() => dialogVisible.value, (newV) => {
        if (newV && props.voiceData) {
            Object.assign(formData, props.voiceData)
        }
    })

    const fileList = ref([])


    // Form data
    const formData = reactive<VoiceData>({
        id: '',
        title: '',
        file: '',
        playCount: 0,
        likeCount: 0,
        shareCount: 0,
        clickCount: 0
    })

    // Form rules
    const rules: FormRules = {

    }





    // Methods
    const handleClose = () => {
        dialogVisible.value = false
    }

    const handleCancel = () => {
        dialogVisible.value = false

    }

    const handleSubmit = async () => {
        if (!formRef.value) return
        if (showLoading.value) {
            ElMessage.warning('正在提交中，请稍后...')
            return
        }
        showLoading.value = true
        try {
            await formRef.value.validate()


            const params = {
                type: 'update',
                title: formData.title,
                classVoiceUrl: formData.file,
                playCount: formData.playCount,
                likeCount: formData.likeCount,
                shareCount: formData.shareCount,
                clickCount: formData.clickCount,
                id: formData.id,
                timestamp: Date.now()
            }
            const enData = desEncrypt(JSON.stringify(params))

            const res = await service.post('/voice/voiceSave', {
                enData
            })
            console.log('res', res);
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
                dialogVisible.value = false
            } else {
                ElMessage.error(res.data.msg)
            }


        } catch (error) {
            console.log('保存失败', error);
        } finally {
            showLoading.value = false
        }
    }

    // Upload methods
    const beforeUpload: UploadProps['beforeUpload'] = (file) => {
        // 检查文件类型
        const isAudio = file.type.startsWith('audio/')
        if (!isAudio) {
            ElMessage.error('只能上传音频文件!')
            return false
        }

        // 检查文件大小 (限制为10MB)
        const isLt10M = file.size / 1024 / 1024 < 10
        if (!isLt10M) {
            ElMessage.error('音频文件大小不能超过10MB!')
            return false
        }

        // 创建文件URL用于预览
        const audioUrl = URL.createObjectURL(file)
        formData.file = audioUrl

        ElMessage.success('音频文件选择成功')

        // 阻止自动上传，我们只是用于预览
        return false
    }



    const handleUploadError = () => {
        ElMessage.error('音频上传失败')
    }

    // 清理音频URL资源
    const cleanupAudioUrl = () => {
        if (formData.file && formData.file.startsWith('blob:')) {
            URL.revokeObjectURL(formData.file)
        }
    }

    // 删除音频文件
    const removeAudioFile = () => {
        // 清理当前音频URL资源
        cleanupAudioUrl()
        // 重置音频URL
        formData.file = ''
        // 清空文件列表
        fileList.value = []
        ElMessage.success('音频文件已删除')
    }

    // 组件卸载时清理资源
    onUnmounted(() => {
        cleanupAudioUrl()
    })

    // 监听对话框关闭，清理资源
    watch(dialogVisible, (newVal) => {
        if (!newVal) {
            cleanupAudioUrl()
        }
    })
</script>

<style lang="scss" scoped>
    .audio-upload-container {
        width: 100%;

        .upload-demo {
            width: 100%;
        }

        .audio-player {
            margin-top: 10px;

            .audio-controls {
                display: flex;
                justify-content: flex-end;

                .el-button {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
            }
        }
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
    }

    :deep(.el-form-item__label) {
        font-weight: 500;
    }

    :deep(.el-input__inner) {
        border-radius: 4px;
    }

    :deep(.el-upload__tip) {
        font-size: 12px;
        color: #909399;
        margin-top: 4px;
    }
</style>