<template>
    <el-dialog v-model="dialogVisible" width="600" title="父类管理" :berfore-close="handleClose">



        <el-form-item label="应用">
            <el-select @change="getParentTypeList" filterable v-model="searchParams.appNo" placeholder="应用"
                class="filter-select" clearable>
                <el-option v-for="item in appList" :key="item.appNo"
                    :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                    :value="item.appNo" />
            </el-select>
        </el-form-item>
        <el-form-item label="地区">
            <el-select clearable @change="getParentTypeList" v-model="searchParams.region" placeholder="地域">

                <el-option v-for="item in regionList" :key="item.value" :label="item.label"
                    :value="item.value"></el-option>

            </el-select>
        </el-form-item>
        <ul>
            <li v-for="(item, index) in parentList" :key="index">

                <el-input v-model="item.classType" @blur="editParentName(item)"></el-input>
                <el-input :disabled="true" v-model="item.international"></el-input>
                <el-button @click="setLanguage('edit', item)">编辑</el-button>
                <el-button type="danger" @click="removeParent(item.id)">删除</el-button>
            </li>
            <li>
                <el-button style="width: 100%;" @click="showAddParentDialog">新增</el-button>
            </li>
        </ul>
    </el-dialog>

    <!-- 国际化编辑弹窗 -->
    <el-dialog title="编辑国际化" v-model="languageDialogVisible" width="550">
        <ul class="language_select_list">
            <li v-for="(item, index) in languageData" :key="index">
                <el-select v-model="item.language">
                    <el-option v-for="langOption in international" :key="langOption.value" :label="langOption.language"
                        :value="langOption.value" :disabled="isLanguageSelected(langOption.value, item.language)" />
                </el-select>

                <el-input v-model="item.value" placeholder="请输入文本">

                </el-input>
                <el-button type="danger" @click="removeLanguageLi(index)">删除</el-button>
            </li>
            <li>
                <el-button style="width: 100%;" @click="addLanguageLi">添加一行</el-button>
            </li>

        </ul>
        <p style="display: flex;justify-content: flex-end;">
            <el-button type="primary" @click="handleLanguageComfirm">
                确定
            </el-button>
            <el-button @click="languageDialogVisible = false">
                取消
            </el-button>
        </p>

    </el-dialog>


    <!-- 新增父类 -->
    <el-dialog title="新增父类" width="500" v-model="showAddParent">
        <el-form-item label="应用">
            <el-select filterable v-model="addParentData.appNo" placeholder="请选择应用">
                <el-option v-for="item in appList" :key="item.appNo"
                    :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                    :value="item.appNo" />
            </el-select>
        </el-form-item>
        <el-form-item label="区域">

            <el-radio-group v-model="addParentData.region">

                <el-radio v-for="item in regionList" :key="item.value" :value="item.value" size="large">{{ item.label
                }}</el-radio>

            </el-radio-group>

        </el-form-item>
        <el-form-item label="父类名称">
            <el-input v-model="addParentData.classType"></el-input>
        </el-form-item>
        <el-form-item label="国际化">
            <el-input :disabled="true" v-model="addParentData.international"></el-input>
            <el-button @click="setLanguage('add')">编辑</el-button>
        </el-form-item>
        <p style="display: flex;justify-content: flex-end;">
            <el-button type="primary" @click="addParentFn">确定</el-button>
        </p>
    </el-dialog>
</template>

