<template>
    <div class="view">
        <clothEditor v-model:show-editor="showEditor" :editorInfo="editorItemInfo" :noHaveParent='true'
            :type="'wallpapper'" :wallpapperTypes="wallpaperTypeList" />

        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <el-button style="margin: 0;" type="primary" @click="addWallpaper" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增
                    </el-button>
                    <el-button style="margin: 0;" type="primary" class="add-button" @click="exportExcel">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        导出
                    </el-button>
                    <el-upload ref="upload" action="#" :http-request="importInternation" :limit="1"
                        :show-file-list="false">
                        <el-button type="primary" class="add-button" style="margin: 0;">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            导入国际化
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
                <div class="filter-row">


                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.region" placeholder="国内外" class="filter-select">
                            <el-option v-for="item in regionList" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.classType" placeholder="壁纸类型" class="filter-select">
                            <el-option v-for="item in wallpaperTypeList" :key="item.value" :label="item.note"
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
        <el-card class="content-card">
            <Transition enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut" mode="out-in">
                <component :is="componentName" :filterParams="filterParams" :tableData="appData"
                    @editor="editorWallpaper" @delete="deleteWallpaper" @view="viewDetail" @moveIndex="moveIndex">
                </component>
            </Transition>
            <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                :total="totalData" v-model:current-page="searchParams.pageNum" :page-size="searchParams.pageSize" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import tableAciton from '@/components/public/tableAciton.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';
    import clothEditor from '@/components/clothingMaterials/clothEditor.vue';
    import { nextTick, onMounted, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { desEncrypt } from '@/utils/des';
    import type { UploadRequestOptions } from 'element-plus'
    import service from '@/axios';
    import { useRouter } from 'vue-router';
    const router = useRouter()
    const counterStore = useCounterStore()
    const { showPagestion, showLoading, regionList, defaultAppNo, operationClass, wallpaperFliterParams } = storeToRefs(counterStore)
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)


    //数据总数
    const totalData = ref<number>(0)

    //导入国际化
    const importInternation = async (options: UploadRequestOptions) => {

        try {
            const formData = new FormData()
            formData.append('wallpapers', options.file)
            formData.append('region', searchParams.value.region)
            formData.append('appNo', defaultAppNo.value as string)
            formData.append('classType', searchParams.value.classType)
            showLoading.value = true
            const res = await service.post('/wallpaper/importExcelInternationalization', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log('导入国际化', res);
            if (res.data.code === 200) {
                ElMessage.success('导入成功')
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

    //导出excel
    const exportExcel = async () => {
        try {
            const res = await service.get('/wallpaper/exportExcel', {
                params: {
                    appNo: defaultAppNo.value,
                    region: searchParams.value.region,
                    query: searchParams.value.query,
                    classType: searchParams.value.classType,
                },
                responseType: 'blob'
            })
            if (res.data) {
                const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = '壁纸.xlsx'
                a.click()
                window.URL.revokeObjectURL(url)
            }

        } catch (err) {
            console.log('导出失败', err);
        } finally { }

    }


    //获取壁纸类型
    const wallpaperTypeList = ref<any>([])
    const getWallpaperType = async () => {
        try {
            const res = await service.get('/wallpaper/index')
            console.log('获取壁纸类型', res);
            wallpaperTypeList.value = res.data.data.types
        } catch (err) {

        }
    }


    //新增壁纸
    const showEditor = ref<boolean>(false)
    watch(() => showEditor.value, (newV) => {
        if (!newV) {
            editorItemInfo.value = ''
            getUserList()
        }
    })
    const addWallpaper = () => {
        console.log('123123');
        showEditor.value = true
    }
    //编辑壁纸
    const editorItemInfo = ref<any>()
    const editorWallpaper = (item: any) => {
        editorItemInfo.value = item
        showEditor.value = true
    }

    //删除壁纸
    const deleteWallpaper = (item: any) => {
        ElMessageBox.confirm(
            '是否删除该壁纸?',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        ).then(async () => {
            try {

                showLoading.value = true
                const res = await service.post(`/wallpaper/del/${item.id}`)
                if (res.data.code === 200) {
                    ElMessage.success('删除成功')
                    getUserList()
                } else {
                    ElMessage.error(res.data.msg)
                }
            } catch (err) {
                console.log('删除失败', err);
            } finally {
                showLoading.value = false
            }
        })
    }

    //查看详情
    const viewDetail = (row: any) => {
        operationClass.value = row.operationClass
        router.push('/templateMaterial?id=' + row.id + '&type=wallpapper&title=壁纸')
        console.log('查看详情', row);
    }

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
            const res = await service.post('/wallpaper/move', {
                enData
            })
            console.log('移动', res);
            if (res.data.code === 200) {

                ElMessage({
                    message: '移动成功',
                    type: 'success'
                })
                getUserList()
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
    //搜索参数
    interface SearchParams {
        region: string
        query: string
        classType: string,
        pageNum: number,
        pageSize: number,


    }
    const searchParams = ref<SearchParams>(
        {
            region: '',
            query: '',
            classType: '',
            pageNum: 1, pageSize: 10

        }
    )

    watch(() => searchParams.value.pageNum, () => {
        wallpaperFliterParams.value = {
            ...searchParams.value,

        }
        getUserList()
    })
    const searching = () => {
        searchParams.value.pageNum = 1; // 点击查询时，通常重置到第一页
        wallpaperFliterParams.value = {
            ...searchParams.value
        }
        console.log('wallpaperFliterParams', wallpaperFliterParams.value);
        getUserList();
    }
    //重置搜索
    const resetSearch = () => {
        searchParams.value = {
            region: regionList.value[0].value,
            query: '',
            classType: wallpaperTypeList.value[0].value,
            pageNum: 1, pageSize: 10

        }
        wallpaperFliterParams.value = {
            ...searchParams.value
        }
        getUserList()
    }
    interface AppContentConfig {
        appAbbreviation: string;           // 所属应用
        id: number;          // 序号
        name: string;              // 名称
        region: string;            // 地区
        international: string
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


    //监听应用变化
    watch(() => defaultAppNo.value, (newV) => {
        if (newV) {
            resetSearch()

        }
    })

    // 生成用户数据
    const appData = ref<AppContentConfig[]>([

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
                appNo: defaultAppNo.value,
                pageNum: searchParams.value.pageNum,
                pageSize: searchParams.value.pageSize,
                region: searchParams.value.region,
                query: searchParams.value.query,
                classType: searchParams.value.classType,

            }
            console.log('壁纸列表', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/wallpaper/list', {
                enData
            })
            totalData.value = res.data.total
            appData.value = res.data.rows
            console.log('获取壁纸列表', res);
            res.data.rows.forEach((item: any) => {
                item.regionObj = item.region
                item.region = item.regionObj.note
            })
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
            console.log("获取壁纸列表失败", err);
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
    onMounted(async () => {
        await getWallpaperType()
        if (Object.keys(wallpaperFliterParams.value).length > 0) {
            searchParams.value = {
                ...wallpaperFliterParams.value
            }

        } else {

            searchParams.value = {
                query: '',
                classType: wallpaperTypeList.value[0].value,
                region: regionList.value[0].value,

                pageNum: 1,
                pageSize: 10
            }
        }
        await nextTick()

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
                    display: flex;
                    align-items: center;
                    column-gap: 12px;

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