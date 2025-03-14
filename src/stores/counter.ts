import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore(
  'counter',
  () => {
    const userName = ref<string>('') //用户名
    const userAvatar = ref<string>('') //用户头像
    const appList = ref<any>([]) // 应用列表
    const channelList = ref<any>([]) // 渠道列表
    const OSlist = ref<any>([]) // 系统列表
    const menuList = ref<any>([]) // 菜单列表
    const showPagestion = ref<boolean>(true) // 是否显示分页

    return {
      appList,
      userName,
      userAvatar,
      menuList,
      showPagestion,
      channelList,
      OSlist,
    }
  },
  {
    persist: {
      key: 'counter',
      storage: localStorage,
    },
  },
)
