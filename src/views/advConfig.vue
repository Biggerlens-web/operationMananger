<template>
    <div class="ad-management-view">
        <channelAdvEditor v-model:show-editor="showChannelEditor" @refresh="refreshTables" :type="channelType"
            :rowList="currentRow" />
        <cornEditor v-model:show-editor="showCornEditor" @refresh="refreshTables" :type="cornType"
            :rowList="currentRow" />

        <el-card class="content-card">
            <adTable v-for="(item, index) in tableELArray" :key="item.type" :title="item.title" :filter="item.filter"
                :type="item.type" class="ad-table" @add="addData" @editor="editorData" @delete="deleteData"
                @save="saveAttr" :ref="el => { if (el) adTableRefs[index] = el }" />
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import { useCounterStore } from '@/stores/counter';
import { storeToRefs } from 'pinia';
import { onMounted, reactive, ref } from 'vue'
import adTable from '@/components/AdSubscription/adTable.vue';
import channelAdvEditor from '@/components/AdSubscription/editor/channelAdvEditor.vue';
import cornEditor from '@/components/AdSubscription/editor/cornEditor.vue';
import service from '@/axios';
import { desEncrypt } from '@/utils/des';
import { pinia } from '@/main'
import { ElMessageBox, ElMessage } from 'element-plus';
const counterStore = useCounterStore()
const { appList, defaultAppNo } = storeToRefs(counterStore)
const tableELArray = reactive<{
    type: string
    title: string
    filter: boolean
    filterParams?: string[]
}[]>([

    {
        type: 'channel',
        title: "渠道广告",
        filter: true,
    },
    {
        type: 'corn',
        title: "定时任务",
        filter: true,
    },
    {
        type: 'InterstitialAds',
        title: "插屏广告",
        filter: true,
    },


])
const adTableRefs = ref<any[]>([]);
// 添加这个函数来刷新表格数据
const refreshTables = () => {
    console.log('刷新表格数据');
    // 调用每个表格组件的 getData 方法
    adTableRefs.value.forEach(table => {
        if (table && table.getData) {
            table.getData();
        }
    });

    // 刷新广告列表数据
    getAdList();
}

//新增数据
const showChannelEditor = ref<boolean>(false) // 新增渠道广告弹窗
const channelType = ref<string>('') // 新增 or 编辑渠道广告弹窗
const showCornEditor = ref<boolean>(false) // 新增定时任务弹窗
const cornType = ref<string>('') // 新增 or 编辑定时任务弹窗
const addData = (type: string) => {
    console.log('type', type);
    if (type === '渠道广告') {
        showChannelEditor.value = true
        channelType.value = 'add'
    } else if (type === '定时任务') {
        showCornEditor.value = true
        cornType.value = 'add'
    } else if (type === '插屏广告') {
        addInterstitialAds()

    }
}
//编辑数据
//当前编辑数据
const currentRow = ref<any>({})
const editorData = (row: any, type: any) => {
    console.log('row', row, 'type', type);
    if (type === '渠道广告') {
        channelType.value = 'update'
        showChannelEditor.value = true
        currentRow.value = row
    } else if (type === '定时任务') {
        cornType.value = 'update'
        showCornEditor.value = true
        currentRow.value = row
    }
}

//插屏广告新增
const addInterstitialAds = async () => {
    const params = {
        appNo: defaultAppNo.value,
        type: 'add',
        timestamp: Date.now(),
    }
    const paramsStr = desEncrypt(JSON.stringify(params))
    const res: any = await service.post('/advInterstitialConfig/save', {
        enData: paramsStr
    })
    console.log(res, params);

    if (res.data.code === 200) {
        ElMessage.success('新增成功')
        // 刷新列表数据
        refreshTables()
    } else {
        ElMessage.error(res.data.message || '保存失败')
    }
}

//删除数据
const deleteData = (row: any, type: any) => {
    console.log('row', row, 'type', type);
    if (type === '渠道广告') {
        handleChannelDelete(row.id)
    } else if (type === '定时任务') {
        handleTaskDelete(row.id)
    } else if (type === '插屏广告') {
        handleInterstitialAdsDelete(row.id)
    }
}

