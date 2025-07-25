<template>
    <div class="view">
        <clothEditor v-model:show-editor="showEditor" :editorInfo="editorItemInfo" :noHaveParent='true'
            :type="'mask'" />

        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <el-button type="primary" style="margin: 0;" @click="addEditor" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增
                    </el-button>
                    <el-button type="primary" style="margin: 0;" class="add-button" @click="exportExcell">
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
                <component :is="componentName" :filterParams="filterParams" :tableData="appData" @editor="editorEditor"
                    @delete="deleteEditor" @view="viewDetail" @moveIndex="moveIndex">
                </component>
            </Transition>

            <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                :total="totalData" v-model:current-page="pageNum" v-model:page-size="pageSize" />
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
    import service from '@/axios';
    import type { UploadRequestOptions } from 'element-plus';
    import { useRouter } from 'vue-router';
    const counterStore = useCounterStore()
    const { showPagestion, defaultAppNo, regionList, operationClass, maskFliterParams, showLoading } = storeToRefs(counterStore)
    const components: any = {
        userTable,
        userList
    }
    const router = useRouter()
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)

    //导入国际化
    const importInternation = async (options: UploadRequestOptions) => {

        try {
            const formData = new FormData()
            formData.append('masks', options.file)
            formData.append('region', searchParams.value.region)
            formData.append('appNo', defaultAppNo.value as string)
            showLoading.value = true
            const res = await service.post('/mask/importExcelInternationalization', formData, {
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
    const exportExcell = async () => {
        try {
            const res = await service.get('/mask/exportExcel', {
                params: {
                    appNo: defaultAppNo.value,
                    region: searchParams.value.region,
                    query: searchParams.value.query,
                    timestamp: Date.now()
                },
                responseType: 'blob'
            })

            const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `mask_${Date.now()}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            ElMessage.success('导出成功')
        } catch (err) {
            ElMessage.error('导出失败')
            console.log('导出失败', err);
        }
    }



    //监听应用变化
    watch(() => defaultAppNo.value, () => {
        pageNum.value = 1
        resetSearch()
        getUserList()
    })
    //分页
    const pageNum = ref<number>(1)
    const pageSize = ref<number>(10)
    const totalData = ref<number>(0)
    watch(() => pageNum.value, () => {
        maskFliterParams.value = {
            pageNum: pageNum.value,
            pageSize: pageSize.value,
            ...searchParams.value,

        }
        getUserList()
    })


    //查询
    const searching = () => {
        pageNum.value = 1; // 点击查询时，通常重置到第一页
        maskFliterParams.value = {
            pageNum: pageNum.value,
            pageSize: pageSize.value,
            ...searchParams.value
        }
        console.log('maskFliterParams', maskFliterParams.value);
        getUserList()
    }

    //新增遮罩
    const showEditor = ref<boolean>(false)

    watch(() => showEditor.value, (newV) => {
        if (!newV) {
            editorItemInfo.value = ''
            getUserList()
        }
    })
    const addEditor = () => {
        showEditor.value = true
    }

    //编辑遮罩
    const editorItemInfo = ref<any>()
    const editorEditor = (item: any) => {
        editorItemInfo.value = item
        showEditor.value = true
    }

    //删除遮罩
    const deleteEditor = (item: any) => {
        console.log('删除遮罩', item);
        ElMessageBox.confirm(
            '确定删除该遮罩吗？',
            '删除遮罩',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(async res => {
            try {
                showLoading.value = true
                const res = await service.post(`/mask/del/${item.id}`)
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
        router.push('/templateMaterial?id=' + row.id + '&type=mask&title=遮罩')
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
            const res = await service.post('/mask/move', {
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
        query: string
        region: string



    }
    const searchParams = ref<SearchParams>(
        {
            query: '',
            region: regionList.value[0].value,

        }
    )
    //重置搜索
    const resetSearch = () => {
        searchParams.value = {
            region: regionList.value[0].value,
            query: '',

        }
        pageNum.value = 1
        maskFliterParams.value = {
            pageNum: pageNum.value,
            pageSize: pageSize.value,
            ...searchParams.value
        }
        getUserList()
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
    const appData = ref<any>([

    ])
    interface filterParams {
        note: string
        isShow: boolean
        key: string
    }

    watch(() => defaultAppNo.value, async () => {
        resetSearch()
    })
    const filterParams = ref<filterParams[]>()
    const getUserList = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                pageNum: pageNum.value,
                pageSize: pageSize.value,
                appNo: defaultAppNo.value,
                region: searchParams.value.region,
                query: searchParams.value.query,
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/mask/list', {
                enData
            })
            console.log('获取遮罩列表', res);
            res.data.rows.forEach((element: any) => {
                element.regionObj = element.region
                element.region = element.regionObj.note
            });
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

        if (Object.keys(maskFliterParams.value).length > 0) {
            searchParams.value = {
                query: maskFliterParams.value.query,
                region: maskFliterParams.value.region,

            }
            pageNum.value = maskFliterParams.value.pageNum
        } else {


            // searchParams.value = {
            //     query: '',
            //     region: 'domestic',
            // }
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
            height: max-content;

            .pagesBox {
                margin-top: 30px;
            }
        }
    }
</style>