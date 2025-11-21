<template>
    <el-dialog v-model="showMoveTemplateDialog" title="移动模板" width="500px">
        <el-form :model="formData" :rules="rules" ref="formRef">
            <el-form-item label="大分类" prop="bigCategoryId">
                <el-select v-model="formData.bigCategoryId" placeholder="请选择类目" @change="getSmallClassificationData">
                    <el-option v-for="item in bigTemplateList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="小分类" prop="categoryId">
                <el-select v-model="formData.categoryId" placeholder="请选择类目">
                    <el-option v-for="item in smallCategoryList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="handleMove">确定</el-button>
            <el-button type="danger" @click="showMoveTemplateDialog = false">取消</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    import service from '@/axios';
    import { desEncrypt } from '@/utils/des';
    import { ElMessage } from 'element-plus';
    import { reactive, ref } from 'vue'
    import { useCounterStore } from '@/stores/counter'
    import { storeToRefs } from 'pinia'
    const counterStore = useCounterStore()
    const { showLoading } = storeToRefs(counterStore)
    const showMoveTemplateDialog = defineModel('showMoveTemplateDialog', {
        default: false,
        type: Boolean
    })
    interface Prop {
        bigTemplateList: any,
        language: string
        selectIds: any

    }
    const props = defineProps<Prop>()


    const formRef = ref()
    const rules = reactive({
        bigCategoryId: [
            { required: true, message: '请选择大类目', trigger: 'change' }
        ],
        categoryId: [
            { required: true, message: '请选择小类目', trigger: 'change' }
        ],
    })
    const formData = reactive({
        bigCategoryId: '',
        categoryId: ''
    })


    const smallCategoryList = ref<any>([])
    //获取小分类
    const getSmallClassificationData = async () => {

        const id = formData.bigCategoryId
        console.log('id', id);
        if (id === undefined || id === null || id === '') {
            return
        }

        try {
            const params = {
                timestamp: Date.now(),
                id: id,
                language: props.language,
            }

            console.log("🚀 ~ getSmallClassificationData ~ params:", params)
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.get('/formTemplate/getSmallClassificationData', {
                params: {
                    enData
                }

            })
            console.log("🚀 ~ getSmallClassificationData ~ res:", res)
            if (res.data.code === 200) {
                smallCategoryList.value = res.data.rows


            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log("🚀 ~ getSmallClassificationData ~ err:", err)
        }

    }

    const handleMove = async () => {
        console.log('移动');
        if (!formRef.value) {
            console.error('formRef 未初始化')
            return
        }
        // 统一采用 Promise 形式校验
        const valid = await formRef.value.validate()
        if (!valid) {
            console.log('校验失败')
            return
        }
        // 避免重复提交：先判断再设置 loading
        if (showLoading.value) {
            ElMessage.warning('正在处理，请稍候...')
            return
        }
        try {
            showLoading.value = true
            const params = {
                timestamp: Date.now(),
                templateIds: props.selectIds,
                subId: formData.bigCategoryId,
                smallClassifyId: formData.categoryId,
            }
            console.log('移动参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/formTemplate/batchSave', {
                enData
            })
            if (res.data.code === 200) {
                ElMessage.success(res.data.msg)
                showLoading.value = false
                showMoveTemplateDialog.value = false
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