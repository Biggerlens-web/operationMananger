<template>
    <el-dialog :model-value="dialogVisible" title="编辑菜单" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="菜单文本" prop="menuText">
                <el-input v-model="formData.menuText" />
            </el-form-item>
            <el-form-item label="菜单类型" prop="menuType">
                <el-select v-model="formData.menuType" placeholder="请选择菜单类型">
                    <el-option label="文件夹" :value="0" />
                    <el-option label="链接" :value="1" />

                </el-select>
            </el-form-item>
            <template v-if="formData.menuType === 1">
                <el-form-item label="菜单标识" prop="menuIdentify">
                    <el-input v-model="formData.menuIdentify" />
                </el-form-item>
                <el-form-item label="菜单链接" prop="menuUrl">
                    <el-input v-model="formData.menuUrl" />
                </el-form-item>

                <el-form-item label="菜单链接类型" prop="menuUrlType">
                    <el-select v-model="formData.menuUrlType" placeholder="请选择菜单链接类型">
                        <el-option label="外部链接" :value="0" />
                        <el-option label="内部链接" :value="1" />

                    </el-select>
                </el-form-item>
                <el-form-item label="上级菜单" prop="parentId">
                    <el-select v-model="formData.parentId" placeholder="请选择上级菜单">
                        <el-option v-for="item in parentMenuList" :key="item.id" :label="item.menuText"
                            :value="item.id" />
                    </el-select>
                </el-form-item>

            </template>

            <el-form-item label="说明" prop="remark">
                <el-input type="textarea" v-model="formData.remark" />
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
    import { onMounted, reactive, ref, watch } from 'vue';
    import service from '@/axios';
    import { ElMessage, type FormInstance } from 'element-plus';
    import { desEncrypt } from '@/utils/des';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    const stores = useCounterStore()
    const { showLoading } = storeToRefs(stores)
    const props = defineProps<{
        dialogVisible: boolean,
        menuInfo?: any
    }>()


    watch(() => props.dialogVisible, (newV) => {
        if (newV) {
            Object.assign(formData.value, props.menuInfo)
            if (formData.value.menuType === '文件夹') {
                formData.value.menuType = 0
            } else if (formData.value.menuType === '链接') {
                formData.value.menuType = 1
            }
            console.log('formData', formData.value);
        }

    }, {
        deep: true
    })
    const ruleFormRef = ref<FormInstance>()
    const formData = ref<any>({
        id: '',
        menuText: '',
        menuType: '',
        remark: '',
        menuIdentify: '',
        menuUrl: '',
        menuUrlType: '',
        parentId: 2
    })
    const rules = ref<any>({
        menuText: [{ required: true, message: '请输入菜单文本', trigger: 'blur' }],
        menuType: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],


    })



    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()


    //重置表单
    const resetForm = () => {
        formData.value = {
            id: '',
            menuText: '',
            menuType: '',
            remark: '',
            menuIdentify: '',
            menuUrl: '',
            menuUrlType: '',
            parentId: 2
        }
        ruleFormRef.value?.resetFields()
    }
    const handleClose = () => {
        resetForm()
        emit('update:dialogVisible', false)
    }

    const saveMenu = async () => {
        try {
            const params = {
                timestamp: Date.now()
                ,
                ...formData.value
            }
            if (formData.value.parentName) {
                delete params.parentName
            }
            if (!params.id) {
                delete params.id
            }


            params.type = formData.value.id ? 'update' : 'add'
            const enData = desEncrypt(JSON.stringify(params))
            console.log('保存参数', params)
            showLoading.value = true
            const res = await service.post('/system/menu/save', {
                enData
            })
            if (res.data.code === 200) {

                handleClose()
                ElMessage.success('保存成功')
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {

            console.log('err', err);
            ElMessage.error('网络错误')
        } finally {
            showLoading.value = false
        }
    }
    const handleComfirm = (formEl: any) => {
        formEl.validate((valid: any) => {
            if (valid) {
                saveMenu()
            }
        })

    }

    //获取父级菜单
    const parentMenuList = ref<any>([])
    const getParentMenuList = async () => {
        try {
            showLoading.value = true
            const menuInfo = await service.get('/system/menu/menuInfo')

            console.log('获取父级菜单信息', menuInfo.data.data.menus);
            parentMenuList.value = menuInfo.data.data.menus
        } catch (err) {
            console.log('获取父级菜单信息失败', err);
        } finally {
            showLoading.value = false
        }
    }

    onMounted(async () => {
        await getParentMenuList()
    })
</script>

<style lang="scss" scoped></style>