<script lang="ts" setup>
    import service from '@/axios'
    import { useCounterStore } from '@/stores/counter'
    import { desEncrypt } from '@/utils/des'
    import { ElMessage } from 'element-plus'
    import { storeToRefs } from 'pinia'
    import { reactive, ref, watch } from 'vue'

    const stores = useCounterStore()
    const { international, appList, regionList, showLoading } = storeToRefs(stores)

    const dialogVisible = defineModel('dialog')
    const handleClose = () => {
        dialogVisible.value = false
    }


    //筛选条件
    const searchParams = ref<any>({
        appNo: '',
        region: '',

    })




    //删除父类
    const removeParent = async (id: number | string) => {
        try {
            showLoading.value = true
            const res = await service.post('/clothingMaterialsType/del/' + id)


            if (res.data.code === 200) {
                ElMessage.success('删除成功')
                getParentTypeList()
            } else {
                ElMessage.error('删除失败')
            }
        } catch (err) {
            console.log('删除失败', err);
        } finally {
            showLoading.value = false
        }
    }
    //获取父分类列表
    const getParentTypeList = async () => {
        try {


            const params = {
                appNo: searchParams.value.appNo,
                region: searchParams.value.region,
                timestamp: Date.now()
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.get('/clothingMaterialsType/list', {
                params: {
                    enData
                }
            })
            console.log('获取父分类列表', res);

            parentList.value = res.data.data.list
        } catch (err) {


            console.log('获取父分类失败', err);
        } finally {
            showLoading.value = false
        }
    }
    const parentList = ref<any>([

    ])




    watch(() => dialogVisible.value, (newV) => {

        if (newV) {
            getParentTypeList()
        }

    })


    //设置国际化

    const parenti18n = ref('')

    const languageDialogVisible = ref<boolean>(false)

    const languageData = ref<any>([
        {
            language: '',
            value: ''
        }

    ])

    //新增父类
    const addParentFn = async () => {
        try {
            const params = {
                appNo: addParentData.value.appNo,
                region: addParentData.value.region,
                classType: addParentData.value.classType,
                international: addParentData.value.international,
                timestamp: Date.now()
            }

            console.log('参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/clothingMaterialsType/save', {
                enData
            })
            console.log('保存父类', res);
            if (res.data.code === 200) {
                ElMessage.success('新增成功')
                getParentTypeList()
                showAddParent.value = false
            } else {
                ElMessage.error('新增失败')
            }

        } catch (err) {
            console.log('保存父类失败', err);

        } finally {
            showLoading.value = false
        }
    }


    const setLanguageType = ref<string>()
    const editorParentName = ref<string>()
    const editorParentId = ref<any>()
    const setLanguage = (type: string, item?: any) => {
        setLanguageType.value = type

        switch (type) {
            case 'edit':

                parenti18n.value = item.international
                editorParentName.value = item.classType
                editorParentId.value = item.id
                break;
            case 'add':

                if (addParentData.value.international) {
                    parenti18n.value = addParentData.value.international
                } else {
                    parenti18n.value = ''
                }

                break;
        }


        languageDialogVisible.value = true
    }





    const addLanguageLi = () => {
        languageData.value.push({
            language: '',
            value: '',

        })
    }
    const removeLanguageLi = (index: number) => {
        if (languageData.value.length == 1) {

            ElMessage.warning('至少保留一行')
            return
        }
        languageData.value.splice(index, 1)
    }
    const isLanguageSelected = (languageValue: string, currentLanguage: string) => {
        // 如果是当前行已选的语言，则不禁用
        if (languageValue === currentLanguage) {
            return false;
        }
        // 检查该语言是否已被其他行选择
        return languageData.value.some((dataItem: any) => dataItem.language === languageValue);
    }
    const openLanguageDialog = () => {
        if (parenti18n.value) {
            try {
                const i18nObject = JSON.parse(parenti18n.value);
                languageData.value = Object.entries(i18nObject).map(([key, value]) => ({
                    language: key,
                    value: value as string
                }));
            } catch (error) {
                console.error('Failed to parse i18n JSON string:', error);
                // 如果解析失败，可以重置为默认值或进行错误处理
                languageData.value = [{ language: '', value: '' }];
            }
        } else {
            // 如果 formData.i18n 为空，则使用默认的初始值或清空
            languageData.value = [{ language: '', value: '' }];
        }
        languageDialogVisible.value = true;
    };



    watch(() => languageDialogVisible.value, (newV) => {
        if (newV) {
            openLanguageDialog()
        }
    })
    //修改父类国际化
    const edirParentInternational = async () => {
        try {


            const editItem = parentList.value.find((item: any) => item.id === editorParentId.value)
            const params = {
                id: editorParentId.value,
                international: parenti18n.value,
                region: editItem.region,
                appNo: editItem.appNo,
                classType: editItem.classType,
                timestamp: Date.now()
            }
            console.log('修改参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/clothingMaterialsType/save', {
                enData
            })
            console.log('保存父类', res);
        } catch (err) {
            console.log('修改失败', err);
        } finally {
            showLoading.value = false
        }
    }


    //修改父类名称
    const editParentName = async (item: any) => {
        try {
            const params = {
                id: item.id,
                classType: item.classType,
                region: item.region,
                appNo: item.appNo,
                international: item.international,
                timestamp: Date.now()
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/clothingMaterialsType/save', {
                enData
            })
            console.log('修改名称', res);
        } catch (err) {
            console.log('修改名称失败', err);
        } finally {
            showLoading.value = false
        }
    }
    const handleLanguageComfirm = async () => {
        const i18nObject = languageData.value.reduce((acc: any, cur: any) => {
            if (cur.language && cur.value) {
                acc[cur.language] = cur.value;
            }
            return acc;
        }, {} as Record<string, string>);
        parenti18n.value = JSON.stringify(i18nObject);
        if (setLanguageType.value === 'edit') {
            await edirParentInternational()
            editorParentId.value = ''
            getParentTypeList()

        } else {

            addParentData.value.international = parenti18n.value


        }
        languageDialogVisible.value = false;
    }






    //新增父类
    const showAddParent = ref(false)
    const addParentData = ref({
        classType: '',
        international: '',
        region: '',
        appNo: ''
    })
    const showAddParentDialog = () => {
        addParentData.value = {
            classType: '',
            international: '',
            region: '',
            appNo: ''
        }
        showAddParent.value = true
    }

</script>

<style lang="scss" scoped>
    .language_select_list {
        list-style: none;
        padding: 0;

        li {
            display: flex;
            align-items: center;
            margin-bottom: 10px;

            .el-select {
                margin-right: 10px;
                width: 120px;
            }

            .el-input {
                margin-right: 10px;
            }
        }
    }

    ul {
        list-style: none;
        padding: 0;

        li {
            display: flex;
            align-items: center;
            margin-bottom: 10px;

            .el-input {
                margin-right: 10px;
            }

            .el-input:first-of-type {
                width: 150px; // 设置第一个输入框的宽度
            }

            .el-input:nth-of-type(2) {
                flex-grow: 1; // 让第二个输入框占据剩余空间
            }

            .el-button {
                margin-left: auto; // 将编辑按钮推到最右边
            }
        }
    }
</style>