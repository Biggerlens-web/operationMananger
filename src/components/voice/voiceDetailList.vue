<template>
    <el-dialog v-model="dialogVisible" title="语言包管理" width="90%" :before-close="handleClose">
        <div class="voice-management">
            <!-- 上传按钮 -->
            <div class="upload-section">
                <el-button type="primary" @click="handleUpload">上传</el-button>
                <el-input v-model="searchText" placeholder="语音文本" style="width: 200px; margin-left: 10px;" clearable />
            </div>

            <!-- 表格 -->
            <el-table :data="voiceList" style="width: 100%; margin-top: 20px;height: 500px;" border stripe>
                <el-table-column prop="pTitle" label="所属语音包" width="120" />
                <el-table-column prop="title" label="语音文本" min-width="200" />
                <el-table-column prop="file" label="文件" min-width="300">
                    <template #default="scope">
                        <div class="file-cell">
                            <span class="file-url">{{ scope.row.file }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="playCount" label="播放量" width="80" align="center" />
                <el-table-column prop="likeCount" label="收藏量" width="80" align="center" />
                <el-table-column prop="shareCount" label="分享量" width="80" align="center" />
                <el-table-column prop="clickCount" label="点击量" width="80" align="center" />
                <el-table-column label="操作" width="150" align="center">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination-wrapper">
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
                    layout="prev, pager, next" @current-change="handleCurrentChange" />
            </div>
        </div>
    </el-dialog>
    <uploadVoiceDetail v-model:dialog-visible="uploadVoice" :voiceType="voiceType" />
    <voiceDetailEdit v-model:dialog-visible="editVisible" :voiceData="editData" />
</template>

<script lang="ts" setup>
    import { ref, reactive, watch } from 'vue'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { useCounterStore } from '@/stores/counter'
    import uploadVoiceDetail from './uploadVoiceDetail.vue'
    import voiceDetailEdit from './voiceDetailEdit.vue'
    import { storeToRefs } from 'pinia'
    import { desEncrypt } from '@/utils/des'
    import service from '@/axios'
    const stores = useCounterStore()
    const { showLoading } = storeToRefs(stores)
    interface VoiceItem {
        id: number | string
        pTitle: string
        title: string
        file: string
        likeCount: number
        playCount: number
        shareCount: number
        clickCount: number

    }
    const props = defineProps<{
        voiceType: any
    }>()
    const dialogVisible = defineModel('dialogVisible', {
        type: Boolean,
        default: false
    })



    const uploadVoice = ref<boolean>(false)

    watch(() => dialogVisible.value, async (newVal, oldVal) => {
        if (newVal) {
            await getDetailList()
        }
    })
    //明细列表
    const getDetailList = async () => {
        showLoading.value = true
        try {
            const params = {
                timestamp: Date.now(),
                query: searchText.value,
                pageNum: currentPage.value,
                pageSize: pageSize.value,
                categoryId: props.voiceType.id
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/voice/voiceList', {
                enData
            })
            console.log('列表', res);
            console.log('props.', props.voiceType);
            voiceList.value = res.data.rows
            voiceList.value.forEach(item => {
                item.pTitle = props.voiceType.title
            })
            total.value = res.data.total
        } catch (err) {
            console.log('获取失败', err);
        } finally {
            showLoading.value = false
        }
    }

    // 搜索文本
    const searchText = ref('')

    // 分页数据
    const currentPage = ref(1)
    const pageSize = ref(15)
    const total = ref(0)

    // 表格数据
    const voiceList = ref<VoiceItem[]>([

    ])

    // 关闭对话框
    const handleClose = () => {
        dialogVisible.value = false
    }

    // 上传处理
    watch(() => uploadVoice.value, (newV) => {
        if (!newV) {
            getDetailList()
        }
    })
    const handleUpload = () => {
        uploadVoice.value = true
    }

    // 编辑处理
    const editVisible = ref<boolean>(false)
    const editData = ref<any>()
    watch(() => editVisible.value, (newV) => {
        if (!newV) {
            getDetailList()
        }
    })
    const handleEdit = (row: VoiceItem) => {
        editData.value = row
        editVisible.value = true
    }

    // 删除处理
    const handleDelete = async (row: VoiceItem) => {
        showLoading.value = true
        try {
            await ElMessageBox.confirm(
                `确定要删除语音吗？`,
                '确认删除',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            )

            const res = await service.post(`/voice/voiceDel/${row.id}`)
            if (res.data.code === 200) {
                ElMessage.success('删除成功')
                getDetailList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch {
            ElMessage.info('已取消删除')
        } finally {
            showLoading.value = false
        }
    }



    // 当前页改变
    const handleCurrentChange = (val: number) => {
        currentPage.value = val
        getDetailList()
    }


</script>

<style lang="scss" scoped>
    .voice-management {
        .upload-section {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }

        .file-cell {
            .file-url {
                font-size: 12px;
                color: #606266;
                word-break: break-all;
                line-height: 1.4;
            }
        }

        .pagination-wrapper {

            margin-top: 20px;
        }
    }

    :deep(.el-dialog) {
        .el-dialog__body {
            padding: 20px;
        }
    }

    :deep(.el-table) {
        .el-table__cell {
            padding: 8px 0;
        }
    }
</style>