//渠道广告删除
const handleChannelDelete = async (id: number) => {
    console.log('参数', id);
    ElMessageBox.confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(async () => {
            try {
                const response = await service.post(`/advChannelConfig/del/${id}`)
                if (response.data.code === 200) {
                    ElMessage.success('删除成功')
                    refreshTables()
                }
            } catch (error) {
                console.error('删除失败', error);
                ElMessage.error('删除失败')
            }
        })
        .catch(() => {
            console.log('取消');
        })
}
//定时任务删除
const handleTaskDelete = async (id: number) => {
    ElMessageBox.confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(async () => {
            console.log('确定');
            const res: any = await service.post(`/advChannelTaskConfig/del/${id}`)
            if (res.data.code === 200) {
                ElMessage.success('删除成功')
                refreshTables()
            }
        })
        .catch(() => {
            console.log('取消');
        })
}
//插屏广告删除
const handleInterstitialAdsDelete = async (id: number) => {
    ElMessageBox.confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(async () => {
            const res: any = await service.post(`/advInterstitialConfig/del/${id}`)
            console.log('res', res);
            if (res.data.code === 200) {
                ElMessage.success('删除成功')
                refreshTables()
            }
        }).catch(() => {
            console.log('取消');
        })
}

//提交修改数据
const saveAttr = async (row: any, type: any) => {
    console.log('row', row, 'type', type);
    if (type === '渠道广告') {
        handleChannelSaveAttr(row)
    } else if (type === '定时任务') {
        handleTaskSaveAttr(row)
    } else if (type === '插屏广告') {
        handleInterstitialAdsSaveAttr(row)
    }
}

//渠道广告提交修改
const handleChannelSaveAttr = async (row: any) => {
    console.log('row', row);
    const params = {
        id: row.id,
        advTypeId: row.advType?.id || row.advTypeId,
        showAdv: row.showAdv,
        advOpenStartNum: row.advOpenStartNum?.toString(),
        advOpenIntervalNum: row.advOpenIntervalNum?.toString(),
        showOs: row.showOs,
        osOpenStartNum: row.osOpenStartNum?.toString(),
        osOpenIntervalNum: row.osOpenIntervalNum?.toString(),
        showBanner: row.showBanner,
        bannerOpenStartNum: row.bannerOpenStartNum?.toString(),
        bannerOpenIntervalNum: row.bannerOpenIntervalNum?.toString(),
        showInterstitial: row.showInterstitial,
        interstitialOpenStartNum: row.interstitialOpenStartNum?.toString(),
        interstitialOpenIntervalNum: row.interstitialOpenIntervalNum?.toString(),
        showReward: row.showReward,
        rewardOpenStartNum: row.rewardOpenStartNum?.toString(),
        rewardOpenIntervalNum: row.rewardOpenIntervalNum?.toString(),
        showInfoFlow: row.showInfoFlow,
        infoFlowOpenStartNum: row.infoFlowOpenStartNum?.toString(),
        infoFlowOpenIntervalNum: row.infoFlowOpenIntervalNum?.toString(),
        showAllScreen: row.showAllScreen,
        allScreenOpenStartNum: row.allScreenOpenStartNum?.toString(),
        allScreenOpenIntervalNum: row.allScreenOpenIntervalNum?.toString(),
        showContent: row.showContent,
        contentOpenStartNum: row.contentOpenStartNum?.toString(),
        contentOpenIntervalNum: row.contentOpenIntervalNum?.toString(),
        personalAdsOpen: row.personalAdsOpen?.toString(),
        shakeAdsOpen: row.shakeAdsOpen?.toString(),
        timestamp: Date.now(),
    }

    try {
        const paramsStr = desEncrypt(JSON.stringify(params))
        const res: any = await service.post('/advChannelConfig/saveAttr', {
            enData: paramsStr
        })

        if (res.data.code === 200) {
            ElMessage.success('保存成功')
            // 刷新列表数据
            refreshTables()
        } else {
            ElMessage.error(res.data.message || '保存失败')
        }
    } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败，请重试')
    }
}


