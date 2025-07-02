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
        <el-table :data="viewList" border style="width: 100%" :min-height="420" :max-height="600" highlight-current-row
            :header-cell-style="{ background: '#f5f7fa' }" :cell-style="{ padding: '8px 0' }">
            <template v-for="item in keyList" :key="item.key">
                <el-table-column :prop="item.key" :label="item.note" show-overflow-tooltip min-width="130">
                    <!-- 处理嵌套对象属性 -->
                    <template v-if="item.key.includes('.')" #default="scope">
                        {{ getNestedProperty(scope.row, item.key) }}
                    </template>

                    <!-- 处理广告类型字段，显示数组中的 id 和 typeName -->
                    <template v-if="item.key === 'optionals'" #default="scope">
                        <div>
                            <!-- 如果只有一个广告类型，直接显示 -->
                            <template v-if="scope.row.optionals && scope.row.optionals.length === 1">
                                <span>{{ scope.row.optionals[0].advType.typeName }}</span>
                            </template>

                            <!-- 如果有多个广告类型，使用下拉选择框 -->
                            <template v-else-if="scope.row.optionals && scope.row.optionals.length > 1">
                                <el-select v-model="scope.row.selectedOptionalId" placeholder="选择广告类型"
                                    style="width: 100px" @change="handleOptionalChange(scope.row, $event)">
                                    <el-option v-for="optional in scope.row.optionals" :key="optional.advType.id"
                                        :label="`${optional.advType.typeName}`" :value="optional.advType.id" />
                                </el-select>
                            </template>

                            <!-- 如果没有广告类型数据 -->
                            <template v-else>
                                <span style="color: #999;">暂无广告类型</span>
                            </template>

                            <!-- 如果选中的是头条广告，显示个性化屏蔽广告和摇一摇广告开关 -->
                            <template v-if="getSelectedOptional(scope.row)?.advType?.typeId === 'TT_ADS'">
                                <div style="margin-top: 8px;">
                                    <div style="margin-bottom: 4px;">
                                        <p>个性化屏蔽广告</p>
                                        <el-switch v-model="scope.row.personalAdsOpen" disabled />
                                    </div>
                                    <div>
                                        <p>摇一摇广告</p>
                                        <el-switch v-model="scope.row.shakeAdsOpen" disabled />
                                    </div>
                                </div>
                            </template>
                        </div>
                    </template>

                    <!-- 处理时间字段，使用时间选择器 -->
                    <template style="width: 150rpx;" v-if="item.key === 'openStartTime' || item.key === 'openEndTime'"
                        #default="scope">
                        <el-time-picker v-model="scope.row[item.key]" format="HH:mm" value-format="HH:mm"
                            placeholder="选择时间" style="width: 100px;"
                            @change="handleTimeChange(scope.row, item.key, $event)" />
                    </template>

                    <!-- 渠道类型的开关字段，包含开始和间隔输入框 -->
                    <template
                        v-if="(item.key === 'showAdv' || item.key === 'showOs' || item.key === 'showBanner' || item.key === 'showInterstitial' || item.key === 'showReward' || item.key === 'showInfoFlow' || item.key === 'showAllScreen' || item.key === 'showContent') && props.type === 'channel'"
                        #default="scope">
                        <el-switch :model-value="getSwitchValue(scope.row[item.key])"
                            @update:model-value="setSwitchValue(scope.row, item.key, $event)" active-text="开"
                            inactive-text="关" />
                        <div>
                            <p>开始 <el-input style="width: 60px;" type="number"
                                    v-model="scope.row[getStartFieldName(item.key)]" :min="0" /></p>
                            <p>间隔 <el-input style="width: 60px;" type="number"
                                    v-model="scope.row[getIntervalFieldName(item.key)]" :min="0" /></p>
                        </div>
                    </template>

                    <!-- 定时任务类型的开关字段，只显示开关 -->
                    <template
                        v-if="(item.key === 'showAdv' || item.key === 'showOs' || item.key === 'showBanner' || item.key === 'showInterstitial' || item.key === 'showReward' || item.key === 'showInfoFlow' || item.key === 'showAllScreen' || item.key === 'showContent') && props.type === 'corn'"
                        #default="scope">
                        <el-switch :model-value="getSwitchValue(scope.row[item.key])"
                            @update:model-value="setSwitchValue(scope.row, item.key, $event)" active-text="开"
                            inactive-text="关" />
                    </template>


                    <!-- 插屏广告字段组件 -->

                    <template v-if="item.key === 'pageId'" #default="scope">
                        <el-input v-model="scope.row[item.key]" placeholder="请输入广告显示位ID" />
                    </template>

                    <template v-if="item.key === 'loadProgram' || item.key === 'noLoadAfterSeveralTimesClose'"
                        #default="scope">
                        <el-input v-model="scope.row[item.key]" type="number" />
                    </template>

                </el-table-column>
            </template>

            <el-table-column label="操作" fixed="right" width="150">
                <template #default="scope">
                    <div class="action-buttons" style="display: flex; flex-direction: column; gap: 4px;">
                        <el-button v-if="type !== 'InterstitialAds'" type="primary" size="small" text
                            @click="handleEditor(scope.row)">
                            编辑
                        </el-button>
                        <el-button type="primary" size="small" text @click="handleResult(scope.row)">提交修改</el-button>
                        <el-button type="danger" size="small" text @click="handleDelete(scope.row)">
                            删除
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <div class="pagination-container">
            <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
                :small="false" :disabled="false" :background="true" layout="total, sizes, prev, pager, next"
                :total="totalData" :prev-text="'上一页'" :next-text="'下一页'" :page-size-text="'条/页'"
                :total-text="'共 {total} 条'" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script lang="ts" setup>
    import service from '@/axios';
    import { useCounterStore } from '@/stores/counter';
    import { desEncrypt } from '@/utils/des';
    import { storeToRefs } from 'pinia';
    import { onMounted, ref, watch } from 'vue'
    const stores = useCounterStore()
    const { defaultAppNo, showLoading } = storeToRefs(stores)
    const props = defineProps<{
        title: string
        filter: boolean
        type: string
    }>()
    const emit = defineEmits<{
        'add': [value: any],
        'editor': [value: any, title: string],
        'delete': [value: any, title: string],
        'save': [value: any, title: string]
    }>()
    const searchParams = ref<any>({
        version: '',
    })



    //新增
    const addData = () => {
        emit('add', props.title)
    }


    //编辑
    const handleEditor = (row: any) => {
        emit('editor', row, props.title)
    }

    //删除
    const handleDelete = (row: any) => {
        emit('delete', row, props.title)
    }

    //提交修改
    const handleResult = (row: any) => {
        emit('save', row, props.title)
    }



    // 不同类型表格需要展示的字段配置
    const typeFieldsConfig = ref<any>({
        channel: ['id', 'channels.channelRemark', 'optionals', 'showAdv', 'showOs', 'showBanner', 'showInterstitial', 'showReward', 'showInfoFlow', 'showAllScreen', 'showContent'],
        corn: ['id', 'channels.channelName', 'openStartTime', 'openEndTime', 'showAdv', 'showOs', 'showBanner', 'showInterstitial', 'showReward', 'showInfoFlow', 'showAllScreen', 'showContent'],
        InterstitialAds: ['id', 'pageId', 'loadProgram', 'noLoadAfterSeveralTimesClose']
    })

    const viewList = ref<any>()
    const keyList = ref<any>()

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
    const channelList = ref<channelItem[]>([])

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
    const cornList = ref<cornItem[]>([])

    //插屏广告
    interface InterstitialAdsItem {
        id: number;                // 编号
        pageId: string;      // 广告显示位ID
        loadProgram: number;   // 加载概率(0-1之间的小数)
        noLoadAfterSeveralTimesClose: number;   // 关闭几次后不显示 
    }
    const interstitiaAdsList = ref<InterstitialAdsItem[]>([])

    //注释
    const note = ref<any>({
        id: '编号',
        'channels.channelRemark': '渠道',
        'channels.channelName': '渠道',
        optionals: '广告类型',
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

    // 获取开始字段名称
    const getStartFieldName = (showKey: string) => {
        const fieldMap: Record<string, string> = {
            'showAdv': 'advOpenStartNum',
            'showOs': 'osOpenStartNum',
            'showBanner': 'bannerOpenStartNum',
            'showInterstitial': 'interstitialOpenStartNum',
            'showReward': 'rewardOpenStartNum',
            'showInfoFlow': 'infoFlowOpenStartNum',
            'showAllScreen': 'allScreenOpenStartNum',
            'showContent': 'contentOpenStartNum'
        }
        return fieldMap[showKey] || ''
    }

    // 获取间隔字段名称
    const getIntervalFieldName = (showKey: string) => {
        const fieldMap: Record<string, string> = {
            'showAdv': 'advOpenIntervalNum',
            'showOs': 'osOpenIntervalNum',
            'showBanner': 'bannerOpenIntervalNum',
            'showInterstitial': 'interstitialOpenIntervalNum',
            'showReward': 'rewardOpenIntervalNum',
            'showInfoFlow': 'infoFlowOpenIntervalNum',
            'showAllScreen': 'allScreenOpenIntervalNum',
            'showContent': 'contentOpenIntervalNum'
        }
        return fieldMap[showKey] || ''
    }



    //分页
    const pageNum = ref<number>(1)
    const pageSize = ref<number>(10)
    const totalData = ref<number>(0)

    // 分页事件处理
    const handleSizeChange = (val: number) => {
        pageSize.value = val
        pageNum.value = 1 // 重置到第一页
        getData()
    }

    const handleCurrentChange = (val: number) => {
        pageNum.value = val
        getData()
    }

    watch(() => pageNum.value, () => {
        getData()
    })

    //监听应用变化
    watch(() => defaultAppNo.value, () => {
        getData()
    })

    const getChannelList = async () => {
        showLoading.value = true
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

        } finally {
            showLoading.value = false
        }
    }

    const getCornList = async () => {
        showLoading.value = true
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
        } finally {
            showLoading.value = false
        }
    }


    const getAdvList = async () => {
        showLoading.value = true
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
        } finally {
            showLoading.value = false
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
                    // 对定时任务数据进行时间格式初始化
                    viewList.value = initTimeData(cornList.value)
                    break;
                case 'InterstitialAds':
                    await getAdvList()
                    viewList.value = interstitiaAdsList.value
                    break;
            }

            // 初始化广告类型选择
            viewList.value.forEach((item: { optionals: string | any[]; selectedOptionalId: any; }) => {
                // 如果有多个广告类型，默认选中第一个
                if (item.optionals && Array.isArray(item.optionals) && item.optionals.length > 1) {
                    item.selectedOptionalId = item.optionals[0]?.advType?.id || null;
                    console.log('初始化选中广告类型:', item.selectedOptionalId);
                }
            });

            initParams()
        }
        catch (err) {
            console.log('获取数据出错', err);
        }
    }
    // 处理广告类型下拉选择框变化
    const handleOptionalChange = (row: any, selectedId: number) => {
        // 可以在这里添加额外的逻辑，比如更新其他相关字段
        console.log('选择的广告类型ID:', selectedId, '行数据:', row);
    }

    // 处理时间字段变化
    const handleTimeChange = (row: any, fieldKey: string, newTime: string) => {
        //console.log('时间字段变化:', fieldKey, '新时间:', newTime, '行数据:', row);
        // 可以在这里添加时间格式验证或其他逻辑
    }

    // 初始化时间数据格式
    const initTimeData = (data: any[]) => {
        return data.map(item => {
            // 将时间字符串转换为时间选择器可识别的格式
            if (item.openStartTime && typeof item.openStartTime === 'string') {
                // 如果是 "00:00:00:00" 格式，转换为 "00:00:00:000" 格式
                item.openStartTime = item.openStartTime.replace(/:(\d{2})$/, ':$100');
            }
            if (item.openEndTime && typeof item.openEndTime === 'string') {
                // 如果是 "00:00:00:00" 格式，转换为 "00:00:00:000" 格式
                item.openEndTime = item.openEndTime.replace(/:(\d{2})$/, ':$100');
            }
            return item;
        });
    }

    // 获取当前选中的广告类型
    const getSelectedOptional = (row: any) => {
        if (!row.optionals || !Array.isArray(row.optionals)) {
            return null;
        }

        // 如果只有一个选项，直接返回第一个
        if (row.optionals.length === 1) {
            return row.optionals[0];
        }

        // 如果有多个选项，根据selectedOptionalId查找
        if (row.selectedOptionalId) {
            return row.optionals.find((optional: { advType: { id: any; }; }) => optional.advType.id === row.selectedOptionalId);
        }

        // 默认返回第一个
        return row.optionals[0] || null;
    }

    // 获取开关值，支持字符串和布尔值
    const getSwitchValue = (value: any): boolean => {
        if (typeof value === 'string') {
            return value === 'true';
        }
        return Boolean(value);
    }

    // 设置开关值，将布尔值转换为字符串或保持原类型
    const setSwitchValue = (row: any, key: string, value: boolean) => {
        // 如果原值是字符串类型，则保持字符串格式
        if (typeof row[key] === 'string') {
            row[key] = value ? 'true' : 'false';
        } else {
            row[key] = value;
        }
    }

    defineExpose({
        getData
    });
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

        .pagination-container {
            display: flex;
            justify-self: end;
            margin-top: 20px;
            padding: 16px 0;

            :deep(.el-pagination) {
                .el-pagination__total {
                    color: #606266;
                    font-weight: 500;
                }

                .el-pager li {
                    transition: all 0.2s ease;

                    &:hover {
                        color: #409eff;
                    }

                    &.is-active {
                        background-color: #409eff;
                        color: #fff;
                    }
                }

                .btn-prev,
                .btn-next {
                    transition: all 0.2s ease;

                    &:hover {
                        color: #409eff;
                    }
                }
            }
        }
    }
</style>