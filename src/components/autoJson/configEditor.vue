<template>
    <el-dialog :model-value="dialogEditor" title="编辑配置" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="auto" class="demo-ruleForm"
            status-icon>
            <el-form-item label="名称" prop="name">
                <el-input v-model="formData.name" />
            </el-form-item>
            <el-form-item label="应用" prop="appNo">
                <el-select filterable v-model="formData.appNo" placeholder="请选择应用" class="filter-select">
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
                </el-select>
            </el-form-item>
            <el-form-item label="系统" prop="os">
                <el-select filterable v-model="formData.os" placeholder="请选择系统" class="filter-select">
                    <el-option v-for="item in OSlist" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="地区" prop="region">
                <el-select filterable v-model="formData.region" placeholder="请选择地区" class="filter-select">
                    <el-option label="国内" value="domestic" />
                    <el-option label="国外" value="foreign" />
                </el-select>
            </el-form-item>
            <el-form-item label="渠道" prop="channel" v-if="showChannelEditor">
                <el-select filterable multiple v-model="formData.channel" placeholder="请选择渠道" class="filter-select">
                    <el-option v-for="item in channelList" :key="item.id" :label="item.channelName" :value="item.id" />
                </el-select>
            </el-form-item>

            <el-form-item label="开关" prop="open">
                <el-switch v-model="formData.open"></el-switch>
            </el-form-item>
            <!-- <el-form-item v-if="formData.open" label="开始时间" prop="startTime">
                <el-date-picker ref="datePicker" value-format="YYYY-MM-DD HH:mm:ss" v-model="formData.startTime"
                    type="datetime" placeholder="请选择开始时间" />
            </el-form-item>
            <el-form-item v-if="formData.open" label="结束时间" prop="endTime">
                <el-date-picker ref="datePicker" value-format="YYYY-MM-DD HH:mm:ss" v-model="formData.endTime"
                    type="datetime" placeholder="请选择结束时间" />
            </el-form-item> -->
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
    import { ElMessage } from 'element-plus';
    import { storeToRefs } from 'pinia';
    import { computed, reactive, ref, watch } from 'vue';
    const counterStore = useCounterStore()
    const autoOprationStore = useAutoOpration()
    const { JSONEditorNote, JSONEditorValue } = storeToRefs(autoOprationStore)
    const { appList, channelList, OSlist } = storeToRefs(counterStore)
    const props = defineProps<{
        dialogEditor: boolean
        activeApp: string | number
        editorFormData: any
    }>()


    const showChannelEditor = computed(() => !['IOS', 'MAC'].includes(formData.os))
    const emits = defineEmits<{
        'update:dialogEditor': [value: boolean]
        'update': []
    }>()



    const formData = reactive<any>({
        id: "",
        code: '',
        name: '',
        appNo: '',
        desc: '',
        os: '',
        channel: [],
        region: '',
        open: true,


    })
    const resetForm = () => {
        formData.id = ''
        formData.code = ''
        formData.name = ''
        formData.appNo = ''
        formData.desc = ''
        formData.os = ''
        formData.channel = []
        formData.open = true

    }
    const ruleFormRef = ref<any>(null)
    const rules = reactive<any>({
        code: [
            { required: true, message: '请填写编码', trigger: 'blur' },
        ],
        name: [
            {
                required: true, message: '请填写名称', trigger: 'blur'
            }
        ],
        os: [
            {
                required: true, message: '请选择系统', trigger: 'blur'
            }
        ],
        channel: [
            {
                required: true, message: '请选择渠道', trigger: 'blur'
            }
        ],
        startTime: [
            {
                required: true, message: '请选择开始时间', trigger: 'blur'
            }
        ],
        endTime: [
            {
                required: true, message: '请选择结束时间', trigger: 'blur'
            }
        ],

    })
    watch(() => props.dialogEditor, (newV) => {
        if (newV) {


            if (props.editorFormData) {
                for (const key in props.editorFormData) {
                    for (const childKey in formData) {
                        if (key === childKey) {
                            if (key === 'channel') {
                                const channelArr = props.editorFormData[key].split(',')
                                console.log('channelArr', channelArr);
                                formData[key] = channelArr.map((item: any) => {
                                    return parseInt(item)


                                })
                            } else {
                                formData[key] = props.editorFormData[key]
                            }
                        }
                    }
                }
                console.log('formData', formData);
            } else {
                resetForm()
                if (props.activeApp) {
                    formData.appNo = props.activeApp

                }
            }
        }
    })
    const handleClose = () => {
        JSONEditorNote.value = {}
        JSONEditorValue.value = {}
        emits('update:dialogEditor', false)
    }

    //参数值url编码
    const enCodeObj = (obj: any) => {
        const result: any = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                if (typeof value === 'string') {
                    result[key] = encodeURIComponent(value);
                } else if (typeof value === 'object' && value !== null) {
                    result[key] = enCodeObj(value);
                } else {
                    result[key] = value;
                }
            }
        }
        return result;
    }

    const saveConfig = async (params: any) => {
        try {
            console.log('params', params);
            // const config = JSON.parse(params.config)
            // const configNote = JSON.parse(params.configNote)
            // params.config = JSON.stringify(enCodeObj(config))
            // params.configNote = JSON.stringify(enCodeObj(configNote))
            const paramsObj = { ...params, timestamp: Date.now() }
            console.log('参数', paramsObj);
            const paramStr = desEncrypt(JSON.stringify(paramsObj))
            const res = await service.post('/appConfig/json/save', {
                enData: paramStr
            })
            console.log('保存配置', res);
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            ElMessage.error('保存失败')
            console.log('保存失败', err);
        }
    }
    const handleComfirm = async (formEl: any) => {
        if (!formEl) return
        await ruleFormRef.value.validate(async (valid: any) => {
            if (valid) {
                console.log('formData', formData);
                const params = JSON.parse(JSON.stringify(formData))
                if (!params.id) {
                    delete params.id
                }
                params.channel = params.channel.join(',')
                params.appName = appList.value.find((item: any) => item.appNo === params.appNo)?.appName
                await saveConfig(params)
                resetForm()
                emits('update')
                handleClose()
            }
        })

    }
</script>

<style lang="scss" scoped></style>