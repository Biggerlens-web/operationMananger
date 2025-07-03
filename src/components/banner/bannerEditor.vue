<template>
    <el-dialog :model-value="dialogVisible" title="编辑轮播图" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>



            <el-form-item label="路径" prop="imgfolderId">
                <el-select v-model="formData.imgfolderId" placeholder="请选择路径" clearable>
                    <el-option v-for="item in bannerFolderList"
                        :label="`${item.parentObj.bucketName}.${item.parentObj.endpoint}.${item.folder}`"
                        :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="图片" prop="img">
                <el-upload v-model:file-list="fileList" action="#" list-type="picture-card" :auto-upload="false"
                    :on-change="handleUploadChange" :on-remove="handleUploadRemove" :limit="1">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="图片名称" prop="imgName">
                <el-input v-model="formData.imgName" placeholder="请输入图片名称" clearable />


            </el-form-item>
            <el-form-item label="图片点击链接" prop="imgClickUrl">
                <el-input v-model="formData.imgClickUrl" placeholder="请输入图片点击链接" clearable />
            </el-form-item>
            <el-form-item label="图片标识" prop="funcType">
                <el-input v-model="formData.funcType" placeholder="请输入图片标识" clearable />
            </el-form-item>
            <el-form-item label="英文说明" prop="remarkEN">
                <el-input v-model="formData.remarkEN" placeholder="请输入英文说明" clearable />
            </el-form-item>
            <el-form-item label="中文说明" prop="remarkCH">
                <el-input v-model="formData.remarkCH" placeholder="请输入中文说明" clearable />
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
    import { ElMessage, type FormInstance, type UploadFile, type UploadProps } from 'element-plus';
    import { storeToRefs } from 'pinia';
    import { ref, watch } from 'vue'
    import { Plus } from '@element-plus/icons-vue'
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    const counterStore = useCounterStore()
    const { appList, OSlist, channelList, showLoading } = storeToRefs(counterStore)
    const props = defineProps<{
        dialogVisible: boolean
        bannerInfo: any
        bannerFolderList: any
    }>()


    const fileList = ref<any>([])
    watch(() => props.dialogVisible, async (newV) => {
        if (newV && props.bannerInfo) {
            formData.value.id = props.bannerInfo.id
            formData.value.imgfolderId = props.bannerInfo.parentObj.id

            formData.value.imgName = props.bannerInfo.imgName
            formData.value.imgClickUrl = props.bannerInfo.imgClickUrl
            formData.value.funcType = props.bannerInfo.funcType
            formData.value.remarkEN = props.bannerInfo.remarkEN
            formData.value.remarkCH = props.bannerInfo.remarkCH
            if (props.bannerInfo.image) {
                try {
                    const res = await fetch(props.bannerInfo.image)
                    const blob = await res.blob()
                    const fileName = formData.value.imgName
                    const file = new File([blob], fileName, { type: blob.type });

                    // 构造 UploadFile 对象以在 el-upload 中显示
                    const uploadFile = {
                        name: file.name,
                        size: file.size,
                        status: 'success', // 标记为已上传成功状态
                        uid: Date.now(), // 生成唯一ID
                        url: props.bannerInfo.image, // 用于预览
                        raw: Object.assign(file, { uid: Date.now() }), // 为File对象添加uid属性
                    };
                    fileList.value = [uploadFile]
                    const render = new FileReader()
                    render.onload = () => {
                        const base64 = render.result as string
                        if (base64) {
                            formData.value.img = base64.split(',')[1]
                        }
                    }
                } catch (err) {
                    console.log('读取图片报错', err);
                }
            } else {
                formData.value.img = ''
                fileList.value = []
            }


        }
    })
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()

    const formData = ref<any>({
        id: '',
        imgfolderId: '', //图片文件路径id
        img: '',//图片文件
        imgName: '',//图片名称
        imgClickUrl: '',//图片点击链接
        funcType: '',//图片标识
        remarkEN: '',//英文说明
        remarkCH: '',//中文说明



    })
    const ruleFormRef = ref<FormInstance>()
    const rules = ref<any>({

    })

    const handleUploadChange: UploadProps['onChange'] = (file) => {
        if (file.raw) {


            const render = new FileReader()
            render.onload = () => {
                const base64 = render.result as string
                if (base64) {
                    formData.value.img = base64.split(',')[1]
                }

            }
            render.readAsDataURL(file.raw)

        }
    };

    const handleUploadRemove: UploadProps['onRemove'] = () => {
        formData.value.img = '';
        fileList.value = []
    };

    const resetForm = () => {
        formData.value = {
            id: '',
            imgfolderId: '', //图片文件路径id
            img: '',//图片文件
            imgName: '',//图片名称

            imgClickUrl: '',//图片点击链接
            funcType: '',//图片标识
            remarkEN: '',//英文说明
            remarkCH: '',//中文说明


        }
        fileList.value = []
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
                type: formData.value.id ? 'update' : 'add'
            }
            console.log('参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/base/bannerImg/save', {
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
                console.log('submit!');
                saveChange()

            }
        })
    }
</script>

<style lang="scss" scoped></style>