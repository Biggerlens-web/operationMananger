<template>
    <el-dialog :model-value="dialogVisible" width="1300" title="公共空间" :before-close="handleClose">
        <div class="template-container">
            <draggable v-model="templateList" group="templates" @start="onDragStart" @end="onDragEnd" item-key="id"
                class="draggable-list">
                <template #item="{ element, index }">
                    <div class="template-card" :class="{ 'dragging': isDragging }">
                        <div class="card-header">
                            <span class="template-id">{{ element.id }}</span>
                        </div>
                        <div class="card-image">
                            <img :src="element.image" :alt="element.title" />
                        </div>
                        <div class="card-actions">
                            <el-button size="small" type="primary" @click="handleEdit(element)">编辑</el-button>
                            <el-button size="small">其他尺寸</el-button>
                            <el-button size="small" type="danger">模板前景</el-button>
                        </div>
                    </div>
                </template>
            </draggable>
        </div>

        <template #footer>
            <el-button type="primary" @click="uploadPublic">同步上传至公共空间</el-button>
            <el-button type="primary" @click="handleClose">取消</el-button>
        </template>
    </el-dialog>
    <stickerTemplateEditor :editInfo="editInfo" v-model:dialogEditor="dialogEditor" />
</template>

<script lang="ts" setup>
    import service from '@/axios'
    import { useCounterStore } from '@/stores/counter'
    import { desEncrypt } from '@/utils/des'
    import { storeToRefs } from 'pinia'
    import { watch, ref } from 'vue'
    import { useRoute } from 'vue-router'
    import draggable from 'vuedraggable'
    import stickerTemplateEditor from '../clothingMaterials/stickerTemplateEditor.vue'
    const route = useRoute()

    const stores = useCounterStore()
    const { defaultAppNo, showLoading } = storeToRefs(stores)
    const dialogVisible = defineModel('dialogVisible', {
        type: Boolean,
        default: false
    })

    // 拖拽相关状态
    const isDragging = ref(false)

    // 模板列表数据
    const templateList = ref<any>([

    ])


    watch(dialogVisible, (newVal, oldVal) => {
        if (newVal) {
            getPublicAreaInfo()
        }
    })
    const handleClose = () => {
        dialogVisible.value = false
    }

    // 拖拽事件处理
    const onDragStart = () => {
        isDragging.value = true
    }

    const onDragEnd = () => {
        isDragging.value = false
        console.log('拖拽结束，新的排序:', templateList.value.map((item: any) => item.id))
    }

    let region: string = ''
    const getPublicAreaInfo = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                templateUpId: parseInt(route.query.id as string)
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.get('/templateUpDetail/publicIndex',
                {
                    params: {
                        enData
                    }
                }
            )
            console.log('获取公共空间', res);
            region = res.data.data.region
        } catch (err) {
            console.log('获取公共空间失败', err);
        } finally {
            showLoading.value = false
        }
    }
    const uploadPublic = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                appNo: defaultAppNo.value,
                region: region.toLowerCase()
            }
            console.log('参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/templateUp/syncPublic', {
                enData
            })
            console.log('上传公共空间', res);
        } catch (err) {
            console.log('上传失败', err);
        } finally {
            showLoading.value = false
        }
    }


    //编辑
    const dialogEditor = ref<boolean>(false)
    const editInfo = ref<any>()
    const handleEdit = (item: any) => {
        console.log('编辑', item);
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