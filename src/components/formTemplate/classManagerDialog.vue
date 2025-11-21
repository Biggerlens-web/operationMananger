<template>
    <el-dialog v-model="showClassManager" title="类目管理" width="500px">
        <div>
            <el-button type="primary" size="small" @click="handleAddBig">新增大分类</el-button>
        </div>
        <draggable tag="ul" :list="bigList" item-key="id" :animation="200" class="big_class" ghost-class="ghost-class"
            chosen-class="chosen-class" drag-class="drag-class" :handle="'.drag-handle'" @end="onBigDragEnd">
            <template #item="{ element, index }">
                <li :key="element.id" class="big-item">
                    <div class="big-item-header">
                        <el-icon class="drag-handle" title="拖动排序">
                            <Rank />
                        </el-icon>
                        <el-icon class="arrow-icon" :class="{ expanded: isExpanded(element.id) }"
                            @click.stop="toggleExpand(element)">
                            <ArrowRight />
                        </el-icon>
                        <el-input :ref="(el: any) => setBigInputRef(el, index)" style="width: 150px;" class="big-name"
                            v-model="element.name" placeholder="请输入类目名称" @blur="handleBlur('big', element)" />
                        <div class="btn_group">
                            <el-button type="primary" size="small"
                                @click.stop="handleAddSmall(element)">新增小分类</el-button>
                            <el-button type="danger" size="small"
                                @click.stop="handleDel(element.id, 'big')">删除类目</el-button>

                        </div>
                    </div>

                    <draggable v-if="isExpanded(element.id)" tag="ul" v-model="smallMap[element.id]" item-key="id"
                        :animation="200" class="small_list" ghost-class="ghost-class" chosen-class="chosen-class"
                        drag-class="drag-class" :handle="'.small-drag-handle'" @end="() => onSmallDragEnd(element.id)">
                        <template #item="{ element: small, index }">
                <li :key="small.id" class="small-item">
                    <el-icon class="small-drag-handle" title="拖动排序">
                        <Rank />
                    </el-icon>
                    <el-input :disabled="small.id === 0" :ref="(el: any) => setSmallInputRef(el, element.id, index)"
                        style="width: 150px;" class="small-name" v-model="small.name" placeholder="请输入小类目名称"
                        @blur="handleBlur('small', small, element.id)" />
                    <div class="btn_group" v-if="small.id !== 0">
                        <el-button type="danger" size="small"
                            @click.stop="handleDel(element.id, 'small', small.id, index)">删除类目</el-button>
                    </div>
                </li>
            </template>
        </draggable>
        </li>
</template>
</draggable>
</el-dialog>

<!-- 新建类目弹窗 -->
<el-dialog v-model="showAddDialog" title="新建类目" width="500px">
    <div class="add-cat-form">
        <div class="add-cat-header">
            <!-- 仅在选择中文或英文时允许翻译（中文 -> 英文） -->
            <el-link type="primary" @click="handleTranslateAll">{{ '翻译' }}</el-link>
        </div>
        <el-form :model="addForm" label-width="80px">
            <!-- 当选择中文或英文时，保留英文输入框：显示中文 + 英文 -->
            <template v-if="['zh', 'en'].includes(language)">
                <el-form-item label="中文">
                    <el-input v-model="addForm.zh" placeholder="请输入中文名称" clearable />
                </el-form-item>
                <el-form-item label="英文">
                    <el-input v-model="addForm.en" placeholder="请输入英文名称" clearable />
                </el-form-item>
            </template>

            <!-- 否则仅显示用户选择的语言输入框 -->
            <template v-else>
                <el-form-item label="中文">
                    <el-input v-model="addForm.zh" placeholder="请输入中文名称" clearable />
                </el-form-item>
                <el-form-item :label="langLabelMap[language] || '名称'">
                    <el-input v-model="addForm.en" :placeholder="`请输入${langLabelMap[language] || '名称'}`" clearable />
                </el-form-item>
            </template>
        </el-form>
    </div>
    <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmAddCategory">确定</el-button>
    </template>
</el-dialog>
</template>

