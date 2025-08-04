<template>
    <div>
        <el-table :data="tableData" style="width: 100%" height="650">
            <el-table-column prop="name" label="权重名称" width="180" />
            <el-table-column prop="weight" label="权重值" />
            <el-table-column fixed="right" label="操作" width="120">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click="handleClick(scope.row)">
                        编辑
                    </el-button>

                </template>
            </el-table-column>
        </el-table>
    </div>
    <editWeight v-model:dialogVisible="dialogVisible" :functionValue="functionValue" :weight="weight"
        @update="changeWeight" />
</template>

<script lang="ts" setup>
    import { onActivated, ref } from 'vue'
    import editWeight from './editWeight.vue'
    import { useCounterStore } from '@/stores/counter'
    import { storeToRefs } from 'pinia'
    import { desEncrypt } from '@/utils/des'
    import service from '@/axios'
    import { ElMessage } from 'element-plus'
    const dialogVisible = ref<boolean>(false)
    const counterStore = useCounterStore()
    const { showLoading, defaultAppNo } = storeToRefs(counterStore)

    interface Props {
        functionValue: string | number
        searchParams: any
    }
    const props = defineProps<Props>()



    const weightNameList: any = {
        likeWeight: '点赞量权值',
        viewWeight: '点击量权值',
        timeWeight: '时间衰减权值'
    }


    // 权重管理数据数组
    const tableData = ref<any>([

    ])

    const name = ref('')

    const weight = ref(0)
    const handleClick = (row: any) => {
        console.log(row)
        name.value = row.key
        weight.value = row.weight
        dialogVisible.value = true
    }


    const getWeightData = async () => {
        showLoading.value = true
        try {
            console.log('权重管理数据', props.searchParams);
            const params = {
                timestamp: Date.now(),
                appNo: defaultAppNo.value,
                id: props.searchParams.functionValue
            }
            console.log("🚀 ~ getWeightData ~ params:", params)
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/hairMaterials/function/list', {
                enData
            })
            console.log("🚀 ~ getWeightData ~ res:", res)
            if (res.data.code === 200) {
                const arr = [
                    {
                        name: weightNameList.likeWeight,
                        weight: res.data.data.list[0].likeWeight,
                        key: 'likeWeight'
                    },
                    {
                        name: weightNameList.viewWeight,
                        weight: res.data.data.list[0].viewWeight,
                        key: 'viewWeight'
                    },
                    {
                        name: weightNameList.timeWeight,
                        weight: res.data.data.list[0].timeWeight,
                        key: 'timeWeight'
                    }
                ]
                tableData.value = arr
            } else {
                ElMessage.error(res.data.msg)
            }

        } catch (err) {

        } finally {
            showLoading.value = false
        }
    }



    const changeWeight = async (weight: number) => {
        if (showLoading.value) return
        showLoading.value = true
        try {
            const params = {
                timestamp: Date.now(),
                id: props.functionValue,
                [name.value]: weight
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/hairMaterials/function/save', {
                enData
            })
            console.log("🚀 ~ changeWeight ~ res:", res)
            if (res.data.code === 200) {
                ElMessage.success('修改成功')
                getWeightData()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log("🚀 ~ changeWeight ~ err:", err)

        } finally {
            showLoading.value = false
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