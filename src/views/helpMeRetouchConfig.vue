<template>
    <div class="view">
        <listEdit v-model:dialog-visable="showListEdit" :listInfo='listInfo' @confirm="confirmList" />
        <languageEditor v-model:dialog-visable="showLanguageEditor" :configId="configId" />
        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <!-- <el-button type="primary" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增配置连接
                    </el-button>
                    <el-button type="primary" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        EXECEL导入
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
                        <el-select filterable v-model="searchParams.os" placeholder="请选择系统" class="filter-select"
                            clearable>
                            <el-option v-for="item in OSlist" :key="item.value" :label="item.note"
                                :value="item.value" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.isCanPay" placeholder="是否收费" class="filter-select"
                            clearable>
                            <el-option label="是" :value="'true'" />
                            <el-option label="否" :value="'false'" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.isShowTaobao" placeholder="是否开启淘宝"
                            class="filter-select" clearable>
                            <el-option label="是" :value="'true'" />
                            <el-option label="否" :value="'false'" />
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
                <component :is="componentName" :filterParams="filterParams" :tableData="appData" :showAction="false"
                    @editorLanguage="editorLanguage" @addListData="addListData" @handleInput="handleInput"
                    @switchChange="switchChange" @handleNumInput="handleNumInput">
                </component>
            </Transition>

            <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                :total="totalData" v-model:current-page="pageNum" :page-size="pageSize" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import tableAciton from '@/components/public/tableAciton.vue';
    import listEdit from '@/components/public/listEdit.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';
    import languageEditor from '@/components/public/languageEditor.vue';
    import { onMounted, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    import { ElMessage } from 'element-plus';
    const counterStore = useCounterStore()
    const { showPagestion, appList, OSlist, defaultAppNo, showLoading } = storeToRefs(counterStore)
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


    //配置列表数据
    const showListEdit = ref<boolean>(false)
    const listInfo = ref<any>([])
    const editKey = ref<string>('')
    const editListId = ref<number>(0)
    //添加列表数据
    const addListData = (item: any) => {
        const { key } = item
        listInfo.value = item[key]
        editKey.value = key
        editListId.value = item.id
        showListEdit.value = true
    }
    const confirmList = async (item: any) => {
        try {
            const arr = item.map((el: any) => el.name)
            const params = {
                timestamp: Date.now(),
                [editKey.value]: arr.join(','),
                id: editListId.value
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/helpMeRetouch/save', {
                enData
            })
            console.log('保存', res);
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
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



    //配置国际化
    const showLanguageEditor = ref<boolean>(false)
    const configId = ref<number | string>()
    const editorLanguage = (item: any) => {
        configId.value = item.id
        showLanguageEditor.value = true

    }

    //确定输入框
    const handleInput = async (item: any) => {
        console.log(item);

        try {
            const params = {
                timestamp: Date.now(),
                id: item.id,
                helpMeTitle: item.helpMeTitle,
                isCanPay: String(item.isCanPay),
                price: item.price,
                isShowTaobao: String(item.isShowTaobao),
                helpMeWxCustomerServiceUri: item.helpMeWxCustomerServiceUri,
                helpMeTaobaoUri: item.helpMeTaobaoUri,
                version: item.version,
                noPayTimes: JSON.parse(item.noPayTimes).join(','),
                bannerImgs: JSON.parse(item.bannerImgs).join(','),
            }
            console.log('参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/helpMeRetouch/save', {

                enData

            })

            console.log('保存输入框', res);
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
                getUserList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('修改输入框失败', err);
        } finally {
            showLoading.value = false
        }

    }


    //修改数字输入框
    const handleNumInput = async (item: any) => {
        try {
            const params = {
                timestamp: Date.now(),
                id: item.id,
                [item.key]: item[item.key],

            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/helpMeRetouch/save', {
                enData
            })
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
                getUserList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('修改数字输入框失败', err);
        } finally {
            showLoading.value = false
        }
    }


    //切换开关
    const switchChange = async (item: any) => {
        try {
            const params = {
                timestamp: Date.now(),
                id: item.id,
                isCanPay: String(item.isCanPay),
                isShowTaobao: String(item.isShowTaobao),
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/helpMeRetouch/save', {
                enData
            })
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
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

    //搜索参数
    interface SearchParams {
        appNo: string | number
        os: string
        isCanPay: string
        isShowTaobao: string



    }
    const searchParams = ref<SearchParams>(
        {
            appNo: defaultAppNo.value,
            os: '',
            isCanPay: '',
            isShowTaobao: ''

        }
    )
    //重置搜索
    const resetSearch = () => {
        searchParams.value = {
            appNo: defaultAppNo.value,
            os: '',
            isCanPay: '',
            isShowTaobao: ''

        }
        getUserList()
    }

    //监听app变化
    watch(() => defaultAppNo.value, () => {
        searchParams.value.appNo = defaultAppNo.value
        getUserList()
    })
    interface PhotoEditingAppData {
        appAbbreviation: string;                 // 所属应用
        os: string;                  // 系统
        helpMeTitle: string;          // 帮我修图标题
        isCharged: boolean;              // 是否收费
        price: number;                   // 价格
        showTaobaoPage: boolean;         // 是否显示淘宝页面
        taobaoPageLink: string;          // 淘宝页面链接
        wechatServiceLink: string;       // 帮我修图微信客服链接
        versionNumber: string;           // 版本号
        nonPaymentTime: number;          // 不支付时间（小时）
        channelPhotoUrl: string;         // 渠道照片
        i18nConfig: {                    // 国际化配置
            languages: string[];
            defaultLanguage: string;
        };
    }


    const appNote: any = {
        appAbbreviation: '所属应用',
        os: '系统',
        helpMeTitle: '帮我修图标题',
        isCanPay: '是否收费',
        price: '价格',
        isShowTaobao: '是否显示淘宝页面',
        helpMeTaobaoUri: '淘宝页面链接',
        helpMeWxCustomerServiceUri: '帮我修图微信客服链接',
        version: '版本号',
        noPayTimes: '不支付时间',
        bannerImgs: '渠道照片',
        i18nConfig: '国际化配置'

    }
    // 生成用户数据
    const appData = ref<PhotoEditingAppData[]>([

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
                os: searchParams.value.os,
                isCanPay: searchParams.value.isCanPay,
                isShowTaobao: searchParams.value.isShowTaobao
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/helpMeRetouch/list', {
                enData
            })
            console.log('获取帮我修图列表', res);
            res.data.rows.forEach((item: any) => {
                item.isCanPay = item.isCanPay === 'true' ? true : false
                item.isShowTaobao = item.isShowTaobao === 'true' ? true : false
            })
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
            console.log('获取帮我修图列表失败', err);
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