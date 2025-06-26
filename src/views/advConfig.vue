<template>
    <div class="ad-management-view">
        <channelAdvEditor v-model:show-editor="showChannelEditor" />
        <cornEditor v-model:show-editor="showCornEditor" />
        <interstitialAdsEditor v-model:show-editor="showInterstitialAdsEditor" />
        <!-- <el-card class="filter-card">
            <div class="card-head">
                <el-select filterable v-model="activeApp" placeholder="请选择应用" class="filter-select">
                    <el-option v-for="item in appList" :key="item.appNo"
                        :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                        :value="item.appNo" />
                </el-select>
            </div>
        </el-card> -->
        <el-card class="content-card">
            <adTable v-for="item in tableELArray" :key="item.type" :title="item.title" :filter="item.filter"
                :type="item.type" class="ad-table" @add="addData" @editor="editorData" @delete="deleteData" />
        </el-card>
    </div>
</template>

<script lang="ts" setup>
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { reactive, ref } from 'vue'
    import adTable from '@/components/AdSubscription/adTable.vue';
    import channelAdvEditor from '@/components/AdSubscription/editor/channelAdvEditor.vue';
    import cornEditor from '@/components/AdSubscription/editor/cornEditor.vue';
    import interstitialAdsEditor from '@/components/AdSubscription/editor/interstitialAdsEditor.vue';
    import { ElMessageBox } from 'element-plus';
    const activeApp = ref<string | number>()
    const counterStore = useCounterStore()
    const { appList } = storeToRefs(counterStore)
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
            filter: false
        },
        {
            type: 'InterstitialAds',
            title: "插屏广告",
            filter: false
        },


    ])















    //新增数据
    const showChannelEditor = ref<boolean>(false) // 新增渠道广告弹窗
    const showCornEditor = ref<boolean>(false) // 新增定时任务弹窗
    const showInterstitialAdsEditor = ref<boolean>(false) // 新增插屏广告弹窗
    const addData = (type: string) => {
        console.log('type', type);
        if (type === '渠道广告') {
            showChannelEditor.value = true
        } else if (type === '定时任务') {
            showCornEditor.value = true

        }
    }
    //编辑数据
    const editorData = (row: any) => {

        // console.log('row', row);
        // if (type === '渠道广告') {
        //     showChannelEditor.value = true
        // } else if (type === '定时任务') {
        //     showCornEditor.value = true

        // }
    }

    //删除数据
    const deleteData = (row: any) => {

        // console.log('row', row);
        // ElMessageBox.confirm('确定删除吗？', '提示', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     type: 'warning'
        // })
    }

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