<template>
    <el-table :data="tableData" border style="width: 100%" height="600px">
        <template v-for="item in filterParams" :key="item.key">
            <el-table-column :prop="item.key" :label="item.note" v-if="item.isShow">
                <template v-if="item.key === 'avatar' || item.key === 'thumbnail'" #default="scope">
                    <img :src="scope.row[item.key]" alt="">
                </template>
                <template
                    v-if="item.key === 'isCharged' || item.key === 'showTaobaoPage' || item.key === 'isEnabled' || item.key === 'subscriptionLoginEnabled' || item.key === 'backButton'"
                    #default="scope">
                    <el-switch v-model="scope.row[item.key]" :active-value="true" :inactive-value="false" />
                </template>

                <template
                    v-if="item.key === 'photoEditTitle' || item.key === 'versionNumber' || item.key === 'taobaoPageLink'"
                    #default="scope">
                    <el-input v-model="scope.row[item.key]" />
                </template>

                <template v-if="item.key === 'price'" #default="scope">
                    <el-input-number style="width: 100px;" size="small" v-model="scope.row[item.key]" />
                </template>

                <template v-if="item.key === 'i18nConfig'" #default="scope">
                    <el-button @click="eidtorLanguage(scope.row)">配置</el-button>
                </template>
                <template v-if="item.key === 'autoOpenPlan'" #default="scope">
                    <el-select v-model="scope.row[item.key]">
                        <el-option label="自动" value="auto" />
                        <el-option label="手动" value="manual" />
                    </el-select>

                    <el-button @click="addAutoOpenMethod" style="width: 100%;margin-top: 10px;">添加</el-button>
                </template>
            </el-table-column>
        </template>

        <el-table-column label="操作" fixed="right" width="150" v-if="showAction">
            <template #default="scope">
                <el-button style="margin: 0;" type="text" size="small" @click="banUser(scope.row)"
                    v-if="userList">禁用</el-button>

                <el-button style="margin: 0;" type="text" size="small" @click="handleRoles(scope.row)"
                    v-if="userList">分配角色</el-button>
                <el-button v-if="roleList" style="margin: 0;" type="text" size="small"
                    @click="onAssginRole(scope.row)">分配权限</el-button>
                <el-button style="margin: 0;" type="text" size="small" @click="scanImg(scope.row)"
                    v-if="bannerPath">扫描该路径下图片</el-button>

                <el-button style="margin: 0;" type="text" size="small" @click="handleView(scope.row)"
                    v-if="viewButton">查看</el-button>

                <el-button style="margin: 0;" type="text" size="small" @click="handleEditor(scope.row)">编辑</el-button>
                <el-button style="margin: 0;" type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts" setup>
    const emit = defineEmits<{
        'editor': [value: any],
        'delete': [value: any],
        'rolesEditor': [value: any],
        'ban': [value: any],
        'assginRole': [value: any],
        'scanImg': [value: any],
        'AutoOpenMethod': [value: any],
        'editorLanguage': [value: any],
        'view': [value: any],
    }>()



    const props = withDefaults(defineProps<{
        tableData: any
        filterParams: any
        showAction: boolean
        userList: boolean
        roleList: boolean
        bannerPath: boolean,
        viewButton: boolean
    }>(), {
        showAction: true,
        userList: false,
        viewButton: false,
        roleList: false,
        bannerPath: false
    })


    const handleView = (item: any) => {
        console.log('查看', item)
        emit('view', item)
    }
    const handleEditor = (item: any) => {
        console.log('编辑', item)
        emit('editor', item)

    }
    const handleDelete = (item: any) => {
        console.log('删除', item)
        emit('delete', item)
    }

    //分配角色
    const handleRoles = (item: any) => {
        console.log('分配角色', item)
        emit('rolesEditor', item)
    }

    //禁用用户
    const banUser = (item: any) => {
        console.log('禁用用户', item)
        emit('ban', item)
    }

    //分配权限
    const onAssginRole = (item: any) => {
        console.log('分配权限', item)
        emit('assginRole', item)
    }
    //扫描轮播图路径下的图片
    const scanImg = (item: any) => {
        console.log('扫描轮播图路径下的图片', item)
        emit('scanImg', item)
    }

    //添加自动打开方案
    const addAutoOpenMethod = (item: any) => {
        console.log('添加自动打开方案')
        emit('AutoOpenMethod', item)
    }

    //配置国际化
    const eidtorLanguage = (item: any) => {
        console.log('配置国际化', item)
        emit('editorLanguage', item)
    }
</script>

<style lang="scss" scoped></style>