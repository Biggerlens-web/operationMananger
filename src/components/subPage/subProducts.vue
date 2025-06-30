<template>
    <el-dialog :model-value="showEditor" title="编辑商品排序" width="90%" :before-close="handleClose"
        style="max-width: 600px; min-width: 400px;">
        <div class="product-sort-container">
            <draggable v-model="localProductList" item-key="id" class="product-list" ghost-class="ghost"
                chosen-class="chosen" drag-class="drag" @start="onDragStart" @end="onDragEnd">
                <template #item="{ element, index }">
                    <div class="product-item">
                        <div class="drag-handle">
                            <el-icon>
                                <Rank />
                            </el-icon>
                        </div>
                        <div class="product-info">

                            <div class="product-details">
                                <div class="product-name">{{ `${element.productName}:${element.productId}` }}</div>

                            </div>
                        </div>

                        <div class="delete-btn" @click="handleDeleteProduct(index)">
                            <el-icon>
                                <Close />
                            </el-icon>
                        </div>
                    </div>
                </template>
            </draggable>

            <div class="empty-state" v-if="!localProductList || localProductList.length === 0">
                <el-empty description="暂无商品数据" />
            </div>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleSave">保存排序</el-button>
                <el-button type="primary" @click="handleAddProduct">新增商品</el-button>
            </div>
        </template>
    </el-dialog>
    <el-dialog v-model="showAddProduct" title="新增商品" width="500">
        <el-form :model="addProductForm" ref="addProductFormRef">
            <el-form-item label="商品类型" prop="productType">

                <el-select v-model="addProductForm.productType">
                    <el-option v-for="item in productInfoList" :key="item.value" :label="item.note" :value="item.value">
                    </el-option>
                </el-select>


            </el-form-item>
            <el-form-item label="商品编码" prop="productId">
                <el-input v-model="addProductForm.productId" />
            </el-form-item>
            <el-form-item label="商品名称" prop="productName">
                <el-input v-model="addProductForm.productName" />
            </el-form-item>

        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="comfirmAddProduct">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    import { computed, ref, watch } from 'vue'
    import draggable from 'vuedraggable'
    import { Sort, Rank, Close } from '@element-plus/icons-vue'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { desEncrypt } from '@/utils/des'
    import service from '@/axios'

    const showEditor = defineModel('showEditor', {
        type: Boolean,
        default: false
    })



    //获取商品信息列表
    const productInfoList = ref<any[]>([])
    const getProductInfo = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                subPageConfigId: props.subPageConfigId
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.get('/subPageConfigHWProducts/edit', {
                params: {
                    enData
                }
            })
            console.log('获取商品信息', res);
            productInfoList.value = res.data.data.productTypes
            localProductList.value = [...res.data.data.hwProducts]
        } catch (err) {
            console.log('获取商品信息失败', err);

        }



    }




    const props = defineProps<{
        sortProductList: any[]
        subPageConfigId: any
    }>()



    watch(() => props.subPageConfigId, () => {
        getProductInfo()
    })







    const emit = defineEmits<{
        save: []
    }>()




    // 本地商品列表副本，用于拖拽操作
    const localProductList = ref<any[]>([])
    const isDragging = ref(false)

    // 监听props变化，更新本地列表
    watch(() => props.sortProductList, (newList) => {
        if (newList && Array.isArray(newList)) {
            localProductList.value = [...newList]
        }
    }, { immediate: true, deep: true })

    // 拖拽开始
    const onDragStart = () => {
        isDragging.value = true
    }

    // 拖拽结束
    const onDragEnd = () => {
        isDragging.value = false
    }

    // 删除商品
    const handleDeleteProduct = async (index: number) => {
        try {
            await ElMessageBox.confirm(
                `确定要删除商品吗？`,
                '删除确认',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
            localProductList.value.splice(index, 1)
            ElMessage.success('商品删除成功')
        } catch {
            // 用户取消删除
        }
    }



    //新增商品
    const showAddProduct = ref<boolean>(false)
    const addProductForm = ref<any>({
        subPageConfigId: computed(() => props.subPageConfigId),
        productType: '',
        productId: '',
        productName: ''
    })
    const handleAddProduct = () => {
        console.log('新增商品');
        showAddProduct.value = true
    }
    const comfirmAddProduct = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                type: 'add',
                subPageConfigId: addProductForm.value.subPageConfigId,
                productType: addProductForm.value.productType,
                productId: addProductForm.value.productId,
                productName: addProductForm.value.productName,
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/subPageConfigHWProducts/save', {
                enData
            })
            if (res.data.code === 200) {
                ElMessage.success('新增商品成功')
                showAddProduct.value = false
                getProductInfo()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('新增失败', err);
        }
    }


    // 保存排序
    const handleSave = async () => {
        try {


            const sort = localProductList.value.map((item: any) => {
                return item.id


            })
            const params = {
                timestamp: Date.now(),
                subPageConfigId: props.subPageConfigId,
                sort: sort
            }


            console.log('排序保存参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/subPageConfigHWProducts/saveSort', {
                enData
            })
            if (res.data.code === 200) {
                emit('save')
                ElMessage.success('商品排序已保存')
                handleClose()
            }
        } catch (err) {
            console.log('保存失败', err);
        }

    }

    // 关闭弹窗
    const handleClose = () => {
        showEditor.value = false
        // 重置本地列表
        if (props.sortProductList && Array.isArray(props.sortProductList)) {
            localProductList.value = [...props.sortProductList]
        }
    }
