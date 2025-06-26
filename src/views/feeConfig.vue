<template>
    <div class="view">
        <freeConfigEditor v-model:show-editor="showEditor" />
        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <el-button type="primary" @click="addConfig" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增付费弹窗配置
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
                        <el-select filterable v-model="searchParams.os" placeholder="请选择系统" class="filter-select">
                            <el-option v-for="item in OSlist" :key="item" :label="item" :value="item" />
                        </el-select>
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
            <Transition enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut" mode="out-in">
                <component :is="componentName" :filterParams="filterParams" :tableData="appData" @editor="editorConfig"
                    @delete="deleteConfig" :ishideEdit="true" @handleNumInput="handleNumInput"
                    @switchChange="switchChange">
                </component>
            </Transition>

            <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                :total="totalData" v-model:current-page="pageNum" :page-size="pageSize" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import tableAciton from '@/components/public/tableAciton.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';

    import freeConfigEditor from '@/components/freeConfig/freeConfigEditor.vue';
    import { onMounted, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    const counterStore = useCounterStore()
    const { showPagestion, OSlist, defaultAppNo } = storeToRefs(counterStore)
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)


    //分页
    const pageNum = ref<number>(1)
    const pageSize = ref<number>(10)
    const totalData = ref<number>(0)
    watch(() => pageNum.value, () => {
        getUserList()
    })

    //新增配置
    const showEditor = ref<boolean>(false)
    watch(() => showEditor.value, (newV) => {
        if (!newV) {
            getUserList()
        }
    })
    const addConfig = () => {
        showEditor.value = true
    }
    //编辑配置
    const editorConfig = (item: any) => {
        showEditor.value = true
    }
    //删除配置
    const delConfigFn = async (id: number) => {
        try {
            const res = await service.post(`/feeConfig/del/${id}`)
            if (res.data.code === 200) {
                ElMessage.success('删除成功')
                getUserList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {

        }
    }
    const deleteConfig = (item: any) => {
        console.log('删除', item)
        ElMessageBox.confirm(
            '此操作将永久删除该配置, 是否继续?',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        ).then(async () => {
            await delConfigFn(item.id)
        })
    }

    //切换开关
    const switchChange = async (item: any) => {

        console.log('切换开关', item);
        // try {
        //     const { key } = item
        //     const params = {
        //         timestamp: Date.now(),
        //         id: item.id,
        //         [key]: item[key]
        //     }
        //     const enData = desEncrypt(JSON.stringify(params))
        //     const res = await service.post('/feeConfig/save', {
        //         enData
        //     })
        //     console.log('保存成功', res);
        // } catch (err) {
        //     console.log('修改失败', err);
        // }
    }
    //修改数字输入框
    const handleNumInput = async (item: any) => {
        try {
            const { key } = item
            const params = {
                timestamp: Date.now(),
                id: item.id,
                [key]: item[key]
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/feeConfig/save', {
                enData
            })
            console.log('保存成功', res);
            if (res.data.code === 200) {
                ElMessage.success('修改成功')
                getUserList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('修改失败', err);
        }
    }
    //搜索参数
    interface SearchParams {

        os: string



    }
    const searchParams = ref<SearchParams>(
        {

            os: '',

        }
    )


    //重置搜索
    const resetSearch = () => {
        searchParams.value = {

            os: '',

        }
        getUserList()
    }
    interface FeatureConfig {
        appName: string;                // 所属应用
        feePointField: string;              // 字段名
        feePointName: string;       // 字段说明
        os: string;                 // 系统
        rightEnterVipUI: boolean;     // 是否直接打开vip界面

        showUpdateVip: boolean;        // 是否显示升级vip
        freeCount: number;         // 免费次数
        paymentAmount: number;          // 支付金额
        paymentUseCount: number;        // 可付费解锁次数
        paymentUnlockCount: number;   // 付费可解锁次数
        rightShowAdsUnlock: boolean;          // 是否直接显示广告
        adsVideoUnlockCount: number;          // 可广告解锁次数
        adsVideoUseCount: number;        // 广告可解锁次数
        shareAppUseCount: number;       // 可分享解锁次数
        shareAppUnlockCount: number;     // 分享可解锁次数
        questionnaireUseCount: number;      // 可使用调查问卷解说次数
        questionnaireUnlockCount: number;    // 调查问卷可解锁次数
        configTextDefault: string;       // 在线配置文案
    }


    const appNote: any = {
        appName: '所属应用',
        feePointField: '字段名',
        feePointName: '字段说明',
        os: '系统',
        rightEnterVipUI: '是否直接打开vip界面',

        showUpdateVip: '是否显示升级vip',
        freeCount: '免费次数',
        paymentAmount: '支付金额',
        paymentUseCount: '可付费解锁次数',
        paymentUnlockCount: '付费可解锁次数',
        rightShowAdsUnlock: '是否直接显示广告',
        adsVideoUnlockCount: '可广告解锁次数',
        adsVideoUseCount: '广告可解锁次数',
        shareAppUseCount: '可分享解锁次数',
        shareAppUnlockCount: '分享可解锁次数',
        questionnaireUseCount: '可使用调查问卷解锁次数',
        questionnaireUnlockCount: '调查问卷可解锁次数',
        configTextDefault: '在线配置文案'

    }
    // 生成用户数据
    const appData = ref<FeatureConfig[]>([

    ])
    interface filterParams {
        note: string
        isShow: boolean
        key: string
    }

    //监听应用变化
    watch(() => defaultAppNo.value, () => {
        getUserList()
    })

    const filterParams = ref<filterParams[]>()
    const getUserList = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                pageNum: pageNum.value,
                pageSize: pageSize.value,
                appNo: defaultAppNo.value,
                os: searchParams.value.os
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/feeConfig/list', {
                enData
            })
            console.log('获取付费弹窗列表', res);

            res.data.rows.forEach((item: any) => {
                item.rightEnterVipUI = item.rightEnterVipUI === 'true' ? true : false
                item.showUpdateVip = item.showUpdateVip === 'true' ? true : false
                item.rightShowAdsUnlock = item.rightShowAdsUnlock === 'true' ? true : false

            })
            totalData.value = res.data.total
            appData.value = res.data.rows
            const keys = Object.keys(appNote)
            filterParams.value = keys.map((item) => {
                return {
                    note: appNote[item],
                    isShow: true,
                    key: item
                }
            })
            console.log('filterParams', filterParams.value);
        } catch (err) {
            console.log('获取列表失败', err);
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