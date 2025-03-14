<template>
    <div class="view">
        <el-card class="filter-card">
            <div class="card-header">
                <div class="left-actions">
                    <el-button type="primary" class="add-button">
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
                        <el-select v-model="searchParams.path" placeholder="请选择路径" clearable>
                            <el-option label="目录" value="目录" />
                            <el-option label="菜单" value="菜单" />
                            <el-option label="按钮" value="按钮" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-input v-model="searchParams.bannerImgName" placeholder="输入图片名称" clearable
                            prefix-icon="Link" />
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
            <Transition enter-active-class="animate__animated animate__slideInLeft"
                leave-active-class="animate__animated animate__slideOutLeft">
                <component :is="componentName" :filterParams="filterParams" :tableData="bannerImgData"></component>
            </Transition>

            <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                :total="1000" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import tableAciton from '@/components/public/tableAciton.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';
    import { onMounted, ref } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    const counterStore = useCounterStore()
    const { showPagestion } = storeToRefs(counterStore)
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)



    //搜索参数
    interface SearchParams {
        path: string
        bannerImgName: string

    }
    const searchParams = ref<SearchParams>(
        {
            path: '',
            bannerImgName: '',

        }
    )
    //重置搜索
    const resetSearch = () => {
        searchParams.value = {
            path: '',
            bannerImgName: '',
        }
        getUserList()
    }
    interface AdImageItem {
        id: number;           // 编号
        endpoint: string;     // 端点
        domain: string;       // 域
        path: string;         // 路径
        image: string;        // 图片
        imageName: string;    // 图片名称
        imageUrl: string;     // 图片访问链接
        clickUrl: string;     // 图片点击链接
        imageId: string;      // 图片标识
        descriptionEn: string; // 英文说明
        descriptionCn: string; // 中文说明
    }

    const bannerImgNote: any = {
        id: '编号',
        endpoint: '端点',
        domain: '域',
        path: '路径',
        image: '图片',
        imageName: '图片名称',
        imageUrl: '图片访问链接',
        clickUrl: '图片点击链接',
        imageId: '图片标识',
        descriptionEn: '英文说明',
        descriptionCn: '中文说明',

    }
    // 生成用户数据
    const bannerImgData = ref<AdImageItem[]>([
        {
            id: 1,
            endpoint: '/api/v1/banners',
            domain: 'api.example.com',
            path: '/api/v1/banners',
            image: 'banner_1.jpg',
            imageName: '首页横幅1',
            imageUrl: 'https://example.com/images/banner_1.jpg',
            clickUrl: 'https://example.com/click/banner_1',
            imageId: 'IMG_0001',
            descriptionEn: 'Homepage banner advertisement 1',
            descriptionCn: '首页横幅广告图片1'
        },
        {
            id: 2,
            endpoint: '/api/v1/ads',
            domain: 'test.example.com',
            path: '/api/v1/ads',
            image: 'promo_1.jpg',
            imageName: '促销活动1',
            imageUrl: 'https://example.com/images/promo_1.jpg',
            clickUrl: 'https://example.com/click/promo_1',
            imageId: 'IMG_0002',
            descriptionEn: 'Promotional advertisement 1',
            descriptionCn: '促销活动广告图片1'
        },
        {
            id: 3,
            endpoint: '/api/v1/promotions',
            domain: 'dev.example.com',
            path: '/api/v1/promotions',
            image: 'ad_1.jpg',
            imageName: '产品广告1',
            imageUrl: 'https://example.com/images/ad_1.jpg',
            clickUrl: 'https://example.com/click/ad_1',
            imageId: 'IMG_0003',
            descriptionEn: 'Product advertisement 1',
            descriptionCn: '产品广告图片1'
        }
    ])
    interface filterParams {
        note: string
        isShow: boolean
        key: string
    }
    const filterParams = ref<filterParams[]>()
    const getUserList = async () => {
        console.log('获取用户列表');
        const dataItem = bannerImgData.value[0]
        const keys = Object.keys(dataItem)
        filterParams.value = keys.map((item) => {
            return {
                note: bannerImgNote[item],
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