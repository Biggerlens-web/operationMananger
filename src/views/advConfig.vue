<!-- 广告管理视图 -->
<template>
    <div class="ad-management-view">
        <!-- 渠道广告编辑器 -->
        <channelAdvEditor v-model:show-editor="showChannelEditor" @refresh="refreshTables" :type="channelType"
            :rowList="currentRow" />
        <!-- 定时任务编辑器 -->
        <cornEditor v-model:show-editor="showCornEditor" @refresh="refreshTables" :type="cornType"
            :rowList="currentRow" />

        <!-- 内容区域卡片 -->
        <el-card class="content-card">
            <!-- 循环渲染广告表格 -->
            <adTable v-for="(item, index) in tableELArray" :key="item.type" :title="item.title" :filter="item.filter"
                :type="item.type" class="ad-table" @add="addData" @editor="editorData" @delete="deleteData"
                @save="saveAttr" :ref="el => { if (el) adTableRefs[index] = el }" />
        </el-card>
    </div>
</template>

<script lang="ts" setup>
    // 引入 Pinia store
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
    const { appList, defaultAppNo, showLoading } = storeToRefs(counterStore)

    // 定义表格元素的数组，用于渲染不同类型的广告表格
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

    // 存储 adTable 组件实例的引用
    const adTableRefs = ref<any[]>([]);
    /**
     * @description 刷新所有表格数据
     */
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

    // 控制编辑器弹窗的显示状态
    const showChannelEditor = ref<boolean>(false) // 渠道广告编辑器弹窗

    const channelType = ref<string>('') // 渠道广告编辑器模式 ('add' or 'update')
    const showCornEditor = ref<boolean>(false) // 定时任务编辑器弹窗
    const cornType = ref<string>('') // 定时任务编辑器模式 ('add' or 'update')
    /**
     * @description 处理新增数据事件
     * @param {string} type - 广告类型
     */
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
    // 存储当前正在编辑的数据行
    const currentRow = ref<any>({})
    /**
     * @description 处理编辑数据事件
     * @param {any} row - 当前行数据
     * @param {any} type - 广告类型
     */
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

    /**
     * @description 新增插屏广告
     */
    const addInterstitialAds = async () => {
        const params = {
            appNo: defaultAppNo.value,
            type: 'add',
            timestamp: Date.now(),
        }
        const paramsStr = desEncrypt(JSON.stringify(params))
        showLoading.value = true
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
        showLoading.value = false
    }

    /**
     * @description 处理删除数据事件
     * @param {any} row - 当前行数据
     * @param {any} type - 广告类型
     */
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

    /**
     * @description 删除渠道广告
     * @param {number} id - 渠道广告ID
     */
    const handleChannelDelete = async (id: number) => {
        console.log('参数', id);
        ElMessageBox.confirm('确定删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
            .then(async () => {
                try {
                    showLoading.value = true
                    const response = await service.post(`/advChannelConfig/del/${id}`)
                    if (response.data.code === 200) {
                        ElMessage.success('删除成功')
                        refreshTables()
                    }
                } catch (error) {
                    console.error('删除失败', error);
                    ElMessage.error('删除失败')
                } finally {
                    showLoading.value = false
                }
            })
            .catch(() => {
                console.log('取消');
            })
    }
    /**
     * @description 删除定时任务
     * @param {number} id - 定时任务ID
     */
    const handleTaskDelete = async (id: number) => {
        ElMessageBox.confirm('确定删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
            .then(async () => {
                console.log('确定');
                showLoading.value = true
                const res: any = await service.post(`/advChannelTaskConfig/del/${id}`)
                if (res.data.code === 200) {
                    ElMessage.success('删除成功')
                    refreshTables()
                }
                showLoading.value = false
            })
            .catch(() => {
                console.log('取消');
            })
    }
    /**
     * @description 删除插屏广告
     * @param {number} id - 插屏广告ID
     */
    const handleInterstitialAdsDelete = async (id: number) => {
        ElMessageBox.confirm('确定删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
            .then(async () => {
                showLoading.value = true
                const res: any = await service.post(`/advInterstitialConfig/del/${id}`)
                console.log('res', res);
                if (res.data.code === 200) {
                    ElMessage.success('删除成功')
                    refreshTables()
                }
                showLoading.value = false
            }).catch(() => {
                console.log('取消');
            })
    }

    /**
     * @description 保存属性修改
     * @param {any} row - 当前行数据
     * @param {any} type - 广告类型
     */
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

    /**
     * @description 保存渠道广告属性修改
     * @param {any} row - 当前行数据
     */
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
            showLoading.value = true
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
        } finally {
            showLoading.value = false
        }
    }


    /**
     * @description 保存定时任务属性修改
     * @param {any} row - 当前行数据
     */
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
            showLoading.value = true
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
        } finally {
            showLoading.value = false
        }
    }

    /**
     * @description 保存插屏广告属性修改
     * @param {any} row - 当前行数据
     */
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
        showLoading.value = true
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
        showLoading.value = false
    }

    /**
     * @description 获取广告类型列表并存储到 Pinia
     */
    const getAdList = async () => {
        const params = {
            appNo: defaultAppNo.value,
            timestamp: Date.now(),
        }

        const paramsStr = desEncrypt(JSON.stringify(params))
        showLoading.value = true
        const res: any = await service.post('/advChannelConfig/edit', {
            enData: paramsStr
        })
        if (res.data.code === 200) {
            useCounterStore(pinia).advertList = res.data.data.advTypes
            console.log('广告列表', res.data.data.advTypes);

        }
        showLoading.value = false
    }

    // 组件挂载时获取广告列表
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