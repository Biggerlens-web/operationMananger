<template>
    <div class="view">


        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="right-actions ">
                    <div class="home" @click="back">
                        <el-icon>
                            <House />
                        </el-icon>
                    </div>

                    <el-button v-for="item in actionBtnList" @click="handleActionBtn(item)" :key="item.key">{{
                        item.label }}</el-button>
                </div>

            </div>

            <el-divider class="divider" />

            <div class="filter-container">
                <div class="filter-row">




                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.functionValue" clearable placeholder="功能"
                            @change="changeFunction" class="filter-select">
                            <el-option v-for="item in functionList" :key="item.value" :label="item.note"
                                :value="item.value" />
                        </el-select>


                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.classId" clearable placeholder="一级分类"
                            class="filter-select" @change="changeFirstClass">
                            <el-option v-for="item in firstCategoryList" :key="item.id" :label="item.className"
                                :value="item.id" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.secondClassId" clearable placeholder="二级分类"
                            class="filter-select">
                            <el-option v-for="item in secondCategoryList" :key="item.id" :label="item.className"
                                :value="item.id" />
                        </el-select>
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
        <el-card class="manage">
            <keep-alive>
                <component :is="activeCom" :key="activeKey" :isDelete="isDelete" @editMaterial="EditingMaterial"
                    ref="childComponentRef" />
            </keep-alive>
        </el-card>

        <!-- 浮动操作栏 -->
        <!-- <div class="floating-actions" ref="actionBox" @mousedown="dragStart" @mouseup="dragEnd">


            <customButton @click="back">
                保存改动
            </customButton>
        </div> -->
    </div>
    <editMaterial v-model:dialog-visible="dialogEditMaterial" />
    <addClass v-model:dialog-visible="dialogAddClass" :firstCategoryList="firstCategoryList" />
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


    import editMaterial from '@/components/AImaterial/editMaterial.vue'
    import addClass from '@/components/AImaterial/addClass.vue'
    import { onMounted, reactive, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    import normalMaterial from '@/components/AImaterial/normalMaterial.vue'
    import weightedManagement from '@/components/AImaterial/weightedManagement.vue'
    import userMaterial from '@/components/AImaterial/userMaterial.vue'
    import { ElMessage } from 'element-plus'
    import { computed } from '@vue/reactivity'
    const counterStore = useCounterStore()
    const { defaultAppNo, showLoading, functionList } = storeToRefs(counterStore)

    // 子组件引用
    const childComponentRef = ref<any>(null)

    // 调用子组件暴露的方法
    const callSpecificMethod = () => {
        if (!childComponentRef.value) return

        switch (activeKey.value) {
            case 'normalMaterial':
                childComponentRef.value.getMaterialData?.()
                break
            case 'weightedManagement':
                childComponentRef.value.refreshWeightData?.()
                break
            case 'userMaterial':
                childComponentRef.value.refreshUserData?.()
                break
        }
    }



    //获取功能列表
    const getFunctionList = async () => {

        try {
            const res = await service.get('/hairMaterials/functionValues')
            console.log("🚀 ~ getFunctionList ~ res:", res)

            if (res.data.code === 200) {
                functionList.value = res.data.data.functionType
                searchParams.value.functionValue = res.data.data.functionType[0].value
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log("🚀 ~ getFunctionList ~ err:", err)

        }
    }


    //获取分类列表
    const firstCategoryList = ref<any>([])
    const secondCategoryList = ref<any>([])
    const getCategoryList = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                functionValue: searchParams.value.functionValue,
                appNo: defaultAppNo.value
            }
            console.log('分类参数params', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/hairMaterials/classification/list', {
                enData
            })
            console.log("🚀 ~ getCategoryList ~ res:", res)


            if (res.data.code === 200) {
                firstCategoryList.value = res.data.data.hairMaterialClassification
                secondCategoryList.value = []

            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log("🚀 ~ getCategoryList ~ err:", err)
        }
    }


    //切换功能点
    const changeFunction = () => {
        searchParams.value.classId = ''
        searchParams.value.secondClassId = ''
        getCategoryList()
    }

    //切换一级分类
    const changeFirstClass = () => {
        secondCategoryList.value = firstCategoryList.value.find((item: any) => item.id === searchParams.value.classId)?.children
    }


    //默认显示视图
    const activeCom = computed(() => {
        return componentList.find(item => item.key === activeKey.value)?.com
    })
    const activeKey = ref('normalMaterial')



    //删除素材
    const isDelete = ref<boolean>(false)

    //组件列表
    const componentList = reactive([
        {
            com: normalMaterial,
            key: 'normalMaterial'
        },
        {
            com: weightedManagement,
            key: 'weightedManagement'
        },
        {
            com: userMaterial,
            key: 'userMaterial'
        }
    ])




    interface ActionBtnItem {
        label: string
        key: string
    }

    const actionBtnList = reactive<ActionBtnItem[]>([
        {
            label: '新增分类',
            key: 'addCategory'
        },
        {
            label: '新增素材',
            key: 'addMaterial'
        },
        {
            label: '加权管理',
            key: 'weightedManagement'
        },
        {
            label: '用户上传',
            key: 'userUpload'
        },
        {
            label: '删除素材',
            key: 'deleteMaterial'
        },
    ])

    const handleActionBtn = (item: ActionBtnItem) => {
        switch (item.key) {
            case 'addCategory':
                dialogAddClass.value = true
                break;
            case 'addMaterial':
                dialogEditMaterial.value = true
                break;
            case 'weightedManagement':
                activeKey.value = 'weightedManagement'
                break;
            case 'userUpload':
                activeKey.value = 'userUpload'
                break;
            case 'deleteMaterial':
                // 调用子组件的方法刷新数据

                break;
            default:
                break;
        }
    }




















    //返回
    const back = () => {
        if (activeKey.value === 'normalMaterial') {
            callSpecificMethod()
        } else {
            activeKey.value = 'normalMaterial'
            callSpecificMethod()
        }
    }


    //搜索参数
    interface SearchParams {
        functionValue: string | number
        classId: string | number
        secondClassId: string | number




    }
    const searchParams = ref<SearchParams>(
        {

            functionValue: '',
            classId: '',
            secondClassId: ''
        }
    )
    //重置搜索
    const resetSearch = () => {
        searchParams.value = {
            functionValue: '',
            classId: '',
            secondClassId: ''
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

    const getUserList = async () => {
        showLoading.value = true
        try {
            const params = {
                timestamp: new Date().getTime(),
                appNo: defaultAppNo.value,
                region: searchParams.value.functionValue,
                isPublic: false
            }
            console.log('获取水印参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/watermark/list', {
                enData
            })

            console.log('获取水印', res);
            appData.value = res.data.rows
        } catch (err) {
            console.log('获取水印失败', err);
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







    //新增分类
    const dialogAddClass = ref<boolean>(false)
    watch(() => dialogAddClass.value, (newV) => {
        if (!newV) {
            getCategoryList()
        }
    })


    //编辑素材
    const dialogEditMaterial = ref<boolean>(false)
    const EditingMaterial = (info: any) => {
        console.log('编辑数据', info);
        dialogEditMaterial.value = true
    }



    onMounted(async () => {
        await getFunctionList()
        await getCategoryList()
        // getUserList();
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

                    .home {
                        font-size: 30px;
                        margin-right: 20px;
                        cursor: pointer;
                    }
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

        .manage {
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