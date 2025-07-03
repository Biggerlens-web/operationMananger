<template>
    <el-dialog :model-value="dialogVisible" width="500" title="模板前景" :before-close="handleClose">
        <div class="template-form">
            <!-- 文件上传区域 -->
            <div class="upload-area">
                <el-upload class="upload-dragger" drag :auto-upload="false" :show-file-list="false"
                    accept=".jpg,.jpeg,.png,.gif" :on-change="handleFileChange">
                    <div class="upload-content" v-if="!previewUrl">
                        <div class="upload-text">拖拽文件到这里...</div>
                    </div>
                    <div class="image-preview" v-else>
                        <img :src="previewUrl" alt="预览图片" />
                        <div class="image-overlay">
                            <el-button size="small" type="danger" @click.stop="removeImage">删除</el-button>
                        </div>
                    </div>
                </el-upload>
            </div>

            <!-- 表单区域 -->
            <div class="form-area">
                <el-form :model="formData" label-width="80px" size="small" label-position="left">
                    <el-form-item label="前景类型">
                        <el-select v-model="formData.type">
                            <el-option v-for="item in forceType" :label="item.note" :value="item.value"></el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item label="宽">
                        <el-input v-model="formData.width" type="number" step="0.1" placeholder="请输入宽度" />
                    </el-form-item>

                    <el-form-item label="高">
                        <el-input v-model="formData.height" type="number" step="0.1" placeholder="请输入高度" />
                    </el-form-item>

                    <el-form-item label="中心点 (横轴)">
                        <el-input v-model="formData.centerX" type="number" step="0.1" placeholder="请输入横轴坐标" />
                    </el-form-item>

                    <el-form-item label="中心点 (纵轴)">
                        <el-input v-model="formData.centerY" type="number" step="0.1" placeholder="请输入纵轴坐标" />
                    </el-form-item>

                    <el-form-item label="角度">
                        <el-input v-model="formData.angle" type="number" step="0.1" placeholder="请输入角度" />
                    </el-form-item>

                    <el-form-item label="缩放比例">
                        <el-input v-model="formData.zoomScale" type="number" step="0.1" placeholder="请输入缩放比例" />
                    </el-form-item>
                    <el-form-item label="文字" v-if="formData.type == 'text'">
                        <el-input v-model="formData.content" type="text" placeholder="请输入文字" />
                    </el-form-item>
                    <el-form-item label="文字颜色" v-if="formData.type == 'text'">
                        <el-color-picker v-model="formData.color" />
                    </el-form-item>
                    <el-form-item label="行间距" v-if="formData.type == 'text'">
                        <el-input v-model="formData.lineSpacing" type="number" step="0.1" placeholder="请输入行间距" />
                    </el-form-item>
                    <el-form-item label="字间距" v-if="formData.type == 'text'">
                        <el-input v-model="formData.charSpacing" type="number" step="0.1" placeholder="请输入字间距" />
                    </el-form-item>
                    <el-form-item label="字体" v-if="formData.type == 'text'">

                        <el-input v-model="formData.textFont" type="text" placeholder="请输入字体" />
                    </el-form-item>
                    <el-form-item label="字号" v-if="formData.type == 'text'">
                        <el-input v-model="formData.fontSize" type="number" step="0.1" placeholder="请输入字号" />
                    </el-form-item>
                    <el-form-item label="对齐" v-if="formData.type == 'text'">
                        <el-select v-model="formData.alignment">
                            <el-option label="左对齐" value="left"></el-option>
                            <el-option label="居中对齐" value="center"></el-option>
                            <el-option label="右对齐" value="right"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="边框线宽" v-if="formData.type == 'text'">
                        <el-input v-model="formData.borderWidth" type="number" step="0.1" placeholder="请输入边框线宽" />
                    </el-form-item>
                    <el-form-item label="边框颜色" v-if="formData.type == 'text'">
                        <el-color-picker v-model="formData.borderColor" />
                    </el-form-item>
                    <el-form-item label="效果" v-if="formData.type == 'text'">
                        <el-input v-model="formData.effect" type="number" step="0.1" placeholder="请输入效果" />
                    </el-form-item>
                    <el-form-item label="气泡" v-if="formData.type == 'text'">
                        <el-input v-model="formData.bubble" type="number" placeholder="请输入气泡" />
                    </el-form-item>
                </el-form>

                <!-- 操作按钮 -->
                <div class="form-buttons">
                    <el-button size="small" @click="handleClose">取消</el-button>
                    <el-button size="small" type="primary" @click="handleConfirm">确认</el-button>
                </div>
            </div>
        </div>


    </el-dialog>
</template>

