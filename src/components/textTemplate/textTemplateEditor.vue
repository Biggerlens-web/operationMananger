<template>
    <el-dialog :model-value="showEditor" title="编辑文字模板" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon label-position="top">
            <el-form-item label="所属应用" prop="appNo">
                <el-select filterable v-model="defaultAppNo" :disabled="true">
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
                </el-select>
            </el-form-item>



            <el-form-item label="地区" prop="region">
                <el-select v-model="formData.region">
                    <el-option v-for="item in regionList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="类型" prop="templateType">
                <el-select v-model="formData.templateType">
                    <el-option v-for="item in textTemplateTypeList" :key="item.value" :label="item.note"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="版本" prop="version">
                <el-input v-model="formData.version" />
            </el-form-item>
            <el-form-item label="颜色" prop="color">
                <el-color-picker v-model="formData.color" />
            </el-form-item>
            <el-form-item label="颜色透明度" prop="colorAlpha">
                <el-input v-model="formData.colorAlpha" type="number" />
            </el-form-item>
            <el-form-item label="阴影半径" prop="shadowRadius">
                <el-input v-model="formData.shadowRadius" type="number" />
            </el-form-item>
            <el-form-item label="阴影透明度" prop="shadowAlpha">
                <el-input v-model="formData.shadowAlpha" type="number" />
            </el-form-item>
            <el-form-item label="阴影颜色" prop="shadowColor">
                <el-color-picker v-model="formData.shadowColor" />
            </el-form-item>
            <el-form-item label="阴影角度" prop="shadowAngle">
                <el-input v-model="formData.shadowAngle" type="number" />
            </el-form-item>
            <el-form-item label="阴影水平偏移量" prop="shadowOffsetX">
                <el-input v-model="formData.shadowOffsetX" type="number" />
            </el-form-item>
            <el-form-item label="边框宽" prop="borderWidth">
                <el-input v-model="formData.borderWidth" type="number" />
            </el-form-item>
            <el-form-item label="边框颜色" prop="borderColor">
                <el-color-picker v-model="formData.borderColor" />
            </el-form-item>
            <el-form-item label="边框透明度" prop="borderAlpha">
                <el-input v-model="formData.borderAlpha" type="number" />
            </el-form-item>
            <el-form-item label="背景颜色" prop="backgroundColor">
                <el-color-picker v-model="formData.backgroundColor" />
            </el-form-item>
            <el-form-item label="背景透明度" prop="backgroundAlpha">
                <el-input v-model="formData.backgroundAlpha" type="number" />
            </el-form-item>
            <el-form-item label="背景半径" prop="backgroundRadius">
                <el-input v-model="formData.backgroundRadius" type="number" />
            </el-form-item>
            <el-form-item label="字间距" prop="charSpacing">
                <el-input v-model="formData.charSpacing" type="number" />
            </el-form-item>
            <el-form-item label="行间距" prop="lineSpacing">
                <el-input v-model="formData.lineSpacing" type="number" />
            </el-form-item>
            <el-form-item label="气泡索引" prop="bubbleIndex">
                <el-input v-model="formData.bubbleIndex" type="number" />
            </el-form-item>
            <el-form-item label="对齐" prop="alignment">
                <el-input v-model="formData.alignment" type="number" />
            </el-form-item>
            <el-form-item label="字体" prop="textFont">
                <el-input :disabled="true" v-model="formData.textFont" style="width: 85%;margin-right: 10px;" />
                <el-button @click="editFont">编辑</el-button>
            </el-form-item>
            <el-form-item label="是否垂直显示" prop="verticalForm">
                <el-switch v-model="formData.verticalForm" />
            </el-form-item>
            <el-form-item label="是否使用画笔颜色" prop="useStrokeColor">
                <el-switch v-model="formData.useStrokeColor" />
            </el-form-item>
            <el-form-item label="是否显示删除线" prop="strikethrough">
                <el-switch v-model="formData.strikethrough" />
            </el-form-item>
            <el-form-item label="是否变化字形" prop="glyphTransform">
                <el-switch v-model="formData.glyphTransform" />
            </el-form-item>
            <el-form-item label="是否显示下划线" prop="underline">
                <el-switch v-model="formData.underline" />
            </el-form-item>
            <el-form-item label="是否使用新的颜色格式" prop="newColorFormat">
                <el-switch v-model="formData.newColorFormat" />
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
    <el-dialog v-model="isEditFont" title="编辑字体" width="500" :before-close="handleCloseFont">
        <el-form ref="fontFormRef" :model="editFontInfo" label-position="top">
            <el-form-item label="字体文件名" prop="fileId">
                <el-input v-model="editFontInfo.fileId" />
            </el-form-item>
            <el-form-item label="字体名" prop="fontname">
                <el-input v-model="editFontInfo.fontname" />
            </el-form-item>
            <el-form-item label="字体类型" prop="fontType">
                <el-input v-model="editFontInfo.fontType" type="number" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleCloseFont">取消</el-button>
                <el-button type="primary" @click="handleComfirmFont">
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
        showEditor: boolean,
        textTemplateTypeList: Array<any>
        editInfo: any
    }>()

    watch(() => props.showEditor, (newV) => {
        if (newV && props.editInfo) {
            Object.assign(formData.value, props.editInfo)
        }
    })
    const counterStore = useCounterStore()
    const { defaultAppNo, appList, regionList, showLoading } = storeToRefs(counterStore)
    const emit = defineEmits<{
        'update:showEditor': [value: boolean]
    }>()


    //编辑字体
    const setIndex = ref<number>(0)
    const isEditFont = ref<boolean>(false)
    const editFont = (index: number) => {
        const textFont = formData.value.textFont
        console.log('textFont', textFont);
        setIndex.value = index
        if (textFont) {
            editFontInfo.value = JSON.parse(textFont)
        }
        isEditFont.value = true
    }
    const editFontInfo = ref<any>({
        fileId: '',
        fontname: '',
        fontType: 0,
    })
    const handleCloseFont = () => {
        console.log('handleCloseFont');
        isEditFont.value = false
        Object.assign(editFontInfo.value, {
            fileId: '',
            fontname: '',
            fontType: 0,
        })
    }
    const handleComfirmFont = () => {
        console.log('editFontInfo', editFontInfo.value);

        formData.value.textFont = JSON.stringify(editFontInfo.value)
        handleCloseFont()

    }



    const formData = ref<any>({
        "id": null,     //新增为null，修改必传
        "appNo": "",   //必填
        "region": "",
        "templateType": "",
        "version": "",
        "color": "",    //颜色
        "colorAlpha": 1.0,  //颜色透明度
        "shadowRadius": 1.0, //阴影半径
        "shadowAlpha": 1.0, //阴影透明度
        "shadowColor": "",   //阴影颜色
        "shadowAngle": 1.0,   //阴影角度
        "shadowOffsetX": 1.0,  //阴影水平偏移量
        "borderWidth": 1.0,   //边框宽
        "borderColor": "",    //边框颜色
        "borderAlpha": 1.0,   //边框透明度
        "backgroundColor": "",  //背景颜色
        "backgroundAlpha": 1.0,  //背景透明度
        "backgroundRadius": 1.0,  //背景半径
        "charSpacing": 1.0,      //字间距
        "lineSpacing": 1.0,      //lineSpacing
        "bubbleIndex": 1,        //bubbleIndex
        "alignment": 1.0,        //对齐
        "textFont": "",          //字体
        "verticalForm": false,    //是否垂直显示
        "useStrokeColor": false,   //是否使用画笔颜色
        "strikethrough": false,    //是否显示删除线
        "glyphTransform": false,   //是否变化字形
        "newColorFormat": false,    //是否为新的颜色格式
        "underline": false,        //是否显示下划线
        "isPublic": false,          //是否为公共模板

    })


    const ruleFormRef = ref<any>(null)
    const rules = ref({

    })

    const resetForm = () => {
        formData.value = {
            "id": null,     //新增为null，修改必传
            "appNo": "",   //必填
            "region": "",
            "templateType": "",
            "version": "",
            "color": "",    //颜色
            "colorAlpha": 1.0,  //颜色透明度
            "shadowRadius": 1.0, //阴影半径
            "shadowAlpha": 1.0, //阴影透明度
            "shadowColor": "",   //阴影颜色
            "shadowAngle": 1.0,   //阴影角度
            "shadowOffsetX": 1.0,  //阴影水平偏移量
            "borderWidth": 1.0,   //边框宽
            "borderColor": "",    //边框颜色
            "borderAlpha": 1.0,   //边框透明度
            "backgroundColor": "",  //背景颜色
            "backgroundAlpha": 1.0,  //背景透明度
            "backgroundRadius": 1.0,  //背景半径
            "charSpacing": 1.0,      //字间距
            "lineSpacing": 1.0,      //lineSpacing
            "bubbleIndex": 1,        //bubbleIndex
            "alignment": 1.0,        //对齐
            "textFont": "",          //字体
            "verticalForm": false,    //是否垂直显示
            "useStrokeColor": false,   //是否使用画笔颜色
            "strikethrough": false,    //是否显示删除线
            "glyphTransform": false,   //是否变化字形
            "newColorFormat": false,    //是否为新的颜色格式
            "underline": false,        //是否显示下划线
            "isPublic": false,          //是否为公共模板
        }
        ruleFormRef.value?.resetFields()
    }
    const handleClose = () => {
        resetForm()
        emit('update:showEditor', false)
    }

    const saveChange = async () => {
        if (showLoading.value) {
            ElMessage.error('正在保存中，请稍后')
            return
        }
        showLoading.value = true
        try {
            formData.value.appNo = defaultAppNo.value
            const params = {
                ...formData.value,
                timestamp: Date.now(),
                type: formData.value.id ? 'update' : 'add'
            }
            console.log('params', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/textTemplate/save', {
                enData
            })
            if (res.data.code === 200) {
                ElMessage({
                    message: '保存成功',
                    type: 'success',
                })
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