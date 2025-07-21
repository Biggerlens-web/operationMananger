<template>
    <div class="view">
        <voiceEdit v-model:dialog-visible="dialogVisible" :editData="editData" />
        <uploadVoice v-model:dialog-visible="uploaddialog" :typeList="typeList" />
        <voiceDetailList v-model:dialog-visible="detailDialogVisible" :voiceType="voiceType" />
        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <el-button type="primary" class="add-button" @click="addVoice">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增
                    </el-button>
                    <el-button type="primary" class="add-button" @click="upload">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        上传
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
                        <el-select filterable v-model="searchParams.os" placeholder="系统" class="filter-select">
                            <el-option v-for="item in OSlist" :key="item.value" :label="item.note"
                                :value="item.value" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.voiceCate" placeholder="分类" class="filter-select">
                            <el-option v-for="item in typeList" :key="item.cid" :label="item.title" :value="item.cid" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-input v-model="searchParams.query" placeholder="包名"></el-input>

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
                <component :is="componentName" :filterParams="filterParams" :tableData="appData" @editor="handleEdit"
                    @delete="handleDelete" @view="openVoiceDetail">
                </component>
            </Transition>

            <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                :total="totalData" v-model:current-page="searchParams.pageNum" v-model:page-size="searchParams.pageSize"
                @change="getUserList" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import tableAciton from '@/components/public/tableAciton.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';
    import voiceEdit from '@/components/voice/voiceEdit.vue';
    import uploadVoice from '@/components/voice/uploadVoice.vue';
    import voiceDetailList from '@/components/voice/voiceDetailList.vue';
    import { onMounted, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import service from '@/axios';
    import { desEncrypt } from '@/utils/des';
    import { ElMessage, ElMessageBox } from 'element-plus';
    const counterStore = useCounterStore()
    const { showPagestion, OSlist, defaultAppNo, showLoading } = storeToRefs(counterStore)
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)

    //获取分类列表
    const typeList = ref<any>([])
    const getTypeList = async () => {
        showLoading.value = true
        try {
            const params = {
                timestamp: Date.now(),
                appNo: defaultAppNo.value
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.get('/voice/index', {
                params: {
                    enData
                }
            })
            console.log('获取分类', res);
            typeList.value = res.data.data.voicePidList
        } catch (err) {
            console.log('获取分类失败', err);
        } finally {
            showLoading.value = false
        }
    }




    //编辑
    const editData = ref<any>()
    const dialogVisible = ref<boolean>(false)
    watch(() => dialogVisible.value, (newV) => {
        if (!newV) {
            editData.value = ''
            getUserList()
        }
    })
    const handleEdit = (row: any) => {
        editData.value = row
        dialogVisible.value = true
    }

    //新增
    const addVoice = () => {
        dialogVisible.value = true
    }


    //上传语言包
    const uploaddialog = ref<boolean>(false)
    watch(() => uploaddialog.value, (newV) => {
        if (!newV) {
            getUserList()
        }
    })
    const upload = () => {
        uploaddialog.value = true
    }

    //语音包管理
    const detailDialogVisible = ref<boolean>(false)
    const voiceType = ref<number>(0)
    const openVoiceDetail = (item: any) => {
        console.log('item', item);
        voiceType.value = item

        detailDialogVisible.value = true
    }

    //删除
    const handleDelete = (item: any) => {
        ElMessageBox.confirm('确定删除吗？', '删除确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(async () => {
            // 确认删除
            showLoading.value = true
            try {
                const res = await service.post(`/voice/del/${item.id}`)
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
        })
    }


    //搜索参数
    interface SearchParams {
        query: string
        os: string
        voiceCate: string
        pageNum: number
        pageSize: number


    }
    const totalData = ref<number>()
    const searchParams = ref<SearchParams>(
        {
            query: '',
            os: OSlist.value[0].value,
            voiceCate: '',
            pageNum: 1,
            pageSize: 10

        }
    )
    //重置搜索
    const resetSearch = () => {
        searchParams.value = {
            query: '',
            os: OSlist.value[0].value,
            voiceCate: '',
            pageNum: 1,
            pageSize: 10

        }
        getUserList()
    }
    interface AppContentItem {
        appAbbreviation: string;       // 所属应用
        os: string;          // 类型
        pid: number;         // 层级
        title: string;          // 名称
        imageName: string;     // 缩略图
        playCount: number;    // 点击量
        likeCount: number; // 收藏量
        shareCount: number;    // 分享量
        createTime: string;    // 创建时间
    }


    const appNote: any = {
        appAbbreviation: '所属应用',
        os: '类型',
        pid: '层级',
        title: '名称',
        imageName: '缩略图',
        playCount: '点击量',
        likeCount: '收藏量',
        shareCount: '分享量',
        createTime: '创建时间',
    }
    // 生成用户数据
    const appData = ref<AppContentItem[]>([

    ])
    interface filterParams {
        note: string
        isShow: boolean
        key: string
    }
    const filterParams = ref<filterParams[]>()

    watch(() => defaultAppNo.value, () => {
        searchParams.value.pageNum = 1
        searchParams.value.os = OSlist.value[0]
        searchParams.value.voiceCate = ''
        searchParams.value.query = ''
        getUserList()
    })
    const getUserList = async () => {
        console.log('获取用户列表');
        showLoading.value = true
        try {

            const params = {
                timestamp: Date.now(),
                appNo: defaultAppNo.value,
                os: searchParams.value.os,
                voiceCate: searchParams.value.voiceCate,
                query: searchParams.value.query,
                pageNum: searchParams.value.pageNum,
                pageSize: searchParams.value.pageSize,

            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/voice/list', {
                enData
            })
            console.log('获取语音包列表', res);
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

        } finally {
            showLoading.value = false
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
        getTypeList()
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
            height: max-content;

            .pagesBox {
                margin-top: 30px;
            }
        }
    }
</style>