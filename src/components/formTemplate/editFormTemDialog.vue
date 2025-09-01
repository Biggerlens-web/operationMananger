<template>
    <el-dialog v-model="isEditTemplate" title="编辑模板" width="500px">

        <el-form :model="formData" ref="formRef" :rules="rules">
            <el-form-item label="大分类" prop="bigClass">
                <el-select v-model="formData.bigClass" placeholder="请选择大分类" @change="getSmallClassificationData"
                    clearable>
                    <el-option v-for="item in bigTemplateList" :key="item.cid" :label="item.name" :value="item.cid" />
                </el-select>
            </el-form-item>
            <el-form-item label="小分类" prop="smallClass">
                <el-select v-model="formData.smallClass" placeholder="请选择小分类" clearable>
                    <el-option v-for="item in smallTemplateList" :key="item.name" :label="item.name"
                        :value="item.name" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="handleSave">保存</el-button>
            <el-button @click="isEditTemplate = false">取消</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    import service from '@/axios'
    import { desEncrypt } from '@/utils/des'
    import { ElMessage } from 'element-plus'
    import { ref, watch } from 'vue'

    const isEditTemplate = defineModel('isEditTemplate', {
        type: Boolean,
        default: false
    })

    interface Props {
        language: string
        bigTemplateList: any[]
        editInfo: any
    }
    const props = withDefaults(defineProps<Props>(), {
        language: 'zh',
        bigTemplateList: () => [],
    })



    watch(() => props.editInfo, () => {
        console.log("🚀 ~  props.editInfo:", props.editInfo)

        if (props.editInfo) {
            // formData.value.bigClass = props.editInfo.cid
            formData.value.bigClass = 0
            formData.value.smallClass = props.editInfo.name
            getSmallClassificationData()

        } else {
            formRef.value.resetFields()
        }
    })



    interface FormData {
        bigClass: number | string
        smallClass: string
    }
    const formData = ref<FormData>({
        bigClass: 0,
        smallClass: ''
    })


    //校验规则
    const rules = ref({
        bigClass: [{ required: true, message: '请选择大分类', trigger: 'blur' }],
        smallClass: [{ required: true, message: '请选择小分类', trigger: 'blur' }],
    })

    //保存
    const handleSave = () => {
        if (!formRef.value) return
        formRef.value.validate((valid: any) => {
            if (valid) {
                ElMessage.success('校验通过')
                isEditTemplate.value = false
            } else {

            }
        })

    }

    //表单对象
    const formRef = ref<any>()

    //获取小分类
    const smallTemplateList = ref<any[]>([])
    const getSmallClassificationData = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                cid: formData.value.bigClass,
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
                smallTemplateList.value = res.data.rows
            } else {

                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log("🚀 ~ getSmallClassificationData ~ err:", err)
        }

    }

</script>

<style lang="scss" scoped></style>