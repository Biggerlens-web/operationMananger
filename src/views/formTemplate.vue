<template>
    <div class="form-template-page">
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
                                :value="item.id" />
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
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.sortViewMode" placeholder="排序" class="filter-select"
                            @change="getFormTemplateData">

                            <el-option v-for="item in sortTypeList" :key="item.value" :label="item.label"
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
                    <div class="filter-item filter-actions">

                        <el-button @click="switchViewMode">
                            <el-icon>
                                <Refresh />
                            </el-icon>
                            切换视图({{ searchParams.pushViewMode === 0 ? '未推送' : '已推送' }})
                        </el-button>

                    </div>
                </div>


            </div>


        </el-card>
        <el-card class="stickTp_manage" v-loading="showLoading">

            <draggable tag="ul" v-model="list" item-key="tid" :animation="200" class="template-grid"
                :class="searchParams.sortViewMode === 1 ? 'randomSort-grid' : ''" ghost-class="ghost-class"
                chosen-class="chosen-class" drag-class="dragging-class" :group="{ name: 'items' }"
                :disabled="isDisableList" @start="onDragStart" @end="onDragEnd">
                <template #item="{ element, index }">
                    <li :key="element.tid" class="template-item">
                        <!-- 右上角复选框 -->
                        <div class="checkbox-wrapper" @click.stop
                            v-show="searchParams.pushViewMode === 0 && isShowCheckbox">
                            <input type="checkbox" :id="`checkbox-${element.tid}`" :checked="isSelected(element.id)"
                                @change="handleCheckBoxChange($event, element.id)" class="custom-checkbox" />
                            <label :for="`checkbox-${element.tid}`" class="checkbox-label"></label>
                        </div>
                        <div class="template_data" @click.stop>
                            <p class="p_id">ID:{{ element.id }}</p>
                            <p class="p_viewNum">模板名称:{{ element.fileName }}</p>
                            <p class="p_viewNum" v-if="element.viewNum">浏览数:{{ element.viewNum }}</p>
                            <p class="p_pay">

                                <el-tag size="small" :type="element.isVip ? 'warning' : 'success'" effect="plain">
                                    {{ element.isVip ? 'VIP' : '免费' }}
                                </el-tag>
                                <el-tag size="small" v-show="element.isFreeTrial" :type="'success'" effect="plain">
                                    {{ '限免' }}
                                </el-tag>
                                <el-tag size="small" v-show="element.isRecommend" :type="'success'" effect="plain">
                                    {{ '推荐' }}
                                </el-tag>
                            </p>
                        </div>

                        <div class="img-wrapper">

                            <el-image style="width: 100%; height: 100%"
                                :src="`${searchParams.language === 'zh' || searchParams.language === 'zh-Hant' ? 'https://wordmaker.oss.biggerlens.com/template/new' : 'https://wordmaker-en.oss.biggerlens.com/template/new'}/${encodeURIComponent(element.imagePath)}`"
                                :fit="'contain'" loading="lazy" />

                        </div>
                        <p class="template-name" v-if="searchParams.pushViewMode === 0">
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
        <!-- 多选操作 -->
        <div class="multi-select-actions" v-show="isShowCheckbox">
            <el-button type="primary" @click="handleSelectAll">
                {{ isClickAll ? '取消全选' : '全选' }}
            </el-button>
            <el-button type="danger" @click="handleBatchDelete">
                删除
            </el-button>
            <el-button type="primary" @click="handleMove">
                移动
            </el-button>

        </div>
    </div>
    <editFormTemDialog v-model:is-edit-template="isEditTemplate" :language="searchParams.language"
        :bigTemplateList="bigTemplateList" :editInfo="editInfo" :isBatch="isBatch" @update="getFormTemplateData"
        @bathUpadte="handleBatchEdit" />
    <classManagerDialog v-model:show-class-manager="showClassManager" :bigTemplateList="bigTemplateList"
        :language="searchParams.language" />
    <moveTemplateDialog v-model:show-move-template-dialog="showMoveTemplateDialog" :bigTemplateList="bigTemplateList"
        :language="searchParams.language" :selectIds="selectedList" />



    <!-- 浮动操作栏 -->
    <div class="floating-actions" ref="actionBox" @mousedown="dragStart" @mouseup="dragEnd"
        v-show="!showLoading && searchParams.pushViewMode === 0">
        <el-button type="primary" @click="handleCategoryManage">
            类目管理
        </el-button>
        <el-button :type="isShowCheckbox ? 'success' : 'primary'" :plain="isShowCheckbox"
            :class="{ 'active-btn': isShowCheckbox }" @click="handleMultiSelect">
            多选操作
        </el-button>
        <el-button type="primary" @click="handleOpenBatchEdit">
            批量编辑
        </el-button>
        <el-button type="danger" @click="handleBatchDelete">
            批量删除
        </el-button>
        <el-button type="primary" @click="handleRandomSort">
            随机排序
        </el-button>

        <el-button type="primary" @click="handlePushUpdate">
            推送更新
        </el-button>

    </div>
