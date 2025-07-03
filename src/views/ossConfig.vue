<template>
    <div class="view">
        <el-dialog v-model="dialogJSON" title="JSON配置" width="1000" :before-close="handleCloseJSON">
            <jsonEditor ref="childRef" v-model="jsonConfig" :comment-data="jsonConfigNote" @updateNote="updateNote"
                @inputChecked="inputChecked" @dateChange="dateChange" :editorType="editorType"
                :dialogJSON="dialogJSON" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleCloseJSON">取消</el-button>
                    <el-button type="primary" @click="handleComfirmJSON">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <appOSSEditor v-model:show-editor="showEditor" :configInfo="configInfo" />
        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions" style="display: flex;align-items: center;column-gap: 10px;">
                    <el-button type="primary" @click="addOSSConfig" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增配置链接
                    </el-button>

                    <el-button type="primary" class="add-button" @click="downloadTemplate">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        下载EXECEL模板
                    </el-button>
                    <el-upload action="#" :show-file-list='false' :http-request="importConfig">
                        <el-button type="primary" class="add-button">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            EXECEL导入
                        </el-button>
                    </el-upload>
                </div>
                <div class="right-actions">
                    <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
                        @changeView="changeView" />
                </div>
            </div>

            <el-divider class="divider" />

            <div class="filter-container">
                <!-- <div class="filter-row">
                    <div class="filter-item">

                    </div>
                    <div class="filter-item">

                    </div>



                    <div class="filter-item filter-actions">
                        <el-button type="primary" @click="getUserList">
                            <el-icon>
                                <Search />
                            </el-icon>
                            查询
                        </el-button>
                        <el-button @click="resetSearch">
                            <el-icon>
                                <Refresh />
                            </el-icon>
                            重置
                        </el-button>
                    </div>
                </div> -->


            </div>
        </el-card>
        <el-card class="content-card">
            <Transition enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut" mode="out-in">
                <component :is="componentName" :filterParams="filterParams" :tableData="appData" :isDownload="true"
                    :isEditJSON="true" @editor="editorOSSConfig" @delete="deleteOSSConfig" @editorJSON="editorJSON"
                    @download="downloadOSS"></component>
            </Transition>

            <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                :total="totalData" v-model:current-page="pageNum" v-model:page-size="pageSize" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import tableAciton from '@/components/public/tableAciton.vue';
    import { getKeysAsObject } from '../utils/keyAsObj'
    import userTable from '@/components/user/userTable.vue';
    import jsonEditor from '@/components/autoJson/jsonEditor.vue';
    import userList from '@/components/user/userList.vue';
    import appOSSEditor from '@/components/appOSS/appOSSEditor.vue';
    import { onMounted, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    const counterStore = useCounterStore()
    const { showPagestion, defaultAppNo, defaultCompanyNo, showLoading } = storeToRefs(counterStore)
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)

    //监听应用切换
    watch(() => defaultAppNo.value, () => {
        getUserList()
    })

    //分页
    const pageNum = ref<number>(1)
    const pageSize = ref<number>(10)
    const totalData = ref<number>(0)
    watch(() => pageNum.value, () => {
        getUserList()

    })



    //导入excel
    const importConfig = async (options: any) => {
        try {
            console.log('options', options);
            const { file } = options
            const formData = new FormData()
            formData.append('file', file)
            showLoading.value = true
            const res = await service.post('/oss/importByExcel', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            console.log('导入excel', res);
            if (res.data.code === 200) {
                ElMessage.success(res.data.msg)
                getUserList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('导入失败', err);
        } finally {
            showLoading.value = false
        }
    }

    //下载excel模板
    const downloadTemplate = async () => {
        try {
            showLoading.value = true
            const response = await service.get('/oss/importTemplate', {
                responseType: 'blob'
            });
            // 尝试从Content-Disposition获取文件名，如果后端有设置的话
            let fileName = '应用配置导入模板.xlsx'; // 设置一个默认或期望的文件名
            const disposition = response.headers['content-disposition'];
            if (disposition) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                    fileName = matches[1].replace(/['"]/g, '');
                    // 如果文件名是URL编码的，需要解码
                    try {
                        fileName = decodeURIComponent(fileName);
                    } catch (e) {
                        // 解码失败，使用原始匹配到的文件名
                        console.warn('Failed to decode filename from Content-Disposition', e);
                    }
                }
            }

            const blob = new Blob([response.data], {
                type: response.headers['content-type'] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            ElMessage.success('模板下载成功');

        } catch (err) {
            console.log('下载失败', err);
        } finally {
            showLoading.value = false
        }
    }



    //新增配置链接
    const showEditor = ref<boolean>(false)
    const addOSSConfig = () => {
        showEditor.value = true
    }

    //编辑配置链接
    const configInfo = ref<any>()
    watch(() => showEditor.value, (newV) => {
        if (!newV) {
            configInfo.value = ''
            getUserList()
        }
    })
    const editorOSSConfig = (item: any) => {
        configInfo.value = item
        showEditor.value = true

    }
    //删除配置链接
    const delOSSconfig = async (id: number) => {
        try {
            showLoading.value = true
            const res = await service.post(`/oss/del/${id}`)
            if (res.data.code === 200) {
                ElMessage({
                    message: '删除成功',
                    type: 'success',
                })
                getUserList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('保存失败', err);
        } finally {
            showLoading.value = false

        }
    }
    const deleteOSSConfig = (item: any) => {
        ElMessageBox.confirm(
            '此操作将永久删除该配置, 是否继续?',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(res => {
            delOSSconfig(item.id)
        })
    }


    //编辑JSON
    const dialogJSON = ref<boolean>(false)
    const editorType = ref<string>('value')
    type JsonDataType = Record<string, any>;
    const jsonConfig = ref<JsonDataType>({})//json数据
    const jsonConfigNote = ref<JsonDataType>({})//json注释
    const editJsonId = ref<number>()
    const getJSONInfo = async (id: number) => {
        try {
            const params = {
                timestamp: Date.now(),
                id: id
            }
            console.log('json参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.get(`/oss/jsonFile`, {
                params: {
                    enData
                }
            })

            console.log('获取json', res);
            if (res.data.code === 200) {
                if (res.data.rows[0]) {
                    jsonConfig.value = JSON.parse(res.data.rows[0])
                }
                if (res.data.rows[1]) {
                    jsonConfigNote.value = JSON.parse(res.data.rows[1])
                }

                editJsonId.value = id
                console.log('json数据', jsonConfig.value);
                console.log('json注释', jsonConfigNote.value);
                dialogJSON.value = true
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('获取JSON失败', err);
        } finally {
            showLoading.value = false
        }
    }
    const editorJSON = (item: any) => {
        console.log('编辑json', item);
        getJSONInfo(item.id)
    }

    const handleCloseJSON = () => {
        jsonConfig.value = {}
        dialogJSON.value = false
    }

    // 检查嵌套属性是否存在
    function hasCommaNestedProperty(obj: Record<string, any>, path: string): boolean {
        // 直接检查是否有完全匹配的键
        if (path in obj) {
            return true;
        }

        // 检查是否有以逗号形式表示的嵌套属性
        for (const key of Object.keys(obj)) {
            if (key.includes(',')) {
                const parts = key.split(',');
                // 如果path作为任何部分出现在逗号分隔的键中
                if (parts.includes(path)) {
                    return true;
                }
            }
        }

        return false;
    }

    //参数值url编码
    const enCodeObj = (obj: any): any => {
        const result: any = {};
        // Check if the input is an array
        if (Array.isArray(obj)) {
            // If it's an array, map over its elements and recursively encode them
            return obj.map(item => enCodeObj(item));
        }

        // If it's an object (and not null)
        if (typeof obj === 'object' && obj !== null) {
            for (const key in obj) {
                // Ensure the property belongs to the object itself
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    const value = obj[key];
                    if (typeof value === 'string') {
                        result[key] = encodeURIComponent(value);
                    } else if (typeof value === 'object' && value !== null) {
                        // Recursively call enCodeObj for nested objects or arrays
                        result[key] = enCodeObj(value);
                    } else {
                        // Handle other primitive types directly
                        result[key] = value;
                    }
                }
            }
            return result;
        }

        // Return primitive values directly (if not a string already handled)
        // This handles cases where the initial input might be a non-string primitive
        return obj;
    }
    //编辑备注
    const assaginOBj = (key: string, value: any, obj: any) => {
        if (Object.keys(jsonConfigNote.value).length === 0) {

            jsonConfigNote.value = obj
        } else {
            jsonConfigNote.value[key] = value
        }
    }


    const childRef = ref()
    // 调用子组件方法
    const callChildMethod = () => {
        childRef.value?.setJsonData()
    }
    const updateNote = (note: any) => {
        callChildMethod()
        const { value, path } = note

        const hasPath = hasCommaNestedProperty(jsonConfig.value, path)
        console.log('hasPath', hasPath, jsonConfig.value, path);
        // if (!hasPath) {
        //   jsonData.value[path] = ''
        // }

        const noteObj = getKeysAsObject(jsonConfig.value)
        console.log('noteObj', noteObj);
        console.log('Object.entries(noteObj)', Object.entries(noteObj));
        for (const [key, val] of Object.entries(noteObj)) {
            // 如果是直接匹配到顶层属性
            if (key.includes(',')) {

                if (key.includes(path)) {
                    console.log('keypath', key, path);
                    noteObj[key] = value;
                    assaginOBj(key, value, noteObj)

                }
            } else {
                console.log('key', key);
                if (key === path) {
                    noteObj[path] = value;
                    console.log(`更新顶层属性 ${path}:`, value);
                    console.log('noteObj', noteObj);
                    console.log('comments', jsonConfigNote.value);
                    assaginOBj(key, value, noteObj)
                    console.log('noteObj', jsonConfigNote.value);
                    return;
                }
            }



        }


    }
    //编辑布尔值
    const inputChecked = (key: string) => {
        console.log('jsonData.value', jsonConfig.value);
        // 遍历 jsonData 中的所有属性
        for (const [dataKey, value] of Object.entries(jsonConfig.value)) {
            // 如果是对象类型，检查其内部属性
            if (typeof value === 'object' && value !== null) {
                // 如果在嵌套对象中找到了对应的 key
                if (key in value && typeof value[key] === 'boolean') {
                    value[key] = !value[key];
                    console.log(`修改嵌套值 ${dataKey}.${key}:`, value[key]);
                    console.log('Jsondata', jsonConfig.value);

                    return;
                }
            }
            // 如果是顶层属性
            else if (dataKey === key) {
                if (typeof value === 'boolean') {
                    jsonConfig.value[key] = !value;
                } else {
                    // 如果不是布尔值，可以设置一个默认的布尔值
                    jsonConfig.value[key] = true;
                }
                console.log(`修改顶层值 ${key}:`, jsonConfig.value[key]);
                console.log('Jsondata', jsonConfig.value);

                return;
            }
        }


    }

    //编辑日期
    const dateChange = (dateObj: any) => {
        const { path, value } = dateObj;

        // 遍历 jsonData 中的所有属性
        for (const [key, val] of Object.entries(jsonConfig.value)) {
            // 如果是直接匹配到顶层属性
            if (key === path) {
                jsonConfig.value[path] = value;
                console.log(`更新顶层属性 ${path}:`, value);
                return;
            }

            // 如果是对象，检查其内部属性
            if (val && typeof val === 'object' && !Array.isArray(val)) {
                if (path in val) {
                    val[path] = value;
                    console.log(`更新嵌套属性 ${key}.${path}:`, value);
                    return;
                }
            }
        }

        console.warn(`未找到路径 ${path}`);
    }

    //确定修改json
    const handleComfirmJSON = async () => {
        try {
            callChildMethod()


            const jsonData = JSON.stringify(enCodeObj(jsonConfig.value))

            const jsonNote = JSON.stringify(enCodeObj(jsonConfigNote.value))

            const params = {
                timestamp: Date.now(),
                id: editJsonId.value,
                json: jsonData,
                noteJson: jsonNote
            }

            console.log('保存json参数', params);
            const enData = desEncrypt(JSON.stringify(params))


            showLoading.value = true
            const res = await service.post('/oss/upJson', {
                enData
            })
            console.log('保存结果', res);


            if (res.data.code === 200) {
                ElMessage.success('保存成功')

                handleCloseJSON()


                getUserList()
            } else {
                ElMessage.error('保存失败')
            }

        } catch (err) {
            ElMessage.error('保存失败')
        } finally {
            showLoading.value = false
        }

    }


    //下载OSS文件
    const downloadOSS = async (item: any) => {
        try {
            const params = {
                timestamp: Date.now(),
                id: item.id
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.get('/oss/getFile', {
                params: {
                    enData
                },
                responseType: 'blob'
            })

            console.log('下载oss文件', res);
            const blob = new Blob([res.data], {
                type: res.headers['content-type'] || 'application/json'
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'oss.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            ElMessage.success('模板下载成功');
        } catch (err) {
            console.log('下载失败', err);
        } finally {
            showLoading.value = false
        }
    }

    interface ApplicationData {
        companyName: string;   // 公司名称
        appName: string;       // 应用名称
        endpoint: string;      // 端点
        bucket: string;        // 域
        folder: string;    // 文件夹
        name: string;      // 文件名
    }


    const appNote: any = {
        companyName: '公司名称',
        appName: '应用名称',
        endpoint: '端点',
        bucket: '域',
        folder: '文件夹',
        name: '文件名'

    }
    // 生成用户数据
    const appData = ref<ApplicationData[]>([

    ])
    interface filterParams {
        note: string
        isShow: boolean
        key: string
    }
    const filterParams = ref<filterParams[]>()
    const getUserList = async () => {
        try {

            const params = {
                timestamp: Date.now(),
                pageNum: pageNum.value,
                pageSize: pageSize.value,
                companyNo: defaultCompanyNo.value,
                appNo: defaultAppNo.value
            }
            console.log('应用配置参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/oss/list', {
                enData
            })
            console.log('获取应用配置列表', res);
            totalData.value = res.data.total
            appData.value = res.data.rows
            const keys = Object.keys(appNote)
            filterParams.value = keys.map((item) => {
                return {
                    note: appNote[item],
                    isShow: true,
                    key: item
                }
            })
            console.log('filterParams', filterParams.value);
        } catch (err) {
            console.log('获取应用配置列表失败', err);
        } finally {
            showLoading.value = false
        }



    }
    //参数显影
    const checkedParams = ({ key, checked }: any) => {
        console.log('修改参数', key, checked);
        const item = filterParams.value?.find((item) => item.key === key)
        if (item) {
            item.isShow = checked
        }

    }
    //切换显示模式
    const changeView = () => {

        const keys = Object.keys(components)
        const keyItem = keys.find((item) => item !== componentStr.value)
        if (keyItem) {
            componentStr.value = keyItem
            componentName.value = components[keyItem]
        }
        console.log('keyItem', keyItem);
    }
    onMounted(() => {
        getUserList();
        showPagestion.value = true
    })
</script>

<style scoped lang="scss">
    .view {
        .filter-card {
            width: 100%;
            margin-bottom: 20px;

            .card-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;

                .left-actions {
                    .add-button {
                        font-weight: 500;

                        .el-icon {
                            margin-right: 4px;
                        }
                    }
                }

                .right-actions {
                    display: flex;
                    align-items: center;
                }
            }

            .divider {
                margin: 12px 0;
            }

            .filter-container {
                .filter-row {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 16px;

                    &:last-child {
                        margin-bottom: 0;
                    }

                    .filter-item {
                        // flex: 1;
                        width: 200px;
                        /* 允许元素收缩到比内容更小 */
                    }

                    .button-group {
                        display: flex;
                        justify-content: flex-end;
                        gap: 8px;
                        width: 100%;
                    }
                }
            }
        }

        .content-card {
            height: calc(100vh - 220px);

            .pagesBox {
                margin-top: 30px;
            }
        }
    }
</style>