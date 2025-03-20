<template>
    <div class="data-table-container">
        <div class="table-header">
            <h3 class="table-title">{{ title }}</h3>
            <div class="filter-container" v-if="filter">
                <div class="filter-item">
                    <el-input v-model="searchParams.version" placeholder="版本" clearable />

                </div>
            </div>
        </div>
        <el-button type="primary" @click="addData">新增</el-button>
        <el-table :data="viewList" border style="width: 100%" :max-height="420" highlight-current-row
            :header-cell-style="{ background: '#f5f7fa' }" :cell-style="{ padding: '8px 0' }">
            <template v-for="item in keyList" :key="item.key">
                <el-table-column :prop="item.key" :label="item.note" show-overflow-tooltip />
            </template>

            <el-table-column label="操作" fixed="right" width="150" align="center">
                <template #default="scope">
                    <div class="action-buttons">
                        <el-button type="primary" size="small" text @click="handleEditor(scope.row)">
                            编辑
                        </el-button>
                        <el-button type="danger" size="small" text @click="handleDelete(scope.row)">
                            删除
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts" setup>
    import { onMounted, ref } from 'vue'
    const props = defineProps<{
        title: string
        filter: boolean
        type: string
    }>()
    const emit = defineEmits<{
        'add': [value: any],
        'editor': [value: any],
        'delete': [value: any]
    }>()
    const searchParams = ref<any>({
        version: '',
    })

    //新增
    const addData = () => {
        console.log('新增');
        emit('add', props.title)
    }


    //编辑
    const handleEditor = (row: any) => {
        console.log('编辑', row);
        emit('editor', row)
    }

    //删除
    const handleDelete = (row: any) => {
        console.log('删除', row);
        emit('delete', row)
    }
    //  渠道信息
    interface channelItem {
        id: number;               // 编号
        channel: string;          // 渠道
        adType: string;           // 广告类型
        showAd: boolean;          // 显示广告
        splashAd: boolean;        // 开屏
        bannerAd: boolean;        // banner
        interstitialAd: boolean;  // 插屏
        rewardedAd: boolean;      // 激励
        fullscreenAd: boolean;    // 全屏
        feedAd: boolean;          // 信息流
        content: string;          // 内容

    }
    const channelList = ref<channelItem[]>([
        {
            id: 1,
            channel: "应用宝",
            adType: "穿山甲",
            showAd: true,
            splashAd: true,
            bannerAd: true,
            interstitialAd: false,
            rewardedAd: true,
            fullscreenAd: false,
            feedAd: true,
            content: "普通素材"
        },
        {
            id: 2,
            channel: "华为应用市场",
            adType: "优量汇",
            showAd: true,
            splashAd: true,
            bannerAd: false,
            interstitialAd: true,
            rewardedAd: true,
            fullscreenAd: true,
            feedAd: false,
            content: "精品素材"
        },
        {
            id: 3,
            channel: "小米应用商店",
            adType: "穿山甲",
            showAd: true,
            splashAd: true,
            bannerAd: true,
            interstitialAd: true,
            rewardedAd: false,
            fullscreenAd: false,
            feedAd: true,
            content: "互动素材"
        },
        {
            id: 4,
            channel: "OPPO软件商店",
            adType: "优量汇",
            showAd: true,
            splashAd: false,
            bannerAd: true,
            interstitialAd: false,
            rewardedAd: true,
            fullscreenAd: false,
            feedAd: true,
            content: "视频素材"
        },
        {
            id: 5,
            channel: "VIVO应用商店",
            adType: "穿山甲",
            showAd: true,
            splashAd: true,
            bannerAd: false,
            interstitialAd: true,
            rewardedAd: true,
            fullscreenAd: false,
            feedAd: false,
            content: "原生素材"
        },
        {
            id: 6,
            channel: "App Store",
            adType: "优量汇",
            showAd: false,
            splashAd: false,
            bannerAd: false,
            interstitialAd: false,
            rewardedAd: true,
            fullscreenAd: false,
            feedAd: false,
            content: "奖励素材"
        },
        {
            id: 7,
            channel: "Google Play",
            adType: "AdMob",
            showAd: true,
            splashAd: false,
            bannerAd: true,
            interstitialAd: true,
            rewardedAd: true,
            fullscreenAd: true,
            feedAd: true,
            content: "海外素材"
        },
        {
            id: 8,
            channel: "官方网站",
            adType: "自有广告",
            showAd: true,
            splashAd: true,
            bannerAd: true,
            interstitialAd: false,
            rewardedAd: false,
            fullscreenAd: false,
            feedAd: true,
            content: "品牌素材"
        },
        {
            id: 9,
            channel: "百度手机助手",
            adType: "百青藤",
            showAd: true,
            splashAd: true,
            bannerAd: true,
            interstitialAd: true,
            rewardedAd: false,
            fullscreenAd: true,
            feedAd: true,
            content: "搜索素材"
        },
        {
            id: 10,
            channel: "魅族应用商店",
            adType: "广点通",
            showAd: true,
            splashAd: true,
            bannerAd: false,
            interstitialAd: true,
            rewardedAd: true,
            fullscreenAd: false,
            feedAd: true,
            content: "图文素材"
        }
    ])

    //定时任务
    interface cornItem {
        id: number;               // 编号
        channel: string;          // 渠道
        startTime: string;        // 开始时间
        endTime: string;          // 结束时间
        showAd: boolean;          // 显示广告
        splashAd: boolean;        // 开屏
        bannerAd: boolean;        // banner
        interstitialAd: boolean;  // 插屏
        rewardedAd: boolean;      // 激励
        fullscreenAd: boolean;    // 全屏
        feedAd: boolean;          // 信息流
        content: string;
    }
    const cornList = ref<cornItem[]>([
        {
            id: 1,
            channel: "应用宝",
            startTime: "2023-05-01 00:00:00",
            endTime: "2023-12-31 23:59:59",
            showAd: true,
            splashAd: true,
            bannerAd: true,
            interstitialAd: false,
            rewardedAd: true,
            fullscreenAd: false,
            feedAd: true,
            content: "普通素材"
        },
        {
            id: 2,
            channel: "华为应用市场",
            startTime: "2023-06-15 00:00:00",
            endTime: "2024-01-15 23:59:59",
            showAd: true,
            splashAd: true,
            bannerAd: false,
            interstitialAd: true,
            rewardedAd: true,
            fullscreenAd: true,
            feedAd: false,
            content: "精品素材"
        },
        {
            id: 3,
            channel: "小米应用商店",
            startTime: "2023-04-10 00:00:00",
            endTime: "2023-10-10 23:59:59",
            showAd: true,
            splashAd: true,
            bannerAd: true,
            interstitialAd: true,
            rewardedAd: false,
            fullscreenAd: false,
            feedAd: true,
            content: "互动素材"
        },
        {
            id: 4,
            channel: "OPPO软件商店",
            startTime: "2023-07-01 00:00:00",
            endTime: "2024-02-29 23:59:59",
            showAd: true,
            splashAd: false,
            bannerAd: true,
            interstitialAd: false,
            rewardedAd: true,
            fullscreenAd: false,
            feedAd: true,
            content: "视频素材"
        },
        {
            id: 5,
            channel: "VIVO应用商店",
            startTime: "2023-08-15 00:00:00",
            endTime: "2023-11-15 23:59:59",
            showAd: true,
            splashAd: true,
            bannerAd: false,
            interstitialAd: true,
            rewardedAd: true,
            fullscreenAd: false,
            feedAd: false,
            content: "原生素材"
        },
        {
            id: 6,
            channel: "App Store",
            startTime: "2023-09-01 00:00:00",
            endTime: "2024-03-01 23:59:59",
            showAd: false,
            splashAd: false,
            bannerAd: false,
            interstitialAd: false,
            rewardedAd: true,
            fullscreenAd: false,
            feedAd: false,
            content: "奖励素材"
        },
        {
            id: 7,
            channel: "Google Play",
            startTime: "2023-06-01 00:00:00",
            endTime: "2024-06-01 23:59:59",
            showAd: true,
            splashAd: false,
            bannerAd: true,
            interstitialAd: true,
            rewardedAd: true,
            fullscreenAd: true,
            feedAd: true,
            content: "海外素材"
        },
        {
            id: 8,
            channel: "官方网站",
            startTime: "2023-07-10 00:00:00",
            endTime: "2023-12-10 23:59:59",
            showAd: true,
            splashAd: true,
            bannerAd: true,
            interstitialAd: false,
            rewardedAd: false,
            fullscreenAd: false,
            feedAd: true,
            content: "品牌素材"
        },
        {
            id: 9,
            channel: "百度手机助手",
            startTime: "2023-08-01 00:00:00",
            endTime: "2024-01-31 23:59:59",
            showAd: true,
            splashAd: true,
            bannerAd: true,
            interstitialAd: true,
            rewardedAd: false,
            fullscreenAd: true,
            feedAd: true,
            content: "搜索素材"
        },
        {
            id: 10,
            channel: "魅族应用商店",
            startTime: "2023-09-15 00:00:00",
            endTime: "2024-02-15 23:59:59",
            showAd: true,
            splashAd: true,
            bannerAd: false,
            interstitialAd: true,
            rewardedAd: true,
            fullscreenAd: false,
            feedAd: true,
            content: "图文素材"
        }
    ])



    //插屏广告
    interface InterstitialAdsItem {
        id: number;                // 编号
        adPositionId: string;      // 广告显示位ID
        loadProbability: number;   // 加载概率(0-1之间的小数)
        closeCountLimit: number;   // 关闭几次后不显示 
    }
    const interstitiaAdsList = ref<InterstitialAdsItem[]>([
        {
            id: 1,
            adPositionId: "splash_001",
            loadProbability: 1.0,
            closeCountLimit: 3
        },
        {
            id: 2,
            adPositionId: "banner_top_001",
            loadProbability: 0.8,
            closeCountLimit: 5
        },
        {
            id: 3,
            adPositionId: "banner_bottom_001",
            loadProbability: 0.9,
            closeCountLimit: 4
        },
        {
            id: 4,
            adPositionId: "interstitial_game_001",
            loadProbability: 0.7,
            closeCountLimit: 2
        },
        {
            id: 5,
            adPositionId: "interstitial_level_001",
            loadProbability: 0.6,
            closeCountLimit: 3
        },
        {
            id: 6,
            adPositionId: "reward_video_001",
            loadProbability: 1.0,
            closeCountLimit: 0
        },
        {
            id: 7,
            adPositionId: "reward_video_002",
            loadProbability: 0.95,
            closeCountLimit: 0
        },
        {
            id: 8,
            adPositionId: "fullscreen_exit_001",
            loadProbability: 0.8,
            closeCountLimit: 2
        },
        {
            id: 9,
            adPositionId: "feed_home_001",
            loadProbability: 0.75,
            closeCountLimit: 5
        },
        {
            id: 10,
            adPositionId: "feed_detail_001",
            loadProbability: 0.85,
            closeCountLimit: 4
        }
    ])

    //注释
    const note = ref<any>({
        id: '编号',
        channel: '渠道',
        startTime: '开始时间',
        endTime: '结束时间',
        showAd: '显示广告',
        splashAd: '开屏',
        bannerAd: 'banner',
        interstitialAd: '插屏',
        rewardedAd: '激励',
        fullscreenAd: '全屏',
        feedAd: '信息流',
        content: '内容',
        adPositionId: '广告显示位ID',
        loadProbability: '加载概率',
        closeCountLimit: '关闭次数限制',
    })

    const viewList = ref<any>()
    const keyList = ref<any>([

    ])
    //初始化参数列表
    const initParams = () => {
        for (const key in viewList.value[0]) {
            keyList.value.push({
                key,
                note: note.value[key]
            })
        }
    }
    onMounted(() => {
        // console.log('props', props.type);



        switch (props.type) {
            case 'channel':
                viewList.value = channelList.value
                break;
            case 'corn':
                viewList.value = cornList.value
                break;
            case 'InterstitialAds':
                viewList.value = interstitiaAdsList.value
                break;
        }
        initParams()
    })
