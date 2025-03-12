<template>
    <ul class="template-grid">
        <templateEditor v-model:dialogEditor="dialogEditor" />
        <li v-for="item in list" :key="item.id" class="template-item" @click="editorTemplate(item.id)">
            <div class="img-wrapper">
                <img :src="item.img" alt="" class="template-img">
            </div>
            <p class="template-name">{{ item.name }}</p>
        </li>
    </ul>
</template>

<script lang="ts" setup>
    import { ref, watch } from 'vue'
    import templateEditor from './templateEditor.vue';
    import { useTemplateStore } from '@/stores/template';
    import { storeToRefs } from 'pinia';
    const templateStore = useTemplateStore()
    const { addTemplateMark } = storeToRefs(templateStore)


    watch(() => addTemplateMark.value, (newVal, oldVal) => {
        dialogEditor.value = true;
    })
    //编辑模板
    const dialogEditor = ref<boolean>(false);
    const editorTemplate = (id: string | number) => {
        dialogEditor.value = true;
    }

    const list = ref<any>([
        {
            name: '模板1',
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
        }
    ])

</script>

<style lang="scss" scoped>
    .template-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
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
        text-align: center;
    }
</style>