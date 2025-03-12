<template>

    <ul class="catalog-list">

        <li v-for="item in catalogList" :key="item.id" class="catalog-item" @click="goTemplates(item)">
            <div class="item-main">
                <div class="item-icon">
                    <img :src="item.img" alt="" class="template-icon">
                </div>
                <div class="item-info">
                    <span class="item-name">{{ item.name }}</span>
                    <span class="item-date">{{ item.date }}</span>
                </div>
            </div>
            <div class="item-action" @click.stop>
                <el-dropdown>
                    <img :src="moreIcon" alt="更多" class="more-icon">
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>删除</el-dropdown-item>
                            <el-dropdown-item @click="editor(item)">编辑</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </li>
    </ul>
</template>

<script lang="ts" setup>
    import { useTemplateStore } from '@/stores/template';
    import moreIcon from '../../assets/template/更多.png'
    import { ref } from 'vue'
    import { storeToRefs } from 'pinia';
    const templateStore = useTemplateStore()
    const { subTypeTitle } = storeToRefs(templateStore)

    const emit = defineEmits<{
        'goDetail': [value: any],
        'editorTemplateType': [value: any]
    }>()
    const catalogList = ref([
        {
            name: '子模版',
            id: 1,
            img: '',
            date: '2023-07-11'
        },
        {
            name: '常用模板',
            id: 2,
            img: '',
            date: '2023-08-15'
        },
        {
            name: '系统模板',
            id: 3,
            img: '',
            date: '2023-09-20'
        },
        {
            name: '自定义模板',
            id: 4,
            img: '',
            date: '2023-10-05'
        },
        {
            name: '报表模板',
            id: 5,
            img: '',
            date: '2023-11-01'
        },
        {
            name: '数据分析模板',
            id: 6,
            img: '',
            date: '2023-12-15'
        },
        {
            name: '可视化模板',
            id: 7,
            img: '',
            date: '2024-01-10'
        },
        {
            name: '表单模板',
            id: 8,
            img: '',
            date: '2024-02-01'
        },
        {
            name: '工作流模板',
            id: 9,
            img: '',
            date: '2024-02-15'
        },
        {
            name: '仪表盘模板',
            id: 10,
            img: '',
            date: '2024-03-01'
        }
    ])
    const goTemplates = (item: any) => {
        const k = {
            type: 'templatesList',
            id: item.id
        }
        subTypeTitle.value = item.name
        emit('goDetail', k)
    }

    //编辑
    const editor = (item: any) => {
        const k = {
            type: 'addTemplateSubCatalog',
            id: item.id
        }
        emit('editorTemplateType', k)
    }
</script>

<style lang="scss" scoped>
    .catalog-list {
        list-style: none;
        padding: 0;
        margin: 0;
        background: #fff;
        border-radius: 8px;

    }

    .catalog-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid #f0f0f0;
        transition: all 0.3s ease;
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
</style>