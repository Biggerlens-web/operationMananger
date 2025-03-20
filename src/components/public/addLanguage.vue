<template>
    <el-dialog :model-value="showEditor" title="" width="500" :before-close="handleClose">
        <ul class="fieldList">
            <li class="fieldItem" v-for="(el, index) in languageContentList" :key="el.language">
                <el-select v-model="el.language" style="width: 120px;" placeholder="请选择语言">
                    <el-option v-for="item in languageList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <el-input v-model="el.content" placeholder="请输入文案" />
                <el-button type="danger" @click="remove(index)">删除</el-button>
            </li>
            <li>
                <el-button style="width: 100%;" @click="add">
                    添加一个
                </el-button>
            </li>
        </ul>

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
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue'
    const props = defineProps<{
        showEditor: boolean
    }>()

    const counterStore = useCounterStore()
    const { appList, OSlist, channelList } = storeToRefs(counterStore)
    const emit = defineEmits<{
        'update:showEditor': [value: boolean]
    }>()
    const formData = ref<any>({
        id: '',

        host: '',

        channel: '',
        appNo: ''
    })
    const languageList = ref([
        {
            value: '1',
            label: '中文'
        },
        {
            value: '2',
            label: '英文'
        }
    ])

    const languageContentList = ref<any>([
        {
            language: '中文',
            content: '中文文案'
        },
        {
            language: '英文',
            content: '英文文案'
        }
    ])
    //新增语言文案
    const add = () => {
        languageContentList.value.push({
            language: '',
            content: ''
        })
    }
    //删除语言文案
    const remove = (index: number) => {
        languageContentList.value.splice(index, 1)
    }


    const ruleFormRef = ref<any>(null)
    const rules = ref({
        channelGroupName: [{ required: true, message: '请输入渠道组名称', trigger: 'blur' }],
        channelList: [{ required: true, message: '请选择渠道', trigger: 'blur' }]
    })

    const resetForm = () => {
        formData.value = {
            id: '',

            host: '',

            channel: '',
            appNo: ''
        }
        ruleFormRef.value?.resetFields()
    }
    const handleClose = () => {
        resetForm()
        emit('update:showEditor', false)
    }
    const handleComfirm = (ruleFormRef: any) => {
        ruleFormRef.validate((valid: any) => {
            if (valid) {
                handleClose()
            }
        })
    }
</script>

<style lang="scss" scoped>

    .fieldList {
        .fieldItem {
            display: flex;
            column-gap: 5px;
            margin-bottom: 10px;
        }
    }
</style>