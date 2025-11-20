<template>
    <div class="view">
        <!-- <pptTemplateEditor v-model:dialogEditor="dialogEditor" /> -->
        <el-image ref="imageRef" style="position: fixed;left: -9999px;top: -9999px;z-index: 20;" :src="previewUrl"
            show-progress :preview-src-list="previewUrlList" fit="cover" />
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



                    <!-- <div class="filter-item">
                        <el-select filterable v-model="searchParams.os" placeholder="系统" class="filter-select"
                            clearable>
                            <el-option v-for="item in OSlist" :key="item.value" :label="item.note"
                                :value="item.value" />
                        </el-select>
                    </div> -->
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.region" placeholder="国内外" class="filter-select"
                            @change="getMenuList">
                            <el-option v-for="item in regionList" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.sort" placeholder="排序" class="filter-select"
                            clearable>
                            <el-option v-for="item in sortList" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.category" placeholder="模版类目" class="filter-select"
                            clearable>
                            <el-option v-for="item in categoryList" :key="item.id" :label="item.name"
                                :value="item.id" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.isPay" placeholder="模板付费" class="filter-select"
                            clearable>
                            <el-option v-for="item in paysList" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-input placeholder="请输入模版名称" v-model="searchParams.templateName" class="filter-input"
                            clearable />
                    </div>


                    <div class="filter-item filter-actions">
                        <el-button type="primary" @click="getUserList(1)">
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
            <draggable tag="ul" v-model="appData" item-key="id" :animation="200" class="template-grid"
                ghost-class="ghost-class" chosen-class="chosen-class" drag-class="dragging-class"
                :group="{ name: 'items' }">
                <template #item="{ element, index }">
                    <li :key="element.id" class="template-item">
                        <!-- 右上角复选框 -->
                        <!-- <div class="checkbox-wrapper" @click.stop>
                            <input type="checkbox" :id="`checkbox-${element.id}`" :checked="isSelected(element.id)"
                                @change="handleCheckBoxChange($event, element.id)" class="custom-checkbox" />
                            <label :for="`checkbox-${element.id}`" class="checkbox-label"></label>
                        </div> -->

                        <div class="template_data" @click.stop>
                            <p class="p_id">ID:{{ element.id }}</p>
                            <p class="p_viewNum">模版名称:{{ element.fileName }}</p>
                            <p class="p_viewNum">浏览数:{{ element.viewNum }}</p>
                            <p class="p_viewNum">封面点击数:{{ element.coverClickNum }}</p>
                        </div>

                        <div class="img-wrapper">
                            <img :src="element.coverImagePaths[0]" alt="" class="template-img" />
                        </div>
                        <p class="template-name">
                            <el-button @click="openPreview(element.coverImagePaths)">
                                预览
                            </el-button>
                            <!-- <el-button type="primary" size='samll' @click="openEditor(element)">
                                编辑
                            </el-button> -->
                            <!-- <el-button type="danger" size='samll' @click="deleteTemplate(element.id)">
                                删除
                            </el-button> -->
                        </p>
                    </li>
                </template>
            </draggable>

        </el-card>

        <!-- 浮动操作栏 -->
        <div class="floating-actions" ref="actionBox" @mousedown="dragStart" @mouseup="dragEnd">
            <el-pagination :page-sizes="[10, 20, 30, 40]" layout="sizes,prev, pager, next,total"
                v-model:page-size="pageSize" v-model:current-page="currentPage" :total="totalNum"
                @current-change="handleCurrentChange" @size-change="handleSizeChange" />
        </div>
    </div>

</template>

