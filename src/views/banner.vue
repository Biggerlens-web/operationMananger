<template>
    <div class="view">
        <copyBanner v-model:dialog-visible="showBannerCopy" :copyInfo="copyInfo" />
        <bannerPointEditor v-model:dialog-visible="showBannerEditor" :bannerPointInfo="bannerPointInfo" />
        <el-card class="filter-card">
            <div class="card-header">
                <div class="left-actions">
                    <el-button type="primary" @click="addBanner" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增轮播点
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
                        <el-select filterable v-model="searchParams.appNo" placeholder="请选择应用" clearable>
                            <el-option v-for="item in appList" :key="item.appNo"
                                :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                                :value="item.appNo" />

                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.os" placeholder="请选择系统" clearable>
                            <el-option v-for="item in OSlist" :key="item" :label="item" :value="item" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.language" placeholder="请选择语言" clearable>
                            <el-option v-for="item in international" :key="item.value" :label="item.language"
                                :value="item.value" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.channelId" placeholder="请选择渠道" clearable>
                            <el-option v-for="item in channelList" :key="item.id" :label="item.channelName"
                                :value="item.id" />
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
                <component :is="componentName" :filterParams="filterParams" :tableData="carouseData" :copy="true"
                    :banner="true" @editor="editorBanner" @delete="deleteBanner" @copyItem="copyItem"
                    @setBannerImg="setBannerImg">
                </component>
            </Transition>

            <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                :total="totalData" v-model:page-size="pageSize" v-model:current-page="pageNum" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import tableAciton from '@/components/public/tableAciton.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';

    import bannerPointEditor from '@/components/banner/bannerPointEditor.vue';
    import { onMounted, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { desEncrypt } from '@/utils/des';
    import copyBanner from '@/components/banner/copyBanner.vue';
    import service from '@/axios';
    const counterStore = useCounterStore()
    const { showPagestion, appList, OSlist, channelList, international } = storeToRefs(counterStore)
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)


    //复制
    const copyInfo = ref<any>()
    const showBannerCopy = ref<boolean>(false)
    watch(() => showBannerCopy.value, (newV) => {
        if (!newV) {
            getUserList()
        }
    })
    const copyItem = (item: any) => {
        copyInfo.value = item.id
        console.log('复制', item);
        showBannerCopy.value = true
    }

    //配置轮播图
    const setBannerImg = (item: any) => {


        console.log('配置轮播图', item);

    }
    //分页
    const pageNum = ref<number>(1)
    const pageSize = ref<number>(20)
    const totalData = ref<number>(0)
    watch(() => pageNum.value, () => {
        getUserList()
    })

    //新增轮播点
    const showBannerEditor = ref<boolean>(false)
    watch(() => showBannerEditor.value, () => {
        if (!showBannerEditor.value) {
            bannerPointInfo.value = ''
            getUserList()
        }
    })
    const addBanner = () => {
        showBannerEditor.value = true
    }


    //编辑轮播点
    const bannerPointInfo = ref<any>()
    const editorBanner = (item: any) => {
        bannerPointInfo.value = item
        showBannerEditor.value = true
    }


    //删除轮播点
    const delBannerFn = async (id: number) => {
        try {
            const res = await service.post(`/base/banner/del/${id}`)
            console.log('删除', res);
            if (res.data.code === 200) {
                ElMessage.success('删除成功')
                getUserList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('删除失败', err);
        }
    }
    const deleteBanner = (item: any) => {
        ElMessageBox.confirm(
            '此操作将永久删除该轮播点, 是否继续?',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(res => {
            delBannerFn(item.id)
        })

    }
    //搜索参数
    interface SearchParams {
        appNo: string
        os: string
        channelId: string | number
        language: string

    }
    const searchParams = ref<SearchParams>(
        {
            appNo: '',
            os: '',
            language: '',
            channelId: '',

        }
    )
    //重置搜索
    const resetSearch = () => {
        searchParams.value = {
            appNo: '',
            os: '',
            language: '',
            channelId: '',
        }
        getUserList()
    }
    interface CarouselItem {
        id: number;           // 编号
        appName: string;      // 所属应用
        os: string;       // 系统
        language: string;     // 语言
        channelName: string;      // 渠道
        bannerName: string; // 轮播点名称
        bannerCode: string; // 轮播点编码
    }

    const carouseNote: any = {
        id: '编号',
        appName: '所属应用',
        os: '系统',
        language: '语言',
        channelName: '渠道',
        bannerName: '轮播点名称',
        bannerCode: '轮播点编码',


    }
    // 生成用户数据
    const carouseData = ref<CarouselItem[]>([

    ])
    interface filterParams {
        note: string
        isShow: boolean
        key: string
    }
    const filterParams = ref<filterParams[]>()
    const getUserList = async () => {


        try {
            const params: any = {
                timestamp: Date.now(),
                pageNum: pageNum.value,
                pageSize: pageSize.value,
                ...searchParams.value
            }
            for (let key in params) {
                if (params[key] === undefined) {
                    params[key] = ''
                }
            }
            console.log('参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/base/banner/list', {

                enData

            })

            console.log('获取录播点列表', res);
            res.data.rows.forEach((item: any) => {

                item.channelName = item.channels ? item.channels.channelName : ''
                item.language = item.languageVo ? item.languageVo.remark : ''
                item.appName = item.parentObj.appAbbreviation
            })
            carouseData.value = res.data.rows
            totalData.value = res.data.total
        } catch (err) {
            console.log('获取轮播点列表失败', err);
        }
        console.log('获取用户列表');

        const keys = Object.keys(carouseNote)
        filterParams.value = keys.map((item) => {
            return {
                note: carouseNote[item],
                isShow: true,
                key: item
            }
        })
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
        getUserList();
        console.log('international', international.value);
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