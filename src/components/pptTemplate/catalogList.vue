<template>
    <draggable tag="ul" v-model="catalogList" item-key="id" :animation="200" class="catalog-list"
        ghost-class="ghost-class" chosen-class="chosen-class" drag-class="dragging-class" :group="{ name: 'items' }"
        @start="onDragStart" @end="onDragEnd" handle=".moveIcon">
        <template #item="{ element, index }">
            <li :key="element.id" @mouseenter="element.isHover = true" @mouseleave="element.isHover = false"
                class="catalog-item" @click="goSubCatalog(element)">
                <div class="item-main">
                    <div class="drageIcon">
                        <img v-show="element.isHover" class="moveIcon" src="../../assets/moveIcon.png" alt="">
                    </div>

                    <div class="item-icon">
                        <img v-lazy="element.img" alt="" class="template-icon">
                    </div>
                    <div class="item-info">
                        <p class="item-name">
                            <span>{{ element.name }}</span>
                            <span class="tag tag-test" v-if="element.isTest">测试</span>
                            <span class="tag tag-prod" v-if="element.isProduction">正式</span>
                        </p>
                        <p class="item-date">{{ element.date }}</p>
                    </div>
                </div>
                <div class="item-action" @click.stop>
                    <el-dropdown>
                        <img :src="moreIcon" alt="更多" class="more-icon">
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="handleDelete">删除</el-dropdown-item>
                                <el-dropdown-item @click="editor">编辑</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </li>
        </template>
    </draggable>

</template>

<script lang="ts" setup>
    import { useTemplateStore } from '@/stores/template';
    import moreIcon from '../../assets/template/更多.png'
    import { onMounted, ref } from 'vue'
    import { storeToRefs } from 'pinia';
    import draggable from 'vuedraggable'


    const templateStore = useTemplateStore()
    const { typeTitle, subTypeTitle } = storeToRefs(templateStore)
    const emit = defineEmits<{
        'goDetail': [value: any],
        'editorTemplateType': [value: any]
    }>()
    interface CatalogItem {
        name: string;
        id: number;
        img: string;
        date: string;
        isTest: boolean;
        isProduction: boolean;
        isHover?: boolean;
    }
    const catalogList = ref<CatalogItem[]>([
        {
            name: '全部模板',
            id: 1,
            img: '',
            date: '2023-07-11',
            isTest: true,
            isProduction: true,

        },
        {
            name: '常用模板',
            id: 2,
            img: '',
            date: '2023-08-15',
            isTest: true,
            isProduction: true
        },
        {
            name: '系统模板',
            id: 3,
            img: '',
            date: '2023-09-20',
            isTest: true,
            isProduction: true
        },
        {
            name: '自定义模板',
            id: 4,
            img: '',
            date: '2023-10-05',
            isTest: true,
            isProduction: true
        },
        {
            name: '报表模板',
            id: 5,
            img: '',
            date: '2023-11-01',
            isTest: true,
            isProduction: true
        },
        {
            name: '数据分析模板',
            id: 6,
            img: '',
            date: '2023-12-15',
            isTest: true,
            isProduction: true
        },
        {
            name: '可视化模板',
            id: 7,
            img: '',
            date: '2024-01-10',
            isTest: true,
            isProduction: true
        },
        {
            name: '表单模板',
            id: 8,
            img: '',
            date: '2024-02-01',
            isTest: true,
            isProduction: true
        },
        {
            name: '工作流模板',
            id: 9,
            img: '',
            date: '2024-02-15',
            isTest: true,
            isProduction: true
        },
        {
            name: '仪表盘模板',
            id: 10,
            img: '',
            date: '2024-03-01',
            isTest: true,
            isProduction: true
        }
    ])

    //子目录
    const goSubCatalog = (item: any) => {
        const k = {
            type: 'templatesList',
            id: item.id
        }
        typeTitle.value = item.name
        emit('goDetail', k)
    }


    const editor = () => {
        const k = {
            type: 'addTemplateCatalog',
            id: 1
        }
        emit('editorTemplateType', k)
    }
    const handleDelete = () => { }


    //开始拖动
    const onDragStart = () => {
        console.log('开始拖动')
    }
    //结束拖动
    const onDragEnd = () => {
        console.log('结束拖动')
    }

    onMounted(() => {
        for (let item of catalogList.value) {
            item.isHover = false
        }
    })
</script>

<style lang="scss" scoped>
    .catalog-list {
        list-style: none;
        padding: 0;
        margin: 0;
        background: #fff;
        border-radius: 8px;
        // box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    }

    .catalog-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid #f0f0f0;
        transition: all 0.3s ease;

        &.dragging {
            opacity: 0.5;
            background: #f5f7fa;
        }

        &.drag-over {
            border: 2px dashed #409eff;
            transform: scale(1.02);
        }
    }

    .catalog-item:last-child {
        border-bottom: none;
    }

    .catalog-item:hover {
        background-color: #f6f8fa;
    }

    .item-main {
        display: flex;
        align-items: center;
        gap: 16px;

        .drageIcon {
            width: 13px;


            .moveIcon {
                width: 100%;
                cursor: pointer;
            }
        }
    }

    .item-icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f7fa;
    }

    .template-icon {
        width: 24px;
        height: 24px;
        object-fit: contain;
    }

    .item-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .item-name {
        font-size: 15px;
        color: #333;
        font-weight: 500;
        display: flex;
        column-gap: 5px;

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

    .item-date {
        font-size: 13px;
        color: #999;


    }

    .item-action {
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    .catalog-item:hover .item-action {
        opacity: 1;
    }

    .more-icon {
        width: 20px;
        height: 20px;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background-color 0.2s ease;
    }

    .more-icon:hover {
        background-color: #eee;
    }

    .item {
        padding: 10px;
        margin: 5px;
        background-color: #f1f1f1;
        border-radius: 4px;
        transition: all 0.3s;
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
</style>