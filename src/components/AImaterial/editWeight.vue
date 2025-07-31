<template>
    <el-dialog title="加权管理" v-model="dialogVisible" width="30%" :before-close="() => { resetForm(ruleFormRef) }">
        <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="auto" class="demo-ruleForm">
            <el-form-item label="算法应用功能" prop="functionValue">
                <el-select v-model="ruleForm.functionValue" :disabled="true">
                    <el-option v-for="item in functionList" :key="item.value" :label="item.note" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="算法当前参数调整" prop="weight">
                <el-input-number v-model="ruleForm.weight" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
            <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    import { reactive, ref, computed } from 'vue'
    import type { FormRules, FormInstance } from 'element-plus'
    import { useCounterStore } from '@/stores/counter'
    import { storeToRefs } from 'pinia'
    const counterStore = useCounterStore()
    const { functionList } = storeToRefs(counterStore)
    const ruleFormRef = ref<any>()
    interface Props {
        functionValue: string | number
    }
    const props = defineProps<Props>()
    const dialogVisible = defineModel('dialogVisible', {
        type: Boolean,
        default: false
    })
    const ruleForm = reactive<any>({
        id: '',
        functionValue: computed(() => props.functionValue),
        weight: 0
    })
    const rules = reactive<FormRules>({
        functionValue: [
            { required: true, message: '请输入功能点', trigger: 'blur' },

        ],
        weight: [
            { required: true, message: '请输入权重值', trigger: 'blur' }]
    }
    )

    const submitForm = async (formEl: FormInstance | undefined) => {
        if (!formEl) return
        await formEl.validate((valid) => {
            if (valid) {
                console.log('submit!')
            } else {
                console.log('error submit!')
            }
        })
    }

    const resetForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.resetFields()
        dialogVisible.value = false
    }

</script>

<style lang="scss" scoped></style>