<template>
    <el-dialog :model-value="dialogVisible" title="编辑签名" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon v-loading="loading">
            <el-form-item label="所属应用" prop="appNo">
                <el-select v-model="formData.appNo">
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
                </el-select>
            </el-form-item>
            <el-form-item label="签名名称" prop="signName">
                <el-input v-model="formData.signName" />
            </el-form-item>
            <el-form-item label="密钥库文件" prop="jks">
                <el-upload v-model:file-list="formData.jks" class="upload-demo" action="#" :auto-upload='false'
                    :limit="1">
                    <el-button type="primary">上传文件</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="密钥库密码" prop="jksPassword">
                <el-input type="password" v-model="formData.jksPassword" />
            </el-form-item>
            <el-form-item label="别名" prop="alias">
                <el-input v-model="formData.alias" />
            </el-form-item>
            <el-form-item label="别名密码" prop="aliasPasswrod">
                <el-input type="password" v-model="formData.aliasPasswrod" />
            </el-form-item>
            <el-form-item label="包名" prop="packageName">
                <el-input v-model="formData.packageName" />
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
    import { ref, watch } from 'vue'
    const counterStore = useCounterStore()
    const { appList, defaultAppNo } = storeToRefs(counterStore)
    const props = defineProps<{
        dialogVisible: boolean
        signInfo: any
    }>()
    const loading = ref<boolean>(false)
    const getEditInfo = async (id: number) => {
        try {
            loading.value = true
            const params = {
                timestamp: Date.now(),
                appNo: formData.value.appNo,
                id,
                type: 'update'
            }
            console.log('参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/apkSign/edit', {
                enData
            })
            console.log('获取编辑信息', res);
            const info = res.data.data.apkSign
            formData.value.jksPassword = info.jksPassword
            formData.value.jksName = info.jksName
            formData.value.jksUrl = info.jksUrl
            formData.value.aliasPasswrod = info.aliasPasswrod
            // 获取文件并转换为File对象以在el-upload中显示
            const response = await fetch(info.jksUrl)
            if (response.ok) {
                const blob = await response.blob()
                const fileName = info.jksName || 'keystore.jks'
                const file = new File([blob], fileName, { type: blob.type })

                // 创建el-upload需要的文件对象格式
                const uploadFile = {
                    name: fileName,
                    size: file.size,
                    type: file.type,
                    raw: file,
                    status: 'success',
                    uid: Date.now(),
                    url: info.jksUrl
                }

                // 将文件添加到formData.jks中以在el-upload中显示
                formData.value.jks = [uploadFile]
            } else {
                ElMessage.error('获取文件失败')
            }

        } catch (err) {
            console.log('失败', err);
            ElMessage.error('获取信息失败')
        } finally {
            loading.value = false
        }
    }
    watch(() => props.dialogVisible, (newVal, oldVal) => {
        if (newVal && props.signInfo) {
            formData.value.id = props.signInfo.id
            formData.value.appNo = props.signInfo.appNo
            formData.value.signName = props.signInfo.signName
            formData.value.alias = props.signInfo.alias
            formData.value.packageName = props.signInfo.packageName

            getEditInfo(props.signInfo.id)
        } else {
            formData.value.appNo = defaultAppNo.value
        }
    })
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()


    //监听应用变化
    watch(() => defaultAppNo.value, () => {
        formData.value.appNo = defaultAppNo.value
    })
    const formData = ref<any>({
        id: '',
        appNo: "",
        signName: '',//签名名称
        alias: '',//别名
        aliasPasswrod: '',//别名密码
        packageName: '',//包名
        jksName: '',//密钥库名称
        jks: '',//密钥库文件
        jksUrl: '',//密钥库链接
        jksPassword: '',//密钥库密码



    })
    const ruleFormRef = ref<FormInstance>()
    const rules = ref<any>({
        bucket: [{ required: true, message: '请输入域', trigger: 'blur' }],
        path: [{ required: true, message: '请选择路径', trigger: 'change' }],
        img: [{ required: true, message: '请上传图片', trigger: 'blur' }],
        bannerName: [{ required: true, message: '请输入轮播图名称', trigger: 'blur' }]

    })

    const resetForm = () => {
        formData.value = {
            id: '',
            appNo: "",
            signName: '',//签名名称
            alias: '',//别名
            aliasPasswrod: '',//别名密码
            packageName: '',//包名
            jksName: '',//密钥库名称
            jks: '',//密钥库文件
            jksUrl: '',//密钥库链接
            jksPassword: '',//密钥库密码

        }
        ruleFormRef.value?.resetFields()
    }
    const handleClose = () => {
        resetForm()
        emit('update:dialogVisible', false)
    }
    const saveChange = async () => {
        try {
            // 分离jks文件和其他数据
            const { jks, ...otherData } = formData.value



            // 创建FormData对象
            const formDataToSend = new FormData()


            for (let key in formData.value) {
                if (key !== 'jks') {
                    formDataToSend.append(key, formData.value[key])
                }
            }
            if (formData.value.id) {
                formDataToSend.append('type', 'update')
            } else {
                formDataToSend.append('type', 'add')
            }
            // 如果有jks文件，添加到FormData中
            if (jks && jks.length > 0 && jks[0].raw) {
                formDataToSend.append('jks', jks[0].raw, jks[0].name)
            }

            const res = await service.post('/apkSign/save', formDataToSend, {
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
        }
    }
    const handleComfirm = (ruleFormRef: any) => {
        ruleFormRef.validate((valid: any) => {
            if (valid) {
                console.log('submit!');
                console.log('form', formData.value);
                saveChange()
            }
        })
    }
</script>

<style lang="scss" scoped></style>