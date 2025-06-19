<template>
    <el-dialog :model-value="dialogVisible" title="编辑用户角色" width="500" :before-close="handleClose">


        <el-form-item label="角色">
            <el-select v-model="chosedRole" placeholder="请选择角色" multiple>
                <el-option v-for="item in rolesList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </el-form-item>

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
    import { ElMessage } from 'element-plus';
    import { onMounted, ref, toRaw, watch } from 'vue';


    const props = defineProps<{
        dialogVisible: boolean
        userId: number
    }>()
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()

    const getUserRoleList = async () => {
        try {
            const params = {
                id: props.userId,
                timestamp: Date.now()
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.get('/system/userRole/assign', {
                params: {
                    enData
                }
            })
            console.log('获取用户角色列表成功', res);
            if (res.data.code === 200) {

                const selectedObj = res.data.data.selectRoles
                const arr = Object.entries(selectedObj)
                console.log('arr', arr);
                if (arr.length) {
                    chosedRole.value = arr.map((item: any) => item[1].id)
                } else {
                    chosedRole.value = []
                }

                console.log('chosed', chosedRole.value);
            }
        } catch (err) {
            console.log('获取用户角色列表失败', err);
        }
    }
    watch(() => props.dialogVisible, (newVal) => {
        if (newVal) {
            getUserRoleList()
        }
    })

    //已选中的角色
    const chosedRole = ref<number[]>([])
    const rolesList = ref<any>([

    ])

    //取消
    const handleClose = () => {
        chosedRole.value = []
        emit('update:dialogVisible', false)
    }
    //确定

    const saveRole = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                userId: props.userId,
                roleIds: chosedRole.value.join(',')
            }
            console.log('保存参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/system/userRole/save', {
                enData
            })
            console.log('保存角色', res);


            if (res.data.code === 200) {
                ElMessage({
                    message: '保存成功',
                    type: 'success'
                })

                handleClose()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            ElMessage.error('网络错误')
            console.log('保存失败', err);
        }
    }
    const handleComfirm = () => {

        if (chosedRole.value.length === 0) {
            ElMessage.error('请选择角色')
            return
        }
        saveRole()

    }


    //获取角色列表
    const getRoleList = async () => {
        try {
            const params = {
                pageNum: 1,
                pageSize: 999999,
                timestamp: Date.now()
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.get('/system/role/list', {
                params: {
                    enData
                }
            })

            console.log('获取角色列表成功', res);
            if (res.data.code === 200) {
                rolesList.value = res.data.rows
            }
        } catch (err) {
            console.log('获取角色列表失败', err);
        }
    }

    onMounted(() => {
        getRoleList()
    })
</script>

<style lang="scss" scoped></style>