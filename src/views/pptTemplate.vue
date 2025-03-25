<template>
    <div class="view">
        <addTemplateCatalog v-model:dialogEditor="edtiorTemplateType" :isEditor="isEditorTemplateType"
            @clearMark="clearEditorMark" />

        <div class="page-header">

            <el-button type="primary" :icon="Plus" @click="addTemplateType">新增模板分类</el-button>
            <el-button type="primary" v-show="activeCataType === 'templatesList'" :icon="Plus"
                @click="addTemplate">新增模板</el-button>
            <span class="typeTitle">
                {{ `${typeTitle}` }}
            </span>
        </div>

        <el-card class="filter-card">
            <el-dropdown class="moreAction">
                <img src="../assets/template/更多.png" alt="">
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>推送测试</el-dropdown-item>
                        <el-dropdown-item>推送正式</el-dropdown-item>
                    </el-dropdown-menu>

                </template>
            </el-dropdown>
            <div class="filter-box">

                <div class="filter-item">
                    <span class="label">应用:</span>
                    <el-select v-model="activeApp" placeholder="请选择应用" clearable class="filter-select">
                        <el-option v-for="item in appList" :key="item.id"
                            :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                            :value="item.appNo" />
                    </el-select>
                </div>
                <div class="filter-item">
                    <span class="label">应用:</span>
                    <el-select v-model="activeApp" placeholder="请选择应用" clearable class="filter-select">
                        <el-option v-for="item in appList" :key="item.id"
                            :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                            :value="item.appNo" />

                    </el-select>
                </div>
                <div class="filter-item">
                    <span class="label">应用:</span>
                    <el-select v-model="activeApp" placeholder="请选择应用" clearable class="filter-select">
                        <el-option v-for="item in appList" :key="item.id"
                            :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                            :value="item.appNo" />
                    </el-select>
                </div>
            </div>
        </el-card>


        <el-card class="content-card">
            <img class="backIcon" v-show="activeCataType !== 'catalogList'" @click="goback" :src="backIcon" alt="">
            <component :is="componentId" @goDetail="goDetail" @editorTemplateType="editorTemplateType"></component>
        </el-card>

    </div>
</template>

<script lang="ts" setup>
    import { onMounted, ref } from 'vue'
    import { Plus } from '@element-plus/icons-vue'

    import catalogList from '@/components/pptTemplate/catalogList.vue'
    import templatesList from '../components/pptTemplate/templatesList.vue'
    import { useTemplateStore } from '@/stores/template'
    import { storeToRefs } from 'pinia'
    import backIcon from '../assets/template/返回.png'
    import addTemplateCatalog from '@/components/templates/addTemplateCatalog.vue'
    import { useCounterStore } from '@/stores/counter'
    const componentId = ref<any>()
    const templateStore = useTemplateStore()
    const conterStore = useCounterStore()
    const { appList } = storeToRefs(conterStore)
    const { activeCataType, activeCalaId, activeSubId, typeTitle, subTypeTitle, addTemplateMark } = storeToRefs(templateStore)
    const components: any = {
        catalogList,
        templatesList
    }

    //新增模板类型
    const edtiorTemplateType = ref<boolean>(false)
    const addTemplateType = () => {
        edtiorTemplateType.value = true
    }
    const addTemplate = () => {
        console.log('addTemplate');
        addTemplateMark.value = !addTemplateMark.value
    }

    //编辑模板类型
    const isEditorTemplateType = ref<string>('')
    const editorTemplateType = (obj: any) => {
        console.log('obj', obj);
        isEditorTemplateType.value = obj.type
        edtiorTemplateType.value = true
    }
    const clearEditorMark = () => {
        isEditorTemplateType.value = ''
    }

    //前进
    const goDetail = (k: any) => {
        console.log('k', k);
        if (k.type === 'templatesList') {
            activeSubId.value = k.id
        }
        activeCataType.value = k.type
        componentId.value = components[k.type]
    }

    //返回
    const goback = () => {
        console.log('activeCataType', activeCataType.value);
        if (activeCataType.value === 'catalogList') return
        if (activeCataType.value === 'templatesList') {
            activeCataType.value = 'catalogList'
            typeTitle.value = '类目管理'
            componentId.value = components['catalogList']
        }
    }


    const activeApp = ref('')

    onMounted(() => {
        componentId.value = components[activeCataType.value]
    })

</script>

<style lang="scss" scoped>
    .view {
        min-height: 100%;
        position: relative;

        .backIcon {
            position: absolute;
            width: 20px;
            height: 20px;
            // top: 23%;
            left: 5px;
            cursor: pointer;
        }
    }

    .page-header {
        display: flex;
        // justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        position: relative;

        .typeTitle {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
        }
    }

    .page-header h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
        color: #1f2f3d;
    }

    .filter-card {
        margin-bottom: 16px;
        position: relative;

        .moreAction {
            position: absolute;
            right: 0;
            top: 26px;

            img {
                width: auto;
                height: 20px;
                cursor: pointer;
            }
        }
    }

    .filter-box {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        align-items: flex-start;
    }

    .filter-item {
        display: flex;
        align-items: center;
        margin-right: 24px;
    }

    .filter-item .label {
        margin-right: 8px;
        color: #606266;
        font-size: 14px;
    }

    .filter-select {
        width: 200px;
    }

    .filter-actions {
        margin-left: auto;
    }

    .content-card {
        height: 680px;
        overflow-y: scroll;

    }
</style>