</template>

<script lang="ts" setup>
    const actionBox = ref<HTMLElement>()
    const isDraging = ref<boolean>(false)
    const dragOffset = ref<{ x: number, y: number }>({ x: 0, y: 0 })
    const elementSize = ref<{ width: number, height: number }>({ width: 0, height: 0 })
    const dragStart = (e: MouseEvent) => {
        if (actionBox.value) {
            const rect = actionBox.value.getBoundingClientRect()
            // 缓存元素尺寸，避免重复计算
            elementSize.value.width = rect.width
            elementSize.value.height = rect.height

            dragOffset.value.x = e.clientX - rect.left
            dragOffset.value.y = e.clientY - rect.top
            isDraging.value = true
            actionBox.value.style.right = 'auto'
            actionBox.value.style.bottom = 'auto'
            actionBox.value.style.left = rect.left + 'px'
            actionBox.value.style.top = rect.top + 'px'
            window.addEventListener('mousemove', dragMove)
            // 防止文本选择
            document.body.style.userSelect = 'none'
        }
    }

    const dragMove = (e: MouseEvent) => {
        if (actionBox.value && isDraging.value) {
            const innerWidth = window.innerWidth
            const innerHeight = window.innerHeight
            const newX = Math.max(0, Math.min(e.clientX - dragOffset.value.x, innerWidth - elementSize.value.width))
            const newY = Math.max(0, Math.min(e.clientY - dragOffset.value.y, innerHeight - elementSize.value.height))
            actionBox.value.style.left = newX + 'px'
            actionBox.value.style.top = newY + 'px'
        }
    }




    const dragEnd = (e: MouseEvent) => {
        isDraging.value = false
        document.body.style.userSelect = ''
        window.removeEventListener('mousemove', dragMove)

    }
    import draggable from 'vuedraggable'
    import { computed, nextTick, onMounted, ref, watch } from 'vue'
    import { useCounterStore } from '@/stores/counter'
    import { storeToRefs } from 'pinia'
    import service from '@/axios'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { desEncrypt } from '@/utils/des'
    import editFormTemDialog from '@/components/formTemplate/editFormTemDialog.vue'
    import classManagerDialog from '@/components/formTemplate/classManagerDialog.vue'
    import moveTemplateDialog from '@/components/formTemplate/moveTemplateDialog.vue'
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

    const isDisableList = computed(() => {
        if (searchParams.value.pushViewMode) {
            return true
        } else {
            if (searchParams.value.sortViewMode) {
                return false
            } else {
                return true
            }
        }
    })
    const onDragEnd = async () => {
        console.log('结束拖动')
        hasUnsavedChanges.value = true

        const sortList = list.value.map((item: any, index: number) => ({
            [item.id]: index
        }))
        console.log("🚀 ~ onDragEnd ~ sortList:", sortList)


        try {
            const params: any = {
                timestamp: Date.now(),
                sortList: sortList,
            }
            if (searchParams.value.smallTemplate) {
                params.smallClassifyId = searchParams.value.smallTemplate
            } else {
                params.bigClassifyId = searchParams.value.bigTemplate
            }
            const enData = desEncrypt(JSON.stringify(params))
            console.log("🚀 ~ onDragEnd ~ params:", params)
            const res = await service.post('/formTemplate/sortFormTemplateData', {
                enData
            })
            console.log("🚀 ~ onDragEnd ~ res:", res)
            if (res.data.code === 200) {
                ElMessage.success(res.data.msg)
                getFormTemplateData()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log("🚀 ~ onDragEnd ~ err:", err)
        }
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


    //类目管理
    const showClassManager = ref<boolean>(false)
    watch(() => showClassManager.value, (newVal) => {
        if (!newVal) {
            getAllData()
        }
    })
    const handleCategoryManage = () => {
        console.log('类目管理');
        showClassManager.value = true
    }
    //多选操作
    const isShowCheckbox = ref<boolean>(false)
    const handleMultiSelect = () => {
        isShowCheckbox.value = !isShowCheckbox.value
        if (!isShowCheckbox.value) {
            selectedList.value = []
        }
        console.log('多选操作', selectedList.value);

    }
    //随机排序
    const handleRandomSort = async () => {
        try {
            console.log('随机排序', searchParams.value);
            if (showLoading.value) return
            showLoading.value = true
            const params: any = {
                timestamp: Date.now(),

            }
            if (searchParams.value.smallTemplate) {
                params.smallClassifyId = searchParams.value.smallTemplate

            } else {
                params.bigClassifyId = searchParams.value.bigTemplate
            }
            console.log('随机排序参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/formTemplate/randomSortFormTemplateData', {
                enData
            })
            console.log('随机排序成功', res);
            if (res.data.code == 200) {
                ElMessage.success(res.data.msg)
                searchParams.value.sortViewMode = 1
                showLoading.value = false
                getFormTemplateData()
            }

        } catch (err) {
            console.log('随机排序失败', err);
        } finally {
            showLoading.value = false
        }

    }
    //推送更新
    const handlePushUpdate = async () => {
        console.log('推送更新');

        try {
            if (showLoading.value) return
            showLoading.value = true

            const res = await service.post('/formTemplate/pushFormTemplateData')
            console.log('推送更新成功', res);
            if (res.data.code == 200) {
                ElMessage.success(res.data.msg)

            } else {
                ElMessage.error(res.data.msg)
            }

        } catch (err) {
            console.log('推送更新失败', err);
        } finally {
            showLoading.value = false
        }
    }


    //全选
    const isClickAll = ref<boolean>(false)
    const handleSelectAll = () => {
        isClickAll.value = !isClickAll.value
        if (isClickAll.value) {
            selectedList.value = list.value.map((item: any) => item.id)
        } else {
            selectedList.value = []
        }
        console.log('selectedList', selectedList.value);
    }


    const showMoveTemplateDialog = ref<boolean>(false)
    const handleMove = () => {
        showMoveTemplateDialog.value = true
        console.log('移动');
    }
    watch(() => showMoveTemplateDialog.value, (newVal) => {
        if (!newVal) {
            selectedList.value = []
            getFormTemplateData()
        }
    })

    //批量删除
    const handleBatchDelete = async () => {
        console.log('批量删除', selectedList.value);

        try {
            if (!selectedList.value.length) {
                ElMessage.error('请选择要删除的模板')
                return
            }
            if (showLoading.value) return
            showLoading.value = true
            const params: any = {
                timestamp: Date.now(),
                ids: [...selectedList.value]
            }
            console.log("🚀 ~ handleBatchDelete ~ params:", params)
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/formTemplate/batchDelFormTemplateData', {
                enData
            })
            console.log('批量删除', res);
            if (res.data.code === 200) {
                ElMessage.success(res.data.msg)
                showLoading.value = false
                getFormTemplateData()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('批量删除失败', err);
        } finally {
            showLoading.value = false
        }
    }

    //批量修改
    const isBatch = ref<boolean>(false)
    const handleOpenBatchEdit = () => {
        console.log('打开批量编辑弹窗');
        if (!selectedList.value.length) {
            ElMessage.error('请选择要修改的模板')
            return
        }
        isBatch.value = true
        isEditTemplate.value = true
    }

    const handleBatchEdit = async (typeObj: { subId: number, smallClassifyId: number }) => {
        console.log('批量修改', selectedList.value);
        try {
            if (!selectedList.value.length) {
                ElMessage.error('请选择要修改的模板')
                return
            }
            if (showLoading.value) return
            showLoading.value = true

            const params: any = {
                timestamp: Date.now(),
                templateIds: [...selectedList.value],
                subId: typeObj.subId,
                smallClassifyId: typeObj.smallClassifyId,
            }

            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/formTemplate/batchSave', {
                enData
            })
            console.log('批量修改成功', res);
            if (res.data.code === 200) {
                ElMessage.success(res.data.msg)
                showLoading.value = false
                selectedList.value = []
                isEditTemplate.value = false
                getFormTemplateData()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('批量修改失败', err);
        } finally {
            showLoading.value = false
        }

    }
    //切换视图
    const switchViewMode = () => {
        searchParams.value.pushViewMode = searchParams.value.pushViewMode === 0 ? 1 : 0
        // searchParams.value.sortViewMode = 0
        getFormTemplateData()
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
            isBatch.value = false
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
    const isSelected = (id: number) => {
        return selectedList.value.includes(id)
    }
    const handleCheckBoxChange = (e: any, id: number) => {
        if (e.target.checked) {
            selectedList.value.push(id)
        } else {
            selectedList.value = selectedList.value.filter((item: number) => item !== id)
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
            language: 'zh',
            sortViewMode: 0,
            pushViewMode: 0
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
            language: 'zh',
            sortViewMode: 0,
            pushViewMode: 0

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

    const sortTypeList = ref<{ label: string, value: number }[]>([
        {
            label: '按浏览量排序',
            value: 0
        },
        {
            label: '按自定义排序',
            value: 1
        }
    ])

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
                    searchParams.value.smallTemplate = res.data.rows[0].id
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
                smallClassifyId: searchParams.value.smallTemplate,
                isVip: searchParams.value.templateType,
                pushViewMode: searchParams.value.pushViewMode,
                sortViewMode: searchParams.value.sortViewMode,
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
    .form-template-page {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 100px); // 使页面容器有确定高度
        min-height: 0; // 允许子元素在 Flex 容器中正确计算剩余空间
        position: relative;
    }


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
                flex-wrap: wrap;

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

    // 优化“付费”显示样式
    .template_data {
        .p_pay {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin: 2px 0;
        }

        .pay-label {
            font-size: 12px;
            color: var(--el-text-color-placeholder);
        }
    }

    .stickTp_manage {
        /* position: relative;  不再需要，因为 back-icon 改为 fixed 定位 */
        flex: 1; // 占满剩余父元素空间
        min-height: 0; // 避免内容高度撑破，确保内部滚动生效
        overflow-y: auto; // 使用 auto 更符合自适应滚动

        .template-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            /* 每行4个项目 */
            gap: 20px;
            /* 项目之间的间距 */
            padding: 0;
            list-style: none;
            margin: 0;
        }

        .randomSort-grid {
            grid-template-columns: repeat(4, 1fr);
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

    .multi-select-actions {
        position: absolute;
        bottom: 0px;
        left: 0;

        z-index: 999;
        display: flex;
        gap: 12px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 8px;

    }

    /* 浮动操作栏样式 */
    .floating-actions {
        position: fixed;
        user-select: none;
        cursor: move;
        bottom: 7px;
        right: 20px;
        display: flex;
        gap: 12px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 8px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.2);
        z-index: 1000;

    }

    /* 激活状态的按钮样式 */
    .floating-actions .active-btn {
        box-shadow: 0 0 0 2px rgba(103, 194, 58, 0.35), 0 6px 18px rgba(103, 194, 58, 0.35);
        transform: translateY(-1px);
    }
</style>