<template>
    <div class="view">
        <channelEditor v-model:dialog-visible="showChannelEditor" :channelInfo="channelInfo" />
        <el-card class="filter-card">
            <div>
                <el-button type="primary" @click="addChannel"> <el-icon>
                        <Plus />
                    </el-icon>新增渠道</el-button>
                <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
                    @changeView="changeView" />
            </div>
        </el-card>
        <el-card class="content-card">
            <Transition enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut" mode="out-in">
                <component :is="componentName" :filterParams="filterParams" :tableData="channelData"
                    @editor="editorChannel" @delete="deleteChannel"></component>
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
    import channelEditor from '@/components/channels/channelEditor.vue';
    import { onMounted, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    const counterStore = useCounterStore()
    const { showPagestion } = storeToRefs(counterStore)
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)


    //分页
    const pageNum = ref<number>(1)
    const pageSize = ref<number>(20)
    const totalData = ref<number>(0)
    watch(() => pageNum.value, () => {
        getUserList()
    })

    //新增渠道
    const showChannelEditor = ref(false)
    watch(() => showChannelEditor.value, (newV) => {
        if (!newV) {
            channelInfo.value = {
                id: 0,
                channelId: '',
                channelName: '',
                channelRemark: '',
            }
            getUserList()
        }
    })
    const addChannel = () => {
        showChannelEditor.value = true
    }
    //编辑渠道
    const channelInfo = ref<ChannelItem>({
        id: 0,
        channelId: '',
        channelName: '',
        channelRemark: '',
    })
    const editorChannel = (item: any) => {
        console.log('编辑渠道', item);
        channelInfo.value = item
        showChannelEditor.value = true
    }
    //删除渠道
    const delChannelFn = async (id: number) => {
        try {
            const res = await service.post(`/base/channels/del/${id}`)
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
    const deleteChannel = (item: any) => {
        console.log('删除渠道', item);
        ElMessageBox.confirm('此操作将永久删除该渠道, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(res => {
            delChannelFn(item.id)
        })
    }


    interface ChannelItem {
        id: number;        // 编号
        channelId: string; // 渠道编号
        channelName: string; // 渠道名称
        channelRemark: string; // 渠道说明
    }

    const channelNote: any = {
        id: '编号',
        channelId: '渠道编号',
        channelName: '渠道名称',
        channelRemark: '渠道说明',

    }
    // 生成用户数据
    const channelData = ref<ChannelItem[]>([

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
                pageNum: pageNum.value,
                pageSize: pageSize.value,
                timestamp: Date.now()
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.get('/base/channels/list', {
                params: {
                    enData
                }
            })
            console.log('获取渠道列表', res);
            totalData.value = res.data.total
            channelData.value = res.data.rows
            const keys = Object.keys(channelNote)
            filterParams.value = keys.map((item) => {
                return {
                    note: channelNote[item],
                    isShow: true,
                    key: item
                }
            })
            console.log('filterParams', filterParams.value);
        } catch (err) {


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