<template>
    <div class="view">
        <textTemplateEditor v-model:show-editor="showEditor" :textTemplateTypeList="textTemplateTypeList"
            :editInfo="editInfo" />
        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">

                <div class="right-actions">
                    <!-- <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
                        @changeView="changeView" /> -->
                </div>
            </div>

            <el-divider class="divider" />

            <div class="filter-container">
                <div class="filter-row">




                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.region" placeholder="国内外" class="filter-select">
                            <el-option v-for="item in regionList" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.templateType" placeholder="模板类型"
                            class="filter-select">
                            <el-option v-for="item in textTemplateTypeList" :key="item.value" :label="item.note"
                                :value="item.value" />
                        </el-select>
                    </div>


                    <div class="filter-item filter-actions">
                        <el-button type="primary" @click="getUserList">
                            <el-icon>
                                <Search />
                            </el-icon>
                            搜索
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
        <el-card class="stickTp_manage">
            <draggable tag="ul" v-model="appData" item-key="id" :animation="200" class="template-grid"
                ghost-class="ghost-class" chosen-class="chosen-class" drag-class="dragging-class"
                :group="{ name: 'items' }">
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
                            <img :src="`${host}${element.coverUrl}`" alt="" class="template-img" />
                        </div>
                        <p class="template-name">
                            <el-button type="primary" @click="editorTemplate(element)" size='samll'>
                                编辑
                            </el-button>

                        </p>
                    </li>
                </template>
            </draggable>
        </el-card>
        <div class="floating-actions" ref="actionBox" @mousedown="dragStart" @mouseup="dragEnd">

            <el-upload action="#" :show-file-list="false" :http-request="importTemplate" accept=".json">
                <customButton>
                    <el-icon>
                        <Plus />
                    </el-icon>
                    导入
                </customButton>
            </el-upload>

            <customButton @click="openPublicSpace">
                公共空间
            </customButton>
            <customButton @click="addFont">
                <el-icon>
                    <Plus />
                </el-icon>
                新增模板
            </customButton>
            <customButton @click="checkedAll">
                全部选中
            </customButton>
            <customButton @click="deleteChecked">
                <el-icon>
                    <Minus />
                </el-icon>
                删除所选
            </customButton>
            <customButton @click="saveAllChange">
                保存改动
            </customButton>

        </div>
    </div>
    <watermarkPublicArea :type="'texttemplate'" :templateType="searchParams.templateType"
        v-model:dialog-visible="showPublicSpace" :region="searchParams.region"
        :textTemplateTypeList="textTemplateTypeList" />
</template>

