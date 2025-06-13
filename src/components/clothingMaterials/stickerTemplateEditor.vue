<template>
  <el-dialog
    :model-value="dialogEditor"
    title="编辑素材模板"
    width="800"
    :before-close="handleClose"
  >
    <div class="form-container">
      <!-- 封面图上传区域 -->
      <div class="upload-section">
        <div class="upload-label">封面大图</div>
        <div class="image-upload-container">
          <el-upload
            class="image-uploader"
            :show-file-list="false"
            action="#"
            :before-upload="handleImageUpload"
          >
            <img v-if="formData.bigUrl" :src="formData.bigUrl" class="uploaded-image" />
            <div v-else class="upload-placeholder">
              <el-icon>
                <Plus />
              </el-icon>
              <span>点击上传封面图</span>
            </div>
          </el-upload>
          <el-button
            v-if="formData.bigUrl"
            type="danger"
            size="small"
            class="delete-image-btn"
            @click="removeCoverImage"
          >
            <el-icon>
              <Delete />
            </el-icon>
            删除
          </el-button>
        </div>
      </div>

      <!-- 表单内容区域 -->
      <div class="form-content">
        <!-- 小图上传区域 -->
        <div class="form-item">
          <span class="label">封面小图</span>
          <div class="small-images-container">
            <div class="small-images-grid">
              <div v-if="formData.smallUrl" class="small-image-item">
                <img :src="formData.smallUrl" alt="小图" class="small-image" />
                <div class="image-overlay">
                  <el-icon class="delete-icon" @click="removeSmallImage()">
                    <Delete />
                  </el-icon>
                </div>
              </div>
              <el-upload
                v-if="!formData.smallUrl"
                class="small-image-uploader"
                :show-file-list="false"
                action="#"
                :before-upload="handleSmallImageUpload"
              >
                <div class="upload-small-placeholder">
                  <el-icon>
                    <Plus />
                  </el-icon>
                </div>
              </el-upload>
            </div>
          </div>
        </div>

        <!-- 样式选择区域 -->
        <div class="form-item">
          <span class="label">样式</span>
          <el-input-number v-model="formData.style" />
        </div>
        <!-- 描述输入区域 -->
        <div class="form-item">
          <span class="label">关键字</span>
          <el-input
            v-model="formData.keyword"
            type="text"
            placeholder="请输入关键字"
            class="form-input"
          ></el-input>
        </div>

        <!-- 是否付费选择区域 -->
        <div class="form-item">
          <span class="label">是否付费</span>
          <el-switch
            v-model="formData.pay"
            :active-value="1"
            :inactive-value="0"
            active-text="付费"
            inactive-text="免费"
          ></el-switch>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, render, watch } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import { desEncrypt } from '@/utils/des'
import service from '@/axios'
const route = useRoute()
interface FormData {
  id: any
  clothingMaterialsId: any //父级id
  style: number //样式

  bigUrl: string //大图
  smallUrl: string //小图
  keyword: string //关键词
  pay: number //是否付费
}

const props = defineProps<{
  dialogEditor: boolean
  editData?: FormData
}>()

const emit = defineEmits<{
  'update:dialogEditor': [value: boolean]
  confirm: [data: FormData]
}>()

// 表单数据
const formData = reactive<FormData>({
  id: '',
  style: 0,
  clothingMaterialsId: parseInt(route.query.id as string) || '',
  bigUrl: '',
  smallUrl: '',
  keyword: '',
  pay: 0,
})

// 处理关闭
const handleClose = () => {
  resetForm()
  emit('update:dialogEditor', false)
}

// 处理确认
const saveMaterial = async () => {
  try {
    const params = {
      id: formData.id,
      clothingMaterialsId: formData.clothingMaterialsId,
      style: formData.style,
      bigUrl: formData.bigUrl.split(',')[1],
      smallUrl: formData.smallUrl.split(',')[1],
      keyword: formData.keyword,
      pay: formData.pay,
      timestamp: Date.now(),
    }

    console.log('参数', params)
    const enData = desEncrypt(JSON.stringify(params))
    const res = await service.post('/clothingMaterialsDetail/save', {
      enData,
    })
    console.log('保存成功', res)
    if (res.data.code === 200) {
      ElMessage.success('保存成功')
      return true
    } else {
      ElMessage.error(res.data.msg)
      return false
    }
  } catch (err) {
    console.log('保存失败', err)
    return false
  }
}
const handleConfirm = async () => {
  if (!formData.style) {
    ElMessage.warning('请选择样式')
    return
  }
  if (!formData.bigUrl) {
    ElMessage.warning('请上传封面图')
    return
  }

  const isSuccess = await saveMaterial()
  if (isSuccess) {
    handleClose()
  }
}

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    id: '',
    clothingMaterialsId: parseInt(route.query.id as string) || '',

    style: '',

    bigUrl: '',
    smallUrl: '',
    keyword: '',

    pay: 0,
  })
}

// 处理封面图上传
const handleImageUpload = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    formData.bigUrl = e.target?.result as string
  }
  reader.readAsDataURL(file)
  return false // 阻止自动上传
}

