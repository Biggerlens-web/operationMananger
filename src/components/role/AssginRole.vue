<template>
    <el-dialog :model-value="dialogVisible" title="分配权限" width="500" :before-close="handleClose">

        <el-tree ref="treeRef" style="max-width: 600px" :data="data" show-checkbox node-key="id" highlight-current
            :props="defaultProps" @check="checkedbox" :default-checked-keys="defaultChecked" />

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleComfirm">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    import service from '@/axios';

    import { desEncrypt } from '@/utils/des';
    import { ElMessage, ElTree } from 'element-plus'

    import { ref, watch, toRaw } from 'vue';









    const props = defineProps<{
        dialogVisible: boolean
        roleId: number | string
    }>()

    //默认选中
    const defaultChecked = ref<number[]>([])
    const getTreeRole = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                id: props.roleId
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.get('/system/rolePermission/getTree', {
                params: {
                    enData
                }
            })


            console.log('获取树状权限', res);

            data.value = res.data.data.list
            defaultChecked.value = []
            data.value.forEach((item) => {
                item.nodes?.forEach((el: any) => {
                    if (el.state && el.state.checked === true) {
                        defaultChecked.value.push(el.id)
                    }
                })
            })

        } catch (err) {
            console.log('获取权限失败', err);
        }
    }
    watch(() => props.dialogVisible, (newV) => {
        if (newV && props.roleId) {
            getTreeRole()
        }
    })
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()

    const defaultProps = {
        children: 'nodes',
        label: 'text',
    }
    interface Tree {
        id: number
        text: string
        nodes?: any
        [key: string]: any
    }
    const data = ref<Tree[]>([

    ])


    const checkedList = ref<any>()
    const checkedbox = (data: any, checkedArr: any) => {

        console.log('checkedArr', checkedArr);
        // 遍历 checkedNodes，并将每个节点转换为原始对象
        checkedList.value = structuredClone(checkedArr.checkedNodes.map((node: any) => toRaw(node)));



        checkedList.value.forEach((item: any) => {
            if (item.text) {
                delete item.text
            }
        })

    }
    const handleClose = () => {
        emit('update:dialogVisible', false)
    }




    const saveRole = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                roleId: props.roleId,
                perms: JSON.stringify(toRaw(checkedList.value))
            }
            console.log('参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/system/rolePermission/saveAssign', {
                enData
            })
            console.log('保存权限分配', res);
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
                handleClose()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('err', err);
        }
    }
    const handleComfirm = () => {
        saveRole()

    }
</script>

<style lang="scss" scoped></style>