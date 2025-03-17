<template>
    <el-tree style="max-width: 600px" :data="data" @node-click="handleNodeClick">

        <template #default="{ node, data }">
            <div v-if="node.level === 1" class="root-node">
                <span>{{ node.label }}</span>
            </div>
            <div v-else class="custom-tree-node">
                <span>{{ node.label }}</span>
                <el-button type="primary" link>
                    查看该应用所有url
                </el-button>
            </div>
        </template>
    </el-tree>
</template>

<script lang="ts" setup>
    interface Tree {
        label: string
        children?: Tree[]
    }

    const handleNodeClick = (data: Tree) => {
        console.log(data)
    }

    const data: Tree[] = [
        {
            label: 'Level one 1',
            children: [
                {
                    label: 'Level two 1-1',
                    children: [
                        {
                            label: 'Level three 1-1-1',
                        },
                    ],
                },
            ],
        },
        {
            label: 'Level one 2',
            children: [
                {
                    label: 'Level two 2-1',
                    children: [
                        {
                            label: 'Level three 2-1-1',
                        },
                    ],
                },
                {
                    label: 'Level two 2-2',
                    children: [
                        {
                            label: 'Level three 2-2-1',
                        },
                    ],
                },
            ],
        },
        {
            label: 'Level one 3',
            children: [
                {
                    label: 'Level two 3-1',
                    children: [
                        {
                            label: 'Level three 3-1-1',
                        },
                    ],
                },
                {
                    label: 'Level two 3-2',
                    children: [
                        {
                            label: 'Level three 3-2-1',
                        },
                    ],
                },
            ],
        },
    ]

    const defaultProps = {
        children: 'children',
        label: 'label',
    }
</script>

<style lang="scss" scoped>

    #main {
        width: 100%;
        height: 710px;
    }

    .custom-tree-node {
        display: flex;
        align-items: center;

        span {
            margin-right: 10px;
        }
    }
</style>