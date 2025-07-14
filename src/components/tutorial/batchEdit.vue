<template>
    <el-dialog v-model="dialogVisiable" title="批量编辑" :before-close="resetForm" width="500">
        <el-form :model="formData" ref="ruleFormRef" class="demo-ruleForm">

            <el-form-item label="分类" prop="categoryId">
                <el-select v-model="formData.categoryId">
                    <el-option v-for="item in categoryTypes" :key="item.id" :label="item.categoryName"
                        :value="item.id" />
                </el-select>
            </el-form-item>

        </el-form>
        <template #footer>
            <el-button type="primary" @click="handleComfirm">确定</el-button>
            <el-button @click="resetForm">取消</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    import service from '@/axios';
    import { useCounterStore } from '@/stores/counter';
    import { desEncrypt } from '@/utils/des';
    import { ElMessage } from 'element-plus';
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue'
    const stores = useCounterStore()
    const { showLoading } = storeToRefs(stores)
    const dialogVisiable = defineModel('dialogBatch', {
        type: Boolean,
        default: false
    })
    const props = defineProps<{
        categoryTypes: any[],
        selectedList: any[]
    }>()
    const formData = ref<any>({
        categoryId: ''
    })

    const resetForm = () => {
        formData.value.categoryId = ''
        dialogVisiable.value = false
    }

    const handleComfirm = async () => {
        showLoading.value = true
        try {
            const params = {
                timestamp: Date.now(),
                categoryId: formData.value.categoryId,
                ids: props.selectedList.join(',')
            }
            console.log('参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/category/matchTutorial', {
                enData
            })
            if (res.data.code === 200) {
                ElMessage.success('保存成功')

                resetForm()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('保存失败', err);
        } finally {
            showLoading.value = false
        }
    }
</script>

<style lang="scss" scoped></style>