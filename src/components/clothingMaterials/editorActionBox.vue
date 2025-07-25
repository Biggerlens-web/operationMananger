<template>
  <div class="action-box" ref="actionBox" @mousedown="dragStart" @mouseup="dragEnd">
    <template v-for="item in actionList" :key="item.action">
      <el-badge :is-dot="item.action === 'save' && hasUnsavedChanges" class="action-item-badge">
        <el-button :type="getButtonType(item.action)" :icon="item.icon" @click="handleAction(item.action)"
          class="action-btn">
          {{ item.text }}
        </el-button>
      </el-badge>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import { useCounterStore } from '@/stores/counter'
  import { storeToRefs } from 'pinia';
  import { useRoute } from 'vue-router';
  const stores = useCounterStore()
  const { operationClass } = storeToRefs(stores)



  const actionBox = ref<HTMLElement>()
  const isDragging = ref<boolean>(false)
  const elementSize = ref<{ width: number, height: number }>({
    width: 0,
    height: 0
  })
  const dragOffSet = ref<{ x: number, y: number }>(
    {
      x: 0,
      y: 0
    }
  )
  const dragStart = (e: MouseEvent) => {
    if (actionBox.value) {
      const rect = actionBox.value.getBoundingClientRect()
      elementSize.value.width = rect.width
      elementSize.value.height = rect.height
      actionBox.value.style.right = 'auto'
      actionBox.value.style.bottom = 'auto'
      actionBox.value.style.left = rect.left + 'px'
      actionBox.value.style.top = rect.top + 'px'
      dragOffSet.value.x = e.clientX - rect.left
      dragOffSet.value.y = e.clientY - rect.top

      document.body.style.userSelect = 'none'
      isDragging.value = true
      window.addEventListener('mousemove', dragMove)
    }
  }

  const dragMove = (e: MouseEvent) => {
    if (isDragging.value && actionBox.value) {
      const newX = Math.max(0, Math.min(e.clientX - dragOffSet.value.x, window.innerWidth - elementSize.value.width))
      const newY = Math.max(0, Math.min(e.clientY - dragOffSet.value.y, window.innerHeight - elementSize.value.height))
      actionBox.value.style.left = `${newX}px`
      actionBox.value.style.top = `${newY}px`
    }
  }

  const dragEnd = () => {
    isDragging.value = false
    document.body.style.userSelect = ''
    window.removeEventListener('mousemove', dragMove)

  }



  // 定义 props
  const props = defineProps<{
    hasUnsavedChanges?: boolean
  }>()

  // 定义 emits
  const emit = defineEmits<{
    actionClick: [event: string]
  }>()

  const route = useRoute()
  onMounted(() => {
    if (route.query.type === 'template') {

      if (operationClass.value !== 0) {
        actionList.value = actionList.value.filter((item: any) => item.operationClass !== 0)

      }
      actionList.value = actionList.value.filter((item: any) => item.text !== '批量新增')
    } else {
      actionList.value = actionList.value.filter((item: any) => !item.isTemplate)
      if (route.query.type === 'shape') {
        actionList.value = actionList.value.filter((item: any) => item.text !== '批量标签')
      }
      if (operationClass.value !== 0) {
        actionList.value = actionList.value.filter((item: any) => item.operationClass !== 0)
      }
      if (route.query.type === 'otherMaterial') {
        actionList.value = actionList.value.filter((item: any) => item.text !== '导出')
      }
    }


  })
  const actionList = ref<any>([
    {
      text: '公共空间',
      icon: 'FolderOpened',
      operationClass: 0,
      action: 'public',
      isTemplate: true
    },
    {
      text: '批量新增',
      icon: 'Plus',
      action: 'add',
      operationClass: 0
    },
    {
      text: '批量编辑',
      icon: 'Edit',
      action: 'edit',
      operationClass: 0
    },
    {
      text: '批量标签',
      icon: 'PriceTag',
      action: 'tag',
      operationClass: 0
    },
    {
      text: '新增素材',
      icon: 'Upload',
      action: 'upload',
      operationClass: 0
    },
    {
      text: '全部选中',
      icon: 'Select',
      action: 'checkAll',

    },
    {
      text: '批量删除',
      icon: 'Delete',
      action: 'delete',
    },
    {
      text: '保存改动',
      icon: 'DocumentChecked',
      action: 'save',
    },
    {
      text: '导出',
      icon: 'Upload',
      action: 'export',

    },

    {
      text: '推送',
      icon: '',
      action: 'push',
      isTemplate: true,
      operationClass: 0
    },
    {
      text: '不推送',
      icon: '',
      action: 'noPush',
      isTemplate: true,
      operationClass: 0
    },

    {
      text: '返回',
      icon: 'ArrowLeft',
      action: 'back',
    },
  ])

  // 处理按钮点击事件
  const handleAction = (action: string) => {
    emit('actionClick', action)
  }

  // 根据操作类型返回按钮类型
  const getButtonType = (action: string) => {
    switch (action) {
      case 'add':
      case 'upload':
        return 'primary'
      case 'save':
        return 'success'
      case 'delete':
        return 'danger'
      case 'edit':
      case 'tag':
      case 'checkAll':
      default:
        return 'default'
    }
  }
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
    cursor: grab;

    .action-item-badge {
      // 如果需要，可以为 el-badge 添加特定样式
      // 例如，确保按钮在 badge 内部正确对齐
      display: inline-flex; // 或者 block, flex, etc. 根据布局需求
    }

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
