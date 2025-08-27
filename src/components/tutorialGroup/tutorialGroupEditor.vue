<template>
    <el-dialog :model-value="showEditor" title="编辑教程组" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="所属应用" prop="appNo">
                <el-select v-model="defaultAppNo" filterable :disabled="true">
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
                </el-select>
            </el-form-item>

            <el-form-item label="系统" prop="os">
                <el-select v-model="formData.os">
                    <el-option v-for="item in OSlist" :key="item.value" :label="item.note" :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item label="地区" prop="region">
                <el-select v-model="formData.region">
                    <el-option v-for="item in regionList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="语言" prop="language" v-show="formData.region !== 'domestic'">
                <el-select v-model="formData.language">
                    <el-option v-for="item in international" :key="item.value" :label="item.language"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="教程类型" prop="tutorialType">
                <el-select filterable v-model="formData.tutorialType" placeholder="教程类型" class="filter-select">
                    <el-option v-for="item in tutorialTypeList" :key="item.value" :label="item.note"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="formData.name" />
            </el-form-item>
            <el-form-item label="访问名" prop="field">
                <el-input v-model="formData.field" />
            </el-form-item>
            <el-form-item label="描述" prop="desc">
                <el-input v-model="formData.desc" type="textarea" />
            </el-form-item>
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
    import { ElMessage } from 'element-plus';
    import { storeToRefs } from 'pinia';
    import { ref, watch } from 'vue'
    const props = defineProps<{
        showEditor: boolean
        tutorialTypeList: any[]
        id?: number | string
    }>()

    watch(() => props.showEditor, async (newV) => {
        if (newV) {
            if (props.id) {
                showLoading.value = true
                try {
                    const params = {
                        timestamp: Date.now(),
                        id: props.id
                    }
                    console.log('参数', params);
                    const enData = desEncrypt(JSON.stringify(params))
                    const res = await service.get('/tutorialGroup/edit', {
                        params: {
                            enData
                        }
                    })

                    console.log('获取教程组信息', res);
                    if (res.data.data.tutorialGroup) {
                        Object.assign(formData.value, res.data.data.tutorialGroup)
                    }
                } catch (err) {
                    console.log('获取教程组信息失败', err);
                } finally {
                    showLoading.value = false
                }
            }
        }
    })
    const counterStore = useCounterStore()
    const { appList, OSlist, regionList, showLoading, international, defaultAppNo } = storeToRefs(counterStore)
    const emit = defineEmits<{
        'update:showEditor': [value: boolean]
    }>()
    const formData = ref<any>({

        "id": '',     //新增为null，修改必传
        "name": "", //必填
        "tutorialType": "", //必填
        "appNo": "",   //必填
        "os": "", //必填
        "region": "",
        "video": "",
        "videoUrlDy": "",
        "videoDuration": 1,
        "level": 1
    })


    const ruleFormRef = ref<any>(null)
    const rules = ref({

    })

    const resetForm = () => {
        formData.value = {
            "id": '',     //新增为null，修改必传
            "name": "", //必填
            "tutorialType": "", //必填
            "appNo": "",   //必填
            "os": "", //必填
            "region": "",
            "video": "",
            "videoUrlDy": "",
            "videoDuration": 1,
            "level": 1
        }
        ruleFormRef.value?.resetFields()
    }
    const handleClose = () => {
        resetForm()
        emit('update:showEditor', false)
    }


    const saveChange = async () => {
        if (showLoading.value) {
            ElMessage.warning('正在保存。。。')
            return
        }
        showLoading.value = true
        try {
            formData.value.appNo = defaultAppNo.value
            const params = {
                ...formData.value,
                timestamp: Date.now()
                ,
                type: formData.value.id ? 'update' : 'add'
            }
            params.language = formData.value.region === 'domestic' ? 'zh' : formData.value.language
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/tutorialGroup/save', {
                enData
            })
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
                saveChange()
            }
        })
    }
</script>

<style lang="scss" scoped></style>