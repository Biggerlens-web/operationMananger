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

            <el-form-item label="说明" prop="desc">
                <el-input type="textarea" v-model="formData.menuText" />
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
    import { onMounted, reactive, ref } from 'vue';
    import service from '@/axios';
    import type { FormInstance } from 'element-plus';
    const props = defineProps<{
        dialogVisible: boolean
    }>()

    const ruleFormRef = ref<FormInstance>()
    const formData = ref<any>({
        id: '',
        menuText: '',
        menuType: '',
        desc: '',
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
            desc: '',
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
    const handleComfirm = (formEl: any) => {
        formEl.validate((valid: any) => {
            if (valid) {
                handleClose()
            }
        })

    }

    //获取父级菜单
    const parentMenuList = ref<any>([])
    const getParentMenuList = async () => {
        try {
            const menuInfo = await service.get('/system/menu/menuInfo')

            console.log('获取父级菜单信息', menuInfo.data.data.menus);
            parentMenuList.value = menuInfo.data.data.menus
        } catch (err) {
            console.log('获取父级菜单信息失败', err);
        }
    }

    onMounted(async () => {
        await getParentMenuList()
    })
</script>

<style lang="scss" scoped></style>