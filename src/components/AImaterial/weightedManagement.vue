<template>
    <div>
        <el-table :data="tableData" style="width: 100%" height="650">
            <el-table-column prop="name" label="权重名称" width="180" />
            <el-table-column prop="weight" label="权重值" />
            <el-table-column fixed="right" label="操作" width="120">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click="handleClick(scope.row)">
                        Edit
                    </el-button>

                </template>
            </el-table-column>
        </el-table>
    </div>
    <editWeight v-model:dialogVisible="dialogVisible" :functionValue="functionValue" />
</template>

<script lang="ts" setup>
    import { onActivated, ref } from 'vue'
    import editWeight from './editWeight.vue'
    const dialogVisible = ref<boolean>(false)


    interface Props {
        functionValue: string | number
        searchParams: any
    }
    const props = defineProps<Props>()
    // 权重管理数据数组
    const tableData = [
        {
            name: '高优先级素材',
            weight: 10
        },
        {
            name: '中优先级素材',
            weight: 5
        },
        {
            name: '低优先级素材',
            weight: 2
        },
        {
            name: '默认素材',
            weight: 1
        },
        {
            name: '特殊推荐素材',
            weight: 15
        },
        {
            name: '季节性素材',
            weight: 8
        },
        {
            name: '热门素材',
            weight: 12
        },
        {
            name: '新上架素材',
            weight: 6
        }
    ]


    const handleClick = (row: any) => {
        console.log(row)
        dialogVisible.value = true
    }


    const getWeightData = async () => {
        try {
            console.log('权重管理数据', props.searchParams);
        } catch (err) {

        }
    }

    onActivated(() => {
        getWeightData()
    })

    defineExpose({
        getWeightData
    })
</script>

<style lang="scss" scoped></style>