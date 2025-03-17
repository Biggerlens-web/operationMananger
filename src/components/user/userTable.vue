<template>
    <el-table :data="tableData" border style="width: 100%" height="600px">
        <template v-for="item in filterParams" :key="item.key">
            <el-table-column :prop="item.key" :label="item.note" v-if="item.isShow">
                <template v-if="item.key === 'avatar' || item.key === 'thumbnail'" #default="scope">
                    <img :src="scope.row[item.key]" alt="">
                </template>
                <template
                    v-if="item.key === 'isCharged' || item.key === 'showTaobaoPage' || item.key === 'isEnabled' || item.key === 'subscriptionLoginEnabled'"
                    #default="scope">
                    <el-switch v-model="scope.row[item.key]" :active-value="true" :inactive-value="false" />
                </template>

                <template
                    v-if="item.key === 'photoEditTitle' || item.key === 'versionNumber' || item.key === 'taobaoPageLink'"
                    #default="scope">
                    <el-input v-model="scope.row[item.key]" />
                </template>

                <template v-if="item.key === 'price'" #default="scope">
                    <el-input-number style="width: 100px;" size="small" v-model="scope.row.price" />
                </template>

                <template v-if="item.key === 'i18nConfig'" #default="scope">
                    <el-button>配置</el-button>
                </template>
            </el-table-column>
        </template>

        <el-table-column label="操作" fixed="right" width="150" v-if="showAction">
            <template #default="scope">
                <el-button type="text" size="small" @click="handleEditor(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts" setup>




    const props = withDefaults(defineProps<{
        tableData: any
        filterParams: any
        showAction: boolean
    }>(), {
        showAction: true
    })

    const handleEditor = (item: any) => {
        console.log('编辑', item)
    }
    const handleDelete = (item: any) => {
        console.log('删除', item)
    }

</script>

<style lang="scss" scoped></style>