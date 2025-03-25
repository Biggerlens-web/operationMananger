<template>
    <pptTemplateEditor v-model:dialog-editor="dialogEditor" />
    <templateView v-model:dialog-visible="showTemplateView" />
    <draggable tag="ul" v-model="list" item-key="id" :animation="200" class="template-grid" ghost-class="ghost-class"
        chosen-class="chosen-class" drag-class="dragging-class" :group="{ name: 'items' }" @start="onDragStart"
        @end="onDragEnd">
        <template #item="{ element, index }">
            <li :key="element.id" class="template-item" @click="editorTemplate(element.id)">
                <div class="img-wrapper" @click.stop="templateViewDialog(element.id)">
                    <img :src="element.img" alt="" class="template-img">
                </div>
                <p class="template-name">
                    <el-tooltip :content="element.name" placement="top" :show-after="500" :enterable="false"
                        popper-class="template-name-tooltip">
                        <span class="name">
                            {{ element.name }}
                        </span>
                    </el-tooltip>
                    <span class="tag tag-test" v-if="!element.isTest">测试</span>
                    <span class="tag tag-prod" v-if="!element.isProduction">正式</span>
                </p>
            </li>
        </template>
    </draggable>
</template>

<script lang="ts" setup>
    import { ref, watch } from 'vue'
    import { useTemplateStore } from '@/stores/template';
    import draggable from 'vuedraggable'
    import { storeToRefs } from 'pinia';
    import templateView from './templateView.vue';
    import pptTemplateEditor from './pptTemplateEditor.vue';
    const templateStore = useTemplateStore()
    const { addTemplateMark } = storeToRefs(templateStore)
    watch(() => addTemplateMark.value, (newVal, oldVal) => {
        dialogEditor.value = true;
    })


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

    ])
    const onDragEnd = () => {
        console.log('结束拖动')
    }
    const onDragStart = () => {
        console.log('开始拖动')
    }

</script>

<style lang="scss" scoped>
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
</style>