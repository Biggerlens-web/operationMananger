<template>
    <div class="view">
        <subPageEditor v-model:show-editor="showEditor" :subInfo="subInfo" />
        <autoOpenEditor v-model:show-editor="showAutoOpenEditor" :subPageConfigId="subPageConfigId"
            :plansArr="plansArr" />
        <subProducts :subPageConfigId="subPageConfigId" v-model:show-editor="showProductsSort"
            :sortProductList="sortProductList" @save="getUserList" />
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
                        <!-- <el-select filterable v-model="searchParams.companyNo" placeholder="应用" class="filter-select">
                            <el-option v-for="item in appList" :key="item.appNo"
                                :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                                :value="item.appNo" />
                        </el-select> -->
                    </div>


                    <!-- <div class="filter-item filter-actions">
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
                    </div> -->
                </div>


            </div>
        </el-card>
        <el-card class="content-card">
            <Transition enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut" mode="out-in">
                <component :is="componentName" :filterParams="filterParams" :tableData="appData" @editor="editorConfig"
                    @delete="deleteConfig" @AutoOpenMethod="AutoOpenMethod" @changeAutoOpen="changeAutoOpen"
                    @editProductsSort="editProductsSort" @switchChange="switchChange">
                </component>
            </Transition>

            <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                :total="totalData" v-model:current-page="pageNum" :page-size="pageSize" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import tableAciton from '@/components/public/tableAciton.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';
    import subPageEditor from '@/components/subPage/subPageEditor.vue';
    import autoOpenEditor from '@/components/subPage/autoOpenEditor.vue';
    import subProducts from '@/components/subPage/subProducts.vue';
    import { computed, onMounted, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    const counterStore = useCounterStore()
    const { showPagestion, defaultAppNo, showLoading } = storeToRefs(counterStore)
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



    //新增配置
    const showEditor = ref<boolean>(false)
    watch(() => showEditor.value, (newV) => {
        if (!newV) {
            getUserList()
            subInfo.value = ''
        }
    })
    const addConfig = () => {
        showEditor.value = true
    }

    //编辑配置
    const subInfo = ref<any>()
    const editorConfig = (item: any) => {
        console.log('编辑', item)
        subInfo.value = item
        showEditor.value = true
    }


    //删除配置
    const delConfigFn = async (id: number) => {
        try {
            showLoading.value = true
            const res = await service.post(`/subPageConfig/del/${id}`)
            if (res.data.code === 200) {
                ElMessage.success('删除失败')
                getUserList()
            } else {
                ElMessage.error(res.data.code)
            }
        } catch (err) {
            console.log('删除失败', err);
        } finally {
            showLoading.value = false
        }
    }
    const deleteConfig = (item: any) => {
        console.log('删除', item)
        ElMessageBox.confirm('确认删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(() => {
            delConfigFn(item.id)
        })
    }







    //商品排序
    const showProductsSort = ref<boolean>(false)
    const sortProductList = ref<any>([])
    const editProductsSort = (item: any) => {
        console.log('商品排序', item);
        subPageConfigId.value = item.id
        sortProductList.value = item.subPageConfigHWProductsVos
        showProductsSort.value = true
    }


    //切换开关
    const switchChange = async (item: any) => {
        try {
            const { key } = item

            const params = {
                timestamp: Date.now(),
                id: item.id,
                [key]: String(item[key])
            }
            console.log('切换开关参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/subPageConfig/saveOneAttr', {
                enData
            })
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
                getUserList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {

            console.log('切换失败', err);
        } finally {
            showLoading.value = false
        }
    }


    //选择自动打开方案
    const changeAutoOpen = async (item: any) => {
        try {
            console.log('选择自动打开方案', item)
            const params = {
                timestamp: Date.now(),
                id: item.id,
                autoOpen: String(item.autoOpen)
            }

            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/subPageConfig/saveOneAttr', {
                enData
            })
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
                getUserList()
            } else {
                ElMessage.error('保存失败')
            }
        } catch (err) {
            console.log('保存失败', err);
        } finally {
            showLoading.value = false
        }

    }

    //添加自动打开方案
    const subPageConfigId = ref()
    const showAutoOpenEditor = ref<boolean>(false)
    const plansArr = ref()
    watch(() => showAutoOpenEditor.value, (newV) => {
        if (!newV) {
            getUserList()
        }
    })
    const AutoOpenMethod = (item: any) => {
        console.log('添加自动打开方案', item)
        subPageConfigId.value = item.id
        plansArr.value = item.subPageConfigAutoOpenVos
        showAutoOpenEditor.value = true
    }
    //搜索参数
    interface SearchParams {
        appNo: string | number




    }
    const searchParams = ref<SearchParams>(
        {
            appNo: defaultAppNo.value,



        }
    )


    //监听应用变化
    watch(() => defaultAppNo.value, () => {
        searchParams.value.appNo = defaultAppNo.value
        getUserList()
    })

    //重置搜索
    const resetSearch = () => {
        searchParams.value = {
            appNo: defaultAppNo.value,

        }
        getUserList()
    }
    interface MemberSystemConfig {
        appName: string;                  // 所属应用
        channelName: string;                  // 渠道
        baseRoot: string;       // 会员系统域名
        autoOpen: string;  // 自动打开方案
        backBtnVisible: string;  // 返回按钮
        loginBeforeMemPage: boolean; // 订阅页登录开关
        subPageConfigHWProductsVos: string; // 商品排序
    }


    const appNote: any = {
        appName: '所属应用',
        channelName: '渠道',
        baseRoot: '会员系统域名',
        autoOpen: '自动打开方案',
        backBtnVisible: '返回按钮',
        loginBeforeMemPage: '订阅页登录开关',
        subPageConfigHWProductsVos: '商品排序',
    }
    // 生成用户数据
    const appData = ref<MemberSystemConfig[]>([

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
                appNo: searchParams.value.appNo,

            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/subPageConfig/list', {
                enData
            })
            console.log('获取订阅页列表', res);
            res.data.rows.forEach((element: any) => {
                element.backBtnVisible = element.backBtnVisible === 'true' ? true : false
                element.loginBeforeMemPage = element.loginBeforeMemPage === 'true' ? true : false
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