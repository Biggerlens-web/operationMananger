<template>
    <div class="view">
        <fontEditor v-model:dialog-visible="showEditor" />
        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <el-button type="primary" @click="addFont" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        批量新增
                    </el-button>

                    <el-button type="primary" @click="addFont" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增字体
                    </el-button>
                    <el-button type="primary" class="add-button">
                        全部选中
                    </el-button>
                    <el-button type="danger" class="add-button">
                        <el-icon>
                            <Minus />
                        </el-icon>
                        删除所选
                    </el-button>
                    <el-button type="primary" class="add-button">
                        保存改动
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
                        <el-select filterable v-model="searchParams.companyNo" placeholder="应用" class="filter-select">
                            <el-option v-for="item in appList" :key="item.appNo"
                                :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                                :value="item.appNo" />
                        </el-select>
                    </div>

                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.companyNo" placeholder="国内外" class="filter-select">
                            <el-option v-for="item in OSlist" :key="item.appNo" :label="item" :value="item" />
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <el-select filterable v-model="searchParams.companyNo" placeholder="语言" class="filter-select">
                            <el-option v-for="item in channelList" :key="item.id" :label="item.channelName"
                                :value="item.id" />
                        </el-select>
                    </div>


                    <!-- <div class="filter-item filter-actions">
                        <el-button type="primary" @click="getUserList">
                            <el-icon>
                                <Search />
                            </el-icon>
                            批量添加
                        </el-button>

                    </div> -->
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
                            <img :src="element.smallUrl || element.bigUrl || element.coverUrl" alt=""
                                class="template-img" />
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
    </div>
</template>

<script setup lang="ts">
    import draggable from 'vuedraggable'
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';
    import fontEditor from '@/components/font/fontEditor.vue';
    import { onMounted, ref } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessageBox } from 'element-plus';
    const counterStore = useCounterStore()
    const { showPagestion, appList, OSlist, channelList } = storeToRefs(counterStore)
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)



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




    //新增字体
    const showEditor = ref<boolean>(false)
    const addFont = () => {
        showEditor.value = true
    }

    //编辑
    const showTemplateEdit = ref<boolean>(false)
    const editorTemplate = (item?: any) => {
        showTemplateEdit.value = true
        console.log('item', item)

    }



    //搜索参数
    interface SearchParams {
        inputText: string
        companyNo: string



    }
    const searchParams = ref<SearchParams>(
        {
            inputText: '',
            companyNo: '',

        }
    )
    //重置搜索
    const resetSearch = () => {
        searchParams.value = {
            inputText: '',
            companyNo: '',

        }
        getUserList()
    }
    interface AppItem {
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
        {
            appId: 'APP_0001',
            shortName: '商城系统',
            companyName: '科技有限公司',
            accessName: 'app1.example.com',
            systemId: 'SYS_0001',
            developer: '张三'
        },
        {
            appId: 'APP_0002',
            shortName: '会员系统',
            companyName: '网络科技有限公司',
            accessName: 'app2.example.com',
            systemId: 'SYS_0002',
            developer: '李四'
        },
        {
            appId: 'APP_0003',
            shortName: '支付系统',
            companyName: '软件开发有限公司',
            accessName: 'app3.example.com',
            systemId: 'SYS_0003',
            developer: '王五'
        },
        {
            appId: 'APP_0004',
            shortName: '管理系统',
            companyName: '信息技术有限公司',
            accessName: 'app4.example.com',
            systemId: 'SYS_0004',
            developer: '赵六'
        },
        {
            appId: 'APP_0005',
            shortName: '客服系统',
            companyName: '科技有限公司',
            accessName: 'app5.example.com',
            systemId: 'SYS_0005',
            developer: '钱七'
        }
    ])
    interface filterParams {
        note: string
        isShow: boolean
        key: string
    }
    const filterParams = ref<filterParams[]>()
    const getUserList = async () => {
        console.log('获取用户列表');
        const dataItem = appData.value[0]
        const keys = Object.keys(dataItem)
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
    onMounted(() => {
        getUserList();
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
    }
</style>