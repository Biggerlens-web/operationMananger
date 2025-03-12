import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useTemplateStore = defineStore(
  'useTemplateStore',
  () => {
    const typeTitle = ref<string>('类目管理') //标题
    const subTypeTitle = ref<string>('') //子标题
    const activeCataType = ref<string>('catalogList') //激活目录类型
    const activeCalaId = ref<number | string>() //激活目录id
    const activeSubId = ref<number | string>() //激活子目录id
    const addTemplateMark = ref<boolean>(false) //添加模板标记
    return {
      activeCataType,
      activeCalaId,
      activeSubId,
      typeTitle,
      subTypeTitle,
      addTemplateMark,
    }
  },
  {
    persist: {
      key: 'useTemplateStore',
      storage: sessionStorage,
    },
  },
)
