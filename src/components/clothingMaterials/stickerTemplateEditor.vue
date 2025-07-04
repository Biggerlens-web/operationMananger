<template>
  <el-dialog :model-value="dialogEditor" title="编辑素材模板" width="800" :before-close="handleClose">
    <div class="form-container">
      <!-- 封面图上传区域 -->
      <div class="upload-section">
        <div class="upload-label">{{ route.query.type === 'template' ? '背景图' : '封面大图' }}
        </div>
        <div class="image-upload-container">
          <el-upload class="image-uploader" :show-file-list="false" action="#" :before-upload="handleImageUpload">
            <img v-if="formData.bigUrl" :src="formData.bigUrl" class="uploaded-image" />
            <div v-else class="upload-placeholder">
              <el-icon>
                <Plus />
              </el-icon>
              <span>点击上传图片</span>
            </div>
          </el-upload>
          <el-button v-if="formData.bigUrl" type="danger" size="small" class="delete-image-btn"
            @click="removeCoverImage">
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
          <span class="label">{{ route.query.type === 'template' ? '封面图' : '封面小图' }}</span>
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
              <el-upload v-if="!formData.smallUrl" class="small-image-uploader" :show-file-list="false" action="#"
                :before-upload="handleSmallImageUpload">
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
        <div class="form-item" v-if="route.query.type !== 'template'">
          <span class="label">样式</span>
          <el-input-number v-model="formData.style" />
        </div>
        <div class="form-item" v-if="route.query.type === 'template'">
          <span class="label">宽</span>
          <el-input v-model="formData.backgroundWidth" type="text" placeholder="请输入宽" class="form-input"></el-input>
        </div>
        <div class="form-item" v-if="route.query.type === 'template'">
          <span class="label">高</span>
          <el-input v-model="formData.backgroundHeight" type="text" placeholder="请输入高" class="form-input"></el-input>
        </div>
        <div class="form-item" v-if="route.query.type === 'template'">
          <span class="label">版本号</span>
          <el-input v-model="formData.version" type="text" placeholder="请输入版本号" class="form-input"></el-input>
        </div>
        <!-- 描述输入区域 -->
        <div class="form-item">
          <span class="label">关键字</span>
          <el-input v-model="formData.keyword" type="text" placeholder="请输入关键字" class="form-input"></el-input>
        </div>

        <!-- 是否付费选择区域 -->
        <div class="form-item">
          <span class="label">是否付费</span>
          <el-switch v-model="formData.isPay" :active-value="true" :inactive-value="false" active-text="付费"
            inactive-text="免费"></el-switch>
        </div>

        <div class="form-item" v-if="route.query.type === 'template'">
          <span class="label">是否推荐模板</span>
          <el-switch v-model="formData.isRecommend" :active-value="true" :inactive-value="false" active-text="是"
            inactive-text="否"></el-switch>
        </div>
        <div class="form-item" v-if="route.query.type === 'mask'">
          <span class="label">是否VIP资源</span>
          <el-switch v-model="formData.isVip" :active-value="true" :inactive-value="false" active-text="是"
            inactive-text="否"></el-switch>
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
  import { onMounted, reactive, ref, render, version, watch } from 'vue'
  import { Plus, Delete } from '@element-plus/icons-vue'
  import { ElMessage, formProps } from 'element-plus'
  import { useRoute } from 'vue-router'
  import { desEncrypt } from '@/utils/des'
  import service from '@/axios'
  import { useCounterStore } from '@/stores/counter'
  import { storeToRefs } from 'pinia'
  const route = useRoute()
  const counterStore = useCounterStore()
  const { changeSChildTemplate } = counterStore
  const { showLoading } = storeToRefs(counterStore)
  const props = defineProps<{
    dialogEditor: boolean
    editData?: any
    isAddChild?: any
  }>()

  const emit = defineEmits<{
    'update:dialogEditor': [value: boolean]
    confirm: [data: any]
  }>()

  // 表单数据
  const formData = reactive<any>({
    id: '',
    style: 0,

    smallUrl: '',
    keyword: '',
    isPay: false,
    backgroundWidth: 0,
    backgroundHeight: 0,
    version: '',
    isRecommend: false,
    isVip: false,
  })
  const initFormData = () => {
    const { type } = route.query
    if (type === 'sitcker') {
      formData.stickerId = parseInt(route.query.id as string) || ''
    } else if (type === 'clothing') {
      formData.clothingMaterialsId = parseInt(route.query.id as string) || ''
    } else if (type === 'background') {
      formData.backgroundId = parseInt(route.query.id as string) || ''
    } else if (type === 'template') {
      formData.templateUpId = parseInt(route.query.id as string) || ''
    } else if (type === 'mask') {
      formData.maskId = parseInt(route.query.id as string) || ''
    } else if (type === 'wallpapper') {
      formData.wallpaperId = parseInt(route.query.id as string) || ''
    }
  }
  onMounted(() => {
    initFormData()
  })
  // 处理关闭
  const handleClose = () => {
    resetForm()
    emit('update:dialogEditor', false)
  }

  // 处理确认

  const saveMaterial = async () => {
    try {
      if (showLoading.value) {
        ElMessage.warning('正在保存。。。');
        return
      }
      const { type } = route.query
      let params: any = {
        id: formData.id,
        style: formData.style,
        bigUrl: formData.bigUrl.includes('http') ? formData.bigUrl : formData.bigUrl.split(',')[1],
        smallUrl: formData.smallUrl.includes('http') ? formData.smallUrl : formData.smallUrl.split(',')[1],
        keyword: formData.keyword,
        isPay: formData.isPay,
        timestamp: Date.now(),
      }
      if (formData.bigUrl.includes('http')) {
        params.bigName = props.editData?.bigName
      }
      if (formData.smallUrl.includes('http')) {
        params.smallName = props.editData?.smallName
      }
      let url: string = ''
      if (type === 'sitcker') {
        url = '/stickerDetail/save'
        params.stickerId = formData.stickerId
        params.type = formData.id ? 'update' : 'add'
      } else if (type === 'clothing') {
        url = '/clothingMaterialsDetail/save'
        params.clothingMaterialsId = formData.clothingMaterialsId
      } else if (type === 'background') {
        url = '/backgroundDetail/save'
        params.type = formData.id ? 'update' : 'add'
        params.backId = formData.backgroundId
      } else if (type === 'template') {
        url = '/templateUpDetail/save'
        params = {
          timestamp: Date.now(),
          type: formData.id ? 'update' : 'add',
          templateUpId: formData.templateUpId,
          backgroundWidth: parseInt(formData.backgroundWidth),
          backgroundHeight: parseInt(formData.backgroundHeight),
          backgroundImage: formData.bigUrl.includes('http') ? formData.bigUrl : formData.bigUrl.split(',')[1],
          coverImage: formData.smallUrl.includes('http') ? formData.smallUrl : formData.smallUrl.split(',')[1],
          version: formData.version,
          keyword: formData.keyword,
          isPay: formData.isPay,
          templateType: props.isAddChild ? 2 : 1,
          templateParentId: props.isAddChild,
          isRecommend: formData.isRecommend,
          id: formData.id,
          backgroundImageName: props.editData?.backgroundImageName || null
        }
      } else if (type === 'mask') {
        url = '/maskDetail/save'
        params.type = formData.id ? 'update' : 'add'
        params.maskId = formData.maskId
        params.isVip = formData.isVip
      } else if (type === 'wallpapper') {
        url = '/wallpaperDetail/save'
        params.type = formData.id ? 'update' : 'add'
        params.wallpaperId = formData.wallpaperId
      }

      console.log('参数', params)
      const enData = desEncrypt(JSON.stringify(params))
      showLoading.value = true
      const res = await service.post(url, {
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
    } finally {
      showLoading.value = false
    }
  }


  const handleConfirm = async () => {

    if (!formData.bigUrl) {
      ElMessage.warning('请上传封面图')
      return
    }

    const isSuccess = await saveMaterial()
    if (isSuccess) {
      handleClose()
      if (props.isAddChild)
        changeSChildTemplate(true)
    }
  }

  // 重置表单
  const resetForm = () => {
    Object.assign(formData, {
      id: '',
      style: 0,

      smallUrl: '',
      keyword: '',
      isPay: false,
      backgroundWidth: 0,
      backgroundHeight: 0,
      version: '',
      isRecommend: false,
      isVip: false,
    })
    console.log('格式化数据');
    initFormData()
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
    formData.bigUrl = ''
  }

  // 监听对话框打开状态和编辑数据变化
  watch(
    () => props.dialogEditor,
    async (isOpen) => {
      if (isOpen && props.editData) {

        // 对话框打开时，如果有编辑数据则回显
        if (route.query.type !== 'template') {
          Object.assign(formData, {
            id: props.editData.id || 0,
            style: props.editData.style || 0,
            clothingMaterialsId:
              props.editData.clothingMaterialsId || parseInt(route.query.id as string),
            bigUrl: props.editData.bigUrl ? props.editData.bigUrl : '',
            smallUrl: props.editData.smallUrl ? props.editData.smallUrl : '',
            keyword: props.editData.keyword || '',
            isPay: props.editData.isPay === undefined ? false : props.editData.isPay,
            isVip: props.editData.isVip || false,

          })
        } else {

          Object.assign(formData, {
            id: props.editData.id || 0,
            style: props.editData.style || 0,
            clothingMaterialsId:
              props.editData.clothingMaterialsId || parseInt(route.query.id as string),
            bigUrl: props.editData.backgroundUrl ? props.editData.backgroundUrl : '',
            smallUrl: props.editData.coverUrl ? props.editData.coverUrl : '',
            keyword: props.editData.keyword || '',
            isPay: props.editData.isPay,
            backgroundWidth: props.editData.backgroundWidth || 0,
            backgroundHeight: props.editData.backgroundHeight || 0,
            version: props.editData.version || '',
            isRecommend: props.editData.isRecommend || false,

          })
          console.log('formData', formData);
        }



      } else if (!isOpen) {

      }
    },
    { immediate: true },
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
