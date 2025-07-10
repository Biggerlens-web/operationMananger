<template>
    <el-dialog :model-value="dialogVisible" width="1300" title="公共空间" :before-close="handleClose">
        <div class="template-container">
            <draggable v-model="templateList" group="templates" @start="onDragStart" @end="onDragEnd" item-key="id"
                class="draggable-list">
                <template #item="{ element, index }">
                    <div class="template-card" :class="{ 'dragging': isDragging }">
                        <div class="card-header">
                            <el-checkbox v-model="element.isSelected" class="template-checkbox" />
                            <span class="template-id">{{ element.id }}</span>
                        </div>
                        <div class="card-image">
                            <img :src="element.coverUrl" :alt="element.title" />
                        </div>
                        <div class="card-actions">
                            <el-button size="small" type="primary" @click="handleEdit(element)">编辑</el-button>

                        </div>
                    </div>
                </template>
            </draggable>
        </div>

        <template #footer>
            <div style="display: flex;flex: 1;justify-content: flex-end;column-gap: 12px;">
                <el-upload action="#" :show-file-list="false" :http-request="importTemplate" accept=".json">
                    <el-button style="margin: 0;" type="primary">导入</el-button>
                </el-upload>
                <el-button style="margin: 0;" type="primary" @click="assign">分配</el-button>
                <el-button style="margin: 0;" type="primary" @click="checkALl">全部选中</el-button>
                <el-button style="margin: 0;" type="danger" @click="deleteChosed">删除所选</el-button>
                <el-button style="margin: 0;" type="primary" @click="saveChange">保存改动</el-button>
                <el-button style="margin: 0;" type="primary" @click="handleClose">取消</el-button>
            </div>

        </template>
    </el-dialog>
    <watermarkEditor v-model:dialogVisible="dialogEditor" :editInfo="editInfo" :isPublic="true" />

</template>

