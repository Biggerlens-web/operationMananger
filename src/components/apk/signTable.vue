<template>
    <div>
        <signEditor v-model:dialog-visible="showSignEditor" :signInfo="signInfo" />
        <h1>
            签名
        </h1>
        <p style="margin: 20px 0px;">
            <el-button type="primary" size="small" @click="handleAdd()">新增</el-button>
        </p>
        <el-table :data="signList" border style="width: 500px" height="650px">
            <el-table-column prop="id" label="编号">
            </el-table-column>
            <el-table-column prop="signName" label="签名名称" />
            <el-table-column prop="alias" label="别名" />
            <el-table-column prop="packageName" label="包名" />
            <el-table-column prop="updateTime" label="更新时间" />
            <el-table-column label="操作" fixed="right" width="80">
                <template #default="scope">
                    <el-button style="margin: 0;" type="text" size="small"
                        @click="handleEditor(scope.row)">编辑</el-button>
                    <el-button style="margin: 0;" type="text" size="small"
                        @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts" setup>
    import { ref, watch } from 'vue';
    import signEditor from './signEditor.vue';
    import { ElMessageBox } from 'element-plus';


    const props = defineProps<{
        signList: any

    }>()
    const emit = defineEmits<{
        'delete': [value: any]
        update: []
    }>()
    //新增签名
    const showSignEditor = ref<boolean>(false)
    watch(() => showSignEditor.value, (newV) => {
        if (!newV) {
            emit('update')
        }
    })




    //新增
    const handleAdd = () => {
        console.log('新增')
        showSignEditor.value = true
    }
    //编辑
    const signInfo = ref<any>()
    const handleEditor = (item: any) => {
        console.log('编辑', item)
        signInfo.value = item
        showSignEditor.value = true
    }
    //删除
    const handleDelete = (item: any) => {
        console.log('删除', item)
        emit('delete', item)
    }
</script>

<style lang="scss" scoped></style>