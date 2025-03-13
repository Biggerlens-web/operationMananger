import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useAutoOpration = defineStore('autoOpration', () => {
  const JSONEditorValue = ref<any>({}) //编辑JSON配置
  const JSONEditorNote = ref<any>({}) //编辑JSON备注

  return {
    JSONEditorValue,
    JSONEditorNote,
  }
})
