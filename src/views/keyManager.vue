<template>
    <div class="key_manager_page">

        <el-card class="filter_card">
            <div class="btn_group">
                <el-button type="primary" @click="handleAddKey">新增密钥</el-button>
                <el-button type="primary" @click="handleBatchAddKey">批量新增</el-button>
                <el-button type="danger" @click="handleBatchDeleteKey">批量删除</el-button>
            </div>
            <div class="search_group">
                <el-input placeholder="请输入密钥名称" v-model="searchText" clearable></el-input>
            </div>
        </el-card>
        <el-card class="content_card">
            <el-tree ref="treeRef" :props="props" show-checkbox :data="data" highlight-current node-key="id"
                :filter-node-method="filterNode" @check="checkedbox">
                <template #default="{ node, data }">
                    <div class="custom-tree-node">
                        <span>{{ node.label }}</span>
                        <div>
                            <el-button type="primary" link @click.stop="addChild(node)" v-if="node.level < 2">
                                新增
                            </el-button>
                            <el-button style="margin-left: 4px" type="danger" link>
                                删除
                            </el-button>
                            <el-button type="primary" link>
                                编辑
                            </el-button>
                        </div>
                    </div>
                </template></el-tree>
        </el-card>
    </div>
    <KeyEditDialog v-model:visible="dialogVisible" :isBatchAdd="isBatchAdd" />
</template>

<script lang="ts" setup>
    import KeyEditDialog from '@/components/keyManager/keyEditDialog.vue'
    import { ref, watch } from 'vue'
    const dialogVisible = ref<boolean>(false)
    const searchText = ref<string>('')
    const props = {
        children: 'nodes',
        label: 'text',
    }
    const treeRef = ref<any>()

    interface TreeNode {
        text: string
        [key: string]: any
        nodes?: TreeNode[]
    }
    const data = ref([
        {
            id: 1, text: '一级 1',
            level: 1,
            nodes: [
                {
                    id: 11, text: '二级 1-1',
                    level: 2

                }
            ]
        },
        {
            id: 2, text: '一级 2',
            level: 1,
            nodes: [
                {
                    id: 21, text: '二级 2-1',
                    level: 2

                }
            ]
        }
    ])

    const filterNode = (value: string, data: TreeNode) => {
        if (!value) return true
        const label = String(data.text ?? '')
        return label.includes(value)
    }

    watch(searchText, (newVal) => {

        treeRef.value?.filter(newVal)





    })
    const isBatchAdd = ref<boolean>(false)
    const handleAddKey = () => {
        isBatchAdd.value = false
        dialogVisible.value = true
    }
    const handleBatchAddKey = () => {
        isBatchAdd.value = true
        dialogVisible.value = true
    }
    const handleBatchDeleteKey = () => {
        console.log(treeRef.value!.getCheckedKeys())
    }


    const checkedbox = (checkedKeys: string[]) => {
        console.log(checkedKeys)
    }


    const addChild = (node: TreeNode) => {

        isBatchAdd.value = true
        dialogVisible.value = true

    }
</script>

<style lang="scss" scoped>
    .key_manager_page {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        height: 100%;

        .filter_card {
            height: max-content;

            .btn_group {
                margin-bottom: 10px;
            }
        }

        .content_card {
            flex: 1;
            overflow-y: scroll;




            .custom-tree-node {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 14px;
                padding-right: 8px;
            }
        }
    }
</style>