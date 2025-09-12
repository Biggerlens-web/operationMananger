<template>
    <div class="view">
        <bannerImgEditor v-model:dialog-visible="showBannerImgEditor" :bannerInfo="bannerInfo"
            :bannerFolderList="bannerFolderList" />
        <el-card class="filter-card">
            <div class="card-header">
                <div class="left-actions">
                    <el-button type="primary" @click="addBannerImg" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增轮播图
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
                        <el-select v-model="searchParams.folderId" placeholder="请选择路径" clearable>
                            <el-option v-for="item in bannerFolderList"
                                :label="`${item.parentObj.bucketName}.${item.parentObj.endpoint}.${item.folder}`"
                                :value="item.id" />



                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-input v-model="searchParams.imgName" placeholder="输入图片名称" clearable prefix-icon="Link" />
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
                <component :is="componentName" :filterParams="filterParams" :tableData="bannerImgData"
                    @editor="editorBannerImg" @delete="deleteBannerImg"></component>
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
    import bannerImgEditor from '@/components/banner/bannerEditor.vue';
    import { onMounted, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { useRoute } from 'vue-router';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    const counterStore = useCounterStore()
    const { showPagestion, showLoading } = storeToRefs(counterStore)




    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)



    //分页
    const pageNum = ref(1)
    const pageSize = ref(10)
    const totalData = ref(0)
    watch(() => pageNum.value, () => {
        getUserList()
    })

    //新增轮播图
    const showBannerImgEditor = ref<boolean>(false)

    watch(() => showBannerImgEditor.value, (newV) => {
        if (!newV) {
            bannerInfo.value = ''
            getUserList()
        }
    })
    const addBannerImg = () => {
        showBannerImgEditor.value = true
    }



    //编辑轮播图
    const bannerInfo = ref<any>()
    const editorBannerImg = (item: any) => {
        bannerInfo.value = item
        showBannerImgEditor.value = true
    }
    //删除轮播图

    const delBannerImg = async (id: number) => {
        try {
            showLoading.value = true
            const res = await service.post(`/base/bannerImg/del/${id}`)
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
    }
    const deleteBannerImg = (item: any) => {
        ElMessageBox.confirm(
            '此操作将永久删除该轮播图, 是否继续?',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(res => {
            delBannerImg(item.id)

        })
    }
    //搜索参数
    interface SearchParams {
        folderId: string | number
        imgName: string

    }
    const searchParams = ref<SearchParams>(
        {
            folderId: '',
            imgName: '',

        }
    )
    //重置搜索
    const resetSearch = () => {
        searchParams.value = {
            folderId: '',
            imgName: '',
        }
        getUserList()
    }
    interface AdImageItem {
        id: number;           // 编号
        endpoint: string;     // 端点
        bucketName: string;       // 域
        folder: string;         // 路径
        image: string;        // 图片
        imgName: string;    // 图片名称
        imgUrl: string;     // 图片访问链接
        imgClickUrl: string;     // 图片点击链接
        funcType: string;      // 图片标识
        remarkEN: string; // 英文说明
        remarkCH: string; // 中文说明
    }

    const bannerImgNote: any = {
        id: '编号',
        endpoint: '端点',
        bucketName: '域',
        folder: '路径',
        image: '图片',
        imgName: '图片名称',
        imgUrl: '图片访问链接',
        imgClickUrl: '图片点击链接',
        funcType: '图片标识',
        remarkEN: '英文说明',
        remarkCH: '中文说明',

    }
    // 生成用户数据
    const bannerImgData = ref<AdImageItem[]>([

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
                folderId: searchParams.value.folderId,
                imgName: searchParams.value.imgName,
            }

            console.log('轮播图列表参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/base/bannerImg/list',
                {
                    enData
                }
            )
            console.log('获取轮播图列表', res);

            res.data.rows.forEach((item: any) => {
                item.folder = item.parentObj.folder
                item.endpoint = item.parentObj.parentObj.endpoint
                item.bucketName = item.parentObj.parentObj.bucketName
                item.image = item.imgUrl + `?time=${Date.now()}`
            })
            bannerImgData.value = res.data.rows
            totalData.value = res.data.total
            const keys = Object.keys(bannerImgNote)
            filterParams.value = keys.map((item) => {
                return {
                    note: bannerImgNote[item],
                    isShow: true,
                    key: item
                }
            })
            console.log('filterParams', filterParams.value);
        } catch (err) {
            console.log('获取轮播图列表失败', err);
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




    //获取轮播图路径列表
    const bannerFolderList = ref<any>([])
    const getBannerFolderList = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                pageNum: 1,
                pageSize: 999999
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.get('/base/bannerImgFolder/list', {
                params: {
                    enData
                }
            })

            bannerFolderList.value = res.data.rows
            console.log('bannerFolderList', bannerFolderList.value);
        } catch (err) {
            console.log('获取路径列表失败', err);
        } finally {
            showLoading.value = false
        }
    }
    const route = useRoute()
    onMounted(() => {

        if (route.query.id) {
            searchParams.value.folderId = parseInt(route.query.id as string)
        }
        getBannerFolderList()



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
            height: max-content;

            .pagesBox {
                margin-top: 30px;
            }
        }
    }
</style>