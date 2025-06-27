<template>
    <div class="data-table-container">
        <div class="table-header">
            <h3 class="table-title">{{ title }}</h3>
            <div class="filter-container" v-if="filter">
                <!-- <div class="filter-item">
                    <el-input v-model="searchParams.version" placeholder="版本" clearable />

                </div> -->
            </div>
        </div>
        <el-button type="primary" @click="addData">新增</el-button>
        <el-table :data="viewList" border style="width: 100%" :max-height="420" highlight-current-row
            :header-cell-style="{ background: '#f5f7fa' }" :cell-style="{ padding: '8px 0' }">
            <template v-for="item in keyList" :key="item.key">
                <el-table-column :prop="item.key" width="120" :label="item.note" show-overflow-tooltip>
                    <!-- 处理嵌套对象属性 -->
                    <template v-if="item.key.includes('.')" #default="scope">
                        {{ getNestedProperty(scope.row, item.key) }}
                    </template>

                    <!-- 处理广告类型字段，添加个性化屏蔽广告和摇一摇广告的开关状态 -->
                    <template v-if="item.key === 'advType'" #default="scope">
                        <div>
                            {{ scope.row.advType && scope.row.advType.typeName }}
                            <template v-if="scope.row.advType && scope.row.advType.typeId === 'TT_ADS'">
                                <div>
                                    <span>个性化屏蔽广告</span>
                                    <el-switch v-model="scope.row.personalAdsOpen" disabled />
                                </div>
                                <div>
                                    <span>摇一摇广告</span>
                                    <el-switch v-model="scope.row.shakeAdsOpen" disabled />
                                </div>
                            </template>
                        </div>
                    </template>

                    <template
                        v-if="item.key === 'showAdv' || item.key === 'showOs' || item.key === 'showBanner' || item.key === 'showInterstitial' || item.key === 'showReward' || item.key === 'showInfoFlow' || item.key === 'showAllScreen' || item.key === 'showContent'"
                        #default="scope">
                        <el-switch v-model="scope.row[item.key]" active-text="开" inactive-text="关" />
                        <div v-if="scope.row[item.key]">
                            <p>开始 <el-input style="width: 50px;" type='number'></el-input></p>
                            <p>间隔 <el-input style="width: 50px;" type='number'></el-input></p>
                        </div>
                    </template>
                </el-table-column>
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
import service from '@/axios';
import { useCounterStore } from '@/stores/counter';
import { desEncrypt } from '@/utils/des';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue'
const stores = useCounterStore()
const { defaultAppNo } = storeToRefs(stores)
const props = defineProps<{
    title: string
    filter: boolean
    type: string
}>()
const emit = defineEmits<{
    'add': [value: any],
    'editor': [value: any, title: string],
    'delete': [value: any, title: string]
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
    emit('editor', row, props.title)
}

//删除
const handleDelete = (row: any) => {
    console.log('删除', row);
    emit('delete', row, props.title)
}
//  渠道信息
interface channelItem {
    id: number;               // 编号
    channels: string;          // 渠道
    adType: string;           // 广告类型
    showAdv: boolean;          // 显示广告
    showOs: boolean;        // 开屏
    showBanner: boolean;        // banner
    showInterstitial: boolean;  // 插屏
    showReward: boolean;      // 激励
    showInfoFlow: boolean;    // 全屏
    showAllScreen: boolean;          // 信息流
    showContent: string;          // 内容

}
const channelList = ref<channelItem[]>([

])

//定时任务
interface cornItem {
    id: number;               // 编号
    openStartTime: string;     // 开屏开始时间
    openEndTime: string;       // 开屏结束时间
    channels: string;          // 渠道
    adType: string;           // 广告类型
    showAdv: boolean;          // 显示广告
    showOs: boolean;        // 开屏
    showBanner: boolean;        // banner
    showInterstitial: boolean;  // 插屏
    showReward: boolean;      // 激励
    showInfoFlow: boolean;    // 全屏
    showAllScreen: boolean;          // 信息流
    showContent: string;          // 内容
}
const cornList = ref<cornItem[]>([

])

//插屏广告
interface InterstitialAdsItem {
    id: number;                // 编号
    adPositionId: string;      // 广告显示位ID
    loadProbability: number;   // 加载概率(0-1之间的小数)
    closeCountLimit: number;   // 关闭几次后不显示 
}
const interstitiaAdsList = ref<InterstitialAdsItem[]>([

])

