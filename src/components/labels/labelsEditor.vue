<template>
    <el-dialog :model-value="dialogVisible" title="编辑用户标签" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>

            <el-form-item label="所属标签" prop="pid">
                <el-cascader style="width: 100%;" v-model="formData.pid" :options="labelOptions" :props="cascaderProps"
                    placeholder="请选择标签层级" clearable filterable @change="handleLabelChange" />
            </el-form-item>
            <ul class="labelsList">
                <li class="label">
                    <p>
                        标签名称
                    </p>
                </li>
                <li v-for="(item, inex) in labelsList" :key="item.index" class="inputItem">
                    <el-input placeholder="请输入标签名称" v-model="item.label"></el-input>
                    <el-input placeholder="请输入标签名称(EN)" v-model="item.labelEn"></el-input>
                    <el-button type="danger" @click="removeLabelName(inex)">删除</el-button>
                </li>
                <li class="addbuton" v-if="!editInfo?.id">
                    <el-button @click="addLabelName">
                        添加标签
                    </el-button>
                </li>
            </ul>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleComfirm(ruleFormRef)">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    import service from '@/axios';
    import { useCounterStore } from '@/stores/counter';
    import { desEncrypt } from '@/utils/des';
    import { ElMessage, type FormInstance } from 'element-plus';
    import { storeToRefs } from 'pinia';
    import { ref, watch } from 'vue'
    const counterStore = useCounterStore()
    const { appList, defaultAppNo, showLoading } = storeToRefs(counterStore)
    const props = defineProps<{
        dialogVisible: boolean
        editInfo: any
    }>()



    const getLabelsInfo = async () => {
        showLoading.value = true
        try {
            const params = {
                timestamp: Date.now(),
                appNo: defaultAppNo.value,
                id: props.editInfo?.id ?? null
            }
            console.log('获取信息参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.get('/labels/edit', {
                params: {
                    enData
                }
            })
            console.log('获取编辑信息', res);
            labelOptions.value = res.data.data.result

        } catch (err) {
            console.log('获取编辑信息失败', err);
        } finally {
            showLoading.value = false
        }
    }

    watch(() => props.dialogVisible, (newV) => {
        if (newV) {
            getLabelsInfo()
        }
        if (newV && props.editInfo) {
            Object.assign(formData.value, props.editInfo)
            labelsList.value[0].label = props.editInfo.label
            labelsList.value[0].labelEn = props.editInfo.labelEn
        }
    })
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()

    const formData = ref<any>({
        id: '',
        pid: '',

        labelIndex: 1,

    })

    watch(() => defaultAppNo.value, (newV) => {
        formData.value.appNo = newV
    })

    // 级联选择器配置
    const cascaderProps = ref({
        expandTrigger: 'click' as const,
        value: 'id',
        label: 'label',
        children: 'children',
        checkStrictly: true, // 是否严格的遵守父子节点不互相关联
        emitPath: true // 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组
    })

    // 标签层级数据 - 模拟数据结构，实际应从接口获取
    const labelOptions = ref([

    ])

    // 处理级联选择器变化
    const handleLabelChange = (value: any) => {
        console.log('选中的标签层级:', value)
        // 这里可以根据选中的值进行相应的处理
    }
    const labelsList = ref<any>([
        {
            label: '',
            labelEn: '',
        },
    ])
    //添加标签名
    const addLabelName = () => {
        labelsList.value.push({
            label: '',
            labelEn: '',
        })
    }
    //删除标签名
    const removeLabelName = (index: number) => {
        labelsList.value.splice(index, 1)
    }
    const ruleFormRef = ref<FormInstance>()
    const rules = ref<any>({


    })

    const resetForm = () => {
        formData.value = {
            id: '',
            pid: '',

        }
        labelsList.value = [{
            label: '',
            labelEn: '',
        }]
        ruleFormRef.value?.resetFields()
    }
    const handleClose = () => {
        resetForm()
        emit('update:dialogVisible', false)
    }


    const saveChange = async () => {
        showLoading.value = true
        try {
            const params: any = {
                timestamp: Date.now(),
                appNo: defaultAppNo.value,
                id: formData.value.id,
                type: formData.value.id ? 'edit' : 'add',
                pid: Array.isArray(formData.value.pid) ? formData.value.pid[formData.value.pid.length - 1] : formData.value.pid,
                labels: labelsList.value.map((item: any) => item.label),
                labelEns: labelsList.value.map((item: any) => item.labelEn),

            }
            if (formData.value.id) {
                delete params.labels
                delete params.labelEns
                params.label = labelsList.value[0].label
                params.labelEn = labelsList.value[0].labelEn
            }
            console.log('保存参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/labels/save', {
                enData
            })
            console.log('保存标签', res);
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
                handleClose()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('保存失败', err);
        } finally {
            showLoading.value = false
        }
    }
    const handleComfirm = (ruleFormRef: any) => {
        ruleFormRef.validate((valid: any) => {
            if (valid) {
                console.log('submit!');
                saveChange()
            }
        })
    }
</script>

<style lang="scss" scoped>

    .labelsList {
        .label {
            margin-bottom: 10px;
        }

        .inputItem {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
        }


    }
</style>