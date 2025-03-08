<template>
    <div class="view">

        <div class="page-header">

            <el-button type="primary" :icon="Plus">新增模板</el-button>
        </div>

        <el-card class="filter-card">
            <div class="filter-box">
                <div class="filter-item">
                    <span class="label">应用:</span>
                    <el-select v-model="activeApp" placeholder="请选择应用" clearable class="filter-select">
                        <el-option v-for="item in appList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </div>
                <!-- <div class="filter-actions">
                    <el-button type="primary">查询</el-button>
                    <el-button>重置</el-button>
                </div> -->
            </div>
        </el-card>


        <el-card class="content-card">
            <component :is="componentId" @goDetail="goDetail"></component>
        </el-card>


    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue'
    import { Plus } from '@element-plus/icons-vue'
    import subCatalogList from '@/components/templates/subCatalogList.vue'
    import catalogList from '@/components/templates/catalogList.vue'
    const componentId = ref(catalogList)
    const components = {
        catalogList,
        subCatalogList
    }
    const componentStr = ref('catalogList')

    const goDetail = (id: number) => {

    }

    // 筛选相关
    interface AppItem {
        id: number
        name: string
    }
    const activeApp = ref('')
    const appList = ref<AppItem[]>([
        { id: 1, name: '123123' },
        { id: 2, name: '123123' },
        { id: 3, name: '123123' },
        { id: 4, name: '123123' },
        { id: 5, name: '123123' },
        { id: 6, name: '123123' },
        { id: 7, name: '123123' },
        { id: 8, name: '123123' },
        { id: 9, name: '123123' },
        { id: 10, name: '123123' }
    ])



</script>

<style lang="scss" scoped>
    .view {
        min-height: 100%;
    }

    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }

    .page-header h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
        color: #1f2f3d;
    }

    .filter-card {
        margin-bottom: 16px;
    }

    .filter-box {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        align-items: flex-start;
    }

    .filter-item {
        display: flex;
        align-items: center;
        margin-right: 24px;
    }

    .filter-item .label {
        margin-right: 8px;
        color: #606266;
        font-size: 14px;
    }

    .filter-select {
        width: 200px;
    }

    .filter-actions {
        margin-left: auto;
    }

    .content-card {
        height: 680px;
        overflow-y: scroll;
    }
</style>