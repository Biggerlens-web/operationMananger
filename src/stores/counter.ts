import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore(
  'counter',
  () => {
    const regionList = reactive<any>([
      {
        label: '国内',
        value: 'domestic',
      },
      {
        label: '国外',
        value: 'foreign',
      },
    ]) //地域列表
    const international = ref<any>() //国际化信息
    const userName = ref<string>('') //用户名
    const userAvatar = ref<string>('') //用户头像
    const appList = ref<any>([]) // 应用列表
    const channelList = ref<any>([]) // 渠道列表
    const OSlist = ref<any>([]) // 系统列表
    const menuList = ref<any>([]) // 菜单列表
    const showPagestion = ref<boolean>(true) // 是否显示分页
    const operationClass = ref<any>() // 操作分类
    const tagList = ref<any>([]) // 标签列表
    const clothFliterParams = ref<any>({}) // 服装筛选参数
    return {
      appList,
      userName,
      userAvatar,
      menuList,
      showPagestion,
      channelList,
      OSlist,
      international,
      regionList,
      operationClass,
      tagList,
      clothFliterParams,
    }
  },
  {
    persist: {
      key: 'counter',
      storage: localStorage,
    },
  },
)
