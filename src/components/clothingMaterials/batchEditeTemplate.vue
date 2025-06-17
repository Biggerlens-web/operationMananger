<template>
    <el-dialog :model-value="dialogBatchEdite" width="500" title="批量编辑素材" :before-close="handleClose">

        <div class="dialog-content">
            <div class="dialog_input">
                <span>所属类</span>
                <el-select v-model="formData.clothingMaterialsId" placeholder="请选择">
                    <el-option v-for="item in typeList" :label="item.name" :value="item.id" :key="item.id" />

                </el-select>
            </div>
            <div class="dialog_input">
                <span>是否付费</span>
                <el-switch v-model="formData.pay" active-text="付费" inactive-text="免费" :active-value="1"
                    :inactive-value="0"></el-switch>
            </div>
            <div class="dialog_input">
                <span>关联运营类</span>
                <el-checkbox-group v-model="formData.operationClassId">
                    <el-checkbox v-for="item in opreationType" :label="item.name" :value="item.id" :key="item.id" />
                </el-checkbox-group>
            </div>
        </div>


        <div class="dialog-footer">
            <el-button type="primary" @click="handleComfirm">确认</el-button>
            <el-button @click="handleClose">取消</el-button>
        </div>




    </el-dialog>
</template>

<script lang="ts" setup>
    import service from '@/axios';
    import { desEncrypt } from '@/utils/des';
    import { ElMessage } from 'element-plus';
    import { reactive, ref, watch, toRaw } from 'vue';

    const dialogBatchEdite = defineModel('dialogBatchEdite')

    const props = defineProps<{
        chosedItem: any
    }>()
    const emit = defineEmits<{
        'update': []
    }>()
    const formData = reactive<any>({
        clothingMaterialsId: '',
        operationClassId: [],
        pay: 0,
    })
    const handleClose = () => {
        dialogBatchEdite.value = false

    }
    const handleComfirm = async () => {

        try {
            const params = {
                timestamp: Date.now(),
                ids: toRaw(props.chosedItem),
                pay: formData.pay,
                clothingMaterialsId: formData.clothingMaterialsId,
                operationClassId: formData.operationClassId.join(','),
            }
            console.log('保存编辑啊参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/clothingMaterialsDetail/saveBatchUpdate', {
                enData
            })
            console.log('批量编辑保存', res);
            if (res.data.code === 200) {
                ElMessage({
                    message: '批量编辑成功',
                    type: 'success',
                })
                emit('update')
                handleClose()
            } else {
                ElMessage({
                    message: '批量编辑失败',
                    type: 'error',
                })
            }
        } catch (err) {

        }

    }

    //获取选项信息
    const typeList = ref<any>()
    const opreationType = ref<any>()
    const getSelectData = async () => {
        try {

            const ids = toRaw(props.chosedItem)
            const params = {
                ids,
                timestamp: Date.now()
            }

            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/clothingMaterialsDetail/batchUpdateEdit', {
                enData
            })
            console.log('获取选择信息', res);
            typeList.value = res.data.data.clothingMaterials
            opreationType.value = res.data.data.operationClassArr
        } catch (err) {
            console.log('获取选择信息失败', err);



        }
    }

    watch(() => dialogBatchEdite.value, async (newVal, oldVal) => {
        if (newVal) {
            await getSelectData()
        }
    })

</script>

<style lang="scss" scoped>
    .dialog-content {
        display: flex;
        flex-direction: column;
        gap: 20px; // 设置子元素之间的间距
        margin-bottom: 20px;
    }

    .dialog_input {
        display: flex;
        align-items: center;
        gap: 10px; // 设置标签和输入框之间的间距

        span {
            width: 80px; // 固定标签宽度，使输入框对齐
            text-align: right;
        }

        .el-input {
            flex-grow: 1; // 让输入框占据剩余空间
        }

        .el-switch {
            flex-grow: 1;
        }
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px; // 设置按钮之间的间距
    }
</style>