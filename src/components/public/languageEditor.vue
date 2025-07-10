<template>
    <el-dialog :model-value="dialogVisable" title="国际化配置" width="1000" :before-close="handleClose">
        <addLanguage v-model:show-editor="showAddLanguage" :languageArr="languageArr" @comfirm="comfirmLanguage" />
        <el-table :data="tableData" border style="width: 100%" height="600px">
            <el-table-column prop="field" label="字段名" width="180" />
            <el-table-column prop="name" label="字段说明" width="180">
                <template #default="scope">
                    <el-input v-model="scope.row.name" @blur="handleName(scope.row)" placeholder="请输入字段说明" />
                </template>
            </el-table-column>
            <el-table-column prop="address" label="语言文案配置">
                <template #default="scope">
                    <ul>
                        <li v-for="item in scope.row.config" :key="item.language">
                            <span style="font-weight: bolder;">{{ item.language + ':' }}</span><span>
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
    import { desEncrypt } from '@/utils/des';
    import addLanguage from './addLanguage.vue';
    import { ref, watch } from 'vue';
    import service from '@/axios';
    import { ElMessage } from 'element-plus';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    const stores = useCounterStore()
    const { showLoading } = storeToRefs(stores)
    const props = defineProps<{
        dialogVisable: boolean
        configId: any
    }>()
    watch(() => props.dialogVisable, (newV) => {
        if (newV && props.configId) {
            getConfigList()
        }
    })
    const emit = defineEmits<{
        'update:dialogVisable': [value: boolean]
    }>()


    //获取明细列表
    const getConfigList = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                id: props.configId
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/helpMeRetouchDetail/list', {
                enData
            })
            console.log('获取明细列表', res);
            res.data.rows.forEach((item: any) => {
                const configObj = JSON.parse(item.config)
                const arr = Object.entries(configObj)

                const config: any = []
                arr.forEach((item: any) => {
                    config.push({
                        language: item[0],
                        value: item[1]
                    })
                })
                item.config = config
            })
            tableData.value = res.data.rows

        } catch (err) {
            console.log('获取明细列表失败', err);
        } finally {
            showLoading.value = false
        }
    }


    //配置国际化
    const showAddLanguage = ref<boolean>(false)
    const languageArr = ref<any>([])
    const configName = ref<string>('')
    const configId = ref<number>(0)
    const handleEditor = (item: any) => {
        console.log('配置国际化', item)
        languageArr.value = item.config
        configName.value = item.name
        configId.value = item.id
        showAddLanguage.value = true
    }


    //修改字段说明
    const handleName = async (item: any) => {
        try {
            const params = {
                timestamp: Date.now(),
                id: item.id,
                name: item.name,
                // config: JSON.stringify(item.config)
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/helpMeRetouchDetail/save', {
                enData
            })
            if (res.data.code === 200) {
                ElMessage.success('修改成功')
                getConfigList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('修改字段说明失败', err);
        } finally {
            showLoading.value = false
        }
    }


    //确定语言配置
    const comfirmLanguage = async (arr: any) => {


        try {
            const obj = arr.reduce((pre: any, cur: any) => {
                pre[cur.language] = cur.value
                return pre
            }, {})

            const params = {
                timestamp: Date.now(),
                id: configId.value,
                // name: configName.value,
                config: JSON.stringify(obj)
            }
            console.log('保存国际化参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/helpMeRetouchDetail/save', {
                enData
            })
            console.log('保存国际化', res);
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
                showAddLanguage.value = false
                getConfigList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('保存国际化失败', err);
        } finally {
            showLoading.value = false
        }
    }






    interface LanguageConfigItem {
        field: string;           // 字段名
        name: string;     // 字段说明
        config: any

    };





    const tableData = ref<LanguageConfigItem[]>([

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