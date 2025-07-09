<template>
    <el-dialog :model-value="dialogVisible" title="权限编辑" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="权限名" prop="permissionName" v-if="formData.permissionType !== 2">
                <el-input v-model="formData.permissionName" />
            </el-form-item>
            <el-form-item label="权限编码" prop="permissionCode" v-if="formData.permissionType !== 2">
                <el-input v-model="formData.permissionCode" />
            </el-form-item>
            <el-form-item label="权限类型" prop="permissionType">
                <el-select v-model="formData.permissionType" placeholder="请选择权限类型">
                    <el-option v-for="item in permissionTypeList" :key="item.value" :label="item.note"
                        :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item label="应用" prop="appNo" v-if="formData.permissionType === 2">
                <el-select v-model="formData.appNo" filterable>
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
                </el-select>
            </el-form-item>
            <el-form-item label="权限小类" prop="permissionType1" v-if="formData.permissionType !== 2">
                <el-select v-model="formData.permissionType1" placeholder="请选择权限类型">
                    <el-option v-for="item in permissionType1List" :key="item.value" :label="item.note"
                        :value="item.value" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleComfirm(ruleFormRef)"> 确定 </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    import { onMounted, ref, watch } from 'vue'
    import { ElMessage, type FormInstance } from 'element-plus'
    import { desEncrypt } from '@/utils/des'
    import service from '@/axios'
    import { useCounterStore } from '@/stores/counter'
    import { storeToRefs } from 'pinia'
    const stores = useCounterStore()
    const { appList, showLoading } = storeToRefs(stores)
    const props = defineProps<{
        dialogVisible: boolean
        permissionInfo: any
    }>()
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()

    watch(
        () => props.dialogVisible,
        (newV) => {
            if (newV && props.permissionInfo) {



                formData.value.id = props.permissionInfo.id
                formData.value.permissionType = props.permissionInfo.permissionType.value
                formData.value.permissionType1 = props.permissionInfo.permissionType1.value
                formData.value.permissionName = props.permissionInfo.permissionName
                formData.value.permissionCode = props.permissionInfo.permissionCode
                if (formData.value.permissionCode.includes('APP')) {
                    formData.value.appNo = parseInt(formData.value.permissionCode.split(':')[1])
                } else {
                    formData.value.appNo = ''
                }
            }
        },
    )



    //获取权限类型
    const permissionTypeList = ref<any>([])
    const permissionType1List = ref<any>([])
    const getPermissionTypeList = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                type: 'add',
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service('/system/permission/edit', {
                params: {
                    enData,
                },
            })
            console.log('获取权限类型', res)
            permissionTypeList.value = res.data.data.permissions
            permissionType1List.value = res.data.data.permissions1
        } catch (err) {
            console.log('获取权限类型失败', err)
        } finally {
            showLoading.value = false
        }
    }

    onMounted(() => {
        getPermissionTypeList()
    })
    const formData = ref<any>({
        id: '',
        permissionType: '',
        permissionType1: '',
        permissionName: '',
        permissionCode: '',
        appNo: ''
    })

    const rules = ref<any>({
        permissionName: [{ required: true, message: '请输入权限名', trigger: 'blur' }],
        permissionCode: [{ required: true, message: '请输入权限编码', trigger: 'blur' }],
    })

    const ruleFormRef = ref<FormInstance>()

    const resetForm = () => {
        ruleFormRef.value?.resetFields()
        formData.value = {
            id: '',
            permissionType: '',
            permissionType1: '',
            permissionName: '',
            permissionCode: '',
            appNo: ''
        }
    }
    const handleClose = () => {
        resetForm()
        emit('update:dialogVisible', false)
    }

    const saveChange = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                id: formData.value.id,
                permissionType1: formData.value.permissionType1,
                permissionName: formData.value.permissionName,
                permissionCode: formData.value.permissionCode,
                permissionType: formData.value.permissionType,
                appNo: formData.value.appNo,
                type: formData.value.id ? 'update' : 'add',
            }
            console.log('参数', params)
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/system/permission/save', {
                enData,
            })
            console.log('保存', res)
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
                handleClose()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('保存失败', err)
        } finally {
            showLoading.value = false
        }
    }
    const handleComfirm = (formEl: any) => {
        formEl.validate((valid: any) => {
            if (valid) {
                saveChange()
            }
        })
    }
</script>

<style lang="scss" scoped></style>