<script setup lang="ts">
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
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';

    import { onMounted, reactive, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    import type { ImageInstance } from 'element-plus'
    // import pptTemplateEditor from '@/components/pptTemplate/pptTemplateEditor.vue'
    import { ElMessage, ElMessageBox } from 'element-plus'
    const counterStore = useCounterStore()
    const { showPagestion, defaultAppNo, regionList, showLoading, OSlist } = storeToRefs(counterStore)





    const totalNum = ref<number>(0)
    const pageSize = ref<number>(20)
    const currentPage = ref<number>(1)
    const handleCurrentChange = (val: number) => {

        getUserList(val)
    }
    const handleSizeChange = (val: number) => {
        pageSize.value = val
        getUserList(currentPage.value)
    }

    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)




    const imageRef = ref<ImageInstance>()
    const previewUrl = ref('')//预览图
    const previewUrlList = ref<any>([])//预览图列表
    const openPreview = (url: string) => {
        previewUrl.value = url[0]
        previewUrlList.value = [...url]



        setTimeout(() => {
            imageRef.value!.showPreview()
        }, 0)
    }



    const deleteTemplate = (id: number) => {
        ElMessageBox.confirm('确定删除该模版吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async () => {
            try {

                ElMessage.success('删除成功')
                getUserList()
            } catch (error) {
                ElMessage.error('删除失败')
            }
        })
    }







    const editInfo = ref<any>()
    const dialogEditor = ref<boolean>(false)
    const openEditor = (element: any) => {
        dialogEditor.value = true
        editInfo.value = element
    }










    //搜索参数
    interface SearchParams {
        region: string
        os: string
        sort: number,
        category: string,
        isPay: number | string
        templateName: string

    }
    //付类列表
    const paysList = reactive<any[]>([
        {
            id: 0,
            name: '全部'
        },
        {
            id: 1,
            name: '付费'
        },
        {
            id: 2,
            name: '免费'
        }
    ])

    //排序列表
    const sortList = reactive<any[]>([
        {
            id: 1,
            name: '综合排序'
        },
        {
            id: 2,
            name: '最新'
        },
        {
            id: 3,
            name: '最热'
        }
    ])

    const searchParams = ref<SearchParams>(
        {

            region: regionList.value[0].value,
            os: '',
            sort: 2,
            category: '',
            isPay: '',
            templateName: ''

        }
    )
    //重置搜索
    const resetSearch = () => {
        searchParams.value = {
            region: regionList.value[0].value,
            os: '',
            sort: 2,
            category: '',
            isPay: '',
            templateName: ''



        }
        getUserList()
    }
    interface AppItem {
        id: number
        appId: string;        // 应用编号
        shortName: string;    // 应用简称
        companyName: string;  // 所属公司
        accessName: string;   // 应用访问名
        systemId: string;     // 系统账号id
        developer: string;    // 开发者
    }


    const appNote: any = {
        appId: '应用编号',
        shortName: '应用简称',
        companyName: '所属公司',
        accessName: '应用访问名',
        systemId: '系统账号id',
        developer: '开发者'

    }
    // 生成用户数据
    const appData = ref<AppItem[]>([
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

    const getUserList = async (pageNum: number = 1) => {
        console.log("🚀 ~ getUserList ~ pageNum:", pageNum)
        showLoading.value = true

        try {
            const params: Record<string, any> = {
                timestamp: new Date().getTime(),
                region: searchParams.value.region,
                classId: searchParams.value.category,
                type: searchParams.value.sort,
                pageNumber: pageNum,
                pageSize: pageSize.value,
            }
            if (searchParams.value.isPay === 1) {
                params.isVip = 1
            } else if (searchParams.value.isPay === 2) {
                params.isVip = 0
            }

            if (searchParams.value.templateName) {
                params.type = 5
                params.templateName = searchParams.value.templateName
            }

            console.log('获取ppt模板参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/mate/ppt/template/findSearch', {
                enData
            })
            console.log('获取ppt模板', res);
            appData.value = res.data.data.data
            totalNum.value = res.data.data.total
        } catch (err) {
            console.log('获取ppt模板失败', err);
        } finally {
            showLoading.value = false
        }


        const keys = Object.keys(appNote)
        filterParams.value = keys.map((item) => {
            return {
                note: appNote[item],
                isShow: true,
                key: item
            }
        })
        console.log('filterParams', filterParams.value);
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



    //获取类目
    const categoryList = ref<any[]>([])
    const getMenuList = async () => {
        try {
            const params: Record<string, any> = {
                timestamp: new Date().getTime(),
                region: searchParams.value.region,
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.get('/mate/ppt/template/findClass', {
                params: {
                    enData
                }
            })
            console.log('获取类目', res);
            categoryList.value = res.data.rows

        } catch (err) {
            console.log('获取类目失败', err);
        }
    }


    onMounted(async () => {
        searchParams.value.region = regionList.value[0].value
        await getMenuList()
        getUserList();
        showPagestion.value = true
    })
</script>

<style scoped lang="scss">

    .dragA,
    .dragB {
        position: fixed;
        z-index: 9999999;
        width: 100px;
        height: 100px;
        top: 0
    }

    .dragA {
        background: red;
        left: 0;

    }

    .dragB {
        background: #409eff;
        left: 200px;
    }

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
            height: 700px;
            overflow-y: scroll;

            .template-grid {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                /* 自适应列数，每列固定200px宽度 */
                gap: 20px;
                /* 项目之间的间距 */
                padding: 0;
                list-style: none;
                margin: 0;
                justify-content: start;
                /* 左对齐排列 */
            }

            .template-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                height: 150px;
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
                box-sizing: border-box;
                /* 确保padding和border包含在总宽度内 */
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