<template>
    <el-dialog :model-value="dialogEditor" title="编辑配置" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="auto" class="demo-ruleForm"
            status-icon>
            <el-form-item label="名称" prop="name">
                <el-input v-model="formData.name" />
            </el-form-item>
            <el-form-item label="应用" prop="appNo">
                <el-select v-model="formData.appNo" placeholder="请选择应用" class="filter-select">
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName}`" :value="item.appNo" />
                </el-select>
            </el-form-item>
            <el-form-item label="编码" prop="code">
                <el-input v-model="formData.code"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="desc">
                <el-input type="textarea" v-model="formData.desc">
                </el-input>
            </el-form-item>
        </el-form>
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
    import { useAutoOpration } from '@/stores/autoOpration';
    import { useCounterStore } from '@/stores/counter';
    import { desEncrypt } from '@/utils/des';
    import { storeToRefs } from 'pinia';
    import { reactive, ref, watch } from 'vue';
    const counterStore = useCounterStore()
    const autoOprationStore = useAutoOpration()
    const { JSONEditorNote, JSONEditorValue } = storeToRefs(autoOprationStore)
    const { appList } = storeToRefs(counterStore)
    const props = defineProps<{
        dialogEditor: boolean
        activeApp: string | number
    }>()

    const emits = defineEmits<{
        'update:dialogEditor': [value: boolean]
        'update': []
    }>()



    const formData = reactive<any>({
        code: '',
        name: '',
        appNo: '',
        desc: '',

    })
    const ruleFormRef = ref<any>(null)
    const rules = reactive<any>({
        code: [
            { required: true, message: '请填写编码', trigger: 'blur' },
        ],
        name: [
            {
                required: true, message: '请填写名称', trigger: 'blur'
            }
        ]
    })
    watch(() => props.dialogEditor, (newV) => {
        if (newV) {
            if (props.activeApp) {
                formData.appNo = props.activeApp
            }
        }
    })
    const handleClose = () => {
        JSONEditorNote.value = {}
        JSONEditorValue.value = {}
        emits('update:dialogEditor', false)
    }


    const saveConfig = async () => {
        try {
            const params = { ...formData, timestamp: Date.now() }
            console.log('参数', params);
            const paramStr = desEncrypt(JSON.stringify(params))
            const res = await service.post('/appConfig/json/save', {
                enData: paramStr
            })
            console.log('保存配置', res);
        } catch (err) {
            console.log('保存失败', err);
        }
    }
    const handleComfirm = async (formEl: any) => {
        if (!formEl) return
        await ruleFormRef.value.validate(async (valid: any) => {
            if (valid) {
                console.log('formData', formData);
                // formData.config = JSON.stringify(JSONEditorValue.value)
                // formData.configNote = JSON.stringify(JSONEditorNote.value)
                console.log('formData', formData);
                await saveConfig()
                emits('update')
                handleClose()
            }
        })

    }
</script>

<style lang="scss" scoped></style>