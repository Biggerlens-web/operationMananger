<template>
    <div class="view">
        <clothEditor v-model:show-editor="showEditor" :editorInfo="editorItemInfo" :noHaveParent='true'
            :type="'sitcker'" />
        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <el-button type="primary" @click="addSticker" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增
                    </el-button>
                    <el-button type="primary" class="add-button" @click="exportExcel">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        导出
                    </el-button>



                </div>
                <div class="right-actions">
                    <el-upload style="margin-right: 50px;" action="#" :show-file-list="false"
                        :on-change="handleInternational" :auto-upload="false">
                        <el-button type="primary" class="add-button">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            导入国际化
                        </el-button>
                    </el-upload>
                    <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
                        @changeView="changeView" />
                </div>
            </div>

            <el-divider class="divider" />

            <div class="filter-container">
                <div class="filter-row">


                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.region" placeholder="国内外" class="filter-select">
                            <el-option v-for="item in regionList" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </div>

                    <div class="filter-item">
                        <el-input v-model="searchParams.query" placeholder="类名"></el-input>

                    </div>

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
        <el-card class="content-card" v-loading="loading">
            <Transition enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut" mode="out-in">
                <component :is="componentName" :filterParams="filterParams" :tableData="appData"
                    :totalItems="totalItems" @editor="editSticker" @delete="deleteSticker" @view="viewDetail"
                    @moveIndex="moveIndex"></component>
            </Transition>

            <el-pagination v-show="showPagestion" class="pagesBox" background layout=" prev, pager, next"
                :total="totalItems" v-model:current-page="searchParams.pageNum" @current-change="handleCurrentChange" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import tableAciton from '@/components/public/tableAciton.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';

    import clothEditor from '@/components/clothingMaterials/clothEditor.vue';
    import { nextTick, onMounted, reactive, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { useRouter } from 'vue-router';
    import service from '@/axios';
    import { desEncrypt } from '@/utils/des';
    const counterStore = useCounterStore()
    const router = useRouter()
    const { showPagestion, regionList, operationClass, stickerFliterParams, defaultAppNo, showLoading } = storeToRefs(counterStore)
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)
    const loading = ref<boolean>(true)



    //移动
    const moveIndex = async (item: any) => {
        console.log('移动', item);
        try {

            const params = {
                timestamp: Date.now(),
                id: item.id,
                type: item.moveType
            }
            console.log('参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/sticker/move', {
                enData
            })
            console.log('移动', res);
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


    //获取贴纸分类列表
    const totalItems = ref(0); // 用于存储总条目数
    const getClothList = async () => {
        loading.value = true
        try {
            const params = {
                appNo: searchParams.value.appNo,
                region: searchParams.value.region,
                query: searchParams.value.query,
                pageNum: searchParams.value.pageNum,
                pageSize: searchParams.value.pageSize,
                timestamp: Date.now()
            }
            console.log('搜索贴纸参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res: any = await service.post('/sticker/list', {
                enData
            })

            console.log('获取贴纸分类列表', res);
            totalItems.value = res.data.total

            for (let item of res.data.rows) {
                item.region = item.region.note
            }

            appData.value = res.data.rows
        } catch (err) {
            console.log('获取贴纸分类列表失败', err);
        } finally {
            loading.value = false
            showLoading.value = false
        }
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
            const res = await service.get('/sticker/exportExcel', {
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
            formData.append('stickers', fileInterNational.value)

            showLoading.value = true
            const res = await service.post('/sticker/importExcelInternationalization', formData, {
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
            const res = await service.post(`/sticker/del/${id}`)

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
        router.push('/templateMaterial?id=' + row.id + '&type=sitcker&title=贴纸')



        console.log('查看详情', row);
    }

    //搜索参数
    interface SearchParams {
        query: string
        appNo: string | number//应用id


        pageNum: number // 新增当前页码
        pageSize: number // 新增每页显示条数
        region: string//地域
    }
    const searchParams = ref<SearchParams>(
        {
            query: '',
            appNo: defaultAppNo.value,
            region: '',

            pageNum: 1, // 默认当前页为1
            pageSize: 10 // 默认每页显示10条
        }
    )






    // 处理当前页码变化
    const handleCurrentChange = (val: number) => {
        searchParams.value.pageNum = val;

        stickerFliterParams.value = {
            ...searchParams.value,

        }
        getClothList(); // 重新获取数据
    }

    //查询按钮点击事件 - 确保调用 getClothList
    const searching = () => {
        searchParams.value.pageNum = 1; // 点击查询时，通常重置到第一页
        stickerFliterParams.value = {

            ...searchParams.value
        }
        console.log('stickerFliterParams', stickerFliterParams.value);
        getClothList();
    }

    //重置搜索 - 确保调用 getClothList
    const resetSearch = () => {
        searchParams.value = {
            query: '',
            appNo: defaultAppNo.value,
            region: 'domestic',

            pageNum: 1,
            pageSize: 10
        };

        stickerFliterParams.value = {
            ...searchParams.value
        }
        getClothList();
    }


    interface AppContentConfig {
        appAbbreviation: string;           // 所属应用
        id: number;          // 序号
        name: string;              // 名称
        region: string;            // 地区
        international: string;//国际化
        viewNum: number;       // 总点击数
        updateTime: string;    // 最近更新时间
    }


    const appNote: any = {
        appAbbreviation: '所属应用',
        id: '序号',
        name: '名称',
        region: '地区',
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
        } catch (err) {
            console.log('获取父类列表失败', err);
        } finally {
            showLoading.value = false
        }

    }



    watch(() => defaultAppNo.value, () => {
        resetSearch()
    })

    onMounted(async () => {

        if (Object.keys(stickerFliterParams.value).length > 0) {
            searchParams.value = {
                ...stickerFliterParams.value
            }
            searchParams.value.appNo = defaultAppNo.value
        } else {


            searchParams.value = {
                query: '',
                appNo: defaultAppNo.value,
                region: 'domestic',

                pageNum: 1,
                pageSize: 10
            }
        }



        showPagestion.value = true
        await nextTick()
        getUserList();//获取贴纸分类数据

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