</script>

<style lang="scss" scoped>
    .product-sort-container {
        max-height: 500px;
        overflow-y: auto;
        overflow-x: hidden; // 防止横向滚动
        width: 100%;

        .sort-tip {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
            padding: 12px;
            background: #f5f7fa;
            border-radius: 6px;
            color: #606266;
            font-size: 14px;
            word-wrap: break-word;

            .el-icon {
                color: #409eff;
                flex-shrink: 0;
            }
        }

        .product-list {
            width: 100%;
            box-sizing: border-box;

            .product-item {
                position: relative;
                display: flex;
                align-items: center;
                padding: 8px 24px 8px 12px; // 右侧增加padding为删除按钮留空间
                margin-bottom: 8px;
                background: #fff;
                border: 1px solid #e4e7ed;
                border-radius: 8px;
                cursor: move;
                transition: all 0.3s ease;
                min-width: 0; // 允许flex子元素收缩
                overflow: visible; // 确保删除按钮可见

                &:hover {
                    border-color: #409eff;
                    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);

                    .delete-btn {
                        opacity: 1;
                    }
                }

                .drag-handle {
                    flex-shrink: 0;
                    margin-right: 8px;
                    color: #c0c4cc;
                    cursor: grab;

                    &:active {
                        cursor: grabbing;
                    }

                    .el-icon {
                        font-size: 14px;
                    }
                }

                .product-info {
                    display: flex;
                    align-items: center;
                    flex: 1;
                    gap: 8px;
                    min-width: 0; // 允许收缩

                    .product-image {
                        flex-shrink: 0;
                        width: 40px;
                        height: 40px;
                        border-radius: 6px;
                        overflow: hidden;
                        background: #f5f7fa;

                        img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    }

                    .product-details {
                        flex: 1;
                        min-width: 0; // 允许收缩
                        overflow: hidden;

                        .product-name {
                            font-size: 13px;
                            font-weight: 500;
                            color: #303133;
                            margin-bottom: 2px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            line-height: 1.4;
                        }

                        .product-price {
                            font-size: 12px;
                            color: #f56c6c;
                            font-weight: 600;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }

                .sort-number {
                    flex-shrink: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #409eff;
                    color: white;
                    border-radius: 50%;
                    font-size: 11px;
                    font-weight: 600;
                    margin-left: 8px;
                }

                .delete-btn {
                    position: absolute;
                    top: 50%;
                    right: 4px;
                    width: 18px;
                    height: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f56c6c;
                    color: white;
                    border-radius: 50%;
                    cursor: pointer;
                    opacity: 0;
                    transition: all 0.3s ease;
                    z-index: 10;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    transform: translateY(-50%);

                    &:hover {
                        background: #f78989;

                    }

                    .el-icon {
                        font-size: 10px;
                    }
                }
            }

            // 拖拽样式
            .ghost {
                opacity: 0.5;
                background: #f5f7fa;
                border: 2px dashed #409eff;
            }

            .chosen {
                transform: scale(1.02);
                box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
            }

            .drag {
                transform: rotate(5deg);
                opacity: 0.8;
            }
        }

        .empty-state {
            padding: 40px 0;
            text-align: center;
        }
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
    }

    // 滚动条样式
    .product-sort-container::-webkit-scrollbar {
        width: 6px;
    }

    .product-sort-container::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }

    .product-sort-container::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;

        &:hover {
            background: #a8a8a8;
        }
    }


    // 响应式设计
    @media (max-width: 768px) {
        .product-sort-container {
            .product-list {
                .product-item {
                    padding: 6px 20px 6px 8px; // 移动端也为删除按钮留空间

                    .product-info {
                        gap: 6px;

                        .product-image {
                            width: 35px;
                            height: 35px;
                        }

                        .product-details {
                            .product-name {
                                font-size: 12px;
                            }

                            .product-price {
                                font-size: 11px;
                            }
                        }
                    }

                    .sort-number {
                        width: 18px;
                        height: 18px;
                        font-size: 10px;
                    }

                    .delete-btn {
                        width: 16px;
                        height: 16px;
                        top: 3px;
                        right: 3px;

                        .el-icon {
                            font-size: 9px;
                        }
                    }
                }
            }
        }
    }
</style>