<template>
    <el-table :data="tableData" border style="width: 100%" height="600px">
        <template v-for="item in filterParams" :key="item.key">
            <el-table-column :prop="item.key" :label="item.note" v-if="item.isShow">
                <template v-if="item.key === 'avatar'" #default="scope">
                    <img :src="scope.row.avatar" alt="">
                </template>
            </el-table-column>
        </template>

        <el-table-column label="操作" fixed="right" width="150">
            <template #default="scope">
                <el-button type="text" size="small" @click="handleEditor(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts" setup>


    const props = defineProps<{
        tableData: any
        filterParams: any
    }>()


    const handleEditor = (item: any) => {
        console.log('编辑', item)
    }
    const handleDelete = (item: any) => {
        console.log('删除', item)
    }

</script>

<style lang="scss" scoped></style>