</script>

<style lang="scss" scoped>
    .data-table-container {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
        padding: 16px;
        margin-bottom: 24px;

        .table-header {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;

            .table-title {
                font-size: 18px;
                font-weight: 600;
                color: #303133;
                margin: 0;
                padding: 0;
                position: relative;

                &::after {
                    content: '';
                    position: absolute;
                    bottom: -8px;
                    left: 0;
                    width: 40px;
                    height: 3px;
                    background-color: #409eff;
                    border-radius: 3px;
                }
            }

            .filter-container {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;

                .filter-item {
                    min-width: 180px;

                    @media (max-width: 768px) {
                        min-width: 100%;
                    }
                }
            }

            @media (max-width: 768px) {
                flex-direction: column;
                align-items: flex-start;
                gap: 16px;
            }
        }

        :deep(.el-table) {
            border-radius: 6px;
            overflow: hidden;

            .el-table__row {
                transition: background-color 0.2s ease;

                &:hover {
                    background-color: #f0f7ff !important;
                }
            }

            th {
                font-weight: 600;
            }
        }

        .action-buttons {
            display: flex;
            justify-content: center;
            gap: 8px;

            :deep(.el-button) {
                padding: 4px 8px;
                transition: all 0.2s ease;

                &.el-button--primary {
                    color: #409eff;

                    &:hover {
                        color: #66b1ff;
                        background-color: #ecf5ff;
                    }
                }

                &.el-button--danger {
                    color: #f56c6c;

                    &:hover {
                        color: #f78989;
                        background-color: #fef0f0;
                    }
                }
            }
        }
    }
</style>