<script lang="ts" setup>
    import { nextTick, ref, watch, reactive } from 'vue';
    import service from '@/axios'
    import { desEncrypt } from '@/utils/des'
    import { ArrowRight, Rank } from '@element-plus/icons-vue'
    import draggable from 'vuedraggable'
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import axios from 'axios';
    interface Props {
        bigTemplateList: any[]
        language?: string
    }
    const counterStore = useCounterStore()
    const { showLoading } = storeToRefs(counterStore)
    const props = withDefaults(defineProps<Props>(), {
        language: 'zh'
    })
    const showClassManager = defineModel('showClassManager', {
        default: false
    })




    // 展开状态与数据
    const expandedIds = ref<Array<number | string>>([])
    const isExpanded = (id: number | string) => expandedIds.value.includes(id)
    const smallMap = ref<Record<number, any[]>>({})
    const loadingSmall = ref<Record<number, boolean>>({})
    // 收集小分类输入框的 ref，用于新增后自动聚焦
    const smallInputRefs = ref<Record<number, any[]>>({})
    const setSmallInputRef = (el: any, bigId: number, idx: number) => {
        if (!smallInputRefs.value[bigId]) smallInputRefs.value[bigId] = []
        smallInputRefs.value[bigId][idx] = el
    }

    const fetchSmallClassification = async (bigId: number) => {
        try {
            loadingSmall.value[bigId] = true
            const params = {
                timestamp: Date.now(),
                id: bigId,
                language: props.language,
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.get('/formTemplate/getSmallClassificationData', {
                params: { enData }
            })
            if (res.data.code === 200) {
                smallMap.value[bigId] = res.data.rows || []
            } else {
                smallMap.value[bigId] = []
            }
        } catch (err) {
            console.log('获取小分类失败', err)
            smallMap.value[bigId] = []
        } finally {
            loadingSmall.value[bigId] = false
        }
    }

    const toggleExpand = async (itemOrId: any) => {
        const id: number | string = (typeof itemOrId === 'number' || typeof itemOrId === 'string') ? itemOrId : (itemOrId.id as number | string)
        if (isExpanded(id)) {
            expandedIds.value = expandedIds.value.filter(x => x !== id)
            return
        }
        expandedIds.value.push(id)
        if (typeof id === 'number' && !smallMap.value[id]) {
            await fetchSmallClassification(id)
        }
    }
    watch(() => showClassManager.value, (newVal) => {
        if (!newVal) {
            // 关闭弹窗时，重置数据
            expandedIds.value = []
        }
    })


    //新增小分类
    const handleAddSmall = async (item: any) => {
        // 打开新增弹窗（不再追加空项）
        addType.value = 'small'
        currentBigId.value = item.id
        showAddDialog.value = true
        // 确保已展开，方便新增后刷新能看到
        if (!isExpanded(item.id)) {
            await toggleExpand(item)
        }
        if (!smallMap.value[item.id]) {
            try { await fetchSmallClassification(item.id) } catch { /* ignore */ }
        }
    }

    // 大分类输入框 refs，用于新增后自动聚焦
    const bigInputRefs = ref<any[]>([])
    const setBigInputRef = (el: any, idx: number) => {
        bigInputRefs.value[idx] = el
    }

    // 新增大分类
    const handleAddBig = async () => {
        // 打开新增弹窗（不再新建空白项）
        addType.value = 'big'
        currentBigId.value = undefined
        showAddDialog.value = true
    }

    //文本翻译
    const translateText = async (text: string, targetLang: string = 'en') => {
        try {
            const params: any = {
                text: text,

            }
            const formData = new FormData()
            formData.append('text', params.text)
            formData.append('to', targetLang)
            const res = await axios.post('/api/api/interpret', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            console.log("🚀 ~ translateText ~ res:", res)
            if (res.data.code == 0) {
                return res.data.data.interpretStr
            } else {
                return text
            }
        } catch (err) {
            console.log('翻译失败', err)
            return text
        }
    }

    // 新增类目弹窗状态与数据
    const showAddDialog = ref(false)
    const addType = ref<'big' | 'small'>('big')
    const currentBigId = ref<number | undefined>(undefined)
    const addForm = reactive<{ zh: string, en: string, zhHant: string, ja: string, fr: string, es: string, ko: string }>(
        { zh: '', en: '', zhHant: '', ja: '', fr: '', es: '', ko: '' }
    )
    const resetAddForm = () => { addForm.zh = addForm.en = addForm.zhHant = addForm.ja = addForm.fr = addForm.es = addForm.ko = '' }

    // 点击“翻译”按钮：根据中文自动填充其它语言（示例：调用现有 translateText）
    const isTranslating = ref(false)
    const handleTranslateAll = async () => {
        // 仅在选择中文或英文时进行翻译：中文 -> 英文

        if (!addForm.zh) {
            ElMessage.warning('请先填写中文名称')
            return
        }
        if (isTranslating.value) return
        try {
            isTranslating.value = true
            const zhText = addForm.zh.trim()
            const enText = await translateText(zhText, getModelKeyByLang(props.language))
            addForm.en = enText
            ElMessage.success('翻译完成')
        } catch (e) {
            ElMessage.error('翻译失败，请稍后重试')
        } finally {
            isTranslating.value = false
        }
    }

    // 语言标签与键映射（用于弹窗输入与提交）
    const langLabelMap: Record<string, string> = { zh: '中文', en: '英文', 'zh-Hant': '繁体', ja: '日语', fr: '法语', es: '西班牙语', ko: '韩语' }
    const getModelKeyByLang = (lang: string) => {
        switch (lang) {
            case 'zh': return 'zh'
            case 'en': return 'en'
            case 'zh-Hant': return 'cht'
            case 'ja': return 'jp'
            case 'fr': return 'fra'
            case 'es': return 'spa'
            case 'ko': return 'kor'
            default: return 'zh'
        }
    }

    // 提交新增类目
    const confirmAddCategory = async () => {
        try {
            // 需要提交的语言集合：选择中文或英文时，提交中文与英文；否则仅提交当前选择语言

            const params: any = {
                timestamp: Date.now(),
                language: props.language,
                name: addForm.zh,
                nameEn: addForm.en,

            }
            console.log('params', params);
            let url = ''
            if (addType.value === 'big') {
                url = '/formClassify/saveBigClassification'
            } else {
                url = '/formClassify/saveSmallClassification'
                params.bigClassifyId = currentBigId.value
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post(url, { enData })
            if (res.data.code !== 200) {
                ElMessage.error(res.data.msg)
                return
            }

            ElMessage.success('新增类目成功')
            showAddDialog.value = false
            resetAddForm()
            // 刷新列表
            await refreshBigClasses()
            if (addType.value === 'small' && currentBigId.value) {
                await fetchSmallClassification(currentBigId.value)
            }
        } catch (err) {
            console.log('新增类目失败', err)
        }
    }

    // 重新拉取大分类列表（参考视图中的实现）
    const refreshBigClasses = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                language: props.language,
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.get('/formTemplate/getLargeClassificationData', {
                params: { enData }
            })
            if (res.data.code === 200) {
                bigList.value = res.data.rows || []
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('获取大分类失败', err)
        }
    }


    //保存类名
    const handleBlur = async (type: string, item: any, bigId?: number) => {
        try {
            const nameEn = await translateText(item.name)

            const params: any = {
                timestamp: Date.now(),
                id: item.id,
                nameEn: nameEn,
                language: props.language,
                name: item.name,


            }
            if (bigId) {
                params.bigClassifyId = bigId

            }
            console.log("🚀 ~ handleBlur ~ params:", params)
            const enData = desEncrypt(JSON.stringify(params))
            let url: string = ''
            if (type === 'big') {
                url = '/formClassify/saveBigClassification'
            } else {
                url = '/formClassify/saveSmallClassification'
            }
            const res = await service.post(url, {
                enData
            })

            console.log('保存类名', res);
            if (res.data.code == 200) {
                ElMessage.success(res.data.msg)
            } else {
                ElMessage.error(res.data.msg)
            }
            if (type === 'big') {
                await refreshBigClasses()
            } else if (bigId) {
                await fetchSmallClassification(bigId)
            }

        } catch (err) {
            console.log('保存失败');
        }
    }



    //检测类目下模板
    const checkTemplateExist = async (id: number, type: number | string) => {
        try {
            const params: any = {
                timestamp: Date.now(),

            }
            if (type === 'big') {
                params.bigClassifyId = id
            } else {
                params.smallClassifyId = id
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/formTemplate/checkTemplateExist', {
                enData
            })
            console.log('检测模板', res);
            if (res.data.code === 200) {
                return res.data.data.exist
            } else {
                ElMessage.error(res.data.msg)
                return true
            }
        } catch (err) {
            console.log('检查模板存在失败', err)
            return true
        }
    }
    //删除类目
    const handleDel = async (bigId: number, type: string, smallId?: number | string, smallIndex?: number) => {



        console.log('删除类目', bigId, type)
        try {
            const exist = await checkTemplateExist(bigId, type)
            if (exist) {

                ElMessageBox.confirm('该类目下存在模板，是否继续删除？', '删除确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(async () => {
                    // 用户点击了确定，执行删除操作
                    let url: string = ''
                    if (type === 'big') {
                        // 删除大分类
                        url = `/formClassify/deleteBigClassification/${bigId}`
                    } else {
                        // 删除小分类
                        url = `/formClassify/deleteSmallClassification/${smallId}`
                    }
                    const res = await service.post(url)
                    if (res.data.code === 200) {
                        ElMessage.success(res.data.msg)
                        if (type === 'big') {
                            // 本地移除并同步展开状态
                            bigList.value = bigList.value.filter(x => x.id !== bigId)
                            delete smallMap.value[bigId]
                            expandedIds.value = expandedIds.value.filter(id => id !== bigId)
                            await refreshBigClasses()
                        } else {
                            // 更新当前展开列表中的小分类
                            const list = smallMap.value[bigId] || []
                            smallMap.value[bigId] = list.filter(x => x.id !== smallId)
                        }
                    } else {
                        ElMessage.error(res.data.msg)
                    }
                })

            } else {
                let url: string = ''
                if (type === 'big') {
                    // 删除大分类
                    url = `/formClassify/deleteBigClassification/${bigId}`
                } else {
                    // 删除小分类
                    url = `/formClassify/deleteSmallClassification/${smallId}`
                }
                const res = await service.post(url)
                if (res.data.code === 200) {
                    ElMessage.success(res.data.msg)
                    if (type === 'big') {
                        bigList.value = bigList.value.filter(x => x.id !== bigId)
                        delete smallMap.value[bigId]
                        expandedIds.value = expandedIds.value.filter(id => id !== bigId)
                        await refreshBigClasses()
                    } else {
                        // 更新当前展开列表中的小分类
                        const list = smallMap.value[bigId] || []
                        smallMap.value[bigId] = list.filter(x => x.id !== smallId)
                    }
                } else {
                    ElMessage.error(res.data.msg)
                }
            }



        } catch (err) {
            console.log('删除失败', err);
        } finally {
            showLoading.value = false
        }
    }

    // 大分类可拖拽列表（基于 props 的副本）
    const bigList = ref<any[]>([])
    watch(() => props.bigTemplateList, (newV) => {
        bigList.value = Array.isArray(newV) ? [...newV] : []
    }, { immediate: true })




    // 拖拽结束处理
    const bigSort = async (sortList: any[]) => {
        try {
            const params: any = {
                timestamp: Date.now(),
                sortList: sortList,
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/formClassify/sortBigClassification', {
                enData
            })
            console.log('大分类排序', res);
            if (res.data.code === 200) {
                ElMessage.success(res.data.msg)
                await refreshBigClasses()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('大分类排序失败', err);
        }
    }
    const onBigDragEnd = () => {
        console.log('大分类拖拽完成', bigList.value)

        // TODO: 调用保存排序接口
        const sortList = bigList.value.map((x, index) => ({
            [x.id]: index,

        }))
        bigSort(sortList)
    }


    const smallSort = async (sortList: any[], bigId: number) => {
        try {
            const params: any = {
                timestamp: Date.now(),
                sortList: sortList,
                bigClassifyId: bigId,
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/formClassify/sortSmallClassification', {
                enData
            })
            console.log('小分类排序', res);
            if (res.data.code === 200) {
                ElMessage.success(res.data.msg)
                // await refreshBigClasses()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('小分类排序失败', err);
        }
    }
    const onSmallDragEnd = (bigId: number) => {
        console.log('小分类拖拽完成', bigId, smallMap.value[bigId] || [])
        // TODO: 调用保存排序接口（传递 bigId 与对应小分类排序）
        const sortList = smallMap.value[bigId].map((x, index) => ({
            [x.id]: index,
        }))
        smallSort(sortList, bigId)
    }
</script>

<style lang="scss" scoped>
    .big_class {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .big-item {
        padding: 8px 0;
    }

    .big-item-header {
        display: flex;
        align-items: center;
        cursor: pointer;
        user-select: none;
        gap: 8px;
    }

    .arrow-icon {
        transition: transform 0.2s ease;
    }

    .arrow-icon.expanded {
        transform: rotate(90deg);
    }

    .big-name {
        font-size: 16px;
        color: var(--el-text-color-primary);
    }

    .small_list {
        list-style: none;
        padding-left: 22px;
        margin: 6px 0 0;
    }

    .small-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 0;
        font-size: 13px;
        color: var(--el-text-color-regular);
    }

    .small-item.loading {
        color: var(--el-color-warning);
    }

    .small-item.empty {
        color: var(--el-text-color-placeholder);
    }

    /* 拖拽相关样式 */
    .ghost-class {
        background-color: #f8f8f8;
        border: 1px dashed #ccc;
        opacity: 0.6;
    }

    .chosen-class {
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
    }

    .drag-class {
        opacity: 0.9;
    }

    .drag-handle,
    .small-drag-handle {
        cursor: grab;
        margin-right: 8px;
    }

    .btn_group {
        margin-left: auto;
    }
</style>