<template>
    <el-dialog :model-value="dialogVisible" width="1300" title="模板前景编辑" :before-close="handleClose">
        <div class="template-container">
            <draggable v-model="templateList" group="templates" @start="onDragStart" @end="onDragEnd" item-key="id"
                class="draggable-list">
                <template #item="{ element, index }">
                    <div class="template-card" :class="{ 'dragging': isDragging }">
                        <div class="checkbox-wrapper" @click.stop>
                            <input type="checkbox" :id="`checkbox-${element.id}`" :checked="element.selected"
                                @change="handleCheckBoxChange($event, element)" class="custom-checkbox" />
                            <label :for="`checkbox-${element.id}`" class="checkbox-label"></label>
                        </div>
                        <div class="card-header">
                            <span class="template-id">{{ 'ID:' + element.id }}</span>
                        </div>
                        <div class="card-image">
                            <img v-lazy="element.imageUrl" :alt="'模板'" />
                        </div>


                    </div>
                </template>
            </draggable>
        </div>




        <template #footer>
            <el-button size="small" type="primary" @click="addChildTemplate">新增模板前景</el-button>
            <el-button size="small" @click="selectAll">全部选中</el-button>
            <el-button size="small" type="danger" @click="deleteSelected">删除所选</el-button>
            <el-button size="small" type="primary" @click="comfirmChange">保存改动</el-button>
        </template>
    </el-dialog>
    <editForceTemplate v-model:dialog-visible="editDialogVisible" :detailId="detailId" />
</template>

<script lang="ts" setup>
    import draggable from 'vuedraggable'
    import editForceTemplate from './editForceTemplate.vue';
    import { computed, ref, watch } from 'vue';

    import { useRoute } from 'vue-router';
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    import { ElMessage } from 'element-plus';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    const stores = useCounterStore()
    const { showLoading } = storeToRefs(stores)


    const dialogVisible = defineModel('dialogVisible', {
        type: Boolean,
        default: false
    })

    watch(() => dialogVisible.value, (newV) => {
        if (newV) {
            getChildList()
        }
    })
    const props = defineProps<{
        parentTemplateId: any
    }>()

    const detailId = computed(() => props.parentTemplateId)
    const handleClose = () => {
        dialogVisible.value = false
    }


    //新增前景模板
    const editDialogVisible = ref<boolean>(false)
    watch(() => editDialogVisible.value, (newV) => {
        console.log('parentTemplateId', props.parentTemplateId, detailId.value);
        if (!newV) {
            getChildList()
        }
    })
    const addChildTemplate = () => {
        editDialogVisible.value = true
    }


    // 拖拽相关状态
    const isDragging = ref(false)
    // 拖拽事件处理
    const onDragStart = () => {
        isDragging.value = true
    }

    const onDragEnd = () => {
        isDragging.value = false
        console.log('拖拽结束，新的排序:', templateList.value.map((item: any) => item.id))
    }

    // 模板列表数据
    const templateList = ref<any>([

    ])
    const route = useRoute()
    const getChildList = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                detailId: props.parentTemplateId
            }
            console.log('参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.get('/templateUpDetailMaterials/list', {
                params: {
                    enData
                }
            })
            console.log('获取前景列表', res);
            templateList.value = res.data.data.list.map((item: any) => ({
                ...item,
                selected: false
            }))

        } catch (err) {
            console.log('获取失败', err);
        } finally {
            showLoading.value = false
        }
    }



    // 自定义复选框变化处理
    const handleCheckBoxChange = (event: Event, item: any) => {
        const target = event.target as HTMLInputElement;
        item.selected = target.checked;
        console.log('复选框状态变化:', item.id, item.selected);
    }

    // 全选/取消全选
    const selectAll = () => {
        const allSelected = templateList.value.every((item: any) => item.selected);
        templateList.value.forEach((item: any) => {
            item.selected = !allSelected;
        });
    }

    // 删除选中项
    const deleteSelected = () => {
        templateList.value = templateList.value.filter((item: any) => !item.selected);



    }

    //保存改动
    const comfirmChange = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                detailId: props.parentTemplateId,
                materialsIds: templateList.value.filter((item: any) => item.selected).map((item: any) => item.id)
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/templateUpDetailMaterials/saveItem', {
                enData
            })
            console.log('保存改动', res);
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('保存改动', err);
        } finally {
            showLoading.value = false
        }
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
        position: relative;

        &:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateY(-2px);
        }

        &.dragging {
            opacity: 0.8;
        }
    }

    .checkbox-wrapper {
        position: absolute;
        top: 8px;
        right: 8px;
        z-index: 10;
        cursor: pointer;
    }

    .custom-checkbox {
        display: none;
    }

    .checkbox-label {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid #ddd;
        border-radius: 4px;
        background-color: rgba(255, 255, 255, 0.9);
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        backdrop-filter: blur(2px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .checkbox-label:hover {
        border-color: #409eff;
        background-color: rgba(255, 255, 255, 0.95);
        transform: scale(1.05);
    }

    .custom-checkbox:checked+.checkbox-label {
        background-color: #409eff;
        border-color: #409eff;
    }

    .custom-checkbox:checked+.checkbox-label::after {
        content: '';
        position: absolute;
        left: 6px;
        top: 2px;
        width: 4px;
        height: 8px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: #f5f7fa;
        border-bottom: 1px solid #e4e7ed;

        .template-id {
            font-size: 12px;
            color: #409eff;
            font-weight: 500;
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
            object-fit: cover;
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