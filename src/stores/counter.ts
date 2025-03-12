import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore(
  'counter',
  () => {
    const userName = ref<string>('') //用户名
    const userAvatar = ref<string>('') //用户头像
    const appList = ref<any>([
      { id: 1, name: '123123' },
      { id: 2, name: '123123' },
      { id: 3, name: '123123' },
      { id: 4, name: '123123' },
      { id: 5, name: '123123' },
      { id: 6, name: '123123' },
      { id: 7, name: '123123' },
      { id: 8, name: '123123' },
      { id: 9, name: '123123' },
      { id: 10, name: '123123' },
    ]) // 应用列表
    return { appList, userName, userAvatar }
  },
  {
    persist: {
      key: 'counter',
      storage: sessionStorage,
    },
  },
)
