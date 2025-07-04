<template>
    <el-dialog :model-value="dialogBatchEdite" width="500" title="批量编辑素材" :before-close="handleClose">

        <div class="dialog-content">
            <div class="dialog_input">
                <span>所属类</span>
                <el-select v-model="formData.clothingMaterialsId" placeholder="请选择">
                    <el-option v-for="item in typeList" :label="item.name" :value="item.id" :key="item.id" />
                </el-select>
            </div>

            <div class="dialog_input" v-if="route.query.type === 'template'">
                <span>版本号</span>
                <el-input v-model="formData.version" placeholder="请输入版本号">

                </el-input>
            </div>
            <div class="dialog_input" v-if="route.query.type === 'template'">
                <span>是否推荐模板</span>
                <el-switch v-model="formData.isRecommend" active-text="是" inactive-text="否" :active-value="true"
                    :inactive-value="false"></el-switch>
            </div>
            <div class="dialog_input" v-if="route.query.type === 'mask'">
                <span>vip资源</span>
                <el-switch v-model="formData.isVip" active-text="是" inactive-text="否" :active-value="true"
                    :inactive-value="false"></el-switch>
            </div>
            <div class="dialog_input">
                <span>是否付费</span>
                <el-switch v-model="formData.isPay" active-text="付费" inactive-text="免费" :active-value="true"
                    :inactive-value="false"></el-switch>
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
    import { useCounterStore } from '@/stores/counter';
    import { desEncrypt } from '@/utils/des';
    import { ElMessage } from 'element-plus';
    import { storeToRefs } from 'pinia';
    import { reactive, ref, watch, toRaw, version } from 'vue';
    import { useRoute } from 'vue-router';
    const stores = useCounterStore()
    const { showLoading } = storeToRefs(stores)
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
        isPay: false,
        version: '',
        isRecommend: false,
        isVip: false
    })
    const handleClose = () => {
        formData.clothingMaterialsId = ''
        formData.operationClassId = []
        formData.isPay = false
        formData.version = ''
        formData.isRecommend = false
        dialogBatchEdite.value = false

    }
    const handleComfirm = async () => {
        if (showLoading.value) {
            ElMessage.warning('正在保存。。。');
            return
        }
        try {

            const params: any = {
                timestamp: Date.now(),
                ids: toRaw(props.chosedItem),
                isPay: formData.isPay,
                operationClassId: formData.operationClassId.join(','),
            }


            const { type } = route.query
            let url: string = ''
            switch (type) {
                case 'clothing':
                    url = '/clothingMaterialsDetail/saveBatchUpdate'
                    params.clothingMaterialsId = formData.clothingMaterialsId
                    break;
                case 'sitcker':
                    url = '/stickerDetail/saveBatchUpdate'
                    params.stickerId = formData.clothingMaterialsId
                    break;
                case 'background':
                    url = '/backgroundDetail/saveBatchUpdate'
                    params.backId = formData.clothingMaterialsId
                    break;

                case 'template':
                    url = '/templateUpDetail/saveBatchUpdate'
                    params.templateUpId = formData.clothingMaterialsId
                    params.version = formData.version
                    params.isRecommend = formData.isRecommend
                    break

                case 'mask':
                    url = '/maskDetail/saveBatchUpdate'
                    params.maskId = formData.clothingMaterialsId
                    params.isVip = formData.isVip

                case 'wallpapper':
                    url = '/wallpaperDetail/saveBatchUpdate'
                    params.wallpaperId = formData.clothingMaterialsId
            }

            console.log('保存编辑啊参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post(url, {
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

        } finally {
            showLoading.value = false
        }

    }

    //获取选项信息
    const typeList = ref<any>()
    const opreationType = ref<any>()
    const route = useRoute()
    const getSelectData = async () => {
        try {

            const ids = toRaw(props.chosedItem)
            const params = {
                ids,
                timestamp: Date.now()
            }

            console.log('选择信息参数', params);
            const { type } = route.query
            let url: string = ''
            switch (type) {
                case 'clothing':
                    url = '/clothingMaterialsDetail/batchUpdateEdit'
                    break;
                case 'sitcker':
                    url = '/stickerDetail/batchUpdateEdit'
                    break;
                case 'background':
                    url = '/backgroundDetail/batchUpdateEdit'
                    break;
                case 'template':
                    url = '/templateUpDetail/batchUpdateEdit'
                    break;
                case 'mask':
                    url = '/maskDetail/batchUpdateEdit'
                    break
                case 'wallpapper':
                    url = '/wallpaperDetail/batchUpdateEdit'
                    break
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post(url, {
                enData
            })
            console.log('获取选择信息', res);

            switch (type) {
                case 'clothing':
                    typeList.value = res.data.data.clothingMaterials
                    formData.clothingMaterialsId = res.data.data.clothingMaterialsId
                    break;
                case 'sitcker':
                    typeList.value = res.data.data.stickers
                    formData.clothingMaterialsId = res.data.data.stickerId
                    break;
                case 'background':
                    typeList.value = res.data.data.backgrounds
                    formData.clothingMaterialsId = res.data.data.backId
                    break;
                case 'template':
                    typeList.value = res.data.data.templateUps
                    formData.clothingMaterialsId = res.data.data.templateUpId
                    break;
                case 'mask':
                    typeList.value = res.data.data.masks
                    formData.clothingMaterialsId = res.data.data.maskId

                case 'wallpapper':
                    typeList.value = res.data.data.wallpapers
                    formData.clothingMaterialsId = res.data.data.wallpaperId
            }

            opreationType.value = res.data.data.operationClassArr
        } catch (err) {
            console.log('获取选择信息失败', err);

        } finally {
            showLoading.value = false
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