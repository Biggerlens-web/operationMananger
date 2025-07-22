<template>
    <!-- 视图主容器 -->
    <div class="view">
        <!-- 服装编辑器组件 -->
        <clothEditor v-model:show-editor="showEditor" :editorInfo="editorItemInfo" :type="'clothing'" />
        <!-- 父类管理弹窗 -->
        <parentManager v-model:dialog="showParentManage" />
        <!-- 过滤和操作卡片 -->
        <el-card class="filter-card">
            <!-- 卡片头部 -->
            <div class="card-header" style="margin: 0;">
                <!-- 左侧操作按钮 -->
                <div class="left-actions">
                    <!-- 新增按钮 -->
                    <el-button type="primary" @click="addSticker" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增
                    </el-button>
                    <!-- 导出按钮 -->
                    <el-button type="primary" class="add-button" @click="exportExcel">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        导出
                    </el-button>
                    <!-- 父类管理按钮 -->
                    <el-button type="primary" class="add-button" @click="parentManage">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        父类管理
                    </el-button>
                </div>
                <!-- 右侧操作按钮 -->
                <div class="right-actions">
                    <!-- 导入国际化文件上传 -->
                    <el-upload style="margin-right: 50px;" action="#" :show-file-list="false"
                        :on-change="handleInternational" :auto-upload="false">
                        <el-button type="primary" class="add-button">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            导入国际化
                        </el-button>
                    </el-upload>
                    <!-- 表格操作组件 -->
                    <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
                        @changeView="changeView" />
                </div>
            </div>

            <el-divider class="divider" />

            <!-- 过滤器容器 -->
            <div class="filter-container">
                <div class="filter-row">
                    <!-- 地区选择器 -->
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.region" placeholder="国内外" class="filter-select"
                            @change="getParentList">
                            <el-option v-for="item in regionList" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </div>
                    <!-- 父类选择器 -->
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.tid" placeholder="父类" class="filter-select"
                            clearable>
                            <el-option v-for="item in parentList" :key="item.id" :label="item.classType"
                                :value="item.id" />
                        </el-select>
                    </div>
                    <!-- 类名搜索输入框 -->
                    <div class="filter-item">
                        <el-input v-model="searchParams.query" placeholder="类名"></el-input>
                    </div>
                    <!-- 查询和重置按钮 -->
                    <div class="filter-item filter-actions">
                        <el-button type="primary" @click="searching">
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
                </div>
            </div>
        </el-card>
        <!-- 内容展示卡片 -->
        <el-card class="content-card" v-loading="loading">
            <!-- 动态组件，带过渡效果 -->
            <Transition enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut" mode="out-in">
                <component :is="componentName" :filterParams="filterParams" :tableData="appData"
                    :totalItems="totalItems" @editor="editSticker" @delete="deleteSticker" @view="viewDetail"
                    @moveIndex="moveIndex"></component>
            </Transition>
            <!-- 分页组件 -->
            <el-pagination v-show="showPagestion" class="pagesBox" background layout=" prev, pager, next"
                :total="totalItems" v-model:current-page="searchParams.pageNum" @current-change="handleCurrentChange" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    // 引入所需组件和模块
    import tableAciton from '@/components/public/tableAciton.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';
    import parentManager from '@/components/clothingMaterials/parentManager.vue';
    import clothEditor from '@/components/clothingMaterials/clothEditor.vue';
    import { nextTick, onMounted, reactive, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { useRouter } from 'vue-router';
    import service from '@/axios';
    import { desEncrypt } from '@/utils/des';

    // 使用Pinia store和Vue Router
    const counterStore = useCounterStore()
    const router = useRouter()
    const { showPagestion, appList, regionList, operationClass, clothFliterParams, defaultAppNo, showLoading } = storeToRefs(counterStore)

    // 动态组件定义
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)
    const loading = ref<boolean>(true)

    // 移动素材项
    const moveIndex = async (item: any) => {
        try {
            const params = {
                timestamp: Date.now(),
                id: item.id,
                type: item.moveType
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/clothingMaterials/move', {
                enData
            })
            if (res.data.code === 200) {
                ElMessage({
                    message: '移动成功',
                    type: 'success'
                })
                getClothList()
            } else {
                ElMessage({
                    message: res.data.msg,
                    type: 'error'
                })
            }
        } catch (err) {
            console.log('移动失败', err);
        } finally {
            showLoading.value = false
        }
    }

    // 获取服装分类列表
    const totalItems = ref(0); // 总条目数
    const getClothList = async () => {
        loading.value = true
        try {
            const params = {
                appNo: searchParams.value.appNo,
                region: searchParams.value.region,
                query: searchParams.value.query,
                pageNum: searchParams.value.pageNum,
                tid: searchParams.value.tid,
                pageSize: searchParams.value.pageSize,
                timestamp: Date.now()
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res: any = await service.post('/clothingMaterials/list', {
                enData
            })

            totalItems.value = res.data.total


            for (let item of res.data.rows) {
                const parentTypeNameArr = item.clothingMaterialsTypeList.map((el: any) => el.classType)
                item.parentTypeIdList = item.clothingMaterialsTypeList.map((el: any) => el.id)
                item.parentTypeName = parentTypeNameArr.join(',')
            }
            appData.value = res.data.rows
        } catch (err) {
            console.log('获取服装分类列表失败', err);
        } finally {
            loading.value = false
            showLoading.value = false
        }
    }


    //父类管理
    const showParentManage = ref(false)
    const parentManage = () => {
        showParentManage.value = true
    }
    //导出excel
    const exportExcel = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                appNo: searchParams.value.appNo,
                region: searchParams.value.region,
                query: searchParams.value.query,
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.get('/clothingMaterials/exportExcel', {
                params: {
                    enData
                },
                responseType: 'blob',
            })
            console.log('导出excel', res);

            const blob = new Blob([res.data], { type: res.headers['content-type'] });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            const contentDisposition = res.headers['content-disposition'];
            let fileName = 'downloaded_file.xlsx'; // 默认文件名带后缀
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (fileNameMatch && fileNameMatch[1]) {
                    fileName = fileNameMatch[1].replace(/['"]/g, '');

                    if (!fileName.toLowerCase().endsWith('.xlsx')) {
                        fileName += '.xlsx';
                    }
                }
            }
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href); // 释放URL对象
            ElMessage.success('导出成功')
        } catch (err) {
            ElMessage.error('导出失败')
            console.log('导出失败', err);
        } finally {
            showLoading.value = false
        }


    }


    //导入国际化
    const fileInterNational = ref()

    const handleInternational = (file: any) => {
        console.log('file', file);



        fileInterNational.value = file.raw
        importInternation()
    }
    const importInternation = async () => {
        try {
            const formData = new FormData()
            formData.append('appNo', String(searchParams.value.appNo))
            formData.append('region', searchParams.value.region)
            formData.append('clothingMaterialsList', fileInterNational.value)

            showLoading.value = true
            const res = await service.post('/clothingMaterials/importExcelInternationalization', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            console.log('导入成功', res);
            if (res.data.code === 200) {
                ElMessage.success('导入成功')
            }
        } catch (err) {
            console.log('导入失败', err);
        } finally {
            showLoading.value = false
        }
    }

    //新增贴纸
    const showEditor = ref<boolean>(false)
    watch(() => showEditor.value, (newV) => {
        if (!newV) {
            console.log('关闭编辑弹窗1111');
            editorItemInfo.value = ''
            getClothList()
        }
    })
    const addSticker = () => {
        showEditor.value = true
    }

    //编辑分类
    const editorItemInfo = ref<any>()
    const editSticker = (row: any) => {
        console.log('row', row);
        editorItemInfo.value = row
        showEditor.value = true
    }
    //删除分类
    const deleteId = async (id: number) => {
        try {
            showLoading.value = true
            const res = await service.post('/clothingMaterials/del/' + id)

            if (res.data.code === 200) {
                ElMessage({
                    message: '删除成功',
                    type: 'success'
                })
                getClothList()
            } else {
                ElMessage({
                    message: res.data.msg,
                    type: 'error'
                })
            }
        } catch (err) {
            console.log('删除失败', err);
        } finally {
            showLoading.value = false
        }
    }
    const deleteSticker = (row: any) => {
        console.log(row)
        ElMessageBox.confirm(
            '确定删除该分类吗？',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        ).then(res => {
            deleteId(row.id)
        })
    }

    //查看详情
    const viewDetail = (row: any) => {
        operationClass.value = row.operationClass
        router.push('/templateMaterial?id=' + row.id + '&type=clothing&title=服装')


        console.log('查看详情', row);
    }

    //搜索参数
    interface SearchParams {
        query: string
        appNo: string | number//应用id
        tid: number | string//父类

        pageNum: number // 新增当前页码
        pageSize: number // 新增每页显示条数
        region: string//地域
    }
    const searchParams = ref<SearchParams>(
        {
            query: '',
            appNo: defaultAppNo.value,
            region: '',
            tid: '',
            pageNum: 1, // 默认当前页为1
            pageSize: 10 // 默认每页显示10条
        }
    )






    // 处理当前页码变化
    const handleCurrentChange = (val: number) => {
        searchParams.value.pageNum = val;

        clothFliterParams.value = {
            ...searchParams.value,

        }
        getClothList(); // 重新获取数据
    }

    //查询按钮点击事件 - 确保调用 getClothList
    const searching = () => {
        searchParams.value.pageNum = 1; // 点击查询时，通常重置到第一页
        clothFliterParams.value = {

            ...searchParams.value
        }
        console.log('clothFliterParams', clothFliterParams.value);
        getClothList();
    }

    //重置搜索 - 确保调用 getClothList
    const resetSearch = () => {
        searchParams.value = {
            query: '',
            appNo: defaultAppNo.value,
            region: 'domestic',
            tid: '',
            pageNum: 1,
            pageSize: 10
        };

        clothFliterParams.value = {
            ...searchParams.value
        }
        getClothList();
    }


    interface AppContentConfig {
        appAbbreviation: string;           // 所属应用
        id: number;          // 序号
        name: string;              // 名称
        region: string;            // 地区
        parentTypeName: string//父类名称
        international: string;//国际化
        viewNum: number;       // 总点击数
        updateTime: string;    // 最近更新时间
    }


    const appNote: any = {
        appAbbreviation: '所属应用',
        id: '序号',
        name: '名称',
        region: '地区',
        parentTypeName: '父类名称',
        international: '国际化',
        viewNum: '总点击数',
        updateTime: '最近更新时间',
    }
    // 生成用户数据
    const appData = ref<AppContentConfig[]>([

    ])
    interface filterParams {
        note: string
        isShow: boolean
        key: string
    }
    const filterParams = ref<filterParams[]>([])
    const getUserList = async () => {


        await getClothList()

        if (appData.value.length) {
            console.log('获取用户列表');
            const dataItem = appData.value[0]
            const keys = Object.keys(dataItem)

            const haveParamsArr = keys.filter(item => appNote[item])

            filterParams.value = haveParamsArr.map((item) => {
                return {
                    note: appNote[item],
                    isShow: true,
                    key: item
                }
            })
        } else {
            for (let key in appNote) {
                const paramsItem = {
                    note: appNote[key],
                    isShow: true,
                    key: key
                }

                filterParams.value?.push(paramsItem)
            }
        }

        console.log('filterParams', filterParams.value);
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


    //获取父类列表
    const parentList = ref<any>([])
    const getParentList = async () => {

        try {
            const params = {
                timestamp: new Date().getTime(),
                appNo: searchParams.value.appNo,
                region: searchParams.value.region,
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.get('/clothingMaterialsType/list', {
                params: {
                    enData
                }
            })

            console.log('获取父类列表', res);

            parentList.value = res.data.data.list
            searchParams.value.tid = ''
        } catch (err) {
            console.log('获取父类列表失败', err);
        } finally {
            showLoading.value = false
        }

    }




    watch(() => defaultAppNo.value, (newV) => {
        searchParams.value = {
            query: '',
            appNo: defaultAppNo.value,
            region: 'domestic',
            tid: '',
            pageNum: 1, // 默认当前页为1
            pageSize: 10 // 默认每页显示10条
        }
        clothFliterParams.value = {
            ...searchParams.value
        }
        getClothList()
        getParentList()
    })
    onMounted(async () => {

        if (Object.keys(clothFliterParams.value).length > 0) {
            searchParams.value = {
                ...clothFliterParams.value
            }
            searchParams.value.appNo = defaultAppNo.value
        } else {


            searchParams.value = {
                query: '',
                appNo: defaultAppNo.value,
                region: 'domestic',
                tid: '',
                pageNum: 1,
                pageSize: 10
            }
        }


        showPagestion.value = true

        await nextTick()
        getUserList();//获取服装分类数据
        getParentList()

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