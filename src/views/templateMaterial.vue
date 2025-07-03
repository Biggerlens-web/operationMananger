<template>
    <templateView v-model:dialog-visible="showTemplateView" />
    <stickerTemplateEditor :editData="editItem" v-model:dialogEditor="dialogEditor" :isAddChild="isAddChild" />
    <editorActionBox class="floating-action-box" @actionClick="handleAction" :hasUnsavedChanges="hasUnsavedChanges" />
    <addClothTemplate v-model:dialogAdd="dialogAddCloth" @update="getMaterialList" />
    <batchEditeTemplate :chosedItem="selectedList" v-model:dialog-batch-edite="dialogBatchEdite"
        @update="getMaterialList" />
    <batchTag v-model:dialogShow="dialogBatchTag" :chosedItem="selectedList" />
    <publicArea v-model:dialog-visible="showPublicArea" />
    <sizeEdit v-model:dialogVisible="dialogSizeEdit" @addChildTemplate="addChildTemplate"
        @editChildTemplate="editChildTemplate" :isAddChild="isAddChild" />
    <forceTemplate v-model:dialogVisible="dialogForceTemplate" :parentTemplateId="parentTemplateId" />
    <el-card class="stickTp_manage">
        <draggable tag="ul" v-model="list" item-key="id" :animation="200" class="template-grid"
            ghost-class="ghost-class" chosen-class="chosen-class" drag-class="dragging-class" :group="{ name: 'items' }"
            @start="onDragStart" @end="onDragEnd">
            <template #item="{ element, index }">
                <li :key="element.id" class="template-item">
                    <!-- 右上角复选框 -->
                    <div class="checkbox-wrapper" @click.stop>
                        <input type="checkbox" :id="`checkbox-${element.id}`" :checked="isSelected(element.id)"
                            @change="handleCheckBoxChange($event, element.id)" class="custom-checkbox" />
                        <label :for="`checkbox-${element.id}`" class="checkbox-label"></label>
                    </div>

                    <div class="template_data" @click.stop>
                        <p class="p_id">ID:{{ element.id }}</p>
                        <p class="p_viewNum">点击数:{{ element.likeNum }}</p>
                        <p class="p_viewNum" v-if="element.viewNum">浏览数:{{ element.viewNum }}</p>
                    </div>

                    <div class="img-wrapper">
                        <img :src="element.smallUrl || element.bigUrl || element.coverUrl" alt=""
                            class="template-img" />
                    </div>
                    <p class="template-name">
                        <el-button type="primary" @click="editorTemplate(element)" size='samll'>
                            编辑
                        </el-button>
                        <el-button size='samll' v-if="route.query.type === 'template'" type="primary"
                            @click="showSizeEdit(element)">
                            其他尺寸
                        </el-button>
                        <el-button size='samll' v-if="route.query.type === 'template'" type="primary"
                            @click="showForceTemplate(element)">
                            模板前景
                        </el-button>
                    </p>
                </li>
            </template>
        </draggable>
    </el-card>
</template>

