<template>
    <el-dialog :model-value="dialogVisible" width="500" title="编辑教程" :before-close="handleClose">
        <el-form :model="formData" label-position="top">
            <el-form-item label="所属应用">
                <el-select v-model="formData.appNo">
                    <el-option v-for="app in appList" :key="app.appNo" :label="app.appName"
                        :value="app.appNo"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属系统">
                <el-select v-model="formData.os">
                    <el-option v-for="os in OSlist" :key="os.value" :label="os.note" :value="os.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="地区">
                <el-select v-model="formData.region">
                    <el-option v-for="region in regionList" :key="region.value" :label="region.label"
                        :value="region.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="视频类型">
                <el-select v-model="formData.videoDuration">
                    <el-option v-for="region in regionList" :key="region.value" :label="region.label"
                        :value="region.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="设备类型">
                <el-select v-model="formData.videoDuration">
                    <el-option v-for="region in regionList" :key="region.value" :label="region.label"
                        :value="region.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分类类型">
                <el-select v-model="formData.videoDuration">
                    <el-option v-for="region in regionList" :key="region.value" :label="region.label"
                        :value="region.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="名称">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="版本">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="封面图">
                <el-upload class="upload-area" action="#" :auto-upload="false">
                    <template #default>
                        <div class="upload-placeholder">
                            <el-icon class="el-icon--upload">
                                <el-icon-upload />
                            </el-icon>
                            <div>将文件拖到此处，或<el>点击上传</el>
                            </div>
                        </div>
                    </template>
                </el-upload>
            </el-form-item>
        </el-form>

        <!-- 底部按钮 -->
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleSubmit">返回</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    import { useCounterStore } from '@/stores/counter'
    import { storeToRefs } from 'pinia'
    import { ref, reactive } from 'vue'
    const stores = useCounterStore()
    const { appList, OSlist, regionList } = storeToRefs(stores)


    const dialogVisible = defineModel('dialogVisible', {
        type: Boolean,
        default: false
    })

    // 表单数据
    const formData = ref<any>({
        name: '',
        tutorialType: '',
        appNo: '',
        os: '',
        region: '',
        video: '',
        videoUrlDy: '',
        videoDuration: '',
        level: 1
    })







    // 关闭对话框
    const handleClose = () => {
        dialogVisible.value = false
    }

    // 提交表单
    const handleSubmit = () => {
        console.log('表单数据:', formData)
        // 这里可以添加提交逻辑
        handleClose()
    }
</script>

<style lang="scss" scoped>
    .upload-area {
        border: 2px dashed #dcdfe6;
        border-radius: 6px;
        padding: 20px;
        text-align: center;
        background-color: #fafafa;
        transition: border-color 0.3s;

        &:hover {
            border-color: #409eff;
        }

        .upload-placeholder {
            color: #909399;

            .el-icon {
                font-size: 28px;
                margin-bottom: 10px;
            }
        }

        .video-preview,
        .image-preview {
            display: flex;
            flex-direction: column;
            align-items: center;

            .video-info,
            .image-info {
                margin-top: 10px;
                font-size: 12px;
                color: #606266;
                max-width: 200px;
                word-break: break-all;
            }
        }
    }

    .dialog-footer {
        text-align: right;

        .el-button {
            margin-left: 10px;
        }
    }

    :deep(.el-dialog__body) {
        max-height: 70vh;
        overflow-y: auto;
    }

    :deep(.el-form-item__label) {
        font-weight: 500;
    }
</style>