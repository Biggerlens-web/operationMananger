<template>
    <el-dialog :model-value="dialogVisible" :title="dialogTitle" width="1000" :before-close="handleClose">
        <h3>轮播图</h3>
        <el-table ref="imgTableRef" :data="tableData" border style="width: 100%" height="600"
            @selection-change="selectChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="id" label="编号" />
            <el-table-column prop="endpoint" label="端点(endpoint)" />
            <el-table-column prop="bucketName" label="域(bucket)" />
            <el-table-column label="图片">
                <template #default="scoped">
                    <el-image :src="scoped.row.imgUrl" fit="contain" />
                </template>

            </el-table-column>
            <el-table-column prop="imgName" label="图片名称" />
            <el-table-column prop="imgUrl" label="图片访问链接" />
        </el-table>
        <el-pagination style="margin-top: 10px;" class="pagesBox" background layout="prev, pager, next"
            :total="totalData" v-model:page-size="pageSize" v-model:current-page="pageNum" />

        <div style="margin-top: 20px;" v-if="editType === 'batchAdd'">
            <h3>
                轮播点
            </h3>
            <el-table ref="pointTableRef" :data="tableData2" border style="width: 100%" height="300"
                @selection-change="selectChange2">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="id" label="编号" />
                <el-table-column label="所属应用">

                    <template #default="scope">
                        {{ scope.row.parentObj.appAbbreviation }}
                    </template>

                </el-table-column>
                <el-table-column prop="os" label="系统" />
                <el-table-column label="语言">
                    <template #default="scope">
                        {{ scope.row.languageVo.remark }}
                    </template>

                </el-table-column>
                <el-table-column label="渠道">
                    <template #default="scope">
                        {{ scope.row.channels.channelRemark }}
                    </template>

                </el-table-column>
                <el-table-column prop="bannerName" label="轮播点名称" />
                <el-table-column prop="bannerCode" label="轮播点编码" />
            </el-table>
            <el-pagination style="margin-top: 10px;" class="pagesBox" background layout="prev, pager, next"
                :total="totalData2" v-model:page-size="pageSize2" v-model:current-page="pageNum2" />
        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleComfirm">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    import service from '@/axios'
    import { desEncrypt } from '@/utils/des'
    import { ElMessage } from 'element-plus'
    import { computed, onMounted, ref, watch } from 'vue'

    const dialogVisible = defineModel('dialogVisible')

    // 表格引用
    const imgTableRef = ref()
    const pointTableRef = ref()

    watch(() => dialogVisible.value, (newV) => {
        if (newV) {
            // 清空选中的数据
            selectImg.value = []
            selectPoint.value = []
            // 清空表格的选中状态
            setTimeout(() => {
                imgTableRef.value?.clearSelection()
                pointTableRef.value?.clearSelection()
            }, 100)
        }
    })

    const props = defineProps<{
        appNo: string | number
        editType: string
        bannerId: string | number
    }>()

    //分页
    //轮播图
    const totalData = ref<number>(0)
    const pageNum = ref<number>(1)
    const pageSize = ref<number>(10)
    watch(() => pageNum.value, () => {
        getBannImgList()
    })

    const dialogTitle = computed(() => props.editType === 'add' ? '新增轮播图' : '批量新增轮播图')
    //分页
    //轮播图
    const totalData2 = ref<number>(0)
    const pageNum2 = ref<number>(1)
    const pageSize2 = ref<number>(10)

    watch(() => pageNum2.value, () => {
        getBannerPoint()
    })


    //选择轮播图
    const selectImg = ref<any>([])
    const selectChange = (newSelection: any[]) => {
        console.log('newSelection', newSelection);
        selectImg.value = newSelection.map((item: any) => {
            return item.id
        })

    }


    //选择轮播点
    const selectPoint = ref<any>([])
    const selectChange2 = (newSelection: any[]) => {
        console.log('newSelection', newSelection);
        selectPoint.value = newSelection.map((item: any) => {
            return item.id
        })
    }
    //轮播图列表
    const tableData = ref<any>([])

    //轮播点列表
    const tableData2 = ref<any>([])

    //获取轮播点列表
    const getBannerPoint = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                pageNum: pageNum.value,
                pageSize: pageSize.value,
                appNo: props.appNo,
                os: '',
                language: '',
                channelId: '',
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/base/banner/list', {
                enData
            })

            console.log('批量新增获取轮播点', res);
            totalData2.value = res.data.total
            tableData2.value = res.data.rows
        } catch (err) {
            console.log('批量新增获取轮播点失败', err);

        }
    }

    //获取轮播图列表
    const getBannImgList = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                pageNum: pageNum.value,
                pageSize: pageSize.value,
                folderId: '',
                imgName: '',

            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/base/bannerImg/list', {

                enData

            })
            console.log('批量新增获取轮播图片列表', res);
            res.data.rows.forEach((item: any) => {
                item.endpoint = item.parentObj.parentObj.endpoint
                item.bucketName = item.parentObj.parentObj.bucketName
                item.folder = item.parentObj.folder

            })
            totalData.value = res.data.total
            tableData.value = res.data.rows
        } catch (err) {
            console.log('批量新增获取轮播图片列表失败', err);
        }
    }

    watch(() => props.appNo, () => {
        getBannImgList()
        getBannerPoint()
    })
    onMounted(() => {
        getBannImgList()
        getBannerPoint()
    })

    //关闭
    const handleClose = () => {
        dialogVisible.value = false
    }

    //保存
    const handleComfirm = async () => {

        if (props.editType === 'batchAdd') {
            try {


                const params = {
                    timestamp: Date.now(),
                    bannerIds: selectPoint.value,
                    bannerImgIds: selectImg.value,
                }
                const enData = desEncrypt(JSON.stringify(params))
                console.log('批量保存参数', params);
                const res = await service.post('/bannerImgConfig/batchSave', {
                    enData
                })
                console.log('批量保存', res);

                if (res.data.code === 200) {
                    ElMessage.success('保存成功')
                    handleClose()
                } else {
                    ElMessage.error(res.data.msg)
                }
            } catch (err) {
                console.log('保存失败', err);
            }
        } else {

            const onceBanner = ref<any>([props.bannerId])
            try {
                const params = {
                    timestamp: Date.now(),
                    bannerIds: onceBanner.value,
                    bannerImgIds: selectImg.value,
                }
                console.log('参数', params);
                const enData = desEncrypt(JSON.stringify(params))
                const res = await service.post('/bannerImgConfig/batchSave', {
                    enData
                })

                console.log('保存', res);
                if (res.data.code === 200) {
                    ElMessage.success('保存成功')
                    handleClose()
                } else {
                    ElMessage.error(res.data.msg)
                }
            } catch (err) {
                console.log('保存失败', err);
            }
        }

    }
</script>

<style lang="scss" scoped></style>