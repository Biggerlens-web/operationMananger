<template>
    <div>
        <el-image-viewer v-if="showPreview" :url-list="previewSrcList" show-progress
            :initial-index="currentPreviewIndex" @close="showPreview = false" />
        <el-card class="filter-card">
            <div class="filter-container">
                <div class="filter-row">
                    <div class="filter-item">
                        <el-input v-model="searchParams.fileName" placeholder="模板名称" clearable class="filter-input" />
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.bigTemplate" placeholder="大分类"
                            @change="getSmallClassificationData" class="filter-select" clearable>

                            <el-option v-for="item in bigTemplateList" :key="item.id
                                " :label="item.name" :value="item.id
                                    " />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.smallTemplate" placeholder="小分类" clearable
                            class="filter-select">
                            <el-option v-for="item in smallTemplateList" :key="item.name" :label="item.name"
                                :value="item.name" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.templateType" placeholder="模板"
                            class="filter-select">
                            <el-option v-for="item in templateTypelist" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.os" placeholder="系统" class="filter-select">
                            <el-option v-for="item in oslist" :key="item.os" :label="item.os" :value="item.os" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.language" placeholder="语言" class="filter-select"
                            @change="getAllData">

                            <el-option v-for="item in languageList" :key="item.value" :label="item.name"
                                :value="item.value" />
                        </el-select>
                    </div>

                    <div class="filter-item filter-actions">
                        <el-button type="primary" @click="searching">
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
        <el-card class="stickTp_manage" v-loading="showLoading">

            <draggable tag="ul" v-model="list" item-key="tid" :animation="200" class="template-grid"
                ghost-class="ghost-class" chosen-class="chosen-class" drag-class="dragging-class"
                :group="{ name: 'items' }" @start="onDragStart" @end="onDragEnd">
                <template #item="{ element, index }">
                    <li :key="element.tid" class="template-item">
                        <!-- 右上角复选框 -->
                        <!-- <div class="checkbox-wrapper" @click.stop>
                            <input type="checkbox" :id="`checkbox-${element.tid}`" :checked="isSelected(element.tid)"
                                @change="handleCheckBoxChange($event, element.tid)" class="custom-checkbox" />
                            <label :for="`checkbox-${element.tid}`" class="checkbox-label"></label>
                        </div> -->
                        <div class="template_data" @click.stop>
                            <p class="p_id">ID:{{ element.tid }}</p>
                            <p class="p_viewNum">模板名称:{{ element.fileName }}</p>
                            <p class="p_viewNum" v-if="element.viewNum">浏览数:{{ element.viewNum }}</p>
                        </div>

                        <div class="img-wrapper">

                            <el-image style="width: 100%; height: 100%"
                                :src="`${searchParams.language === 'zh' || searchParams.language === 'zh-Hant' ? 'https://wordmaker.oss.biggerlens.com/template/new' : 'https://wordmaker-en.oss.biggerlens.com/template/new'}/${encodeURIComponent(element.imagePath)}`"
                                :fit="'contain'" loading="lazy" />

                        </div>
                        <p class="template-name">
                            <el-button type="primary" @click="previewImg(element)" size='samll'>
                                预览
                            </el-button>
                            <el-button type="primary" @click="handleEdit(element)" size='samll'>
                                编辑
                            </el-button>
                            <el-button type="danger" @click="handleDelete(element)" size='samll'>
                                删除
                            </el-button>
                        </p>
                    </li>
                </template>
            </draggable>
        </el-card>
    </div>
    <editFormTemDialog v-model:is-edit-template="isEditTemplate" :language="searchParams.language"
        :bigTemplateList="bigTemplateList" :editInfo="editInfo" @update="getFormTemplateData" />
</template>