<script lang="ts" setup>
    import { onMounted, reactive, ref, watch } from 'vue'
    import { ElMessage, type UploadFile } from 'element-plus'
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    const stores = useCounterStore()
    const { showLoading } = storeToRefs(stores)
    const dialogVisible = defineModel('dialogVisible', {
        type: Boolean,
        default: false
    })
    const props = defineProps<{
        detailId: number
    }>()


    const forceType = ref<any>([])
    const getTypeList = async () => {
        try {
            showLoading.value = true
            const res = await service.get('/templateUpDetailMaterials/edit')
            console.log('获取前景信息', res);
            forceType.value = res.data.data.materialsTypes
        } catch (err) {

        } finally {
            showLoading.value = false
        }
    }
    watch(() => dialogVisible.value, (newV) => {
        console.log('detailId', props.detailId);
        if (newV) {
            getTypeList()
        }
    })



    // 图片预览URL
    const previewUrl = ref('')
    const uploadedFile = ref<File | null>(null)

    // 表单数据
    const formData = ref<any>({

        "type": "image",       //前景类型
        "content": "",    //文字
        "color": "",      //文字颜色
        "lineSpacing": 1.0,  //行间距
        "charSpacing": 1.0,  //字间距
        "textFont": "",     //字体
        "fontSize": 1.0,     //fontSize
        "image": "",    //前景图
        "width": 1.0,     //宽
        "height": 1.0,    //高
        "centerX": 1.0,   //中心点（横轴）
        "centerY": 1.0,   //中心点（纵轴）
        "borderWidth": 1.0,  //边框线宽
        "borderColor": "",  //边框颜色
        "angle": 1.0,        //角度
        "alignment": 1.0,    //对齐
        "zoomScale": 1.0,   //缩放比例
        "effect": 1.0,     //效果
        "bubble": 1.0     //气泡
    })

    const handleClose = () => {
        formData.value = {

            "type": "image",       //前景类型
            "content": "",    //文字
            "color": "",      //文字颜色
            "lineSpacing": 1.0,  //行间距
            "charSpacing": 1.0,  //字间距
            "textFont": "",     //字体
            "fontSize": 1.0,     //fontSize
            "image": "",    //前景图
            "width": 1.0,     //宽
            "height": 1.0,    //高
            "centerX": 1.0,   //中心点（横轴）
            "centerY": 1.0,   //中心点（纵轴）
            "borderWidth": 1.0,  //边框线宽
            "borderColor": "",  //边框颜色
            "angle": 1.0,        //角度
            "alignment": 1.0,    //对齐
            "zoomScale": 1.0,   //缩放比例
            "effect": 1.0,     //效果
            "bubble": 1.0     //气泡
        }
        dialogVisible.value = false
    }



    const handleConfirm = async () => {



        try {
            formData.value.image = previewUrl.value.split(',')[1]
            if (formData.value.type === 'image') {
                delete formData.value.content
                delete formData.value.color
                delete formData.value.lineSpacing
                delete formData.value.charSpacing
                delete formData.value.textFont
                delete formData.value.fontSize
                delete formData.value.alignment
                delete formData.value.borderWidth
                delete formData.value.borderColor
                delete formData.value.effect
                delete formData.value.bubble
            }
            const params = {
                timestamp: Date.now(),
                detailId: props.detailId,
                operationType: 'add',
                ...formData.value
            }
            console.log('保存参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/templateUpDetailMaterials/save', {
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
        } finally {
            showLoading.value = false
        }
    }

    // 处理文件选择
    const handleFileChange = (file: UploadFile) => {
        if (file.raw) {
            uploadedFile.value = file.raw
            // 创建预览URL
            const reader = new FileReader()
            reader.onload = (e) => {
                previewUrl.value = e.target?.result as string
            }
            reader.readAsDataURL(file.raw)
        }
    }

    // 删除图片
    const removeImage = () => {
        previewUrl.value = ''
        uploadedFile.value = null
    }
</script>

<style lang="scss" scoped>
    .template-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;

        .upload-area {
            width: 100%;

            .upload-dragger {
                width: 100%;

                :deep(.el-upload-dragger) {
                    width: 100%;
                    height: 300px;
                    border: 2px dashed #dcdfe6;
                    border-radius: 6px;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

                    &:hover {
                        border-color: #409eff;
                    }
                }

                .upload-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;

                    .upload-text {
                        font-size: 14px;
                        color: #606266;
                        margin-top: 10px;
                    }
                }

                .image-preview {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    img {
                        max-width: 100%;
                        max-height: 100%;
                        object-fit: contain;
                        border-radius: 4px;
                    }

                    .image-overlay {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        opacity: 0;
                        transition: opacity 0.3s;
                    }

                    &:hover .image-overlay {
                        opacity: 1;
                    }
                }
            }
        }

        .form-area {
            width: 100%;

            .el-form {
                .el-form-item {
                    margin-bottom: 16px;

                    :deep(.el-form-item__label) {
                        font-size: 14px;
                        color: #606266;
                    }

                    :deep(.el-input__wrapper) {
                        border-radius: 4px;
                    }
                }
            }

            .form-buttons {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #ebeef5;
            }
        }
    }

    :deep(.el-dialog__body) {
        padding: 0;
    }
</style>