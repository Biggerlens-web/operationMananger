<template>
    <div class="view">
        <!-- JSON配置弹窗 -->
        <el-dialog v-model="dialogJSON" title="JSON配置" width="1000" :before-close="handleCloseJSON">
            <!-- JSON编辑器组件 -->
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
    import { onMounted, ref, watch, nextTick } from 'vue';

    /**
     * 防抖函数工具
     * 用于限制函数的执行频率，避免频繁调用
     * @param func 需要防抖的函数
     * @param delay 延迟时间（毫秒）
     * @returns 防抖后的函数
     */
    const debounce = (func: Function, delay: number) => {
        let timeoutId: ReturnType<typeof setTimeout>
        return (...args: any[]) => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => func.apply(null, args), delay)
        }
    }
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';

    /**
     * 错误消息常量定义
     * 统一管理所有错误提示信息，便于维护和国际化
     */
    const ERROR_MESSAGES = {
        /** 配置ID验证相关 */
        INVALID_CONFIG_ID: '配置ID不能为空',
        INVALID_CONFIG_ITEM: '配置项无效',

        /** JSON数据处理相关 */
        JSON_PARSE_ERROR: 'JSON数据格式错误',
        JSON_STRINGIFY_ERROR: 'JSON数据格式错误，无法保存',

        /** 网络请求相关 */
        NETWORK_ERROR: '网络请求失败，请稍后重试',
        GET_CONFIG_FAILED: '获取配置失败',

        /** 操作结果相关 */
        SAVE_SUCCESS: '保存成功',
        SAVE_FAILED: '保存失败',
        UPDATE_NOTE_FAILED: '更新注释失败',
        DATE_UPDATE_FAILED: '日期更新失败',
        OPERATION_FAILED: '操作失败',

        /** 数据验证相关 */
        PROPERTY_NOT_FOUND: '属性 {key} 未找到',
        INVALID_PATH: '路径不能为空',
        INVALID_KEY: '键名不能为空'
    } as const

    /**
     * 防抖延迟时间常量（毫秒）
     * 用于优化用户输入体验，避免频繁触发更新
     */
    const DEBOUNCE_DELAY = 150
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


    /**
     * JSON配置相关接口定义
     */

    /**
     * JSON数据类型定义
     * 用于表示动态的JSON配置数据结构
     */
    interface JsonDataType {
        [key: string]: any;
    }

    /**
     * JSON配置状态管理接口
     * 定义JSON编辑器的完整状态结构
     */
    interface JsonConfigState {
        /** 是否显示JSON配置对话框 */
        dialogJSON: boolean;
        /** 编辑器类型（value/note） */
        editorType: string;
        /** JSON配置数据 */
        jsonConfig: JsonDataType;
        /** JSON配置注释数据 */
        jsonConfigNote: JsonDataType;
        /** 当前编辑的配置ID */
        editJsonId?: number;
    }

    /**
     * JSON配置状态管理
     * 管理JSON编辑器的所有状态变量
     */

    /** JSON配置对话框显示状态 */
    const dialogJSON = ref<boolean>(false)

    /** 编辑器类型，用于区分编辑值还是注释 */
    const editorType = ref<string>('value')

    /** JSON配置数据，存储实际的配置内容 */
    const jsonConfig = ref<JsonDataType>({})

    /** JSON配置注释数据，存储配置项的说明信息 */
    const jsonConfigNote = ref<JsonDataType>({})

    /** 当前正在编辑的配置项ID */
    const editJsonId = ref<number | undefined>()
    /**
     * 获取JSON配置信息
     * @param id 配置ID
     */
    const getJSONInfo = async (id: number): Promise<void> => {
        if (!id) {
            ElMessage.error(ERROR_MESSAGES.INVALID_CONFIG_ID)
            return
        }

        try {
            const params = {
                timestamp: Date.now(),
                id
            }

            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true

            const res = await service.get('/oss/jsonFile', {
                params: { enData }
            })

            if (res.data.code === 200) {
                // 安全解析JSON数据
                try {
                    jsonConfig.value = res.data.rows[0] ? JSON.parse(res.data.rows[0]) : {}
                    jsonConfigNote.value = res.data.rows[1] ? JSON.parse(res.data.rows[1]) : {}
                } catch (parseError) {
                    console.error('JSON解析失败:', parseError)
                    ElMessage.error(ERROR_MESSAGES.JSON_PARSE_ERROR)
                    return
                }

                editJsonId.value = id
                dialogJSON.value = true
            } else {
                ElMessage.error(res.data.msg || ERROR_MESSAGES.GET_CONFIG_FAILED)
            }
        } catch (error) {
            console.error('获取JSON配置失败:', error)
            ElMessage.error(ERROR_MESSAGES.NETWORK_ERROR)
        } finally {
            showLoading.value = false
        }
    }
    /**
     * 编辑JSON配置
     * @param item 配置项
     */
    const editorJSON = (item: any): void => {
        if (!item?.id) {
            ElMessage.error(ERROR_MESSAGES.INVALID_CONFIG_ITEM)
            return
        }
        getJSONInfo(item.id)
    }

    /**
     * 关闭JSON配置弹窗
     */
    const handleCloseJSON = (): void => {
        // 重置状态
        jsonConfig.value = {}
        jsonConfigNote.value = {}
        editJsonId.value = undefined
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

    /**
     * 对象参数URL编码工具函数
     * 递归遍历对象，对字符串值进行URL编码
     * @param obj 需要编码的对象或数组
     * @returns 编码后的对象或数组
     */
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



    /**
     * 子组件引用
     * 用于访问jsonEditor组件的方法和属性
     */
    const childRef = ref()

    /**
     * 调用子组件方法同步数据
     * 触发jsonEditor组件的setJsonData方法，同步JSON数据
     */
    const callChildMethod = (): void => {
        childRef.value?.setJsonData()
    }

    // 防抖定时器


    /**
     * 更新注释信息
     * @param note 注释对象，包含值和路径
     */
    const updateNote = debounce((note: { value: string; path: string }): void => {
        const { value, path } = note

        if (!path) {
            console.warn('注释路径不能为空')
            return
        }

        try {
            // 直接更新jsonConfigNote对象，不需要通过getKeysAsObject重新生成
            let isUpdated = false

            // 首先检查是否有完全匹配的路径
            if (jsonConfigNote.value[path] !== undefined) {
                jsonConfigNote.value[path] = value
                isUpdated = true
                console.log(`直接更新路径注释: ${path} = ${value}`)
            } else {
                // 检查是否有包含该路径的复合键
                for (const [key] of Object.entries(jsonConfigNote.value)) {
                    if (key.includes(',') && key.includes(path)) {
                        jsonConfigNote.value[key] = value
                        isUpdated = true
                        console.log(`更新复合路径注释: ${key} = ${value}`)
                        break
                    }
                }
            }

            // 如果没有找到匹配的路径，说明是新增的key，直接添加到注释对象中
            if (!isUpdated) {
                console.log(`新增路径注释: ${path} = ${value}`)
                jsonConfigNote.value[path] = value
                isUpdated = true
            }

            // 成功更新后，直接更新DOM中的注释显示，避免重新渲染整个编辑器
            if (isUpdated) {
                // 使用更安全的方法查找DOM元素，避免特殊字符导致的querySelector错误
                try {
                    // 先尝试使用getElementById，因为ID中的特殊字符在getElementById中是安全的
                    const elementId = `jsoneditor-desc${path}`
                    let editorInput = document.getElementById(elementId)
                    
                    // 如果getElementById失败，尝试使用属性选择器
                    if (!editorInput) {
                        editorInput = document.querySelector(`[id="${elementId}"]`)
                    }
                    
                    // 如果还是找不到，使用更通用的方法遍历查找
                    if (!editorInput) {
                        const allDescElements = document.querySelectorAll('[id^="jsoneditor-desc"]')
                        for (const element of allDescElements) {
                            if (element.id === elementId) {
                                editorInput = element as HTMLElement
                                break
                            }
                        }
                    }
                    
                    if (editorInput instanceof HTMLElement) {
                        editorInput.textContent = value
                        console.log('注释更新完成，当前jsonConfigNote:', jsonConfigNote.value)
                    } else {
                        // 如果DOM中没有找到对应的注释元素（新增属性的情况），需要重新初始化注释显示
                        console.log('未找到注释元素，重新初始化注释显示')
                        setTimeout(() => {
                            callChildMethod()
                        }, 100)
                    }
                } catch (domError) {
                    console.warn('DOM操作失败，重新初始化注释显示:', domError)
                    setTimeout(() => {
                        callChildMethod()
                    }, 100)
                }
            }

        } catch (error) {
            console.error('更新注释失败:', error)
            ElMessage.error(ERROR_MESSAGES.UPDATE_NOTE_FAILED)
        }
    }, DEBOUNCE_DELAY)
    /**
     * 编辑布尔值
     * @param key 要切换的布尔值键名
     */
    const inputChecked = (key: string): void => {
        if (!key) {
            console.warn(ERROR_MESSAGES.INVALID_KEY)
            return
        }

        try {
            // 遍历JSON配置中的所有属性
            for (const [dataKey, value] of Object.entries(jsonConfig.value)) {
                // 检查嵌套对象中的属性
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    if (key in value && typeof value[key] === 'boolean') {
                        value[key] = !value[key]
                        return
                    }
                }
                // 检查顶层属性
                else if (dataKey === key && typeof value === 'boolean') {
                    jsonConfig.value[key] = !value
                    return
                }
            }

            // 如果没找到对应的布尔值，设置默认值
            console.warn(`未找到布尔值属性: ${key}，设置默认值为true`)
            jsonConfig.value[key] = true
        } catch (error) {
            console.error('切换布尔值失败:', error)
            ElMessage.error(ERROR_MESSAGES.OPERATION_FAILED)
        }
    }

    /**
     * 编辑日期值
     * @param dateObj 日期对象，包含路径和值
     */
    const dateChange = (dateObj: { path: string; value: any }): void => {
        const { path, value } = dateObj

        if (!path) {
            console.warn(ERROR_MESSAGES.INVALID_PATH)
            return
        }

        try {
            // 遍历JSON配置中的所有属性
            for (const [key, val] of Object.entries(jsonConfig.value)) {
                // 检查顶层属性
                if (key === path) {
                    jsonConfig.value[path] = value
                    return
                }

                // 检查嵌套对象中的属性
                if (val && typeof val === 'object' && !Array.isArray(val)) {
                    if (path in val) {
                        (val as Record<string, any>)[path] = value
                        return
                    }
                }
            }

            console.warn(`未找到日期路径: ${path}`)
        } catch (error) {
            console.error('更新日期失败:', error)
            ElMessage.error(ERROR_MESSAGES.DATE_UPDATE_FAILED)
        }
    }

    /**
     * 确认保存JSON配置
     */
    const handleComfirmJSON = async (): Promise<void> => {
        if (!editJsonId.value) {
            ElMessage.error(ERROR_MESSAGES.INVALID_CONFIG_ID)
            return
        }

        try {
            // 调用子组件方法同步数据
            callChildMethod()

            // 等待一小段时间确保数据同步完成
            await new Promise(resolve => setTimeout(resolve, 50))

            // 验证JSON数据
            let jsonData: string
            let jsonNote: string

            try {
                jsonData = JSON.stringify(jsonConfig.value)
                console.log("🚀 ~ handleComfirmJSON ~ jsonData:", jsonData)
                jsonNote = JSON.stringify(jsonConfigNote.value)
                console.log("🚀 ~ handleComfirmJSON ~ jsonNote:", jsonNote)
            } catch (stringifyError) {
                console.error('JSON序列化失败:', stringifyError)
                ElMessage.error(ERROR_MESSAGES.JSON_STRINGIFY_ERROR)
                return
            }

            const params = {
                timestamp: Date.now(),
                id: editJsonId.value,
                json: jsonData,
                noteJson: jsonNote
            }

            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true

            const res = await service.post('/oss/upJson', { enData })

            if (res.data.code === 200) {
                ElMessage.success(ERROR_MESSAGES.SAVE_SUCCESS)
                handleCloseJSON()
                getUserList()
            } else {
                ElMessage.error(res.data.msg || ERROR_MESSAGES.SAVE_FAILED)
            }
        } catch (error) {
            console.error('保存JSON配置失败:', error)
            ElMessage.error(ERROR_MESSAGES.NETWORK_ERROR)
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
            height: max-content;

            .pagesBox {
                margin-top: 30px;
            }
        }
    }
</style>