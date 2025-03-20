<template>
    <el-dialog :model-value="dialogVisible" title="分配权限" width="500" :before-close="handleClose">

        <el-tree ref="treeRef" style="max-width: 600px" :data="data" show-checkbox default-expand-all node-key="id"
            highlight-current :props="defaultProps" @check="checkedbox" />

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleComfirm">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    import { ElTree } from 'element-plus'

    const props = defineProps<{
        dialogVisible: boolean
    }>()
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()

    const defaultProps = {
        children: 'children',
        label: 'label',
    }
    interface Tree {
        id: number
        label: string
        children?: Tree[]
    }
    const data: Tree[] = [
        {
            id: 1,
            label: 'Level one 1',
            children: [
                {
                    id: 4,
                    label: 'Level two 1-1',
                    children: [
                        {
                            id: 9,
                            label: 'Level three 1-1-1',
                        },
                        {
                            id: 10,
                            label: 'Level three 1-1-2',
                        },
                    ],
                },
            ],
        },
        {
            id: 2,
            label: 'Level one 2',
            children: [
                {
                    id: 5,
                    label: 'Level two 2-1',
                },
                {
                    id: 6,
                    label: 'Level two 2-2',
                },
            ],
        },
        {
            id: 3,
            label: 'Level one 3',
            children: [
                {
                    id: 7,
                    label: 'Level two 3-1',
                },
                {
                    id: 8,
                    label: 'Level two 3-2',
                },
            ],
        },
    ]

    const checkedbox = (data: any, checkedArr: any) => {
        console.log('data', checkedArr);
    }
    const handleClose = () => {
        emit('update:dialogVisible', false)
    }

    const handleComfirm = () => {
        handleClose()
    }
</script>

<style lang="scss" scoped></style>