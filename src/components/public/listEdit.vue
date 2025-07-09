<template>
    <el-dialog :model-value="dialogVisable" title="添加数据" width="600" :before-close="handleClose">
        <div class="list-edit-container">
            <div v-for="(item, index) in list" :key="index" class="list-item">
                <el-input v-model="item.name" placeholder="请输入名称" class="item-input"></el-input>
                <el-button type="danger" size="small" @click="removeItem(index)" class="delete-btn">
                    删除
                </el-button>
            </div>
            <div class="add-item">
                <el-button type="primary" @click="addItem" class="add-btn">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    添加一行
                </el-button>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleConfirm">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    import { watch, ref } from 'vue';
    import { Plus } from '@element-plus/icons-vue';



    const props = defineProps<{
        listInfo: any
    }>()

    const emit = defineEmits<{
        confirm: [value: any]
    }>()

    const list = ref<any>([])
    const dialogVisable = defineModel('dialogVisable')

    watch(() => dialogVisable.value, (newV) => {
        if (newV) {
            if (props.listInfo) {
                try {
                    list.value = JSON.parse(props.listInfo).map((item: any) => {
                        return {
                            name: item
                        }
                    })
                } catch {
                    list.value = []
                }
            } else {
                list.value = []
            }
        }
    })

    // 添加项目
    const addItem = () => {
        list.value.push({ name: '' })
    }

    // 删除项目
    const removeItem = (index: number) => {
        list.value.splice(index, 1)
    }

    // 确认操作
    const handleConfirm = () => {
        const validList = list.value.filter((item: any) => item.name.trim() !== '')
        emit('confirm', validList)
        dialogVisable.value = false
    }

    // 关闭弹窗
    const handleClose = () => {
        dialogVisable.value = false
    }
</script>

<style lang="scss" scoped>
    .list-edit-container {
        max-height: 400px;
        overflow-y: auto;
        padding: 10px 0;
    }

    .list-item {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
        padding: 8px;
        border: 1px solid #e4e7ed;
        border-radius: 6px;
        background-color: #fafafa;
        transition: all 0.3s ease;

        &:hover {
            border-color: #409eff;
            background-color: #f0f9ff;
        }
    }

    .item-input {
        flex: 1;
    }

    .delete-btn {
        flex-shrink: 0;
        min-width: 60px;
    }

    .add-item {
        display: flex;
        justify-content: center;
        padding: 16px 0;
        border-top: 1px dashed #dcdfe6;
        margin-top: 8px;
    }

    .add-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;

        .el-icon {
            font-size: 14px;
        }
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
    }

    // 滚动条样式优化
    .list-edit-container::-webkit-scrollbar {
        width: 6px;
    }

    .list-edit-container::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }

    .list-edit-container::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;

        &:hover {
            background: #a8a8a8;
        }
    }
</style>