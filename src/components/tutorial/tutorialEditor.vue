<template>
    <el-dialog :model-value="showEditor" title="编辑教程" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="所属应用" prop="appNo">
                <!-- :disabled="!!formData.id" -->
                <el-select filterable v-model="defaultAppNo" disabled placeholder="请选择应用">
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
                </el-select>
            </el-form-item>
            <el-form-item label="系统" prop="os">
                <el-select v-model="formData.os">
                    <el-option v-for="item in OSlist" :key="item.value" :label="item.note" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="地区" prop="region">
                <el-select v-model="formData.region" :disabled="!!formData.id">
                    <el-option v-for="item in regionList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="语言" prop="language" v-show="formData.region !== 'domestic'">
                <el-select v-model="formData.language" :disabled="!!formData.id">
                    <el-option v-for="item in international" :key="item.value" :label="item.language"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="教程类型" prop="tutorialType">
                <el-select filterable :disabled="!!formData.id" v-model="formData.tutorialType" placeholder="教程类型"
                    class="filter-select">
                    <el-option v-for="item in tutorialTypes" :key="item.value" :label="item.note" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="设备类型" prop="deviceType">
                <el-select filterable :disabled="!!formData.id" v-model="formData.deviceType" placeholder="设备类型"
                    class="filter-select">
                    <el-option v-for="item in deviceTypes" :key="item.value" :label="item.note" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="分类类型" prop="category">
                <el-select filterable v-model="formData.category" placeholder="类型" class="filter-select">
                    <el-option v-for="item in categoryTypes" :key="item.id" :label="item.categoryName"
                        :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="formData.name" />
            </el-form-item>
            <el-form-item label="版本" prop="version">
                <el-input-number v-model="formData.version" />
            </el-form-item>
            <el-form-item label="埋点标识" prop="baseSign" v-if="formData.tutorialType === 'text_and_image'">
                <el-input v-model="formData.baseSign" />
            </el-form-item>
            <el-form-item label="关键词" prop="keyword" v-if="formData.tutorialType === 'text_and_image'">
                <el-input v-model="formData.keyword" />
            </el-form-item>
            <el-form-item label="描述" prop="desc">
                <el-input v-model="formData.desc" type="textarea" />
            </el-form-item>
            <el-form-item label="封面图" prop="coverImg">

                <div class="image-upload-container">
                    <el-upload class="image-uploader" v-model:file-list="formData.coverImg" :show-file-list="false"
                        action="#" :on-remove="handleRemove" :auto-upload="false" :on-change="handleChangeimge"
                        accept="image/*">
                        <img v-if="formData.coverImgUrl" :src="formData.coverImgUrl" class="uploaded-image" />
                        <div v-else class="upload-placeholder">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            <span>点击上传图片</span>
                        </div>
                    </el-upload>
                    <el-button v-if="formData.coverImgUrl" type="danger" size="small" class="delete-image-btn"
                        @click="removeCoverImage">
                        <el-icon>
                            <Delete />
                        </el-icon>
                        删除
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item label="跳转标记类" prop="signClass">
                <el-input v-model="formData.signClass" />
            </el-form-item>
            <el-form-item label="跳转标记" prop="sign">
                <el-input v-model="formData.sign" />
            </el-form-item>
            <el-form-item label="视频" prop="video" v-if="formData.tutorialType === 'video'">
                <div class="video-upload-container">
                    <el-upload v-model:file-list="formData.video" class="video-uploader" action="#"
                        :show-file-list="false" :auto-upload="false" :on-change="handleChangeVideo" accept="video/*">
                        <div v-if="formData.videoUrl" class="video-preview-container">
                            <video :src="formData.videoUrl" class="uploaded-video" controls preload="metadata">
                                您的浏览器不支持视频播放
                            </video>
                            <div class="video-info">
                                <span class="video-name">{{ formData.videoName }}</span>
                            </div>
                        </div>
                        <div v-else class="upload-placeholder">
                            <el-icon>
                                <VideoPlay />
                            </el-icon>
                            <span>点击上传视频</span>
                        </div>
                    </el-upload>
                    <el-button v-if="formData.videoUrl" type="danger" size="small" class="delete-video-btn"
                        @click="removeVideo">
                        <el-icon>
                            <Delete />
                        </el-icon>
                        删除视频
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item label="教程等级" prop="level">
                <el-select v-model="formData.level">
                    <el-option v-for="item in levels" :key="item.value" :label="`${item.noteZh}/${item.noteEn}`"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="抖音视频链接" prop="videoUrlDy" v-if="formData.tutorialType === 'video'">
                <el-input v-model="formData.videoUrlDy" />
            </el-form-item>
            <el-form-item label="视频持续时间" prop="videoDuration" v-if="formData.tutorialType === 'video'">
                <el-input v-model="formData.videoDuration" type="number" />
            </el-form-item>
            <el-form-item label="是否为GIF" prop="isGif" v-if="formData.tutorialType === 'video'">
                <el-switch v-model="formData.isGif" />
            </el-form-item>
            <el-form-item label="教程图文" v-if="formData.tutorialType === 'text_and_image'">
                <div class="tutorial-content-wrapper">
                    <div class="tutorial-item-card" v-for="(item, index) in tutorialTextArr" :key="index">
                        <div class="tutorial-item-header">
                            <span class="tutorial-item-number">{{ index + 1 }}</span>
                            <el-button type="danger" size="small" circle class="remove-tutorial-btn"
                                @click="removeTutorialItem(index)">
                                <el-icon>
                                    <Delete />
                                </el-icon>
                            </el-button>
                        </div>

                        <div class="tutorial-item-content">
                            <div class="input-group">
                                <label class="input-label">标题</label>
                                <el-input v-model="item.text" placeholder="请输入教程步骤标题" class="tutorial-input" />
                            </div>

                            <div class="input-group">
                                <label class="input-label">配图</label>
                                <div class="tutorial-image-upload-container">
                                    <el-upload class="tutorial-image-uploader" v-model:file-list="item.image"
                                        :show-file-list="false" action="#"
                                        :on-remove="() => handleRemoveTextImage(index)" :auto-upload="false"
                                        accept="image/*"
                                        :on-change="(uploadFile: UploadUserFile, uploadFiles: UploadFiles) => handleChangeCoverImage(uploadFile, index)">
                                        <div v-if="item.imgUrl" class="tutorial-image-preview">
                                            <img :src="item.imgUrl" class="tutorial-uploaded-image" />
                                            <div class="tutorial-image-overlay">
                                                <el-button type="danger" size="small" circle
                                                    class="tutorial-delete-image-btn"
                                                    @click.stop="removeCoverImageTextImage(index)">
                                                    <el-icon>
                                                        <Delete />
                                                    </el-icon>
                                                </el-button>
                                            </div>
                                        </div>
                                        <div v-else class="tutorial-upload-placeholder">
                                            <el-icon class="upload-icon">
                                                <Plus />
                                            </el-icon>
                                            <span class="upload-text">点击上传配图</span>
                                        </div>
                                    </el-upload>
                                </div>
                            </div>

                            <div class="input-group">
                                <label class="input-label">描述</label>
                                <el-input v-model="item.desc" placeholder="请输入详细描述" type="textarea" :rows="3"
                                    class="tutorial-textarea" />
                            </div>
                        </div>
                    </div>

                    <div class="add-tutorial-section">
                        <el-button type="primary" :icon="Plus" class="add-tutorial-btn" @click="addTutorialItem">
                            添加教程步骤
                        </el-button>
                    </div>
                </div>
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
    import { storeToRefs } from 'pinia';
    import { ref, watch } from 'vue'
    import { type UploadProps, type UploadUserFile, type UploadFiles, ElMessage } from 'element-plus'
    import { Plus, Delete, VideoPlay } from '@element-plus/icons-vue'
    import service from '@/axios';
    import { desEncrypt } from '@/utils/des';
    const props = defineProps<{
        showEditor: boolean
        categoryTypes: any[]
        tutorialTypes: any[]
        deviceTypes: any[]
        levels: any[]
        editInfo: any
    }>()


    const getTypeInfo = async () => {
        showLoading.value = true
        try {
            const params = {
                timestamp: Date.now(),
                id: formData.value.id,
                appNo: formData.value.appNo,
                region: formData.value.region,
                language: formData.value.language,
                os: formData.value.os
            }
            console.log('参数0', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/tutorial/edit', {
                enData
            })
            console.log('获取编辑信息', res);
            formData.value.category = res.data.data.categoryName === 'null' ? 0 : res.data.data.categoryName
            if (res.data.data.tutorialTextAndImages.length) {
                tutorialTextArr.value = res.data.data.tutorialTextAndImages
            } else {
                tutorialTextArr.value = [
                    {
                        text: '',
                        image: [],
                        desc: '',
                        imgUrl: '',
                    }
                ]
            }
        } catch (err) {
            console.log('获取编辑信息失败', err);
        } finally {
            showLoading.value = false
        }
    }
    watch(() => props.showEditor, (newV) => {
        if (newV && props.editInfo) {
            Object.assign(formData.value, props.editInfo)
            getTypeInfo()
        }
        if (!newV) {
            tutorialTextArr.value = [
                {
                    text: '',
                    image: [],
                    desc: '',
                    imgUrl: '',
                }
            ]
        }

        console.log('formData.value', formData.value);
    })
    const counterStore = useCounterStore()
    const { appList, OSlist, regionList, showLoading, international, defaultAppNo } = storeToRefs(counterStore)
    const emit = defineEmits<{
        'update:showEditor': [value: boolean]
    }>()

    const tutorialTextArr = ref<any>([
        {
            text: '',
            image: [],
            desc: '',
            imgUrl: '',
        }
    ])
    const formData = ref<any>({
        "id": '',     //新增为null，修改必传
        "name": "",

        "tutorialType": "",
        "appNo": "",
        "os": "",
        "region": "",
        "signClass": "",   //跳转标记类
        "sign": "",        //跳转标记
        "video": [],
        "videoUrl": "",
        "videoName": "",
        "videoUrlDy": "",   //抖音视频链接
        "videoDuration": 1,  //视频持续时间
        "baseSign": "",   //埋点标识
        "keyword": "",   //关键字
        "level": 1,      //教程等级
        "version": '',   //版本
        "desc": "",     //描述
        "coverImg": [],
        "coverImgName": "",
        coverImgUrl: '',
        "category": "",
        "deviceType": "",
        language: '',
        "isGif": false  //是否为Gif
    })


    const ruleFormRef = ref<any>(null)
    const rules = ref({

    })

    const resetForm = () => {
        formData.value = {
            "id": '',     //新增为null，修改必传
            "name": "",

            "tutorialType": "",
            "appNo": "",
            "os": "",
            "region": "",
            "signClass": "",   //跳转标记类
            "sign": "",        //跳转标记
            "video": [],
            "videoUrl": "",
            "videoName": "",
            "videoUrlDy": "",   //抖音视频链接
            "videoDuration": 1,  //视频持续时间
            "baseSign": "",   //埋点标识
            "keyword": "",   //关键字
            "level": 1,      //教程等级
            "version": '',   //版本
            "desc": "",     //描述
            "coverImg": [],
            "coverImgName": "",
            "coverImgUrl": "",
            "category": "",
            "deviceType": "",
            "isGif": false,  //是否为Gif
            language: ''
        }
        ruleFormRef.value?.resetFields()
    }


    //处理图片
    const handleChangeCoverImage = (uploadFile: UploadUserFile, index: number) => {
        if (uploadFile.raw) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const fullBase64 = e.target?.result as string;
                tutorialTextArr.value[index].imgUrl = fullBase64
                tutorialTextArr.value[index].imgName = ''
            };
            reader.readAsDataURL(uploadFile.raw);

        }
    }
    const handleChangeimge = (uploadFile: UploadUserFile, uploadFiles: UploadFiles) => {
        console.log(uploadFile.raw);

        if (uploadFile.raw) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const fullBase64 = e.target?.result as string;
                formData.value.coverImgUrl = fullBase64
                formData.value.coverImgName = ''
            };
            reader.readAsDataURL(uploadFile.raw);
        }


    }


    const handleRemoveTextImage = (index: number) => {
        tutorialTextArr.value[index].imgUrl = ''
        tutorialTextArr.value[index].image = []
    }

    const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {

        console.log(uploadFile, uploadFiles)

        formData.value.coverImgUrl = ''
        formData.value.coverImg = []
    }


    const removeCoverImageTextImage = (index: number) => {
        tutorialTextArr.value[index].imgUrl = ''
        tutorialTextArr.value[index].image = []
        tutorialTextArr.value[index].imgName = ''
    }
    const removeCoverImage = () => {
        formData.value.coverImgUrl = '';
        formData.value.coverImg = []
    }

    // 添加教程项
    const addTutorialItem = () => {
        tutorialTextArr.value.push({
            text: '',
            image: [],
            textAndImageDesc: '',
            imgUrl: '',
        })
    }

    // 删除教程项
    const removeTutorialItem = (index: number) => {
        if (tutorialTextArr.value.length > 1) {
            tutorialTextArr.value.splice(index, 1)
        }
    }


    // 处理视频上传
    const handleChangeVideo = (uploadFile: UploadUserFile, uploadFiles: UploadFiles) => {
        console.log('视频上传:', uploadFile.raw);

        if (uploadFile.raw) {
            // 检查文件类型
            if (!uploadFile.raw.type.startsWith('video/')) {
                console.error('请选择视频文件');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const fullBase64 = e.target?.result as string;
                formData.value.videoUrl = fullBase64;
                formData.value.videoName = ''
            };
            reader.readAsDataURL(uploadFile.raw);
        }
    }

    // 删除视频
    const removeVideo = () => {
        formData.value.videoUrl = '';
        formData.value.videoName = '';
        formData.value.video = [];
    }


    const handleClose = () => {
        resetForm()
        emit('update:showEditor', false)
    }



    const saveChange = async () => {

        if (showLoading.value) {
            ElMessage.warning('正在保存。。。')
            return
        }
        showLoading.value = true
        try {

            const form = new FormData()
            formData.value.appNo = defaultAppNo.value
            for (let key in formData.value) {
                if (key !== 'coverImg' && key !== 'video' && key !== 'language') {

                    if (key === 'os') {
                        form.append(key, formData.value[key].toLowerCase())
                    }
                    else {

                        form.append(key, formData.value[key])
                    }
                } else if (key === 'language') {
                    form.append(key, formData.value.region === 'domestic' ? 'zh' : formData.value.language)
                }


            }
            if (formData.value.version === null || formData.value.version === '') {
                form.delete('version')
            }
            form.delete('videoUrl')
            form.delete('coverImgUrl')
            form.delete('createdAt')
            form.delete('labels')
            form.delete('likeNum')
            form.delete('levels')
            form.delete('osObj')
            form.append('type', formData.value.id ? 'update' : 'add')

            if (formData.value.tutorialType === 'video') {
                if (!formData.value.videoName) {
                    if (formData.value.video && formData.value.video[0] && formData.value.video[0].raw) {
                        form.append('video', formData.value.video[0].raw)
                        form.delete('videoName')
                    } else {


                    }

                }
            } else {
                form.delete('videoName')
                form.delete('videoUrlDy')
                form.delete('videoDuration')



                tutorialTextArr.value.forEach((item: any) => {
                    form.append('textAndImageDesc', item.desc)
                    form.append('text', item.text)
                    if (item.textAndImageId) {
                        form.append('textAndImageId', item.textAndImageId)
                    }
                    if (item.imgName) {
                        form.append('textAndImageImgName', item.imgName)
                        form.append('image_exist', 'true')
                    } else {
                        console.log('item.image', item);
                        if (item.image && item.image[0] && item.image[0].raw) {
                            form.append('image', item.image[0].raw)
                            form.append('image_exist', 'true')
                        } else {
                            form.append('image_exist', 'false')
                        }

                    }
                    if (item.id) {
                        form.append('textAndImageId', item.id)
                    }
                })
            }

            if (!formData.value.coverImgName) {
                if (formData.value.coverImg && formData.value.coverImg[0] && formData.value.coverImg[0].raw) {
                    form.append('coverImg', formData.value.coverImg[0].raw)
                    form.delete('coverImgName')
                } else {


                }
            }


            const res = await service.post('/tutorial/save', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
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
    const handleComfirm = (ruleFormRef: any) => {
        ruleFormRef.validate((valid: any) => {
            if (valid) {
                saveChange()

            }
        })
    }
</script>

<style lang="scss" scoped>
    .image-upload-container {
        position: relative;
        display: inline-block;
        width: 100%;
    }

    .image-uploader {
        width: 100%;
    }

    .delete-image-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        z-index: 10;
        opacity: 0;
        transition: opacity 0.3s;
    }

    .image-upload-container:hover .delete-image-btn {
        opacity: 1;
    }

    .image-uploader :deep(.el-upload) {
        width: 100%;
        border: 2px dashed var(--el-border-color);
        border-radius: 8px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration);
    }

    .image-uploader :deep(.el-upload:hover) {
        border-color: var(--el-color-primary);
    }

    .uploaded-image {
        width: 100%;
        height: 200px;
        object-fit: contain;
        border-radius: 6px;
        background-color: #f5f7fa;
    }

    .upload-placeholder {
        height: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--el-text-color-secondary);
    }

    .upload-placeholder .el-icon {
        font-size: 28px;
        margin-bottom: 8px;
    }

    // 视频上传样式
    .video-upload-container {
        position: relative;
        display: inline-block;
        width: 100%;
    }

    .video-uploader {
        width: 100%;
    }

    .video-uploader :deep(.el-upload) {
        width: 100%;
        border: 2px dashed var(--el-border-color);
        border-radius: 8px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration);
    }

    .video-uploader :deep(.el-upload:hover) {
        border-color: var(--el-color-primary);
    }

    .video-preview-container {
        width: 100%;
        padding: 12px;
    }

    .uploaded-video {
        width: 100%;
        max-height: 300px;
        border-radius: 6px;
        background-color: #000;
    }

    .video-info {
        margin-top: 8px;
        padding: 8px;
        background-color: #f5f7fa;
        border-radius: 4px;
    }

    .video-name {
        font-size: 14px;
        color: var(--el-text-color-regular);
        word-break: break-all;
    }

    .delete-video-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        z-index: 10;
        opacity: 0;
        transition: opacity 0.3s;
    }

    .video-upload-container:hover .delete-video-btn {
        opacity: 1;
    }

    // 教程图文样式
    .tutorial-content-wrapper {
        width: 100%;
        max-width: 800px;
    }

    .tutorial-item-card {
        background: #fff;
        border: 1px solid #e4e7ed;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        transition: all 0.3s ease;
        position: relative;
    }

    .tutorial-item-card:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        transform: translateY(-2px);
    }

    .tutorial-item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #f0f2f5;
    }

    .tutorial-item-number {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        background: linear-gradient(135deg, #409eff, #67c23a);
        color: white;
        border-radius: 50%;
        font-size: 14px;
        font-weight: 600;
    }

    .remove-tutorial-btn {
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }

    .remove-tutorial-btn:hover {
        opacity: 1;
    }

    .tutorial-item-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .input-label {
        font-size: 14px;
        font-weight: 500;
        color: #303133;
        margin: 0;
    }

    .tutorial-input,
    .tutorial-textarea {
        transition: all 0.3s ease;
    }

    .tutorial-input:focus,
    .tutorial-textarea:focus {
        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }

    .tutorial-image-upload-container {
        width: 100%;
        position: relative;
    }

    .tutorial-image-uploader {
        width: 100%;
    }

    .tutorial-image-uploader :deep(.el-upload) {
        width: 100%;
        border: 2px dashed #dcdfe6;
        border-radius: 8px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
        background-color: #fafbfc;
    }

    .tutorial-image-uploader :deep(.el-upload:hover) {
        border-color: #409eff;
        background-color: #f0f9ff;
    }

    .tutorial-image-preview {
        position: relative;
        width: 100%;
        height: 200px;
        border-radius: 6px;
        overflow: hidden;
    }

    .tutorial-uploaded-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        transition: transform 0.3s ease;
    }

    .tutorial-image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .tutorial-image-preview:hover .tutorial-image-overlay {
        opacity: 1;
    }

    .tutorial-image-preview:hover .tutorial-uploaded-image {
        transform: scale(1.05);
    }

    .tutorial-delete-image-btn {
        background: rgba(245, 108, 108, 0.9);
        border: none;
        color: white;
    }

    .tutorial-delete-image-btn:hover {
        background: #f56c6c;
    }

    .tutorial-upload-placeholder {
        height: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #909399;
        text-align: center;
        padding: 20px;
    }

    .upload-icon {
        font-size: 32px;
        margin-bottom: 12px;
        color: #c0c4cc;
        transition: color 0.3s ease;
    }

    .tutorial-image-uploader:hover .upload-icon {
        color: #409eff;
    }

    .upload-text {
        font-size: 14px;
        color: #606266;
        margin-bottom: 4px;
        font-weight: 500;
    }

    .upload-hint {
        font-size: 12px;
        color: #909399;
    }

    .add-tutorial-section {
        display: flex;
        justify-content: center;
        padding: 20px;
        border: 2px dashed #e4e7ed;
        border-radius: 12px;
        background: #fafbfc;
        transition: all 0.3s ease;
    }

    .add-tutorial-section:hover {
        border-color: #409eff;
        background: #f0f9ff;
    }

    .add-tutorial-btn {
        padding: 12px 24px;
        font-size: 14px;
        font-weight: 500;
        border-radius: 8px;
        transition: all 0.3s ease;
    }

    .add-tutorial-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
    }

    // 响应式设计
    @media (max-width: 768px) {
        .tutorial-item-card {
            padding: 16px;
            margin-bottom: 12px;
        }

        .tutorial-item-header {
            margin-bottom: 12px;
        }

        .tutorial-item-content {
            gap: 12px;
        }

        .tutorial-upload-placeholder {
            height: 160px;
            padding: 16px;
        }

        .upload-icon {
            font-size: 28px;
        }
    }
</style>