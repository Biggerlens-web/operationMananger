import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore(
  'counter',
  () => {
    const userName = ref<string>('') //用户名
    const userAvatar = ref<string>('') //用户头像
    const appList = ref<any>([]) // 应用列表
    const menuList = ref<any>([]) // 菜单列表
    return { appList, userName, userAvatar, menuList }
  },
  {
    persist: {
      key: 'counter',
      storage: sessionStorage,
    },
  },
)