<script setup lang="ts">

    const host = ref(service.defaults.baseURL)
    const actionBox = ref<HTMLElement>()
    const isDraging = ref<boolean>(false)
    const dragOffset = ref<{ x: number, y: number }>({ x: 0, y: 0 })
    const elementSize = ref<{ width: number, height: number }>({ width: 0, height: 0 })
    const dragStart = (e: MouseEvent) => {
        isDraging.value = true
        if (actionBox.value) {
            const rect = actionBox.value.getBoundingClientRect()
            actionBox.value.style.right = 'auto'
            actionBox.value.style.bottom = 'auto'
            actionBox.value.style.left = rect.left + 'px'
            actionBox.value.style.top = rect.top + 'px'
        }


        elementSize.value.width = actionBox.value!.offsetWidth
        elementSize.value.height = actionBox.value!.offsetHeight
        dragOffset.value = {
            x: e.clientX - actionBox.value!.getBoundingClientRect().left,
            y: e.clientY - actionBox.value!.getBoundingClientRect().top
        }
        window.addEventListener('mousemove', dragMove)
    }
    const dragEnd = () => {
        isDraging.value = false

        window.removeEventListener('mousemove', dragMove)
    }
    const dragMove = (e: MouseEvent) => {
        if (isDraging.value) {
            const newX = Math.max(0, Math.min(e.clientX - dragOffset.value.x, document.documentElement.clientWidth - elementSize.value.width))
            const newY = Math.max(0, Math.min(e.clientY - dragOffset.value.y, document.documentElement.clientHeight - elementSize.value.height))
            actionBox.value!.style.left = newX + 'px'
            actionBox.value!.style.top = newY + 'px'
        }
    }



    import tableAciton from '@/components/public/tableAciton.vue';
    import draggable from 'vuedraggable'
    import watermarkPublicArea from '@/components/watermark/watermarkPublicArea.vue'
    import userTable from '@/components/user/userTable.vue';
    import customButton from '@/components/button/customButton.vue';
    import userList from '@/components/user/userList.vue';
    import textTemplateEditor from '@/components/textTemplate/textTemplateEditor.vue';
    import { onMounted, ref, watch, nextTick } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import type { UploadRequestOptions } from 'element-plus'
    import { storeToRefs } from 'pinia';
    import { desEncrypt } from '@/utils/des'
    import service from '@/axios'
    import { ElMessage } from 'element-plus'
    const counterStore = useCounterStore()
    const { showPagestion, regionList, showLoading, defaultAppNo } = storeToRefs(counterStore)
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)



    //导入
    const importTemplate = async (options: UploadRequestOptions) => {
        console.log('options', options);
        const { file } = options
        showLoading.value = true

        try {
            const form = new FormData()
            let url = '/textTemplate/importTextTemplate'
            form.append('templates', file)
            form.append('region', searchParams.value.region)
            form.append('appNo', defaultAppNo.value as string)
            form.append('textTemplateType', String(searchParams.value.templateType))

            const res = await service.post(url, form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log('导入模板');
            if (res.data.code === 200) {
                ElMessage.success('导入成功')
                getUserList()
            } else {
                ElMessage.error(res.data.msg)

            }
        } catch (err) {
            console.log('导入失败', err);
        } finally {
            showLoading.value = false
        }
    }

    //公共空间
    const showPublicSpace = ref<boolean>(false)
    const openPublicSpace = () => {
        console.log('打开公共空间')

        // TODO: 实现公共空间功能
        showPublicSpace.value = true
    }




    const saveAllChange = async () => {
        showLoading.value = true
        try {
            const params = {
                appNo: defaultAppNo.value,
                region: searchParams.value.region,
                templateType: searchParams.value.templateType,
                templateIds: appData.value.map((item: any) => item.id),
                isPublic: false,
                timestamp: Date.now()
            }
            console.log('params', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/textTemplate/saveItem', {
                enData
            })
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
                getUserList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('保存失败', err);
        } finally {
            showLoading.value = false
        }
    }


    //全部选中
    const checkedAll = () => {
        appData.value.forEach((item: any) => {
            if (!selectedList.value.includes(item.id)) {
                selectedList.value.push(item.id)
            }
        })
    }

    //删除所选
    const deleteChecked = () => {
        appData.value = appData.value.filter((item: any) => !selectedList.value.includes(item.id))
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





    //编辑
    const editInfo = ref<any>()
    const editorTemplate = async (item?: any) => {
        editInfo.value = item
        console.log('item', item)
        isBatch.value = false
        await nextTick()

        showEditor.value = true


    }


    //新增字体
    const showEditor = ref<boolean>(false)
    watch(() => showEditor.value, (newVal, oldVal) => {
        if (!newVal) {
            editInfo.value = ''
            getUserList()
        }
    })
    const addFont = async () => {
        isBatch.value = false
        await nextTick()
        showEditor.value = true
    }


    //批量新增
    const isBatch = ref<boolean>(false)
    const batchAddFont = async () => {
        isBatch.value = true
        await nextTick()
        showEditor.value = true
    }

    //搜索参数
    const textTemplateTypeList = ref<any>([])
    interface SearchParams {

        region: string
        templateType: string



    }
    const searchParams = ref<SearchParams>(
        {
            region: regionList.value[0].value,
            templateType: '',

        }
    )
    //重置搜索
    const resetSearch = () => {
        searchParams.value = {
            region: '',
            templateType: '',

        }
        getUserList()
    }

    // 生成用户数据
    const appData = ref<any>([

    ])
    interface filterParams {
        note: string
        isShow: boolean
        key: string
    }
    const filterParams = ref<filterParams[]>()
    watch(() => defaultAppNo.value, () => {
        getUserList()
    })

    const getTemplateType = async () => {
        showLoading.value = true
        try {
            const res = await service.get('/textTemplate/index')
            console.log('模板类型', res);
            textTemplateTypeList.value = res.data.data.textTemplateTypes
            searchParams.value.templateType = textTemplateTypeList.value[0].value
        } catch (err) {

        } finally {
            showLoading.value = false
        }
    }
    const getUserList = async () => {


        showLoading.value = true
        try {
            const params = {
                region: searchParams.value.region,
                textTemplateType: searchParams.value.templateType,
                appNo: defaultAppNo.value,
                isPublic: false,
                timestamp: Date.now()
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/textTemplate/list', {
                enData
            })
            console.log('字体模板列表', res);
            appData.value = res.data.rows
            appData.value.forEach((el: any) => {
                el.likeNum = el.labels[0].split(':')[1]
            })
        } catch (err) {
            console.log('获取失败', err);
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
    onMounted(async () => {
        await getTemplateType()
        getUserList();

        showPagestion.value = true
    })
</script>

<style scoped lang="scss">
    .view {

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

        .content-card {
            height: max-content;

            .pagesBox {
                margin-top: 30px;
            }
        }

        .stickTp_manage {

            height: 700px;
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
    }
</style>