<script lang="ts" setup>
    import draggable from 'vuedraggable'
    import { computed, nextTick, onMounted, ref, watch } from 'vue'
    import { useCounterStore } from '@/stores/counter'
    import { storeToRefs } from 'pinia'
    import service from '@/axios'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { desEncrypt } from '@/utils/des'
    import editFormTemDialog from '@/components/formTemplate/editFormTemDialog.vue'
    const counterStore = useCounterStore()
    const { showLoading } = storeToRefs(counterStore)
    interface listItem {
        tid: number //tid
        viewNum: number | null //点击数
        style: number //样式
        bigName: string //
        bigUrl: string //大图
        clothingMaterialsId: number //父类id
        detailIndex: number //排位
        keyword: string //关键词
        likeNum: number //点赞数
        isPay: boolean //是否付费
        smallName: string //小图名称
        smallUrl: string //小图
    }
    const hasUnsavedChanges = ref(false)
    const list = ref<listItem[]>([])
    const onDragEnd = () => {
        console.log('结束拖动')
        hasUnsavedChanges.value = true
    }
    const onDragStart = () => {
        console.log('开始拖动')
    }


    // 计算所有图片的预览列表
    const previewSrcList = computed(() => {
        return list.value.map((item: any) =>
            `${searchParams.value.language === 'zh' || searchParams.value.language === 'zh-Hant' ? 'https://wordmaker.oss.biggerlens.com/template/new' : 'https://wordmaker-en.oss.biggerlens.com/template/new'}/${encodeURIComponent(item.imagePath)}`
        )
    })

    // 当前预览的图片索引
    const currentPreviewIndex = ref(0)

    const showPreview = ref(false)

    const previewImg = (item: any) => {
        // 找到当前点击图片在列表中的索引
        const index = list.value.findIndex((listItem: any) => listItem.tid === item.tid)
        if (index !== -1) {
            currentPreviewIndex.value = index
        }
        showPreview.value = true


    }




    //编辑模板
    const editInfo = ref<any>()
    const isEditTemplate = ref<boolean>(false)
    const handleEdit = (item: any) => {
        console.log('item', item);
        editInfo.value = item
        isEditTemplate.value = true
    }
    watch(() => isEditTemplate.value, (newVal) => {
        if (!newVal) {

            editInfo.value = ''

        }
    })


    //删除模板
    const handleDelete = (item: any) => {
        console.log('item', item);
        ElMessageBox.confirm('确定删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async () => {
            if (showLoading.value) return
            showLoading.value = true
            try {
                const res = await service.post(`/formTemplate/delFormTemplateData/${item.id}`)
                console.log('res', res);
                if (res.data.code === 200) {
                    ElMessage.success(res.data.msg)
                    showLoading.value = false
                    getFormTemplateData()
                } else {
                    ElMessage.error(res.data.msg)
                }
            } catch (err) {
                console.log("🚀 ~ handleDelete ~ err:", err)
            } finally {
                showLoading.value = false

            }
        })
    }

    //选中模板集合
    const selectedList = ref<any>([])
    const isSelected = (tid: number) => {
        return selectedList.value.includes(tid)
    }
    const handleCheckBoxChange = (e: any, tid: number) => {
        if (e.target.checked) {
            selectedList.value.push(tid)
        } else {
            selectedList.value = selectedList.value.filter((item: number) => item !== tid)
        }
    }

    const editItem = ref<any>()
    const dialogEditor = ref<boolean>(false)
    const editorTemplate = (item?: any) => {
        console.log('item', item)
        editItem.value = item
        dialogEditor.value = true
        hasUnsavedChanges.value = true
    }


    //搜索参数
    const searchParams = ref<any>(
        {
            fileName: '',
            bigTemplate: '',
            smallTemplate: '',
            templateType: 'all',
            os: 'iOS',
            language: 'zh'
        }
    )


    //搜索
    const searching = () => {
        getFormTemplateData()



    }

    //重置搜索
    const resetSearch = async () => {
        searchParams.value = {
            fileName: '',
            bigTemplate: bigTemplateList.value[0].id,

            smallTemplate: '',
            templateType: 'all',
            os: 'iOS',
            language: 'zh'

        }
        await getSmallClassificationData()
        getFormTemplateData()


    }

    const bigTemplateList = ref<any>([

    ])
    const smallTemplateList = ref<any>([

    ])
    const templateTypelist = ref<any>([
        {
            label: '全部',
            value: 'all'
        }, {
            label: '付费',
            value: true
        },
        {
            label: '免费',
            value: false
        }
    ])



    //获取基础数据
    const oslist = ref<any>([])
    const languageList = computed(() => {
        const list = oslist.value.find((item: any) => item.os === searchParams.value.os)
        return list?.language || []

    })
    const getBaseData = async () => {

        try {
            const res = await service.get('/formTemplate/getSystemAndLanguage')
            console.log("🚀 ~ getBaseData ~ res:", res)
            if (res.data.code === 200) {
                oslist.value = res.data.rows
                await nextTick()
                searchParams.value.language = 'zh'
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log("🚀 ~ getBaseData ~ err:", err)
        } finally {

        }
    }


    //获取大分类
    const getLargeClassificationData = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                language: searchParams.value.language,
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.get('/formTemplate/getLargeClassificationData', {
                params: {
                    enData

                }
            })
            console.log("🚀 ~ getLargeClassificationData ~ res:", res)
            if (res.data.code === 200) {
                bigTemplateList.value = res.data.rows
                searchParams.value.bigTemplate = res.data.rows[0].id
            } else {
                ElMessage.error(res.data.msg)
            }

        } catch (err) {
            console.log("🚀 ~ getLargeClassificationData ~ err:", err)

        }
    }


    //获取小分类
    const getSmallClassificationData = async () => {

        const id = searchParams.value.bigTemplate
        if (id === undefined || id === null || id === '') {
            return
        }

        try {
            const params = {
                timestamp: Date.now(),
                id: id,
                language: searchParams.value.language,
            }
            console.log("🚀 ~ getSmallClassificationData ~ params:", params)
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.get('/formTemplate/getSmallClassificationData', {
                params: {
                    enData
                }

            })
            console.log("🚀 ~ getSmallClassificationData ~ res:", res)
            if (res.data.code === 200) {
                smallTemplateList.value = res.data.rows
                if (res.data.rows.length > 0) {
                    searchParams.value.smallTemplate = res.data.rows[0].name
                } else {
                    searchParams.value.smallTemplate = ''
                }

            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log("🚀 ~ getSmallClassificationData ~ err:", err)
        }

    }



    const getFormTemplateData = async () => {
        if (showLoading.value) return
        showLoading.value = true
        try {
            list.value = []

            const params = {
                timestamp: Date.now(),
                fileName: searchParams.value.fileName,
                subId: searchParams.value.bigTemplate,
                language: searchParams.value.language,
                name: searchParams.value.smallTemplate,
                isVip: searchParams.value.templateType,
            }
            if (searchParams.value.templateType === 'all') {
                delete params.isVip
            }


            console.log("🚀 ~ getFormTemplateData ~ params:", params)

            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/formTemplate/getFormTemplateData', {

                enData

            })
            console.log("🚀 ~ getFormTemplateData ~ res:", res)

            if (res.data.code === 200) {
                list.value = res.data.rows
            } else {
                ElMessage.error(res.data.msg)
            }

        } catch (err) {
            console.log("🚀 ~ getFormTemplateData ~ err:", err)

        } finally {
            showLoading.value = false

        }
    }

    const getAllData = async () => {
        await getLargeClassificationData()
        await getSmallClassificationData()
        getFormTemplateData()
    }
    onMounted(async () => {
        await getBaseData()
        await getLargeClassificationData()
        await getSmallClassificationData()
        getFormTemplateData()
    })


