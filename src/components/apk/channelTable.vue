<template>
    <div>
        <channelEditor v-model:dialog-visible="showChannelEditor" />

        <h1>
            渠道
        </h1>
        <p style="margin: 20px 0px;">
            <el-button type="primary" size="small" @click="handleAdd()">新增</el-button>
        </p>
        <el-table :data="channelList" border style="width: 500px" height="550px" :span-method="objectSpanMethod">
            <el-table-column prop="channelName" label="渠道名">
            </el-table-column>
            <el-table-column prop="channelKey" label="渠道key" />
            <el-table-column prop="channelValue" label="渠道value" />
            <el-table-column prop="description" label="渠道说明" />
            <el-table-column label="操作" fixed="right" width="80">
                <template #default="scope">
                    <!-- <el-button style="margin: 0;" type="text" size="small"
                        @click="handleEditor(scope.row)">编辑</el-button> -->
                    <el-button style="margin: 0;" type="text" size="small"
                        @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts" setup>
    import { ElMessageBox } from 'element-plus';
    import channelEditor from './channelEditor.vue';
    import { ref } from 'vue';

    interface ChannelItem {
        channelName: string;    // 渠道名
        channelKey: string;     // 渠道key
        channelValue: string;   // 渠道value
        description: string;    // 渠道说明
    }
    const channelList = ref<ChannelItem[]>([
        {
            channelName: "百度推广",
            channelKey: "channel_type",
            channelValue: "baidu",
            description: "百度搜索引擎广告投放渠道"
        },
        {
            channelName: "百度推广",
            channelKey: "business_type",
            channelValue: "search",
            description: "百度搜索引擎广告投放渠道"
        },
        {
            channelName: "百度推广",
            channelKey: "priority",
            channelValue: "high",
            description: "百度搜索引擎广告投放渠道"
        },
        {
            channelName: "抖音营销",
            channelKey: "channel_type",
            channelValue: "baidu",
            description: "百度搜索引擎广告投放渠道"
        },
        {
            channelName: "抖音营销",
            channelKey: "priority",
            channelValue: "high",
            description: "百度搜索引擎广告投放渠道"
        },

    ])

    interface SpanMethodProps {
        row: any;
        column: any;
        rowIndex: number;
        columnIndex: number;
    }
    const objectSpanMethod = ({
        row,
        column,
        rowIndex,
        columnIndex,
    }: SpanMethodProps) => {
        // 合并渠道名称、渠道key和描述列
        if (columnIndex === 0) {
            if (rowIndex > 0) {
                // 获取当前行的渠道名称
                const prevRow = channelList.value[rowIndex - 1];
                const currentRow = channelList.value[rowIndex];

                // 如果当前行与上一行的渠道名称相同，则隐藏当前行
                if (prevRow && prevRow.channelName === currentRow.channelName) {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                } else {
                    // 计算接下来有多少行是相同的渠道名称
                    let count = 1;
                    for (let i = rowIndex + 1; i < channelList.value.length; i++) {
                        if (channelList.value[i].channelName === currentRow.channelName) {
                            count++;
                        } else {
                            break;
                        }
                    }
                    // 返回合并的行数
                    return {
                        rowspan: count,
                        colspan: 1
                    };
                }
            } else {
                // 第一行，查找后续相同渠道名称的行数
                const currentRow = channelList.value[0];
                let count = 1;
                for (let i = 1; i < channelList.value.length; i++) {
                    if (channelList.value[i].channelName === currentRow.channelName) {
                        count++;
                    } else {
                        break;
                    }
                }
                return {
                    rowspan: count,
                    colspan: 1
                };
            }
        }
    };



    //新增
    const showChannelEditor = ref<boolean>(false)
    const handleAdd = () => {
        console.log('新增')
        showChannelEditor.value = true
    }
    //编辑
    const handleEditor = (item: any) => {
        console.log('编辑', item)
        showChannelEditor.value = true
    }
    //删除
    const handleDelete = (item: any) => {
        console.log('删除', item)

        ElMessageBox.confirm('确认删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
    }
</script>

<style lang="scss" scoped></style>