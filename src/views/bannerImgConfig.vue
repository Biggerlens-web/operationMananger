<template>
    <div class="view">
        <bannerImgBatchAdd v-model:dialog-visible="batchImageDialog" :appNo="searchParams.appNo" :editType="editType"
            :bannerId="searchParams.bannerId" />
        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <el-button type="primary" class="add-button" @click="addImg">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增图片
                    </el-button>
                    <el-button type="primary" class="add-button save-button" @click="save">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        保存改动
                        <div v-if="hasUnsavedChanges" class="red-dot"></div>
                    </el-button>
                </div>
                <div class="right-actions">
                    <!-- <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
                        @changeView="changeView" /> -->
                </div>
            </div>

            <el-divider class="divider" />

            <div class="filter-container">
                <div class="filter-row">


                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.appNo" placeholder="应用" class="filter-select"
                            @change="getBannerList">
                            <el-option v-for="item in appList" :key="item.appNo"
                                :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                                :value="item.appNo" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.os" placeholder="系统" class="filter-select"
                            @change="getBannerList">
                            <el-option v-for="item in OSlist" :key="item" :label="item" :value="item" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.lang" placeholder="语言" class="filter-select"
                            @change="getBannerList">
                            <el-option v-for="item in international" :key="item" :label="item.language"
                                :value="item.value" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.channelId" placeholder="渠道" class="filter-select"
                            @change="getBannerList">
                            <el-option v-for="item in channelList" :key="item.id" :label="item.channelName"
                                :value="item.id" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.bannerId" placeholder="轮播点" class="filter-select"
                            @change="getUserList">
                            <el-option v-for="item in bannerList" :key="item.id" :label="item.bannerName"
                                :value="item.id" />
                        </el-select>
                    </div>

                    <div class="filter-item filter-actions">
                        <el-button type="primary" @click="showBatchAddBannerImg">
                            <el-icon>
                                <Search />
                            </el-icon>
                            批量添加
                        </el-button>

                    </div>
                </div>


            </div>
        </el-card>
        <el-card class="content-card">
            <draggable tag="ul" v-model="list" item-key="id" :animation="200" class="template-grid"
                ghost-class="ghost-class" chosen-class="chosen-class" drag-class="dragging-class"
                :group="{ name: 'items' }" @start="onDragStart" @end="onDragEnd">
                <template #item="{ element, index }">
                    <li :key="element.img.id" class="template-item" @click="editorTemplate(element.img.id)">
                        <div class="img-wrapper" @click.stop="templateViewDialog(element.img.id)">
                            <img :src="element.img.imgUrl" alt="" class="template-img">
                            <div class="delete-icon" @click.stop="deleteTemplate(element.img.id)">
                                <el-icon>
                                    <Delete />
                                </el-icon>
                            </div>
                        </div>
                        <p class="template-name">
                            <el-tooltip :content="element.img.imgName" placement="top" :show-after="500"
                                :enterable="false" popper-class="template-name-tooltip">
                                <span class="name">
                                    {{ element.img.imgName }}
                                </span>
                            </el-tooltip>
                            <!-- <span class="tag tag-test" v-if="!element.isTest">测试</span>
                            <span class="tag tag-prod" v-if="!element.isProduction">正式</span> -->
                        </p>
                    </li>
                </template>
            </draggable>
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import draggable from 'vuedraggable'
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';
    import bannerImgBatchAdd from '@/components/banner/bannerImgBatchAdd.vue';
    import { computed, onMounted, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    import { Delete } from '@element-plus/icons-vue';
    import { ElMessage } from 'element-plus';
    import { useRoute } from 'vue-router';
    const counterStore = useCounterStore()
    const { showPagestion, appList, OSlist, channelList, international } = storeToRefs(counterStore)
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)
    const list = ref<any>([


    ])


    //新增类型
    const editType = ref<string>('')



    //新增图片
    const addImg = () => {
        editType.value = 'add'
        batchImageDialog.value = true
    }


    // 跟踪是否有未保存的改动
    const hasUnsavedChanges = ref<boolean>(false)
    const originalList = ref<any>([])

    // 监听列表变化
    watch(list, (newList) => {
        // 比较当前列表和原始列表是否相同
        const currentIds = newList.map((item: any) => item.img.id)
        const originalIds = originalList.value.map((item: any) => item.img.id)

        // 检查顺序或内容是否发生变化
        hasUnsavedChanges.value = JSON.stringify(currentIds) !== JSON.stringify(originalIds)
    }, { deep: true })



    //批量新增轮播图
    const batchImageDialog = ref<boolean>(false)
    watch(() => batchImageDialog.value, (newV) => {
        if (!newV) {
            getUserList()
        }
    })
    const showBatchAddBannerImg = () => {
        editType.value = 'batchAdd'
        batchImageDialog.value = true
    }


    //显示模板图
    const showTemplateView = ref<boolean>(false);
    const templateViewDialog = (id: string | number) => {
        showTemplateView.value = true;
    }
    //编辑模板
    const dialogEditor = ref<boolean>(false);
    const editorTemplate = (id: string | number) => {
        console.log('id', id);
        dialogEditor.value = true;


    }
    const onDragEnd = () => {
        console.log('结束拖动')
        // 拖拽结束后标记有未保存的改动
        hasUnsavedChanges.value = true
    }
    const onDragStart = () => {
        console.log('开始拖动')
    }


    //搜索参数
    interface SearchParams {
        appNo: number | string
        os: string
        lang: string
        channelId: string | number
        bannerId: number | string



    }
    const searchParams = ref<SearchParams>(
        {
            appNo: appList.value[0].appNo,
            os: OSlist.value[0],
            lang: international.value[0].value,
            channelId: channelList.value[0].id,
            bannerId: ''

        }
    )
    //重置搜索
    const resetSearch = () => {
        searchParams.value = {
            appNo: '',
            os: '',
            lang: '',
            channelId: '',
            bannerId: ''

        }
        getUserList()
    }




    //获取轮播点列表
    const bannerList = ref<any>([])
    const getBannerList = async () => {


        try {

            const params = {
                timestamp: Date.now(),
                appNo: searchParams.value.appNo,
                os: searchParams.value.os,
                language: searchParams.value.lang,
                channelId: searchParams.value.channelId,
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/base/banner/listByAppNoAndOsAndLanguageAndChannelId', {

                enData

            })

            console.log('获取轮播点列表', res);
            bannerList.value = res.data.data.vos
            searchParams.value.bannerId = ''
        } catch (err) {
            console.log('获取轮播点失败', err);

        }
    }



    //获取轮播图列表
    const getUserList = async () => {
        try {


            const params = {
                timestamp: Date.now(),
                bannerId: searchParams.value.bannerId
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.get('/bannerImgConfig/list', {
                params: {
                    enData
                }
            })
            console.log('获取轮播图列表', res);
            list.value = res.data.data.bannerImgConfigList
            // 保存原始列表用于比较
            originalList.value = JSON.parse(JSON.stringify(list.value))
            // 重置改动状态
            hasUnsavedChanges.value = false
        } catch (err) {


            console.log('获取轮播图列表失败', err);
        }


    }


    // 删除模板函数
    const deleteTemplate = (id: string | number) => {
        console.log('删除模板', id)
        const deleteIndex = list.value.findIndex((item: any) => item.img.id === id)
        if (deleteIndex !== -1) {
            list.value.splice(deleteIndex, 1)
            // 删除后标记有未保存的改动
            hasUnsavedChanges.value = true
        }
    }



    //保存改动
    const save = async () => {
        try {


            const params = {
                timestamp: Date.now(),
                bannerId: searchParams.value.bannerId,
                imgIds: list.value.map((item: any) => item.img.id)
            }

            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/bannerImgConfig/save', {
                enData
            })

            console.log('保存改动', res);
            if (res.data.code === 200) {
                ElMessage.success('保存成功')
                // 保存成功后重置改动状态
                hasUnsavedChanges.value = false
                // 更新原始列表
                originalList.value = JSON.parse(JSON.stringify(list.value))
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {


            console.log('保存失败', err);
        }
    }



    const route = useRoute()
    onMounted(async () => {
        const query = route.query
        console.log('query', query);
        if (query) {
            searchParams.value.appNo = query.appNo ? Number(query.appNo) : appList.value[0].appNo
            searchParams.value.os = query.os?.toString() || OSlist.value[0]
            searchParams.value.channelId = query.channelId ? Number(query.channelId) : channelList.value[0].id
            searchParams.value.lang = query.lang?.toString() || international.value[0].value
            await getBannerList()
            searchParams.value.bannerId = query.bannerId ? Number(query.bannerId) : ''
            getUserList()
        }
        showPagestion.value = true
    })
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

                .left-actions {
                    .add-button {
                        font-weight: 500;

                        .el-icon {
                            margin-right: 4px;
                        }
                    }

                    .save-button {
                        position: relative;

                        .red-dot {
                            position: absolute;
                            top: -2px;
                            right: -2px;
                            width: 8px;
                            height: 8px;
                            background-color: #ff4757;
                            border-radius: 50%;
                            border: 2px solid #fff;
                            z-index: 10;
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
            overflow-y: scroll;

            .pagesBox {
                margin-top: 30px;
            }

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

            }

            .template-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            }

            .img-wrapper {
                width: 100%;
                aspect-ratio: 1;
                position: relative;
                overflow: hidden;
                border-radius: 4px;
                background-color: #f5f5f5;

                .delete-icon {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    width: 24px;
                    height: 24px;
                    background-color: #ff4757;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                    z-index: 10;

                    .el-icon {
                        color: white;
                        font-size: 14px;
                    }

                    &:hover {
                        background-color: #ff3742;
                        transform: scale(1.1);
                    }
                }

                &:hover .delete-icon {
                    opacity: 1;
                }
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

                /* 垂直居中对齐 */
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