</script>

<style lang="scss" scoped>


    .filter-card {
        width: 100%;
        margin-bottom: 20px;

        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;

            .left-actions {
                display: flex;
                align-items: center;
                column-gap: 12px;

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

    .stickTp_manage {
        /* position: relative;  不再需要，因为 back-icon 改为 fixed 定位 */
        height: 680px;
        overflow-y: scroll;

        .template-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            /* 每行4个项目 */
            gap: 20px;
            /* 项目之间的间距 */
            padding: 0;
            list-style: none;
            margin: 0;
        }

        .template-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 15px;
            border: 1px solid #eee;
            border-radius: 8px;
            transition: transform 0.2s ease;
            cursor: pointer;
            min-width: 0;
            /* 关键属性：允许网格项小于内容最小宽度 */
            overflow: visible;
            /* 修改为visible以允许预览弹窗正常显示 */
            position: relative;
            /* 为绝对定位的复选框提供定位上下文 */
        }

        .template-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        }

        /* 复选框样式 */
        .checkbox-wrapper {
            position: absolute;
            top: 8px;
            right: 8px;
            z-index: 10;
            cursor: pointer;
        }

        .custom-checkbox {
            display: none;
        }


        .checkbox-label {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid #ddd;
            border-radius: 4px;
            background-color: rgba(255, 255, 255, 0.9);
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            backdrop-filter: blur(2px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .checkbox-label:hover {
            border-color: #409eff;
            background-color: rgba(255, 255, 255, 0.95);
            transform: scale(1.05);
        }

        .custom-checkbox:checked+.checkbox-label {
            background-color: #409eff;
            border-color: #409eff;
        }

        .custom-checkbox:checked+.checkbox-label::after {
            content: '';
            position: absolute;
            left: 6px;
            top: 2px;
            width: 4px;
            height: 8px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
        }

        /* 模板信息样式 */
        .template_data {
            position: absolute;
            top: 8px;
            left: 8px;
            z-index: 9;
            background: linear-gradient(135deg, rgba(64, 158, 255, 0.9), rgba(64, 158, 255, 0.7));
            backdrop-filter: blur(8px);
            border-radius: 8px;
            padding: 6px 10px;
            box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
            cursor: default;
        }

        .template_data:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(64, 158, 255, 0.3);
            background: linear-gradient(135deg, rgba(64, 158, 255, 0.95), rgba(64, 158, 255, 0.8));
        }

        .p_id,
        .p_viewNum {
            margin: 0;
            font-size: 11px;
            color: white;
            font-weight: 500;
            line-height: 1.3;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .p_id {
            margin-bottom: 2px;
        }

        .p_viewNum {
            opacity: 0.9;
        }

        .img-wrapper {
            width: 100%;
            aspect-ratio: 1;
            border-radius: 4px;
            background-color: #f5f5f5;
            overflow: hidden;
            /* 保持overflow: hidden以确保图片不会超出容器边界 */
        }

        .template-img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            /* 确保图片填充整个容器且不变形 */
        }

        .template-name {
            margin: 10px 0 0;
            font-size: 14px;
            color: #333;
            display: flex;
            column-gap: 5px;
            width: 100%;
            /* 确保宽度占满父容器 */
            align-items: center;
            justify-content: center;
            /* 水平居中对齐 */
            flex-wrap: nowrap;
            /* 强制不换行 */

            .el-button {
                flex: 1;
                /* 按钮平均分配空间 */
                min-width: 0;
                /* 允许按钮收缩 */
                font-size: 12px;
                /* 减小字体以适应空间 */
                padding: 4px 8px;
                /* 减小内边距 */
            }

            .name {
                max-width: 200px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .tag {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 2px 6px;
                font-size: 12px;
                border-radius: 4px;
                font-weight: normal;
                white-space: nowrap;
                line-height: 1.2;
                transition: all 0.2s ease;

                &:hover {
                    transform: translateY(-1px);
                }
            }

            .tag-test {
                color: #8c6200;
                background-color: #fff8e6;
                border: 1px solid #ffe6a6;

                &:hover {
                    background-color: #fff3d9;
                }
            }

            .tag-prod {
                color: #135200;
                background-color: #f0ffe6;
                border: 1px solid #b7eb8f;

                &:hover {
                    background-color: #e4ffcc;
                }
            }
        }

        .ghost-class {
            background-color: #f8f8f8;
            border: 1px dashed #ccc;
            opacity: 0.6;
        }

        .chosen-class {
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }

        .drag-class {
            opacity: 0.8;
            transform: rotate(3deg);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
    }
</style>