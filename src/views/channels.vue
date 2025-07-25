<template>
    <!-- 视图容器 -->
    <div class="view">
        <!-- 渠道编辑器弹窗 -->
        <channelEditor v-model:dialog-visible="showChannelEditor" :channelInfo="channelInfo" />
        <!-- 过滤和操作卡片 -->
        <el-card class="filter-card">
            <div>
                <!-- 新增渠道按钮 -->
                <el-button type="primary" @click="addChannel"> <el-icon>
                        <Plus />
                    </el-icon>新增渠道</el-button>
                <!-- 表格操作组件 -->
                <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
                    @changeView="changeView" />
            </div>
        </el-card>
        <!-- 内容展示卡片 -->
        <el-card class="content-card">
            <!-- 动态组件切换，带过渡效果 -->
            <Transition enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut" mode="out-in">
                <component :is="componentName" :filterParams="filterParams" :tableData="channelData"
                    @editor="editorChannel" @delete="deleteChannel"></component>
            </Transition>

            <!-- 分页组件 -->
            <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                :total="totalData" v-model:page-size="pageSize" v-model:current-page="pageNum" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    // 引入子组件和所需模块
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

    // 使用Pinia store进行状态管理
    const counterStore = useCounterStore()
    const { showPagestion, showLoading } = storeToRefs(counterStore)

    // 定义可切换的组件
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)


    // 分页状态
    const pageNum = ref<number>(1)
    const pageSize = ref<number>(20)
    const totalData = ref<number>(0)
    // 监听页码变化，重新获取数据
    watch(() => pageNum.value, () => {
        getUserList()
    })

    // 新增渠道逻辑
    const showChannelEditor = ref(false)
    // 监听编辑器弹窗的关闭事件
    watch(() => showChannelEditor.value, (newV) => {
        if (!newV) {
            // 重置渠道信息并刷新列表
            channelInfo.value = {
                id: 0,
                channelId: '',
                channelName: '',
                channelRemark: '',
            }
            getUserList()
        }
    })
    // 打开新增渠道弹窗
    const addChannel = () => {
        showChannelEditor.value = true
    }

    // 编辑渠道逻辑
    const channelInfo = ref<ChannelItem>({
        id: 0,
        channelId: '',
        channelName: '',
        channelRemark: '',
    })
    // 设置要编辑的渠道信息并打开弹窗
    const editorChannel = (item: any) => {
        console.log('编辑渠道', item);
        channelInfo.value = item
        showChannelEditor.value = true
    }

    // 删除渠道逻辑
    const delChannelFn = async (id: number) => {
        try {
            showLoading.value = true
            const res = await service.post(`/base/channels/del/${id}`)
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
    // 弹出确认框进行删除
    const deleteChannel = (item: any) => {
        ElMessageBox.confirm('此操作将永久删除该渠道, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(res => {
            delChannelFn(item.id)
        })
    }


    // 渠道信息接口定义
    interface ChannelItem {
        id: number;        // 编号
        channelId: string; // 渠道编号
        channelName: string; // 渠道名称
        channelRemark: string; // 渠道说明
    }

    // 渠道字段的中文注释
    const channelNote: any = {
        id: '编号',
        channelId: '渠道编号',
        channelName: '渠道名称',
        channelRemark: '渠道说明',

    }
    // 渠道数据列表
    const channelData = ref<ChannelItem[]>([

    ])
    // 过滤参数接口定义
    interface filterParams {
        note: string
        isShow: boolean
        key: string
    }
    // 过滤参数
    const filterParams = ref<filterParams[]>()
    // 获取渠道列表数据
    const getUserList = async () => {
        try {
            const params = {
                pageNum: pageNum.value,
                pageSize: pageSize.value,
                timestamp: Date.now()
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.get('/base/channels/list', {
                params: {
                    enData
                }
            })
            totalData.value = res.data.total
            channelData.value = res.data.rows
            const keys = Object.keys(channelNote)
            // 生成过滤参数
            filterParams.value = keys.map((item) => {
                return {
                    note: channelNote[item],
                    isShow: true,
                    key: item
                }
            })
        } catch (err) {
            console.error('获取渠道列表失败', err);
        } finally {
            showLoading.value = false
        }

    }
    // 控制表格列的显示/隐藏
    const checkedParams = ({ key, checked }: any) => {
        const item = filterParams.value?.find((item) => item.key === key)
        if (item) {
            item.isShow = checked
        }

    }
    // 切换视图（表格/列表）
    const changeView = () => {
        const keys = Object.keys(components)
        const keyItem = keys.find((item) => item !== componentStr.value)
        if (keyItem) {
            componentStr.value = keyItem
            componentName.value = components[keyItem]
        }
    }
    // 组件挂载后执行
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
            height: max-content;

            .pagesBox {
                margin-top: 30px;
            }
        }
    }
</style>