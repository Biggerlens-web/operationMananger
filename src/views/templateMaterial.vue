<template>
    <templateView v-model:dialog-visible="showTemplateView" />
    <stickerTemplateEditor v-model:dialogEditor="dialogEditor" />
    <editorActionBox class="floating-action-box" @actionClick="handleAction" />
    <addClothTemplate v-model:dialogAdd="dialogAddCloth" />
    <batchEditeTemplate v-model:dialog-batch-edite="dialogBatchEdite" />
    <el-card class="select_box">
        <el-select v-model="gender">
            <el-option label="全部" value="all"></el-option>
            <el-option label="男装" value="clothing"></el-option>
            <el-option label="女装" value="accessories"></el-option>

        </el-select>
        <el-select v-model="clothType">
            <el-option label="全部" value="all"></el-option>
            <el-option label="类型1" value="clothing"></el-option>
            <el-option label="类型2" value="accessories"></el-option>
        </el-select>
    </el-card>
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
                        <p class="p_id">
                            ID:{{ element.id }}
                        </p>
                        <p class="p_viewNum">
                            点击数:{{ 0 }}
                        </p>
                    </div>

                    <div class="img-wrapper" @click.stop="templateViewDialog(element.id)">
                        <img :src="element.img" alt="" class="template-img">
                    </div>
                    <p class="template-name">
                        <el-button type="primary" style="width: 100%;" @click="editorTemplate(element.id)">
                            编辑
                        </el-button>
                    </p>
                </li>
            </template>
        </draggable>
    </el-card>
</template>

<script lang="ts" setup>
    import templateView from '@/components/pptTemplate/templateView.vue'
    import stickerTemplateEditor from '@/components/clothingMaterials/stickerTemplateEditor.vue'
    import editorActionBox from '@/components/clothingMaterials/editorActionBox.vue'
    import addClothTemplate from '@/components/clothingMaterials/addClothTemplate.vue'
    import batchEditeTemplate from '@/components/clothingMaterials/batchEditeTemplate.vue'
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import draggable from 'vuedraggable'
    import { ElMessage } from 'element-plus'


    //筛选条件
    const gender = ref('all')//男女装
    const clothType = ref('all')//服装类型


    const router = useRouter()
    const goBack = () => {
        router.back()
    }
    const list = ref<any>([
        {
            name: '模板1模板1模板1模板1模板1模板1模板1模板1模板1模板1模板1',
            id: 1,
            img: '',
        },
        {
            name: '模板2',
            id: 2,
            img: '',
        },
        {
            name: '模板3',
            id: 3,
            img: '',
        },
        {
            name: '模板4',
            id: 4,
            img: '',
        },
        {
            name: '模板5',
            id: 5,
            img: '',
        },
        {
            name: '模板6',
            id: 6,
            img: '',
        },
        {
            name: '模板7',
            id: 7,
            img: '',
        },
        {
            name: '模板8',
            id: 8,
            img: '',
        },
        {
            name: '模板9',
            id: 9,
            img: '',
        },
        {
            name: '模板10',
            id: 10,
            img: '',
        },
        {
            name: '模板11',
            id: 11,
            img: '',
        },
        {
            name: '模板12',
            id: 12,
            img: '',
        },
        {
            name: '模板13',
            id: 13,
            img: '',
        },
        {
            name: '模板14',
            id: 14,
            img: '',
        },
        {
            name: '模板15',
            id: 15,
            img: '',
        },
        {
            name: '模板16',
            id: 16,
            img: '',
        },

    ])


    //选中模板集合
    const selectedList = ref<any>([1, 2, 3])
    const isSelected = (id: number) => {
        return selectedList.value.includes(id);
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
    }
    const onDragStart = () => {
        console.log('开始拖动')
    }
    //编辑模板
    const dialogEditor = ref<boolean>(false);
    const editorTemplate = (id?: string | number) => {
        console.log('id', id);
        dialogEditor.value = true;


    }

    //显示模板图
    const showTemplateView = ref<boolean>(false);
    const templateViewDialog = (id: string | number) => {
        showTemplateView.value = true;
    }



    //全选
    const checkAll = ref<boolean>(false);
    const handleCheckAll = () => {
        checkAll.value = !checkAll.value;
        if (checkAll.value) {
            selectedList.value = list.value.map((item: any) => item.id)
        } else {
            selectedList.value = []
        }
    }


    //批量新增服装素材
    const dialogAddCloth = ref<boolean>(false)
    const showbatchAdd = () => {
        dialogAddCloth.value = true;
    }


    //批量编辑
    const dialogBatchEdite = ref<boolean>(false)
    const showBatchEdite = () => {
        dialogBatchEdite.value = true;
    }


    //批量删除
    const batchDelete = () => {


        if (selectedList.value.length === 0) {

            ElMessage.warning('请选择要删除的素材')
            return
        }
    }
    //全局操作
    const handleAction = (type: string) => {
        switch (type) {
            case 'add':
                console.log('批量新增');
                showbatchAdd()
                break;
            case 'edit':
                console.log('批量编辑');
                showBatchEdite()
                break;
            case 'tag':
                console.log('批量标签');
                break;
            case 'upload':
                console.log('新增素材');
                editorTemplate()
                break;
            case 'checkAll':
                console.log('全选');
                handleCheckAll()
                break;
            case 'delete':
                console.log('批量删除');
                batchDelete()
                break;
            case 'save':
                console.log('保存改动');
                break;


            case 'back':
                console.log('返回');
                goBack()
                break;
            default:
                break;
        }
    }
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

</style>