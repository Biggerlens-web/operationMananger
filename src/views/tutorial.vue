<template>
    <div class="view">
        <tutorialTypeEditor v-model:show-editor="showEditorType" :categoryTypes="categoryTypes" :isEdit="isEdit"
            :searchParams="searchParams" />
        <tutorialEditor v-model:show-editor="showEditor" :categoryTypes="categoryTypes" :tutorialTypes="tutorialTypes"
            :deviceTypes="deviceTypes" :editInfo="editInfo" :levels="levels" />
        <!-- <tutorialTemplateEdit v-model:dialog-visible="showTemplateEdit" /> -->
        <batchEditEl v-model:dialog-batch="dialogBatch" :categoryTypes="categoryTypes" :selectedList="selectedList" />
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
                        <el-select filterable @change="getTypeInfo" v-model="searchParams.os" placeholder="系统"
                            class="filter-select">
                            <el-option v-for="item in OSlist" :key="item.value" :label="item.note"
                                :value="item.value" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select @change="getTypeInfo" filterable v-model="searchParams.region" placeholder="国内外"
                            class="filter-select">
                            <el-option v-for="item in regionList" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </div>
                    <div class="filter-item" v-show="searchParams.region !== 'domestic'">
                        <el-select @change="getTypeInfo" filterable v-model="searchParams.language" placeholder="语言"
                            class="filter-select">
                            <el-option v-for="item in international" :key="item.value" :label="item.language"
                                :value="item.value" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.tutorialType" placeholder="教程类型"
                            class="filter-select">
                            <el-option v-for="item in tutorialTypes" :key="item.value" :label="item.note"
                                :value="item.value" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.category" placeholder="教程" class="filter-select">
                            <el-option v-for="item in categoryTypes" :key="item.id" :label="item.categoryName"
                                :value="item.id" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.deviceType" placeholder="设备类型"
                            class="filter-select">
                            <el-option v-for="item in deviceTypes" :key="item.value" :label="item.note"
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
                            <p class="p_id">{{ element.labels[1] }}</p>
                            <p class="p_viewNum">点击数:{{ element.likeNum }}</p>
                            <p class="p_viewNum" v-if="element.viewNum">浏览数:{{ element.viewNum }}</p>
                        </div>

                        <div class="img-wrapper">
                            <img :src="element.coverImgUrl" alt="" class="template-img" />
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

        <!-- 浮动操作栏 -->
        <div class="floating-actions" ref="actionBox" @mousedown="dragStart" @mouseup="dragEnd">
            <customButton @click="addType">
                <el-icon>
                    <Plus />
                </el-icon>
                新增分类
            </customButton>
            <customButton @click="deleteType">
                <el-icon>
                    <Minus />
                </el-icon>
                删除分类
            </customButton>
            <customButton @click="addTutorial">
                <el-icon>
                    <Plus />
                </el-icon>
                新增教程
            </customButton>
            <customButton @click="selectAll">
                全部选中
            </customButton>
            <customButton @click="delSelected">
                <el-icon>
                    <Minus />
                </el-icon>
                删除所选
            </customButton>
            <customButton @click="batchEdit">
                <el-icon>
                    <Edit />
                </el-icon>
                批量编辑
            </customButton>
            <customButton @click="tutorialEdit">
                <el-icon>
                    <Edit />
                </el-icon>
                教程分类编辑
            </customButton>
            <customButton @click="saveChange">
                保存改动
            </customButton>
        </div>
    </div>
</template>