<script lang="ts" setup>
    import templateView from '@/components/pptTemplate/templateView.vue'
    import publicArea from '@/components/templates/publicArea.vue'
    import forceTemplate from '@/components/templates/forceTemplate.vue'
    import sizeEdit from '@/components/templates/sizeEdit.vue'
    import stickerTemplateEditor from '@/components/clothingMaterials/stickerTemplateEditor.vue'
    import editorActionBox from '@/components/clothingMaterials/editorActionBox.vue'
    import batchTag from '@/components/clothingMaterials/batchTag.vue'
    import addClothTemplate from '@/components/clothingMaterials/addClothTemplate.vue'
    import batchEditeTemplate from '@/components/clothingMaterials/batchEditeTemplate.vue'
    import { ref, onMounted, watch, onBeforeUnmount, toRaw } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import draggable from 'vuedraggable'
    import { ElMessage } from 'element-plus'
    import { desEncrypt } from '@/utils/des'
    import service from '@/axios'
    import { useCounterStore } from '@/stores/counter'
    import { storeToRefs } from 'pinia'
    const stores = useCounterStore()
    const { operationClass, showLoading } = storeToRefs(stores)
    const route = useRoute()

    //其他尺寸
    const dialogSizeEdit = ref<boolean>(false)
    watch(() => dialogSizeEdit.value, (newV) => {
        if (!newV) {
            isAddChild.value = ''
        }

    })
    const showSizeEdit = (item: any) => {
        console.log('item', item);
        editItem.value = ''
        isAddChild.value = item.id
        dialogSizeEdit.value = true
    }
    const isAddChild = ref<any>('')
    const addChildTemplate = () => {

        dialogEditor.value = true
    }
    //编辑子模板
    const editChildTemplate = (item: any) => {
        editItem.value = item
        dialogEditor.value = true
    }



    //导出明细
    const exportExcel = async () => {
        try {
            const params: any = {
                timestamp: Date.now()
            }
            let url: string = ''
            const { type } = route.query
            switch (type) {
                case 'sitcker':
                    url = '/stickerDetail/exportExcel'
                    params.stickerId = parseInt(route.query.id as string)
                    break
                case 'background':
                    url = '/backgroundDetail/exportExcel'
                    params.backId = parseInt(route.query.id as string)
                    break
                case 'clothing':
                    url = '/clothingMaterialsDetail/exportExcel'
                    params.clothingMaterialsId = parseInt(route.query.id as string)
                    break

                case 'template':
                    url = '/templateUpDetail/exportExcel'
                    params.templateUpId = parseInt(route.query.id as string)
                    break
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.get(url, {
                params: {
                    enData
                },
                responseType: 'blob'
            })
            const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = '明细.xlsx'
            link.click()
            URL.revokeObjectURL(link.href)
        } catch (err) {
            console.log('导出失败', err);
        } finally {
            showLoading.value = false
        }
    }


    //获取素材列表

    const getMaterialList = async () => {
        try {
            const params: any = {
                timestamp: Date.now(),
                // clothingMaterialsId: route.query.id,
            }
            const { type } = route.query
            let url: string = ''
            if (type === 'clothing') {
                params.clothingMaterialsId = parseInt(route.query.id as string)
                url = '/clothingMaterialsDetail/list'
            } else if (type === 'sitcker') {
                params.stickerId = parseInt(route.query.id as string)
                url = '/stickerDetail/list'
            } else if (type === 'background') {
                params.backId = parseInt(route.query.id as string)
                url = '/backgroundDetail/list'
            } else if (type === 'template') {
                params.templateUpId = parseInt(route.query.id as string)
                url = '/templateUpDetail/list'
            }
            console.log('参数', params)
            const enData = desEncrypt(JSON.stringify(params))
            let res: any = {}
            showLoading.value = true
            if (type === 'clothing') {
                res = await service.get(url, {
                    params: {
                        enData,
                    },
                })
            } else {
                res = await service.post(url, {

                    enData,

                })
            }

            console.log('获取素材列表', res)
            list.value = res.data.data.list
            if (type === 'clothing') {

            } else {

                list.value.forEach((item: any) => {
                    item.likeNum = item.labels[1].split(':')[1]

                })
            }




            list.value.sort((a, b) => a.detailIndex - b.detailIndex)
        } catch (err) {
            console.log('获取素材列表失败', err)
        } finally {
            showLoading.value = false
        }


    }
    onMounted(() => {
        getMaterialList()
    })

    const router = useRouter()
    const goBack = () => {
        router.back()
    }

    interface listItem {
        id: number //id
        viewNum: number | null //点击数
        style: number //样式
        bigName: string //
        bigUrl: string //大图
        clothingMaterialsId: number //父类id
        detailIndex: number //排位
        keyword: string //关键词
        likeNum: number //点赞数
        pay: number //是否付费
        smallName: string //小图名称
        smallUrl: string //小图
    }
    const list = ref<listItem[]>([])
    const hasUnsavedChanges = ref(false)





    //模板前景
    const dialogForceTemplate = ref<boolean>(false)
    const parentTemplateId = ref<any>()
    const showForceTemplate = (item: any) => {
        parentTemplateId.value = item.id
        dialogForceTemplate.value = true
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

    const onDragEnd = () => {
        console.log('结束拖动')
        hasUnsavedChanges.value = true
    }
    const onDragStart = () => {
        console.log('开始拖动')
    }
    //编辑模板
    const editItem = ref<any>()
    const dialogEditor = ref<boolean>(false)
    watch(
        () => dialogEditor.value,
        (newV) => {
            if (!newV) {
                getMaterialList()

            }
        },
    )
    const editorTemplate = (item?: any) => {
        console.log('item', item)
        editItem.value = item
        dialogEditor.value = true
        hasUnsavedChanges.value = true
    }
    const deleteTemplate = (id: number) => {
        const deleteIndex = list.value.findIndex((item: any) => item.id === id)
        if (deleteIndex === -1) {
            ElMessage.error('删除失败')
            return
        }
        list.value.splice(deleteIndex, 1)
        hasUnsavedChanges.value = true
    }

    //显示模板图
    const showTemplateView = ref<boolean>(false)
    const templateViewDialog = (id: string | number) => {
        showTemplateView.value = true
    }

    //全选
    const checkAll = ref<boolean>(false)
    const handleCheckAll = () => {
        checkAll.value = !checkAll.value
        if (checkAll.value) {
            selectedList.value = list.value.map((item: any) => item.id)
        } else {
            selectedList.value = []
        }
    }

    //批量新增服装素材
    const dialogAddCloth = ref<boolean>(false)
    const showbatchAdd = () => {
        dialogAddCloth.value = true
    }

    //批量编辑
    const dialogBatchEdite = ref<boolean>(false)

    const showBatchEdite = () => {
        dialogBatchEdite.value = true
    }


    //批量删除
    const batchDelete = () => {
        if (selectedList.value.length === 0) {
            ElMessage.warning('请选择要删除的素材')
            return
        }
        list.value = list.value.filter((item: any) => !selectedList.value.includes(item.id))
        selectedList.value = []
        checkAll.value = false
        hasUnsavedChanges.value = true

    }

    //保存改动
    const saveChanges = async () => {
        try {

            const saveIds = list.value.map(item => item.id)
            const params: any = {


                detailIds: saveIds,
                timestamp: Date.now()


            }
            const { type } = route.query
            let url: string = ''
            switch (type) {
                case 'clothing':
                    params.clothingMaterialsId = parseInt(route.query.id as string)
                    switch (operationClass.value) {
                        case 1:
                            url = '/clothingMaterialsDetail/saveOperationItem'
                            break;
                        case 0:
                            url = '/clothingMaterialsDetail/saveItem'
                            break;
                    }
                    break;
                case 'background':
                    params.backId = parseInt(route.query.id as string)
                    switch (operationClass.value) {
                        case 1:
                            url = '/backgroundDetail/saveOperationItem'
                            break;
                        case 0:
                            url = '/backgroundDetail/saveItem'
                            break;
                    }
                    break;
                case 'sitcker':
                    params.stickerId = parseInt(route.query.id as string)
                    switch (operationClass.value) {
                        case 1:
                            url = '/stickerDetail/saveOperationItem'
                            break;
                        case 0:
                            url = '/stickerDetail/saveItem'
                            break;
                    }
                    break;

                case 'template':
                    params.templateUpId = parseInt(route.query.id as string)
                    switch (operationClass.value) {
                        case 1:
                            url = '/templateUpDetail/saveOperationItem'
                            break;
                        case 0:
                            url = '/templateUpDetail/saveItem'
                            break;
                    }
                    break;
            }
            console.log('参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post(url, {

                enData

            })
            if (res.data.code === 200) {
                ElMessage.success('改动已保存')
                getMaterialList()
                hasUnsavedChanges.value = false
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            ElMessage.error('保存失败')
            console.log('保存失败err', err)
        } finally {
            showLoading.value = false
        }
    }

    //批量编辑标签
    const dialogBatchTag = ref<boolean>(false)
    const showDialogBatchTag = () => {
        dialogBatchTag.value = true
    }



    //公共空间
    const showPublicArea = ref<boolean>(false)
    const showPublicAreaDialog = () => {
        showPublicArea.value = true
    }


    //推送
    const push = async (type: boolean) => {
        try {
            if (selectedList.value.length === 0) {
                ElMessage.warning('请选择要推送的素材')
                return
            }
            const params = {
                timestamp: Date.now(),
                ids: selectedList.value,
                result: type
            }
            console.log('参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/templateUpDetail/batchResultSave', {
                enData
            })
            if (res.data.code === 200) {
                ElMessage.success('操作成功')
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('失败', err);
        } finally {
            showLoading.value = false
        }

    }


    //全局操作
    const handleAction = (type: string) => {
        switch (type) {
            case 'add':
                console.log('批量新增')
                showbatchAdd()
                hasUnsavedChanges.value = true
                break
            case 'edit':
                console.log('批量编辑')
                if (selectedList.value.length === 0) {
                    ElMessage.warning('请选择要编辑的素材')
                    return
                }
                showBatchEdite()
                hasUnsavedChanges.value = true
                break
            case 'tag':
                console.log('批量标签')
                if (selectedList.value.length === 0) {
                    ElMessage.warning('请选择要编辑的素材')
                    return
                }
                showDialogBatchTag()
                break
            case 'upload':
                console.log('新增素材')
                editorTemplate()
                hasUnsavedChanges.value = true
                break
            case 'checkAll':
                console.log('全选')
                handleCheckAll()
                break
            case 'delete':
                console.log('批量删除')
                batchDelete()
                hasUnsavedChanges.value = true
                break
            case 'save':
                console.log('保存改动')
                saveChanges()
                break

            case 'back':
                console.log('返回')
                goBack()
                break
            case 'export':
                console.log('导出')
                exportExcel()
                break

            case 'push':
                console.log('推送');
                push(true)
                break
            case 'noPush':
                console.log('不推送');
                push(false)
                break

            case 'public':
                console.log('公共空间');
                showPublicAreaDialog()
                break
            default:
                break
        }
    }

    onBeforeUnmount(() => {
        operationClass.value = 0
    })

</script>

<style lang="scss" scoped>
    .floating-action-box {
        position: fixed;
        bottom: -14px;
        right: 20px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-radius: 8px;
        background-color: #fff;
    }

    .select_box {
        box-sizing: border-box;
        width: 100%;
        margin-bottom: 10px;
        /* el-card 默认有 padding，如果不需要可以覆盖 */
        /* padding: 0; */
    }

    /* 目标是 el-card 的直接子元素，通常是 .el-card__body */
    .select_box> :deep(.el-card__body) {
        display: flex;
        align-items: center;
        /* 垂直居中对齐 */
        padding: 10px;
        /* 根据需要调整内边距 */
    }

    .select_box> :deep(.el-card__body)>.el-select {
        flex-grow: 1;
        /* 允许 el-select 占据可用空间 */
        margin-right: 10px;
        /* el-select 之间的右边距 */
    }

    .select_box> :deep(.el-card__body)>.el-select:last-child {
        margin-right: 0;
        /* 最后一个 el-select 不需要右边距 */
    }

    .stickTp_manage {
        /* position: relative;  不再需要，因为 back-icon 改为 fixed 定位 */
        height: 820px;
        overflow-y: scroll;

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
            overflow: hidden;
            /* 确保内容不会溢出 */
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

            overflow: hidden;
            border-radius: 4px;
            background-color: #f5f5f5;
        }

        .template-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
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