// 处理小图上传
const handleSmallImageUpload = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    formData.smallUrl = e.target?.result as string
  }
  reader.readAsDataURL(file)
  return false // 阻止自动上传
}

// 删除小图
const removeSmallImage = () => {
  formData.smallUrl = ''
}

// 删除封面图
const removeCoverImage = () => {
  formData.smallUrl = ''
}

// 监听对话框打开状态和编辑数据变化
watch(
  () => props.dialogEditor,
  async (isOpen) => {
    if (isOpen && props.editData) {
      // 对话框打开时，如果有编辑数据则回显
      Object.assign(formData, {
        id: props.editData.id || 0,
        style: props.editData.style || 0,
        clothingMaterialsId:
          props.editData.clothingMaterialsId || parseInt(route.query.id as string),
        bigUrl: props.editData.bigUrl ? props.editData.bigUrl : '',
        smallUrl: props.editData.smallUrl ? props.editData.smallUrl : '',
        keyword: props.editData.keyword || '',
        pay: props.editData.pay === undefined ? 0 : props.editData.pay,
      })

      if (formData.bigUrl) {
        try {
          const res = await fetch(formData.bigUrl)
          const blob = await res.blob()
          const fileName = 'smallIMg' + Date.now()
          const file = new File([blob], fileName, { type: blob.type })
          const render = new FileReader()
          render.onload = (e) => {
            formData.bigUrl = e.target?.result as string
          }
          render.readAsDataURL(file)
        } catch (err) {
          formData.bigUrl = ''
          console.log('获取图片失败', err)
        }
      }
      if (formData.smallUrl) {
        try {
          const res = await fetch(formData.smallUrl)
          const blob = await res.blob()
          const fileName = 'smallIMg' + Date.now()
          const file = new File([blob], fileName, { type: blob.type })
          const render = new FileReader()
          render.onload = (e) => {
            formData.smallUrl = e.target?.result as string
          }
          render.readAsDataURL(file)
        } catch (err) {
          formData.smallUrl = ''
          console.log('获取图片失败', err)
        }
      }
    } else if (!isOpen) {
      // 对话框关闭时不立即重置，由handleClose处理
    }
  },
  { immediate: true },
)

// 监听编辑数据变化（当对话框已打开时）
watch(
  () => props.editData,
  (newData) => {
    if (newData && props.dialogEditor) {
      Object.assign(formData, {
        id: newData.id || 0,
        style: newData.style || 0,
        clothingMaterialsId: newData.clothingMaterialsId || parseInt(route.query.id as string),
        bigUrl: newData.bigUrl
          ? newData.bigUrl.startsWith('data:image')
            ? newData.bigUrl
            : `data:image/png;base64,${newData.bigUrl}`
          : '',
        smallUrl: newData.smallUrl
          ? newData.smallUrl.startsWith('data:image')
            ? newData.smallUrl
            : `data:image/png;base64,${newData.smallUrl}`
          : '',
        keyword: newData.keyword || '',
        pay: newData.pay === undefined ? 0 : newData.pay,
      })
    }
  },
  { deep: true },
)
</script>

<style lang="scss" scoped>
.form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
}

/* 上传区域样式 */
.upload-section {
  margin-bottom: 30px;
}

.upload-label {
  font-size: 14px;
  color: var(--el-text-color-regular);
  font-weight: 500;
  margin-bottom: 12px;
}

.image-upload-container {
  position: relative;
  display: inline-block;
  width: 100%;
}

.image-uploader {
  width: 100%;
}

.delete-image-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-upload-container:hover .delete-image-btn {
  opacity: 1;
}

.image-uploader :deep(.el-upload) {
  width: 100%;
  border: 2px dashed var(--el-border-color);
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration);
}

.image-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.uploaded-image {
  width: 100%;
  height: 200px;
  object-fit: contain;
  border-radius: 6px;
  background-color: #f5f7fa;
}

.upload-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-secondary);
}

.upload-placeholder .el-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

/* 表单项样式 */
.form-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.label {
  min-width: 80px;
  // padding-top: 0px;
  color: var(--el-text-color-regular);
  font-weight: 500;
  flex-shrink: 0;
}

.form-input {
  flex: 1;
}

/* 大小选择样式 */
.size-radio-group {
  display: flex;
  gap: 16px;
}

.size-radio {
  margin-right: 0;
}

/* 小图上传区域样式 */
.small-images-container {
  flex: 1;
}

.small-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 12px;
  max-width: 500px;
}

.small-image-item {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--el-border-color);
}

.small-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.small-image-item:hover .image-overlay {
  opacity: 1;
}

.delete-icon {
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}

.delete-icon:hover {
  color: var(--el-color-danger);
}

.small-image-uploader {
  width: 80px;
  height: 80px;
}

.small-image-uploader :deep(.el-upload) {
  width: 100%;
  height: 100%;
  border: 2px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--el-transition-duration);
}

.small-image-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.upload-small-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-secondary);
}

.upload-small-placeholder .el-icon {
  font-size: 20px;
}

/* 对话框底部样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