<script setup lang="ts">

    import draggable from 'vuedraggable'
    import { onMounted, ref, watch } from 'vue';
    import batchEditEl from '@/components/tutorial/batchEdit.vue'
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import tutorialTypeEditor from '@/components/tutorial/tutorialTypeEditor.vue';
    import tutorialEditor from '@/components/tutorial/tutorialEditor.vue';
    import tutorialTemplateEdit from '@/components/tutorial/tutorialTemplateEdit.vue';
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    import { ElMessage } from 'element-plus';
    import customButton from '@/components/button/customButton.vue';
    const counterStore = useCounterStore()
    const { showPagestion, regionList, OSlist, international, defaultAppNo, showLoading } = storeToRefs(counterStore)

    // 浮动操作栏拖动相关
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

    const initSearchParams = () => {
        searchParams.value.os = OSlist.value[0].value
        searchParams.value.region = regionList.value[0].value
        searchParams.value.language = searchParams.value.region === 'domestic' ? 'zh' : international.value[0].value

    }

    //分类
    const categoryTypes = ref<any>([]) //目录
    const deviceTypes = ref<any>([])//设备
    const tutorialTypes = ref<any>([])//教程
    const levels = ref<any>([])//等级
    const getTypeInfo = async () => {
        showLoading.value = true
        try {
            const params = {
                timestamp: Date.now(),
                appNo: defaultAppNo.value,
                os: searchParams.value.os,
                region: searchParams.value.region,
                language: searchParams.value.region === 'domestic' ? 'zh' : searchParams.value.language
            }
            const enData = desEncrypt(JSON.stringify(params))
            console.log('分类信息参数', params);
            const res = await service.get('/tutorial/index', {
                params: {
                    enData
                }
            })
            console.log('分类信息', res);
            categoryTypes.value = res.data.data.categoryTypes
            deviceTypes.value = res.data.data.deviceTypes
            tutorialTypes.value = res.data.data.tutorialTypes
            levels.value = res.data.data.levels

            searchParams.value.tutorialType = tutorialTypes.value[0].value
            searchParams.value.deviceType = deviceTypes.value[0].value
        } catch (err) {
            console.log('获取分类信息失败', err);
        } finally {
            showLoading.value = false
        }
    }


    //保存改动
    const saveChange = async () => {
        try {
            const params = {
                "appNo": defaultAppNo.value,
                "os": searchParams.value.os,
                "region": searchParams.value.region,
                "tutorialType": searchParams.value.tutorialType,
                "categoryType": searchParams.value.category,
                "deviceType": searchParams.value.deviceType,
                "tutorialIds": appData.value.map((item: any) => item.id),
                language: searchParams.value.region === 'domestic' ? 'zh' : searchParams.value.language,
                timestamp: Date.now()
            }
            console.log('保存改动参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/tutorial/saveItem', {
                enData
            })
            console.log('保存改动', res)
            if (res.data.code === 200) {
                ElMessage.success('保存成功');
                getUserList()
            } else {
                ElMessage.error(res.data?.msg);
            }
        } catch (err) {
            console.log('保存失败', err);
        } finally {
            showLoading.value = false
        }
    }



    // 新增分类
    const showEditorType = ref<boolean>(false)
    watch(() => showEditorType.value, (newV) => {
        if (!newV) {
            getTypeInfo()
            isEdit.value = false
        }
    })
    const addType = () => {
        showEditorType.value = true
    }
    // 新增教程    
    const showEditor = ref<boolean>(false)
    watch(() => showEditor.value, (newV) => {
        if (!newV) {
            getUserList()
            editInfo.value = ''
        }

    })
    const addTutorial = () => {
        showEditor.value = true
    }

    // 删除分类
    const deleteType = async () => {
        if (!searchParams.value.category) {
            ElMessage.warning('请先选择要删除的分类')
            return
        }
        // TODO: 实现删除分类功能
        showLoading.value = true
        try {
            const res = await service.post(`/category/delCategory/${searchParams.value.category}`)
            if (res.data.code === 200) {
                ElMessage.success('删除成功')
                searchParams.value.category = ''
                await getTypeInfo()
                getUserList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('删除失败', err);
        } finally {
            showLoading.value = false
        }

    }

    // 全部选中
    const selectAll = () => {
        selectedList.value = appData.value.map((item: any) => item.id)
    }

    // 删除所选
    const delSelected = () => {
        if (selectedList.value.length === 0) {
            ElMessage.warning('请先选择要删除的项目')
            return
        }
        appData.value = appData.value.filter((item: any) => !selectedList.value.includes(item.id))
        selectedList.value = []
    }

    // 批量编辑
    const dialogBatch = ref<boolean>(false)
    watch(() => dialogBatch.value, (newV) => {
        if (!newV) {
            selectedList.value = []
            getUserList()
        }
    })
    const batchEdit = () => {
        if (selectedList.value.length === 0) {
            ElMessage.warning('请先选择要编辑的教程')
            return
        }
        console.log('批量编辑', selectedList.value)
        // TODO: 实现批量编辑功能
        dialogBatch.value = true
    }

    // 教程编辑
    const isEdit = ref<boolean>(false)
    const tutorialEdit = () => {
        console.log('教程编辑')
        // TODO: 实现教程编辑功能
        isEdit.value = true
        showEditorType.value = true
    }
    //搜索参数
    interface SearchParams {
        os: string
        region: string
        tutorialType: string
        category: number | string
        deviceType: string
        language: string


    }
    const searchParams = ref<SearchParams>(
        {
            os: '',
            region: '',
            tutorialType: '',
            category: '',
            deviceType: '',
            language: "zh"
        }
    )
    //重置搜索
    const resetSearch = () => {
        searchParams.value = {
            os: OSlist.value[0].value,
            region: regionList.value[0].value,
            tutorialType: tutorialTypes.value[0].value,
            category: '',
            deviceType: deviceTypes.value[0].value,
            language: "zh"
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
        resetSearch()
    })
    const getUserList = async () => {
        try {
            const params: any = {
                timestamp: Date.now(),
                appNo: defaultAppNo.value,
                os: searchParams.value.os,
                region: searchParams.value.region,
                tutorialType: searchParams.value.tutorialType,
                category: searchParams.value.category,
                deviceType: searchParams.value.deviceType,
                language: searchParams.value.region !== 'domestic' ? searchParams.value.language : "zh",
            }
            if (!searchParams.value.category) {
                delete params.category
            }
            console.log('参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/tutorial/list', {
                enData
            })
            console.log('获取教程列表', res);
            appData.value = res.data.rows
            appData.value.forEach((element: any) => {
                element.likeNum = element.labels[0].split(':')[1]
                element.levels = element.level
                element.level = element.levels.value
                element.osObj = element.os
                element.os = element.osObj.value.toUpperCase()
            });
        } catch (err) {
            console.log('获取教程列表失败', err);
        } finally {
            showLoading.value = false
        }
    }


    onMounted(async () => {
        initSearchParams()
        await getTypeInfo()
        getUserList();
        showPagestion.value = true
    })


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
    // const showTemplateEdit = ref<boolean>(false)
    const editInfo = ref<any>()
    const editorTemplate = (item?: any) => {
        editInfo.value = item
        showEditor.value = true
        console.log('item', item)

    }
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
            /* position: relative;  不再需要，因为 back-icon 改为 fixed 定位 */
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
    }
</style>