<script lang="ts" setup>
    import service from '@/axios'
    import forceTemplate from '@/components/templates/forceTemplate.vue'
    import sizeEdit from '@/components/templates/sizeEdit.vue'
    import { useCounterStore } from '@/stores/counter'
    import { desEncrypt } from '@/utils/des'
    import { storeToRefs } from 'pinia'
    import { watch, ref } from 'vue'
    import { useRoute } from 'vue-router'
    import draggable from 'vuedraggable'
    import watermarkEditor from './watermarkEditor.vue'
    import { ElMessage } from 'element-plus'
    import type { UploadRequestOptions } from 'element-plus'
    const route = useRoute()

    const stores = useCounterStore()
    const { defaultAppNo, showLoading } = storeToRefs(stores)
    const dialogVisible = defineModel('dialogVisible', {
        type: Boolean,
        default: false
    })
    const props = defineProps<{
        region: string
    }>()
    // 拖拽相关状态
    const isDragging = ref(false)

    // 模板列表数据
    const templateList = ref<any>([

    ])



    //模板前景
    const dialogForceTemplate = ref<boolean>(false)
    const parentTemplateId = ref<any>()
    const showForceTemplate = (item: any) => {
        parentTemplateId.value = item.id
        dialogForceTemplate.value = true
    }

    const checkall = ref(false)
    const checkALl = () => {
        checkall.value = !checkall.value
        if (!checkall.value) {
            templateList.value.forEach((item: any) => {
                item.isSelected = false
            })
        } else {
            templateList.value.forEach((item: any) => {
                item.isSelected = true
            })
        }

    }

    //删除所选
    const deleteChosed = () => {
        templateList.value = templateList.value.filter((item: any) => !item.isSelected)
    }



    const getTemplateList = async () => {
        try {
            showLoading.value = true
            const params = {
                timestamp: Date.now(),
                appNo: defaultAppNo.value,
                region: props.region,
                isPublic: true,
            }
            const enData = desEncrypt(JSON.stringify(params))

            const res = await service.post('/watermark/list', {
                enData
            })
            console.log('公共空间列表', res);
            res.data.rows.forEach((item: any) => {
                item.isSelected = false
            })
            templateList.value = res.data.rows

            console.log('templateList', templateList.value);
        } catch (err) {
            console.log('获取公共空间列表失败', err);
        } finally {
            showLoading.value = false
        }
    }






    const templateUpId = ref<number>(0)
    const getPublicAreaInfo = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                appNo: defaultAppNo.value,
                region: props.region,
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/templateUp/getPublicAreaInfo', {
                enData
            })
            templateUpId.value = res.data.data.templateUpId
        } catch (err) {

        }
    }



    watch(dialogVisible, async (newVal, oldVal) => {
        if (newVal) {
            // await getPublicAreaInfo()
            getTemplateList()
        }
    })
    const handleClose = () => {
        dialogVisible.value = false
    }

    //保存改动
    const saveChange = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                appNo: defaultAppNo.value,
                isPublic: true,
                region: props.region,
                templateIds: templateList.value.map((item: any) => item.id)
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/watermark/saveItem', {
                enData
            })
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
                getTemplateList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('保存失败', err);
        } finally {
            showLoading.value = false
        }
    }



    // 拖拽事件处理
    const onDragStart = () => {
        isDragging.value = true
    }

    const onDragEnd = () => {
        isDragging.value = false
        console.log('拖拽结束，新的排序:', templateList.value.map((item: any) => item.id))
    }

    //导入
    const importTemplate = async (options: UploadRequestOptions) => {
        console.log('options', options);
        const { file } = options
        showLoading.value = true
        try {
            const form = new FormData()
            form.append('templates', file)
            form.append('region', props.region)
            form.append('appNo', defaultAppNo.value as string)

            const res = await service.post('/watermark/importWatermark', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log('导入模板');
            if (res.data.code === 200) {
                ElMessage.success('导入成功')
                getTemplateList()
            } else {
                ElMessage.error(res.data.msg)

            }
        } catch (err) {
            console.log('导入失败', err);
        } finally {
            showLoading.value = false
        }
    }


    //分配
    const assign = async () => {
        try {
            showLoading.value = true
            const isSelectedList = templateList.value.filter((item: any) => item.isSelected)
            if (isSelectedList.length === 0) {
                ElMessage.error('请选择模板')
                return
            }
            const params = {
                timestamp: Date.now(),
                region: props.region,
                templateIds: isSelectedList.map((item: any) => item.id),
            }
            console.log('分配参数', params);
            const enData = desEncrypt(JSON.stringify(params))

            const res = await service.post('/watermark/copyTemplate', {
                enData
            })
            console.log('分配', res);
            if (res.data.code === 200) {
                ElMessage.success('分配成功')
                getTemplateList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('分配失败', err);
        } finally {
            showLoading.value = false
        }
    }





    //编辑
    const dialogEditor = ref<boolean>(false)
    watch(() => dialogEditor.value, (newV) => {
        if (!newV) {
            editInfo.value = ''
            getTemplateList()
        }
    })
    const editInfo = ref<any>()
    const handleEdit = (item: any) => {
        console.log('编辑', item);
        editInfo.value = item
        dialogEditor.value = true
    }





    //其他尺寸
    const dialogSizeEdit = ref<boolean>(false)
    watch(() => dialogSizeEdit.value, (newV) => {
        if (!newV) {
            isAddChild.value = ''
        }

    })
    const showSizeEdit = (item: any) => {
        console.log('item', item);
        editInfo.value = ''
        isAddChild.value = item.id
        console.log('isAddChild.value', isAddChild.value);
        dialogSizeEdit.value = true
    }
    const isAddChild = ref<any>('')
    const addChildTemplate = () => {

        dialogEditor.value = true
    }
    //编辑子模板
    const editChildTemplate = (item: any) => {
        editInfo.value = item
        dialogEditor.value = true
    }
</script>

<style lang="scss" scoped>
    .template-container {
        max-height: 600px;
        overflow-y: auto;
        padding: 20px;
    }

    .draggable-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 16px;
        padding: 0;
    }

    .template-card {
        background: white;
        border: 1px solid #e4e7ed;
        border-radius: 8px;
        overflow: hidden;
        transition: all 0.3s ease;
        cursor: move;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        &:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateY(-2px);
        }

        &.dragging {
            opacity: 0.8;
        }
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: #f5f7fa;
        border-bottom: 1px solid #e4e7ed;
        position: relative;

        .template-checkbox {
            position: absolute;
            left: 8px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;

            :deep(.el-checkbox__input) {
                .el-checkbox__inner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid #dcdfe6;
                    border-radius: 3px;
                    background-color: #fff;

                    &:hover {
                        border-color: #409eff;
                    }
                }

                &.is-checked .el-checkbox__inner {
                    background-color: #409eff;
                    border-color: #409eff;

                    &::after {
                        border: 1px solid #fff;
                        border-left: 0;
                        border-top: 0;
                        height: 7px;
                        left: 4px;
                        top: 1px;
                        width: 3px;
                    }
                }
            }
        }

        .template-id {
            font-size: 12px;
            color: #409eff;
            font-weight: 500;
            margin-left: 24px; // 为复选框留出空间
        }

        .template-status {
            font-size: 10px;
            color: #67c23a;
            background: #f0f9ff;
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid #b3d8ff;
        }
    }

    .card-image {
        width: 100%;
        height: 220px;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            transition: transform 0.3s ease;
        }

        &:hover img {
            transform: scale(1.05);
        }
    }

    .card-content {
        padding: 12px;

        .template-title {
            font-size: 14px;
            font-weight: 500;
            color: #303133;
            margin-bottom: 4px;
            line-height: 1.4;
        }

        .template-price {
            font-size: 12px;
            color: #f56c6c;
            font-weight: 600;
        }
    }

    .card-actions {
        padding: 8px 12px;
        border-top: 1px solid #f0f0f0;
        display: flex;
        gap: 4px;

        .el-button {
            flex: 1;
            font-size: 12px;
            padding: 4px 8px;
        }
    }

    /* 拖拽时的样式 */
    .sortable-ghost {
        opacity: 0.5;
    }

    .sortable-chosen {
        transform: scale(1.02);
    }

    .sortable-drag {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }

    /* 滚动条样式 */
    .template-container::-webkit-scrollbar {
        width: 6px;
    }

    .template-container::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }

    .template-container::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;

        &:hover {
            background: #a8a8a8;
        }
    }
</style>