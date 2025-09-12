<template>
    <div class="view">
        <clothEditor v-model:show-editor="showEditor" :editorInfo="editorItemInfo" :noHaveParent='true'
            :type="'othermaterial'" />

        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <el-button type="primary" @click="addEditor" style="margin: 0;" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增
                    </el-button>
                    <el-upload>

                    </el-upload>
                    <el-upload style="margin: 0;" action="#" :show-file-list="false" :on-change="handleInternational"
                        :auto-upload="false">
                        <el-button style="margin: 0;" type="primary" class="add-button">
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
        <el-card class="content-card" v-loading="showLoading">
            <Transition enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut" mode="out-in">
                <component :is="componentName" :filterParams="filterParams" :tableData="appData" @editor="editorEditor"
                    @delete="deleteEditor" @view="viewDetail" @moveIndex="moveIndex"></component>
            </Transition>

            <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                :total="totalData" v-model:current-page="searchParams.pageNum"
                v-model:page-size="searchParams.pageSize" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import tableAciton from '@/components/public/tableAciton.vue';
    import clothEditor from '@/components/clothingMaterials/clothEditor.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';

    import { onMounted, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    import { useRouter } from 'vue-router';
    const counterStore = useCounterStore()
    const router = useRouter()
    const { showPagestion, regionList, showLoading, operationClass, defaultAppNo, otherFliterParams } = storeToRefs(counterStore)
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)

    //数据总数
    const totalData = ref<number>(0)

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
            const res = await service.post('/otherMaterial/move', {
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


    //查看详情
    const viewDetail = (row: any) => {
        operationClass.value = row.operationClass
        router.push('/templateMaterial?id=' + row.id + '&type=otherMaterial&title=其他素材')
        console.log('查看详情', row);
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
            formData.append('appNo', String(defaultAppNo.value))
            formData.append('region', searchParams.value.region)
            formData.append('materials', fileInterNational.value)

            showLoading.value = true
            const res = await service.post('/otherMaterial/importExcelInternationalization', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            console.log('导入成功', res);
            if (res.data.code === 200) {
                ElMessage.success('导入成功')
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('导入失败', err);
        } finally {
            showLoading.value = false
        }
    }


    //新增其他素材配置
    const showEditor = ref<boolean>(false)
    watch(() => showEditor.value, () => {
        if (!showEditor.value) {
            editorItemInfo.value = ''
            getUserList()
        }
    })
    const addEditor = () => {
        showEditor.value = true
    }
    //编辑其他素材配置
    const editorItemInfo = ref<any>()
    const editorEditor = (item: any) => {
        editorItemInfo.value = item
        showEditor.value = true
    }
    //删除其他素材配置
    const deleteEditor = (item: any) => {
        console.log('删除其他素材配置', item);
        ElMessageBox.confirm(
            '确定删除吗？',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        ).then(async () => {
            showLoading.value = true
            try {
                const res = await service.post(`/otherMaterial/del/${item.id}`)
                if (res.data.code === 200) {
                    ElMessage.success('删除成功')
                    getUserList()
                } else {
                    ElMessage.error(res.data.msg)
                }

            } catch (err) {
                console.log('删除失败', err);
            }
            finally {
                showLoading.value = false
            }
        })

    }
    //搜索参数

    const searchParams = ref<any>(
        {

            region: '',
            pageNum: 1,
            pageSize: 10,

        }
    )


    watch(() => searchParams.value.pageNum, () => {
        getUserList()

    })
    watch(() => defaultAppNo.value, () => {
        resetSearch()
    })


    //搜索
    const searching = () => {
        Object.assign(otherFliterParams.value, searchParams.value)

        getUserList()
    }

    //重置搜索
    const resetSearch = () => {
        searchParams.value = {

            region: regionList.value[0].value,
            pageNum: 1,
            pageSize: 10,

        }
        getUserList()
    }
    interface AppContentConfig {
        appAbbreviation: string;           // 所属应用
        id: number;          // 序号
        name: string;              // 名称
        region: string;            // 地区
        international: string                 // 国际化

        updateTime: string;    // 最近更新时间
    }


    const appNote: any = {
        appAbbreviation: '所属应用',
        id: '序号',
        name: '名称',
        region: '地区',
        international: '国际化',
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
    const filterParams = ref<filterParams[]>()
    const getUserList = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                appNo: defaultAppNo.value,
                pageNum: searchParams.value.pageNum,
                pageSize: searchParams.value.pageSize,
                region: searchParams.value.region,
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/otherMaterial/list', {
                enData
            })
            console.log('获取其他素材列表', res);
            appData.value = res.data.rows
            totalData.value = res.data.total
            appData.value.forEach((item: any) => {
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
            console.log('获取列表失败', err);
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

        const keys = Object.keys(otherFliterParams.value)
        if (keys.length > 0) {
            searchParams.value.region = otherFliterParams.value.region
        } else {
            searchParams.value.region = regionList.value[0].value
        }





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