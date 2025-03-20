<template>
    <el-dialog :model-value="dialogVisable" title="国际化配置" width="1000" :before-close="handleClose">
        <addLanguage v-model:show-editor="showAddLanguage" />
        <el-table :data="tableData" border style="width: 100%" height="600px">
            <el-table-column prop="field" label="字段名" width="180" />
            <el-table-column prop="description" label="字段说明" width="180">


                <template #default="scope">
                    <el-input v-model="scope.row.description" placeholder="请输入字段说明" />
                </template>
            </el-table-column>
            <el-table-column prop="address" label="语言文案配置">


                <template #default="scope">
                    <ul>
                        <li v-for="item in scope.row.i18n">
                            <span>{{ item.language + ':' }}</span><span>
                                {{ item.value }}
                            </span>
                        </li>
                    </ul>

                </template>

            </el-table-column>
            <el-table-column label="操作" width="180">
                <template #default="scope">
                    <el-button type="text" @click="handleEditor(scope.row)">配置</el-button>
                </template>

            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script lang="ts" setup>
    import addLanguage from './addLanguage.vue';
    import { ref } from 'vue';
    const props = defineProps<{
        dialogVisable: boolean
    }>()
    const emit = defineEmits<{
        'update:dialogVisable': [value: boolean]
    }>()


    //配置国际化
    const showAddLanguage = ref<boolean>(false)
    const handleEditor = (item: any) => {
        console.log('配置国际化', item)
        showAddLanguage.value = true
    }







    interface LanguageConfigItem {
        field: string;           // 字段名
        description: string;     // 字段说明
        i18n: {
            language: string
            value: string
        }[]

    };





    const tableData = ref<LanguageConfigItem[]>([
        {
            field: 'name',
            description: '用户名称',
            i18n: [
                { language: 'zh_CN', value: '姓名' },
                { language: 'en_US', value: 'Name' }
            ]
        },
        {
            field: 'age',
            description: '用户年龄',
            i18n: [
                { language: 'zh_CN', value: '年龄' },
                { language: 'en_US', value: 'Age' }
            ]
        },
        {
            field: 'email',
            description: '电子邮箱',
            i18n: [
                { language: 'zh_CN', value: '邮箱' },
                { language: 'en_US', value: 'Email' }
            ]
        },
        {
            field: 'phone',
            description: '联系电话',
            i18n: [
                { language: 'zh_CN', value: '电话' },
                { language: 'en_US', value: 'Phone' }
            ]
        },
        {
            field: 'address',
            description: '居住地址',
            i18n: [
                { language: 'zh_CN', value: '地址' },
                { language: 'en_US', value: 'Address' }
            ]
        },
        {
            field: 'gender',
            description: '性别',
            i18n: [
                { language: 'zh_CN', value: '性别' },
                { language: 'en_US', value: 'Gender' }
            ]
        },
        {
            field: 'birthday',
            description: '出生日期',
            i18n: [
                { language: 'zh_CN', value: '生日' },
                { language: 'en_US', value: 'Birthday' }
            ]
        },
        {
            field: 'status',
            description: '用户状态',
            i18n: [
                { language: 'zh_CN', value: '状态' },
                { language: 'en_US', value: 'Status' }
            ]
        },
        {
            field: 'role',
            description: '用户角色',
            i18n: [
                { language: 'zh_CN', value: '角色' },
                { language: 'en_US', value: 'Role' }
            ]
        },
        {
            field: 'createTime',
            description: '创建时间',
            i18n: [
                { language: 'zh_CN', value: '创建时间' },
                { language: 'en_US', value: 'Create Time' }
            ]
        }
    ])

    //关闭弹窗
    const handleClose = () => {
        emit('update:dialogVisable', false)

    }
</script>

<style lang="scss" scoped>
    ul {
        list-style: none;


    }
</style>