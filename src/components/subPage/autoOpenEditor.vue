<template>
    <el-dialog :model-value="showEditor" title="编辑自动打开方案" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>


            <el-form-item label="编码" prop="autoOpenId">
                <el-input v-model="formData.autoOpenId" />
            </el-form-item>
            <el-form-item label="名称" prop="autoOpenName">
                <el-input v-model="formData.autoOpenName" />
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
    import { ElMessage } from 'element-plus';
    import { storeToRefs } from 'pinia';
    import { computed, ref, watch } from 'vue'
    const props = defineProps<{
        showEditor: boolean
        subPageConfigId: number
        plansArr: any
    }>()

    const counterStore = useCounterStore()
    const { channelList, showLoading } = storeToRefs(counterStore)
    const emit = defineEmits<{
        'update:showEditor': [value: boolean]
    }>()
    const formData = ref<any>({
        subPageConfigId: computed(() => props.subPageConfigId),

        autoOpenId: '',

        autoOpenName: '',

    })


    const ruleFormRef = ref<any>(null)
    const rules = ref({

    })

    const resetForm = () => {
        formData.value = {
            subPageConfigId: computed(() => props.subPageConfigId),
            autoOpenId: '',

            autoOpenName: '',
        }
        ruleFormRef.value?.resetFields()
    }
    const handleClose = () => {
        resetForm()
        emit('update:showEditor', false)
    }

    const saveChange = async () => {
        try {


            const ishave = props.plansArr.find((item: any) => item.autoOpenId == formData.value.autoOpenId)
            if (ishave) {
                ElMessage.error('编码已存在')
                return
            }
            const params = {
                timestamp: Date.now(),
                autoOpenId: formData.value.autoOpenId,
                autoOpenName: formData.value.autoOpenName,
                subPageConfigId: formData.value.subPageConfigId,
                "type": 'add'
            }
            console.log('参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/subPageConfigAutoOpen/save', {
                enData
            })
            console.log('res', res);
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
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
                saveChange()
            }
        })
    }
</script>

<style lang="scss" scoped></style>