//定时任务提交修改
const handleTaskSaveAttr = async (row: any) => {
    const params = {
        id: row.id?.toString(),
        openStartTime: row.openStartTime ? row.openStartTime.replace(/:0000$/, '') : '00:00:00',
        openEndTime: row.openEndTime ? row.openEndTime.replace(/:0000$/, '') : '00:00:00',
        showAdv: row.showAdv === 'true' || row.showAdv === true,
        showOs: row.showOs === 'true' || row.showOs === true,
        showBanner: row.showBanner === 'true' || row.showBanner === true,
        showInterstitial: row.showInterstitial === 'true' || row.showInterstitial === true,
        showReward: row.showReward === 'true' || row.showReward === true,
        showInfoFlow: row.showInfoFlow === 'true' || row.showInfoFlow === true,
        showAllScreen: row.showAllScreen === 'true' || row.showAllScreen === true,
        showContent: row.showContent === 'true' || row.showContent === true,
        timestamp: Date.now(),
    }
    console.log('params', params);
    try {
        const paramsStr = desEncrypt(JSON.stringify(params))
        const res: any = await service.post('/advChannelTaskConfig/saveAttr', {
            enData: paramsStr
        })

        if (res.data.code === 200) {
            ElMessage.success('保存成功')
            // 刷新列表数据
            refreshTables()
        } else {
            ElMessage.error(res.data.message || '保存失败')
        }
    } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败，请重试')
    }
}

//插屏广告提交修改
const handleInterstitialAdsSaveAttr = async (row: any) => {
    console.log('row', row);
    const params = {
        id: row.id,
        type: 'update',
        appNo: row.appNo,
        pageId: row.pageId,
        loadProgram: row.loadProgram,
        noLoadAfterSeveralTimesClose: row.noLoadAfterSeveralTimesClose,
        timestamp: Date.now(),
    }
    const paramsStr = desEncrypt(JSON.stringify(params))
    const res: any = await service.post('/advInterstitialConfig/save', {
        enData: paramsStr
    })
    if (res.data.code === 200) {
        ElMessage.success('保存成功')
        // 刷新列表数据
        refreshTables()
    } else {
        ElMessage.error(res.data.message || '保存失败')
    }
}

//获取广告列表
const getAdList = async () => {
    const params = {
        appNo: defaultAppNo.value,
        timestamp: Date.now(),
    }

    const paramsStr = desEncrypt(JSON.stringify(params))
    const res: any = await service.post('/advChannelConfig/edit', {
        enData: paramsStr
    })
    if (res.data.code === 200) {
        useCounterStore(pinia).advertList = res.data.data.advTypes
        console.log('广告列表', res.data.data.advTypes);

    }
}

onMounted(() => {
    getAdList()
})

</script>

<style lang="scss" scoped>
.ad-management-view {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 16px;
    height: 100%;
    box-sizing: border-box;

    .filter-card {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        transition: box-shadow 0.3s ease;

        &:hover {
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
        }

        :deep(.el-card__body) {
            padding: 16px 20px;
        }

        .card-head {
            display: flex;
            align-items: center;

            .filter-select {
                width: 280px;

                @media (max-width: 768px) {
                    width: 100%;
                }
            }
        }
    }

    .content-card {
        flex: 1;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        transition: box-shadow 0.3s ease;
        max-height: calc(100vh - 180px);
        overflow-y: hidden; // 改为 hidden 而不是 auto

        &:hover {
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
        }

        :deep(.el-card__body) {
            padding: 20px;
            overflow-y: auto;
            height: 100%;
            box-sizing: border-box;

            /* 自定义滚动条样式 */
            &::-webkit-scrollbar {
                width: 8px;
            }

            &::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 4px;
            }

            &::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 4px;
            }

            &::-webkit-scrollbar-thumb:hover {
                background: #a8a8a8;
            }
        }

        .ad-table {
            margin-bottom: 24px;

            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}
</style>