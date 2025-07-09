<template>
    <el-dialog :model-value="dialogVisible" title="编辑用户标签" width="500" :before-close="handleClose">

        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="所属应用" prop="appNo">
                <el-select v-model="formData.appNo">
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
                </el-select>
            </el-form-item>
            <el-form-item label="所属标签" prop="signName">
                <el-cascader style="width: 100%;" v-model="formData.signName" :options="labelOptions"
                    :props="cascaderProps" placeholder="请选择标签层级" clearable filterable @change="handleLabelChange" />
            </el-form-item>
            <ul class="labelsList">
                <li class="label">
                    <p>
                        标签名称
                    </p>
                </li>
                <li v-for="(item, inex) in labelsList" :key="item.la" class="inputItem">
                    <el-input placeholder="请输入标签名称" v-model="item.label"></el-input>
                    <el-input placeholder="请输入标签名称(EN)" v-model="item.label_en"></el-input>
                    <el-button type="danger" @click="removeLabelName(inex)">删除</el-button>
                </li>
                <li class="addbuton">
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
    import { useCounterStore } from '@/stores/counter';
    import type { FormInstance } from 'element-plus';
    import { storeToRefs } from 'pinia';
    import { ref, watch } from 'vue'
    const counterStore = useCounterStore()
    const { appList, defaultAppNo } = storeToRefs(counterStore)
    const props = defineProps<{
        dialogVisible: boolean
        editInfo: any
    }>()

    watch(() => props.dialogVisible, (newV) => {
        if (newV && props.editInfo) {

        }
    })
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()

    const formData = ref<any>({
        id: '',
        appNo: defaultAppNo.value,
        signName: [],
        keyFile: [],
        keypassword: "",
        otherName: '',
        otherNamePassword: '',
        packName: ''
    })

    watch(() => defaultAppNo.value, (newV) => {
        formData.value.appNo = newV
    })

    // 级联选择器配置
    const cascaderProps = ref({
        expandTrigger: 'click' as const,
        value: 'value',
        label: 'label',
        children: 'children',
        checkStrictly: false, // 是否严格的遵守父子节点不互相关联
        emitPath: true // 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组
    })

    // 标签层级数据 - 模拟数据结构，实际应从接口获取
    const labelOptions = ref([
        {
            value: '1',
            label: '1 - 111',
            children: [
                {
                    value: '1-1',
                    label: '1 - new',
                },
                {
                    value: '1-22',
                    label: '1 - 22',
                    children: [
                        {
                            value: '1-22-1',
                            label: '2 - 33'
                        }
                    ]
                },
                {
                    value: '1-123',
                    label: '3 - 123'
                }
            ]
        },
        {
            value: '111',
            label: '111'
        },
        {
            value: 'new-level',
            label: '新增层级标签'
        }
    ])

    // 处理级联选择器变化
    const handleLabelChange = (value: any) => {
        console.log('选中的标签层级:', value)
        // 这里可以根据选中的值进行相应的处理
    }
    const labelsList = ref<any>([
        {
            label: '',
            label_en: '',
        },
    ])
    //添加标签名
    const addLabelName = () => {
        labelsList.value.push({
            label: '',
            label_en: '',
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
            appNo: "",
            signName: [],
            keyFile: [],
            keypassword: "",
            otherName: '',
            otherNamePassword: '',
            packName: ''
        }
        ruleFormRef.value?.resetFields()
    }
    const handleClose = () => {
        resetForm()
        emit('update:dialogVisible', false)
    }
    const handleComfirm = (ruleFormRef: any) => {
        ruleFormRef.validate((valid: any) => {
            if (valid) {
                console.log('submit!');
                handleClose()
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