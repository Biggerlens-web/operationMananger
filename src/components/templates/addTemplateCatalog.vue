<template>
    <el-dialog :model-value="dialogEditor" title="编辑分类" width="500" :before-close="handleClose">
        <el-radio-group v-if="!isEditor" v-model="groupType" @change="selectType" style="margin-bottom: 10px;">
            <el-radio label="parent">分类</el-radio>
            <el-radio label="child">子分类</el-radio>
        </el-radio-group>
        <el-form v-if="groupType === 'parent'" ref="ruleFormRef" style="max-width: 600px" :model="FormData"
            :rules="rules" label-width="auto" class="demo-FormData" status-icon>
            <el-form-item label="分类" prop="catalog">
                <el-input v-model="FormData.catalog" placeholder="请输入分类" />
            </el-form-item>

        </el-form>
        <el-form v-else ref="ruleFormRef" style="max-width: 600px" :model="FormData" :rules="rules2" label-width="auto"
            class="demo-FormData" status-icon>
            <el-form-item label="分类" prop="catalog">
                <el-select v-model="FormData.catalog" placeholder="请选择分类">
                    <el-option label="分类1" value="1" />
                    <el-option label="分类2" value="2" />
                    <el-option label="分类3" value="3" />
                </el-select>
            </el-form-item>
            <el-form-item label="子分类" prop="subCatalog">
                <el-input v-model="FormData.subCatalog" placeholder="请输入子分类" />
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
    import { useTemplateStore } from '@/stores/template';
    import { storeToRefs } from 'pinia';
    import { reactive, ref, watch } from 'vue';
    const templateStore = useTemplateStore()
    const { activeCataType, activeCalaId } = storeToRefs(templateStore)
    const props = defineProps<{
        dialogEditor: boolean,
        isEditor: string
    }>()

    watch(() => props.dialogEditor, (
        newV
    ) => {
        if (newV) {
            if (props.isEditor) {
                groupType.value = props.isEditor === 'addTemplateCatalog' ? 'parent' : 'child'
            } else {
                groupType.value = activeCataType.value === 'catalogList' ? 'parent' : 'child'
            }

        }
    })





    const groupType = ref<string>('')
    const FormData = reactive<any>({
        catalog: '',
        subCatalog: ''
    })
    const rules = reactive<any>({
        catalog: [
            { required: true, message: '请输入分类', trigger: 'blur' }
        ],
    })
    const rules2 = reactive<any>({
        catalog: [
            { required: true, message: '请选择分类', trigger: 'blur' }
        ],
        subCatalog: [
            { required: true, message: '请输入子分类', trigger: 'blur' }
        ]
    })


    const ruleFormRef = ref<any>(null)

    const emit = defineEmits<{
        'update:dialogEditor': [value: boolean],
        'clearMark': [],
    }>()
    const handleClose = () => {
        emit('clearMark')
        emit('update:dialogEditor', false)
    }
    const resetForm = (formEl: any) => {
        if (!formEl) return
        console.log('重置表单');
        formEl.resetFields()
    }
    const handleComfirm = async (formItem: any) => {
        if (!formItem) {
            return
        }
        await formItem.validate((valid: any) => {
            if (valid) {
                console.log(FormData)
                resetForm(formItem)
                handleClose()
            } else {
                console.log('验证失败');
            }
        })

    }



    //选择编辑类型
    const selectType = () => {

    }
</script>

<style lang="scss" scoped></style>