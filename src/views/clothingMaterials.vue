<template>
    <div class="view">
        <clothEditor v-model:show-editor="showEditor" :editorInfo="editorItemInfo" />
        <parentManager v-model:dialog="showParentManage" /> <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <el-button type="primary" @click="addSticker" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增
                    </el-button>
                    <el-button type="primary" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        导出
                    </el-button>
                    <el-button type="primary" class="add-button" @click="parentManage">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        父类管理
                    </el-button>
                    <!-- <el-button type="primary" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        导入国际化
                    </el-button> -->
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
                        <el-select filterable v-model="searchParams.appNo" placeholder="应用" class="filter-select">
                            <el-option v-for="item in appList" :key="item.appNo"
                                :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                                :value="item.appNo" />
                        </el-select>
                    </div>
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
                <component :is="componentName" :viewButton="true" :filterParams="filterParams" :tableData="appData"
                    :moveIndex="true" @editor="editSticker" @delete="deleteSticker" @view="viewDetail"
                    @moveIndex="moveIndex"></component>
            </Transition>

            <el-pagination v-show="showPagestion" class="pagesBox" background layout="total, prev, pager, next"
                :total="totalItems" v-model:current-page="searchParams.pageNum" @current-change="handleCurrentChange" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import tableAciton from '@/components/public/tableAciton.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';
    import parentManager from '@/components/clothingMaterials/parentManager.vue';
    import clothEditor from '@/components/clothingMaterials/clothEditor.vue';
    import { onMounted, reactive, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { useRouter } from 'vue-router';
    import service from '@/axios';
    import { desEncrypt } from '@/utils/des';
    const counterStore = useCounterStore()
    const router = useRouter()
    const { showPagestion, appList, OSlist, channelList, regionList } = storeToRefs(counterStore)
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
            const res = await service.post('/clothingMaterials/move', {
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
        }

    }


    //获取服装分类列表
    const totalItems = ref(0); // 用于存储总条目数
    const getClothList = async () => {
        loading.value = true
        try {
            const params = {
                appNo: searchParams.value.appNo,
                region: searchParams.value.region, // 根据需要设置
                query: searchParams.value.query,
                pageNum: searchParams.value.pageNum,
                pageSize: searchParams.value.pageSize,
                timestamp: Date.now()
            }

            const enData = desEncrypt(JSON.stringify(params))
            const res: any = await service.post('/clothingMaterials/list', {
                enData
            })

            console.log('获取服装分类列表', res);
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
        }
    }


    //父类管理
    const showParentManage = ref(false)
    const parentManage = () => {
        showParentManage.value = true
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

        router.push('/templateMaterial?id=' + row.id)


        console.log('查看详情', row);
    }

    //搜索参数
    interface SearchParams {
        query: string
        appNo: string//应用id
        pageNum: number // 新增当前页码
        pageSize: number // 新增每页显示条数
        region: string//地域
    }
    const searchParams = ref<SearchParams>(
        {
            query: '',
            appNo: '',
            region: '',
            pageNum: 1, // 默认当前页为1
            pageSize: 10 // 默认每页显示10条
        }
    )






    // 处理当前页码变化
    const handleCurrentChange = (val: number) => {
        searchParams.value.pageNum = val;
        getClothList(); // 重新获取数据
    }

    //查询按钮点击事件 - 确保调用 getClothList
    const searching = () => {
        searchParams.value.pageNum = 1; // 点击查询时，通常重置到第一页
        getClothList();
    }

    //重置搜索 - 确保调用 getClothList
    const resetSearch = () => {
        searchParams.value = {
            query: '',
            appNo: appList.value[0].appNo,
            region: 'domestic',
            pageNum: 1,
            pageSize: 10
        };
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
    onMounted(() => {

        searchParams.value = {
            query: '',
            appNo: appList.value[0].appNo,
            region: 'domestic',
            pageNum: 1,
            pageSize: 10
        }




        getUserList();//获取服装分类数据
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