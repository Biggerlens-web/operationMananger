<template>
    <div class="view">
        <tutorialGroupEditor v-model:show-editor="showEditor" />
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
                        <el-select filterable v-model="searchParams.os" placeholder="系统" class="filter-select">
                            <el-option v-for="item in OSlist" :key="item" :label="item" :value="item" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.region" placeholder="国内外" class="filter-select">
                            <el-option v-for="item in regionList" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.language" placeholder="语言" class="filter-select">
                            <el-option v-for="item in international" :key="item.value" :label="item.language"
                                :value="item.value" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.tutorialType" placeholder="教程类型"
                            class="filter-select">
                            <el-option v-for="item in tutorialTypeList" :key="item.id" :label="item.channelName"
                                :value="item.id" />
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
        <el-card class="content-card">
            <!-- <Transition enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut" mode="out-in">
                <component :is="componentName" :filterParams="filterParams" :tableData="appData"></component>
            </Transition>

            <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                :total="1000" /> -->
        </el-card>


        <div class="floating-actions" ref='actionBox' @mousedown="dragStart" @mouseup="dragEnd">
            <customButton @click="addTutorialGroup">
                <el-icon>
                    <Plus />
                </el-icon>
                新增教程组
            </customButton>
            <customButton @click="addTutorialGroup">
                <el-icon>
                    <Edit />
                </el-icon>
                编辑组信息
            </customButton>
            <customButton @click="addTutorialGroup">
                <el-icon>
                    <Minus />
                </el-icon>
                删除当前组
            </customButton>
            <customButton @click="addTutorialGroup">
                <el-icon>
                    <Plus />
                </el-icon>
                分配教程
            </customButton>
            <customButton @click="addTutorialGroup">
                全部选中
            </customButton>
            <customButton @click="addTutorialGroup">
                <el-icon>
                    <Minus />
                </el-icon>
                删除教程
            </customButton>
            <customButton @click="addTutorialGroup">
                保存改动
            </customButton>

        </div>
    </div>
</template>

<script setup lang="ts">
    const isDraging = ref<boolean>(false)
    const actionBox = ref<HTMLElement>()
    const elementSize = ref<{ width: number, height: number }>({ width: 0, height: 0 })
    const dragOffset = ref<{ x: number, y: number }>({ x: 0, y: 0 })

    const dragStart = (e: MouseEvent) => {
        if (actionBox.value) {
            const rect = actionBox.value.getBoundingClientRect()
            elementSize.value.width = rect.width
            elementSize.value.height = rect.height
            actionBox.value.style.right = 'auto'
            actionBox.value.style.bottom = 'auto'
            actionBox.value.style.left = rect.left + 'px'
            actionBox.value.style.top = rect.top + 'px'
            dragOffset.value.x = e.clientX - rect.left
            dragOffset.value.y = e.clientY - rect.top
            isDraging.value = true
            window.addEventListener('mousemove', dragMove)
        }
    }

    const dragMove = (e: MouseEvent) => {
        if (isDraging.value && actionBox.value) {
            const newX = Math.max(0, Math.min(e.clientX - dragOffset.value.x, window.innerWidth - elementSize.value.width))
            const newY = Math.max(0, Math.min(e.clientY - dragOffset.value.y, window.innerHeight - elementSize.value.height))
            actionBox.value.style.left = newX + 'px'
            actionBox.value.style.top = newY + 'px'
        }
    }
    const dragEnd = () => {
        isDraging.value = false
        window.removeEventListener('mousemove', dragMove)
    }

    import tableAciton from '@/components/public/tableAciton.vue';
    import customButton from '@/components/button/customButton.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';
    import { onMounted, ref } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import tutorialGroupEditor from '@/components/tutorialGroup/tutorialGroupEditor.vue';
    const counterStore = useCounterStore()
    const { showPagestion, OSlist, international, regionList, showLoading, defaultAppNo } = storeToRefs(counterStore)
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)



    //教程类型
    const tutorialTypeList = ref<any>([

    ])

    //新增教程组
    const showEditor = ref<boolean>(false)
    const addTutorialGroup = () => {
        console.log('新增教程组');
        showEditor.value = true
    }
    //搜索参数
    interface SearchParams {
        "os": string
        "region": string
        "language": string
        "tutorialType": string



    }
    const searchParams = ref<SearchParams>(
        {
            "os": "",
            "region": '',
            "language": "",
            "tutorialType": ""

        }
    )
    //重置搜索
    const resetSearch = () => {
        searchParams.value = {
            "os": "",
            "region": '',
            "language": "",
            "tutorialType": ""

        }
        getUserList()
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
    const appData = ref<any>([

    ])
    interface filterParams {
        note: string
        isShow: boolean
        key: string
    }
    const filterParams = ref<filterParams[]>()
    const getUserList = async () => {
        showLoading.value = true
        try {
            const params = {
                timestamp: Date.now(),
                ...searchParams.value,
                appNo: defaultAppNo.value
            }
        } catch (err) {
            console.log('获取教程组失败', err);
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
    onMounted(() => {
        getUserList();
        showPagestion.value = true
    })
</script>

<style scoped lang="scss">


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

        .content-card {
            height: calc(100vh - 220px);

            .pagesBox {
                margin-top: 30px;
            }
        }
    }
</style>