<template>
    <div class="view">
        <goodRepationEditor v-model:show-editor="showEditor" :goodInfo="goodInfo" :defaultApp="defaultApp" />
        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <el-button type="primary" @click="addConfig" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增
                    </el-button>

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
                        <el-select filterable v-model="searchParams.os" placeholder="系统" class="filter-select">
                            <el-option v-for="item in OSlist" :key="item" :label="item" :value="item" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.open" placeholder="开关" class="filter-select">
                            <el-option label="开&关" :value="''" />
                            <el-option label="开" :value="true" />
                            <el-option label="关" :value="false" />
                        </el-select>
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
                </div>


            </div>
        </el-card>
        <el-card class="content-card">
            <Transition enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut" mode="out-in">
                <component :is="componentName" :isUpdate="true" :filterParams="filterParams" :tableData="appData"
                    @editor="editorConfig" @delete="deleteConfig" @updateInfo="updateInfo">
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
    import { onMounted, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import goodRepationEditor from '@/components/goodRepation/goodRepationEditor.vue';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    const counterStore = useCounterStore()
    const { showPagestion, appList, OSlist, showLoading } = storeToRefs(counterStore)
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)


    //分页
    const pageNum = ref<number>(1)
    const pageSize = ref<number>(10)
    const totalData = ref<number>(0)
    watch(() => pageNum.value, () => {
        getUserList()
    })

    //新增弹幕弹窗配置
    const defaultApp = ref<any>()
    const showEditor = ref<boolean>(false)
    watch(() => showEditor.value, (newV) => {
        if (!newV) {
            goodInfo.value = {}
            defaultApp.value = ''
            getUserList()
        }
    })
    const addConfig = () => {
        defaultApp.value = searchParams.value.appNo
        showEditor.value = true
    }

    //切换开关

    const switchChange = async (item: any) => {
        try {
            const params = {
                timestamp: Date.now(),
                type: 'update',
                id: item.id,
                appNo: item.appNo,
                name: item.name,
                field: item.field,
                os: item.os,
                open: String(item.open),
                probability: item.probability,
                probabilitys: JSON.parse(item.probabilitys).join(','),
                functionStartNum: item.functionStartNum,
                timeOn: item.timeOn,
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/goodReputationGui/save', {
                enData
            })
            if (res.data.code === 200) {
                ElMessage.success('修改成功')
                getUserList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('修改开关失败', err);
        } finally {
            showLoading.value = false
        }
    }
    //选择概率

    const saveChangeProbability = async (item: any) => {
        try {

            const params: any = {
                timestamp: Date.now(),
                type: 'update',
                id: item.id,
                appNo: item.appNo,
                name: item.name,
                field: item.field,
                os: item.os,
                open: String(item.open),
                probability: item.probability,
                probabilitys: JSON.parse(item.probabilitys).join(','),
                functionStartNum: item.functionStartNum,
                timeOn: item.timeOn,

            }
            console.log('保存参数', params);
            for (let key in params) {
                if (params[key] === undefined) {
                    delete params[key]
                }
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/goodReputationGui/save', {
                enData
            })
            if (res.data.code === 200) {
                ElMessage.success('修改成功')
                getUserList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('保存概率失败', err);
        } finally {
            showLoading.value = false
        }


    }







    //编辑弹幕弹窗配置
    const goodInfo = ref<any>()
    const editorConfig = (item: any) => {
        console.log('编辑', item)
        goodInfo.value = item
        showEditor.value = true
    }
    //删除弹幕弹窗配置
    const deletFn = async (id: number) => {
        try {
            showLoading.value = true
            const res = await service.post(`/goodReputationGui/del/${id}`)
            if (res.data.code === 200) {
                ElMessage.success('删除成功')
                getUserList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {

        } finally {
            showLoading.value = false
        }
    }
    const deleteConfig = (item: any) => {
        ElMessageBox.confirm(
            '是否确认删除该条数据？',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        ).then(res => {
            deletFn(item.id)
        })
    }



    //提交修改
    const updateInfo = async (item: any) => {
        try {
            const params = {
                timestamp: Date.now(),
                id: item.id,
                open: String(item.open),
                probability: item.probability,
                functionStartNum: item.functionStartNum,
                timeOn: item.timeOn,
            }

            console.log('提交修改参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/goodReputationGui/saveAttr', {
                enData
            })
            console.log('提交修改', res);
            if (res.data.code === 200) {
                ElMessage.success('提交成功')
                getUserList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('提交失败', err);
        } finally {
            showLoading.value = false
        }
    }


    //搜索参数
    interface SearchParams {
        appNo: string | number
        os: string
        open: string



    }
    const searchParams = ref<SearchParams>(
        {
            appNo: '',
            os: '',
            open: ''
        }
    )
    //重置搜索
    const resetSearch = () => {
        searchParams.value = {
            appNo: '',
            os: '',
            open: ''

        }
        getUserList()
    }
    interface AppFeatureConfig {
        appAbbreviation: string;         // 所属应用
        os: string;  // 系统
        name: string;     // 名称
        open: string | boolean;      // 开关
        probability: string;    //概率设置
        functionStartNum: number//功能打开次数
        timeOn: number//计时打开
    }


    const appNote: any = {
        appAbbreviation: '所属应用',
        os: '系统',
        name: '名称',
        open: '开关',
        probability: '概率设置',
        functionStartNum: '功能打开次数',
        timeOn: '计时打开(s)'


    }
    // 生成用户数据
    const appData = ref<AppFeatureConfig[]>([

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
                "pageNum": pageNum.value,
                "pageSize": pageSize.value,
                "appNo": searchParams.value.appNo,
                "os": searchParams.value.os,
                "open": searchParams.value.open === '' ? '' : String(searchParams.value.open)
            }

            console.log('筛选参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/goodReputationGui/list', {
                enData
            })
            console.log('好评轮播图列表', res);
            res.data.rows.forEach((item: any) => {
                item.open = item.open === 'true' ? true : false
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
            console.log('获取好评弹窗列表失败', err);
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



    //初始化筛选数据
    const initSearchParams = () => {
        searchParams.value.appNo = appList.value[0].appNo

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