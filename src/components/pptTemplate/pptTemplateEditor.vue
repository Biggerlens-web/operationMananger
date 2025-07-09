<template>
    <el-dialog :model-value="dialogEditor" title="编辑模板" width="800" :before-close="handleClose">
        <div class="form-container">
            <el-dialog v-model="isAddKeyword" title="编辑关键词" width="500">
                <el-form ref="keywordFormEl" :model="keywordForm" :rules="rules" label-width="auto"
                    class="demo-FormData" status-icon>
                    <el-form-item label="关键词" prop="name">
                        <el-input v-model="keywordForm.keyword" placeholder="请输入关键词"></el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="isAddKeyword = false">取消</el-button>
                        <el-button type="primary" @click="confirmKeyword(keywordFormEl)">
                            确定
                        </el-button>
                    </div>
                </template>
            </el-dialog>
            <!-- 封面图上传区域 -->
            <div class="upload-section">
                <el-upload class="image-uploader" :show-file-list="false" action="#">
                    <img v-if="formData.img" :src="formData.img" class="uploaded-image" />
                    <div v-else class="upload-placeholder">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        <span>点击上传封面图</span>
                    </div>
                </el-upload>
            </div>
            <draggable tag="ul" item-key="id" v-model="imageList" :animation="200" class="image-template-grid"
                ghost-class="ghost-class" chosen-class="chosen-class" drag-class="dragging-class"
                :group="{ name: 'items' }" @start="onDragStart" @end="onDragEnd">

                <template #item="{ element, index }">
                    <li :key="element.id" class="image-template-item">
                        <img :src="element" alt="">
                    </li>
                </template>

            </draggable>
            <!-- 表单内容区域 -->
            <div class="form-content">
                <!-- 名称输入区域 -->
                <div class="form-item">
                    <span class="label">中文</span>
                    <el-input v-model="formData.name_zh" placeholder="请输入中文名称" class="form-input"></el-input>
                </div>

                <div class="form-item">
                    <span class="label">英文</span>
                    <el-input v-model="formData.name_en" placeholder="请输入英文名称" class="form-input"></el-input>
                </div>

                <!-- 关键词展示区域 -->
                <div class="form-item">
                    <span class="label">中文关键词</span>
                    <div class="keywords-wrapper">
                        <ul class="keywords-list">
                            <li v-for="(item, index) in formData.keywords_zh" :key="item.id" class="keyword-tag">
                                {{ item.label }}
                                <el-icon class="delete-icon" @click="removeKeyword('zh', index)">
                                    <Close />
                                </el-icon>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="form-item">
                    <span class="label">英文关键词</span>
                    <div class="keywords-wrapper">
                        <ul class="keywords-list">
                            <li v-for="(item, index) in formData.keywords_en" :key="item.id" class="keyword-tag">
                                {{ item.label }}
                                <el-icon class="delete-icon" @click="removeKeyword('en', index)">
                                    <Close />
                                </el-icon>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- 关键词选择区域 -->
                <div class="form-item">
                    <span class="label">关键词选择</span>

                    <div class="keywords-wrapper">
                        <el-dropdown>
                            <span class="el-dropdown-link">
                                {{ keywords_lang === 'zh' ? '中文' : '英文' }}
                                <el-icon class="el-icon--right">
                                    <arrow-down />
                                </el-icon>
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item v-for="item in keywordslang_list" :key="item.value"
                                        @click="chosedLang(item)">
                                        {{ item.label }}


                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                        <ul class="keywords-list selectable">
                            <li class="keyword-add" @click="showKeywordDialog">
                                <el-icon>
                                    <Plus />
                                </el-icon>
                            </li>
                            <li v-for="item in keywordsList" :key="item" class="keyword-tag selectable"
                                :class="{ activeClass: item.active }" @click="selectKeyword(item)">
                                {{ item.label }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleComfirm">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    import draggable from 'vuedraggable'
    import { reactive, ref, watch } from 'vue';
    const props = defineProps<{
        dialogEditor: boolean
    }>()
    const emit = defineEmits<{
        'update:dialogEditor': [value: boolean]
    }>()

    const handleClose = () => {
        emit('update:dialogEditor', false)
    }
    const handleComfirm = () => {
        handleClose()
    }
    const keywords_lang = ref<string>('zh')
    const keywordslang_list = reactive<{ label: string, value: string }[]>([
        {
            label: '中文',
            value: 'zh'
        },
        {
            label: '英文',
            value: 'en'
        }
    ])
    const chosedLang = (item: any) => {
        if (keywords_lang.value === item.value) return
        keywords_lang.value = item.value

    }
    interface Ketword {
        label: string;
        id: number | string;
    }
    interface FormData {
        name_en: string;
        name_zh: string;
        keywords_en: Ketword[];
        keywords_zh: Ketword[];
        img: string;
    }
    const formData = reactive<FormData>({
        name_en: '',
        name_zh: '',
        keywords_en: [],
        keywords_zh: [],
        img: ''
    })

    const imageList = ref<any>([
        "https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1576158114254-3b5c8bf8650a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1511300636408-a63a89df3482?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1496449903678-68ddcb189a24?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1587583650088-9451513b7b5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1558788353-f76d92427f16?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1568572933382-74d440642117?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ])



    //修改预览模板顺序
    const onDragStart = (e: any) => {
        console.log('开始拖动', e);

    }
    //结束拖动
    const onDragEnd = (e: any) => {
        console.log('结束拖动', e);

    }


    const keywordsList = ref<any>([

    ])

    const keywordsList_zh = ref<any>([
        {
            label: '图书1',
            id: 1
        },
        {
            label: '图书2',
            id: 2
        },
        {
            label: '杂志1',
            id: 3
        },
        {
            label: '杂志2',
            id: 4
        },
        {
            label: '报纸1',
            id: 5
        },
        {
            label: '报纸2',
            id: 6
        },
        {
            label: '文章1',
            id: 7
        },
        {
            label: '文章2',
            id: 8
        },
        {
            label: '期刊1',
            id: 9
        },
        {
            label: '期刊2',
            id: 10
        },
        {
            label: '小说1',
            id: 11
        },
        {
            label: '小说2',
            id: 12
        },
        {
            label: '故事1',
            id: 13
        },
        {
            label: '故事2',
            id: 14
        },
        {
            label: '散文1',
            id: 15
        },
        {
            label: '散文2',
            id: 16
        }
    ])

    const keywordsList_en = ref<any>([
        {
            label: 'book1',
            id: 1
        },
        {
            label: 'book2',
            id: 2
        },
        {
            label: 'magazine1',
            id: 3
        },
        {
            label: 'magazine2',
            id: 4
        },
        {
            label: 'newspaper1',
            id: 5
        },
        {
            label: 'newspaper2',
            id: 6
        },
        {
            label: 'article1',
            id: 7
        },
        {
            label: 'article2',
            id: 8
        },
        {
            label: 'journal1',
            id: 9
        },
        {
            label: 'journal2',
            id: 10
        },
        {
            label: 'novel1',
            id: 11
        },
        {
            label: 'novel2',
            id: 12
        },
        {
            label: 'story1',
            id: 13
        },
        {
            label: 'story2',
            id: 14
        },
        {
            label: 'essay1',
            id: 15
        },
        {
            label: 'essay2',
            id: 16
        }
    ])


    //移出关键词
    const removeKeyword = (lang: string, index: number) => {
        if (lang === 'zh') {
            formData.keywords_zh.splice(index, 1)
        } else {
            formData.keywords_en.splice(index, 1)
        }
        keywordActive()
    }
    //选择关键词
    const selectKeyword = (item: any) => {

        if (keywords_lang.value === 'zh') {
            const index = formData.keywords_zh.findIndex((i: any) => i.id === item.id)
            if (index !== -1) {
                formData.keywords_zh.splice(index, 1)
            } else {
                formData.keywords_zh.push(item)
            }
        } else {
            const index = formData.keywords_en.findIndex((i: any) => i.id === item.id)
            if (index !== -1) {
                formData.keywords_en.splice(index, 1)
            }
            else {
                formData.keywords_en.push(item)
            }
        }
        keywordActive()
    }

    //新增关键词
    const keywordForm = reactive<any>({
        name: '',
    })
    const rules = reactive<any>({
        name: [
            { required: true, message: '请输入关键词', trigger: 'blur' }
        ]
    })
    const keywordFormEl = ref<any>(null)
    const isAddKeyword = ref<boolean>(false)
    const showKeywordDialog = () => {
        isAddKeyword.value = true
    }
    const confirmKeyword = async (formEl: any) => {
        if (!formEl) return
        await formEl.validate((valid: boolean) => {
            if (valid) {
                isAddKeyword.value = false
                formEl.resetFields()
                if (keywords_lang.value === 'zh') {

                } else {

                }
            }
        })

    }

    const keywordActive = () => {
        if (keywords_lang.value === 'zh') {
            for (const item of keywordsList_zh.value) {
                item.active = false
            }
            for (const item of formData.keywords_zh) {
                const index = keywordsList_zh.value.findIndex((i: any) => i.id === item.id)
                console.log('index', index);
                if (index !== -1) {
                    keywordsList_zh.value[index].active = true
                }
            }
            console.log('keywordsList_zh', keywordsList_zh.value);
        } else {
            for (const item of keywordsList_en.value) {
                item.active = false
            }
            for (const item of formData.keywords_en) {
                const index = keywordsList_en.value.findIndex((i: any) => i.id === item.id)
                if (index !== -1) {
                    keywordsList_en.value[index].active = true
                }
            }
        }
    }
    watch(() => keywords_lang.value, (newV) => {
        if (newV === 'zh') {
            keywordsList.value = keywordsList_zh.value
        } else {
            keywordsList.value = keywordsList_en.value
        }
        keywordActive()
    }, { immediate: true })
</script>

<style lang="scss" scoped>
    .form-container {
        max-width: 800px;
        margin: 20px auto;
        padding: 24px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    }

    /* 上传区域样式 */
    .upload-section {
        margin-bottom: 30px;
    }

    .image-uploader {
        width: 100%;
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
        object-fit: cover;
        border-radius: 6px;
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

    /*图片预览*/
    .image-template-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        margin-bottom: 20px;

        img {
            width: 120px;
            height: 80px;

        }
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
    }

    .label {
        min-width: 100px;
        padding-top: 8px;
        color: var(--el-text-color-regular);
        font-weight: 500;
    }

    .form-input {
        flex: 1;
    }

    /* 关键词样式 */
    .keywords-wrapper {
        flex: 1;
    }

    .keywords-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 0;
        margin: 0;
        list-style: none;
        margin-top: 10px;
    }

    .keyword-tag {
        padding: 6px 12px;
        background: var(--el-fill-color-lighter);
        border-radius: 4px;
        font-size: 14px;
        color: var(--el-text-color-regular);
        display: flex;
        align-items: center;
        gap: 8px;

    }

    .keyword-tag.selectable {
        cursor: pointer;
        transition: all 0.3s;

    }

    .keyword-tag.selectable.activeClass {
        background: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
    }

    .keyword-tag.selectable:hover {
        background: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
    }

    .delete-icon {
        cursor: pointer;
        font-size: 12px;
        color: var(--el-text-color-secondary);
    }

    .delete-icon:hover {
        color: var(--el-color-danger);
    }

    .keyword-add {
        padding: 6px 12px;
        border: 1px dashed var(--el-border-color);
        border-radius: 4px;
        cursor: pointer;
        color: var(--el-color-primary);
        transition: all 0.3s;
    }

    .keyword-add:hover {
        border-color: var(--el-color-primary);
        background: var(--el-color-primary-light-9);
    }
</style>