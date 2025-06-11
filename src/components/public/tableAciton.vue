<template>
    <ul class="action-list">
        <li class="action-item" :class="{ active: activeAction === 'switch' }" @click="setActiveAction('switch')">
            <el-icon>
                <Switch />
            </el-icon>

        </li>
        <li class="action-item" :class="{ active: activeAction === 'refresh' }" @click="setActiveAction('refresh')">
            <el-icon>
                <Refresh />
            </el-icon>

        </li>
        <li class="action-item" :class="{ active: activeAction === 'fold' }" @click="setActiveAction('fold')">
            <el-icon>
                <Fold />
            </el-icon>

        </li>
        <li class="action-item" :class="{ active: activeAction === 'grid' }">
            <el-dropdown :hide-on-click="false">
                <el-icon>
                    <Grid />
                </el-icon>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item v-for="item in filterParams" :key="item.note">
                            <el-checkbox @change="checkFn(item)" @click.stop v-model="item.isShow" :label="item.note" />
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>

        </li>
    </ul>
</template>

<script setup lang="ts">
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue'
    const props = defineProps<{
        filterParams: any
    }>()
    const emits = defineEmits<{
        'update': [],
        'checkedParams': [value: any],
        'changeView': []
    }>()
    const counterStore = useCounterStore()
    const { showPagestion } = storeToRefs(counterStore)
    // 当前激活的操作
    const activeAction = ref('')

    // 设置激活的操作
    const setActiveAction = (action: string) => {

        activeAction.value = activeAction.value === action ? '' : action
        // 这里可以添加操作的具体逻辑
        if (action === 'refresh') {
            // 触发更新事件
            emits('update')
        } else if (action === 'switch') {
            // 切换分页
            showPagestion.value = !showPagestion.value
        } else {
            //列表/表格
            emits('changeView')
        }

    }
    const checkFn = (item: any) => {
        console.log('object', props.filterParams);
        // 触发更新事件
        const obj = {
            key: item.key,
            checked: item.isShow
        }
        emits('checkedParams', obj);
    }
</script>

<style scoped>
    .action-list {
        width: max-content;
        display: flex;
        list-style: none;
        padding: 0;
        margin: 0;
        background-color: #f5f7fa;
        border-radius: 8px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }

    .action-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        margin: 5px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .action-item:hover {
        background-color: #ecf5ff;
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }



    .action-item .el-icon {
        font-size: 18px;
        transition: all 0.3s ease;
    }

    .action-item:hover .el-icon {
        transform: scale(1.2);
    }

    .action-item.active .el-icon {
        transform: scale(1.2);
    }

    /* 工具提示 */
    .action-tooltip {
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #303133;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        white-space: nowrap;
    }

    .action-tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-width: 5px;
        border-style: solid;
        border-color: #303133 transparent transparent transparent;
    }

    .action-item:hover .action-tooltip {
        opacity: 1;
        visibility: visible;
        top: -35px;
    }

    /* 添加分隔线 */
    .action-item:not(:last-child)::after {
        content: '';
        position: absolute;
        right: -5px;
        height: 20px;
        width: 1px;
        background-color: #e0e0e0;
    }
</style>