//注释
const note = ref<any>({
    id: '编号',
    'channels.channelRemark': '渠道',
    advType: '广告类型',
    openStartTime: '开始时间',
    openEndTime: '结束时间',
    showAdv: '显示广告',
    showOs: '开屏',
    showBanner: 'banner',
    showInterstitial: '插屏',
    showReward: '激励',
    showInfoFlow: '全屏',
    showAllScreen: '信息流',
    showContent: '内容',
    pageId: '广告显示位ID',
    loadProgram: '加载概率',
    noLoadAfterSeveralTimesClose: '关闭次数限制',
})

// 不同类型表格需要展示的字段配置
const typeFieldsConfig = ref<any>({
    channel: ['id', 'channels.channelRemark', 'advType', 'showAdv', 'showOs', 'showBanner', 'showInterstitial', 'showReward', 'showInfoFlow', 'showAllScreen', 'showContent'],
    corn: ['id', 'channels.channelRemark', 'openStartTime', 'openEndTime', 'showAdv', 'showOs', 'showBanner', 'showInterstitial', 'showReward', 'showInfoFlow', 'showAllScreen', 'showContent'],
    InterstitialAds: ['id', 'pageId', 'loadProgram', 'noLoadAfterSeveralTimesClose']
})

const viewList = ref<any>()
const keyList = ref<any>()

//初始化参数列表
const initParams = () => {
    keyList.value = []; // 清空之前的 keyList

    // 根据当前类型获取需要展示的字段
    const fields = typeFieldsConfig.value[props.type] || [];

    // 如果没有配置或者配置为空，则使用对象的所有字段
    if (fields.length === 0 && viewList.value && viewList.value.length > 0) {
        for (const key in viewList.value[0]) {
            keyList.value.push({
                key,
                note: note.value[key] || key
            });
        }
    } else {
        // 使用配置的字段
        fields.forEach((key: string) => {
            keyList.value.push({
                key,
                note: note.value[key] || key
            });
        });
    }

    console.log('列表数据', viewList.value);
    console.log('展示字段', keyList.value);
}

// 获取嵌套对象的属性值
const getNestedProperty = (obj: any, path: string) => {
    if (!obj || !path) return undefined;

    const keys = path.split('.');
    let result = obj;

    for (const key of keys) {
        if (result === null || result === undefined) return undefined;
        result = result[key];
    }

    return result;
}



//分页
const pageNum = ref<number>(1)
const pageSize = ref<number>(10)
const totalData = ref<number>(0)

watch(() => pageNum.value, () => {
    getData()
})

//监听应用变化
watch(() => defaultAppNo.value, () => {
    getData()
})

const getChannelList = async () => {
    try {
        const params = {
            pageNum: pageNum.value,
            pageSize: pageSize.value,
            appNo: defaultAppNo.value,
            timestamp: Date.now()
        }
        const enData = desEncrypt(JSON.stringify(params))
        const res = await service.post('/advChannelConfig/list', {
            enData
        })
        console.log('渠道广告列表', res);
        totalData.value = res.data.total
        channelList.value = res.data.rows
    } catch (err) {

    }
}

const getCornList = async () => {
    try {
        const params = {
            timestamp: Date.now(),
            pageNum: pageNum.value,
            pageSize: pageSize.value,
            appNo: defaultAppNo.value,
        }
        const enData = desEncrypt(JSON.stringify(params))
        const res = await service.post('/advChannelTaskConfig/list', {
            enData
        })
        console.log('定时任务列表', res);
        totalData.value = res.data.total
        cornList.value = res.data.rows
    } catch (err) {
        console.log('获取定时任务列表失败', err);
    }
}


const getAdvList = async () => {
    try {
        const params = {
            timestamp: Date.now(),
            pageNum: pageNum.value,
            pageSize: pageSize.value,
            appNo: defaultAppNo.value,
        }
        const enData = desEncrypt(JSON.stringify(params))
        const res = await service.post('/advInterstitialConfig/list', {
            enData
        })
        console.log('插屏广告列表', res);
        totalData.value = res.data.total
        interstitiaAdsList.value = res.data.rows
    } catch (err) {
        console.log('获取插屏广告失败', err);
    }
}


const getData = async () => {
    try {
        console.log('props.type', props.type);
        switch (props.type) {
            case 'channel':
                await getChannelList()
                viewList.value = channelList.value
                break;
            case 'corn':
                await getCornList()
                viewList.value = cornList.value
                break;
            case 'InterstitialAds':
                await getAdvList()
                viewList.value = interstitiaAdsList.value
                break;
        }
        initParams()

    }
    catch (err) {
        console.log('获取数据出错', err);
    }
}
onMounted(() => {

    getData()



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