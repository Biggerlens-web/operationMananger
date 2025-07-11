<template>
    <el-dialog :model-value="showEditor" title="编辑教程分类" width="500" :before-close="handleClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <el-form-item label="所属应用" prop="appNo">
                <el-select v-model="formData.appNo" filterable :disabled="isEdit">
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
                </el-select>
            </el-form-item>
            <el-form-item label="分类" prop="id" v-if="isEdit">
                <el-select v-model="formData.id" filterable @change="changeCategory">
                    <el-option v-for="item in categoryTypes" :key="item.id" :label="item.categoryName"
                        :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="分类类型名称" prop="type">
                <el-input v-model="formData.categoryName" />

            </el-form-item>
            <el-form-item label="系统" prop="os">
                <el-select v-model="formData.os">
                    <el-option v-for="item in OSlist" :key="item.value" :label="item.note" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="教程排序" prop="categoryIndex">
                <el-input v-model="formData.categoryIndex" type="number" />
            </el-form-item>
            <el-form-item label="地区" prop="region">
                <el-select filterable v-model="formData.region" placeholder="国内外" class="filter-select">
                    <el-option v-for="item in regionList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="语言" prop="language" v-show="formData.region !== 'domestic'">
                <el-select filterable v-model="formData.language" placeholder="语言" class="filter-select">
                    <el-option v-for="item in international" :key="item.value" :label="item.language"
                        :value="item.value" />
                </el-select>
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
        categoryTypes: any
        isEdit: boolean
        searchParams: any
    }>()

    const getEditInfo = async () => {
        try {
            const params = {

            }
        } catch (err) {

        }
    }
    watch(() => props.showEditor, (newV) => {
        if (newV) {
            formData.value.appNo = defaultAppNo.value
        }
    })
    const counterStore = useCounterStore()
    const { appList, OSlist, regionList, showLoading, international, defaultAppNo } = storeToRefs(counterStore)
    const emit = defineEmits<{
        'update:showEditor': [value: boolean]
    }>()
    const formData = ref<any>({
        id: '',
        "categoryName": "",
        "appNo": '',
        "categoryIndex": 1,
        "region": "",
        "language": "",
        "os": "",
        categoryId: ''
    })


    const ruleFormRef = ref<any>(null)
    const rules = ref({

    })


    //编辑分类
    const changeCategory = (item: any) => {
        console.log('item', item);
        const categoryItem = props.categoryTypes.find((el: any) => el.id === item)
        console.log('categoryItem', categoryItem);
        formData.value.categoryName = categoryItem.categoryName
        formData.value.os = categoryItem.os
        formData.value.categoryIndex = categoryItem.categoryIndex
        formData.value.region = categoryItem.region
        formData.value.language = categoryItem.language
    }
    const resetForm = () => {
        formData.value = {
            id: '',
            "categoryName": "",
            "appNo": '',
            "categoryIndex": 1,
            "region": "",
            "language": "",
            "os": "",
            categoryId: ''
        }
        ruleFormRef.value?.resetFields()
    }
    const handleClose = () => {
        resetForm()
        emit('update:showEditor', false)
    }


    const saveChange = async () => {

        showLoading.value = true
        try {
            let params: any = {

            }
            let url: string = ''



            params = {
                timestamp: new Date().getTime(),
                type: formData.value.id ? 'update' : 'add',
                id: formData.value.id,
                categoryName: formData.value.categoryName,
                appNo: formData.value.appNo,
                categoryIndex: formData.value.categoryIndex,
                region: formData.value.region,
                language: formData.value.region !== 'domestic' ? formData.value.language : 'zh',
                os: formData.value.os
            }
            if (formData.value.id) {
                url = '/category/editCategory'
                delete params.id
                params.categoryId = formData.value.id
                delete params.categoryName
                params.updateCategoryName = formData.value.categoryName
            } else {
                url = '/category/save'
            }

            console.log('保存参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post(url, {
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