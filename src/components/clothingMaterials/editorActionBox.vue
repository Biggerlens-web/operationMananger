<template>
    <div class="action-box">
        <el-button v-for="item in actionList" :key="item.action" :type="getButtonType(item.action)" :icon="item.icon"
            @click="handleAction(item.action)" class="action-btn">
            {{ item.text }}
        </el-button>
    </div>
</template>

<script lang="ts" setup>
    import { reactive } from 'vue';



    // 定义 emits
    const emit = defineEmits<{
        actionClick: [event: string]
    }>();

    const actionList = reactive<any>([
        {
            text: '批量新增',
            icon: 'Plus',
            action: 'add'
        },
        {
            text: '批量编辑',
            icon: 'Edit',
            action: 'edit'
        },
        // {
        //     text: '批量标签',
        //     icon: 'PriceTag',
        //     action: 'tag'
        // },
        {
            text: '新增素材',
            icon: 'Upload',
            action: 'upload'
        },
        {
            text: "全部选中",
            icon: "Select",
            action: "checkAll"
        },
        {
            text: '批量删除',
            icon: 'Delete',
            action: 'delete'
        },
        // {
        //     text: '保存改动',
        //     icon: 'DocumentChecked',
        //     action: 'save'
        // },
        {
            text: '返回',
            icon: 'ArrowLeft',
            action: 'back'
        }
    ]);

    // 处理按钮点击事件
    const handleAction = (action: string) => {
        emit('actionClick', action);
    };

    // 根据操作类型返回按钮类型
    const getButtonType = (action: string) => {
        switch (action) {
            case 'add':
            case 'upload':
                return 'primary';
            case 'save':
                return 'success';
            case 'delete':
                return 'danger';
            case 'edit':
            case 'tag':
            case 'checkAll':
            default:
                return 'default';
        }
    };

</script>

<style lang="scss" scoped>
    .action-box {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin-bottom: 16px;
        flex-wrap: wrap;

        .action-btn {
            min-width: 100px;
            height: 36px;
            font-size: 14px;
            border-radius: 6px;
            transition: all 0.3s ease;

            &:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            }

            // 响应式设计
            @media (max-width: 768px) {
                min-width: 80px;
                height: 32px;
                font-size: 12px;
            }
        }

        // 响应式设计
        @media (max-width: 768px) {
            padding: 12px;
            gap: 8px;
        }
    }
</style>