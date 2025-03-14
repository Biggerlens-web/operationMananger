<template>
    <div class="view">
        <el-card class="filter-card">
            <div>
                <el-button type="primary"> <el-icon>
                        <Plus />
                    </el-icon>新增渠道</el-button>
                <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
                    @changeView="changeView" />
            </div>
        </el-card>
        <el-card class="content-card">
            <Transition enter-active-class="animate__animated animate__slideInLeft"
                leave-active-class="animate__animated animate__slideOutLeft">
                <component :is="componentName" :filterParams="filterParams" :tableData="channelData"></component>
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
    interface ChannelItem {
        id: number;        // 编号
        channelId: string; // 渠道编号
        channelName: string; // 渠道名称
        description: string; // 渠道说明
    }

    const channelNote: any = {
        id: '编号',
        channelId: '渠道编号',
        channelName: '渠道名称',
        description: '渠道说明',

    }
    // 生成用户数据
    const channelData = ref<ChannelItem[]>([
        {
            id: 1,
            channelId: 'CH001',
            channelName: '微信',
            description: '微信小程序和公众号渠道'
        },
        {
            id: 2,
            channelId: 'CH003',
            channelName: 'APP',
            description: '原生应用渠道'
        },
        {
            id: 3,
            channelId: 'CH005',
            channelName: 'PC',
            description: '电脑端网页渠道'
        },
        {
            id: 4,
            channelId: 'CH007',
            channelName: '快手',
            description: '快手小程序和H5渠道'
        },
        {
            id: 5,
            channelId: 'CH009',
            channelName: '百度',
            description: '百度小程序和H5渠道'
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
        const dataItem = channelData.value[0]
        const keys = Object.keys(dataItem)
        filterParams.value = keys.map((item) => {
            return {
                note: channelNote[item],
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

            div {
                display: flex;
                align-items: center;
                justify-content: space-between;
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