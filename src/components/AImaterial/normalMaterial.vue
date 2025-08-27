<template>
    <!-- 复制素材 -->
    <el-dialog title="复制素材" v-model="isShowCopy" width="400">
        <el-form :model="copyData" :rules="copyRules" ref="copyFormRef">
            <el-form-item label="目标地区" prop="region">
                <el-select filterable v-model="copyData.region" clearable placeholder="地区" class="filter-select">
                    <el-option v-for="item in regionList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="handleCopy(copyFormRef)">确定</el-button>
        </template>
    </el-dialog>




    <div class="stickTp_manage">
        <draggable tag="ul" v-model="appData" item-key="id" :animation="200" class="template-grid"
            ghost-class="ghost-class" chosen-class="chosen-class" drag-class="dragging-class"
            :group="{ name: 'items' }">
            <template #item="{ element, index }">
                <li :key="element.id" class="template-item">
                    <!-- 右上角复选框 -->
                    <div class="checkbox-wrapper" @click.stop>
                        <input type="checkbox" :id="`checkbox-${element.id}`" :checked="isSelected(element.id)"
                            @change="handleCheckBoxChange($event, element.id)" class="custom-checkbox" />
                        <label :for="`checkbox-${element.id}`" class="checkbox-label"></label>
                    </div>

                    <div class="template_data" @click.stop>
                        <p class="p_id">ID:{{ element.id }}</p>
                        <p class="p_viewNum">点击量:{{ element.viewNum ? element.viewNum : '0' }}</p>
                        <p class="p_viewNum">喜欢数:{{ element.likeNum ? element.likeNum : '0' }}</p>
                        <p class="p_viewNum">上线日期:{{ element.createDate ? dayjs(element.createDate).format('YYYY-MM-DD')
                            : '--' }}</p>
                        <p class="p_viewNum">权值:{{ element.weights }}</p>
                    </div>

                    <div class="img-wrapper">
                        <img :src="element.imageUrl" alt="素材封面" class="template-img" />
                    </div>
                    <p class="template-name">
                        <el-button v-if="!isDelete" type="primary" @click="editorTemplate(element)" size='samll'>
                            编辑
                        </el-button>
                        <el-button v-else type="danger" @click="deleteTemplate(element)" size='samll'>
                            删除
                        </el-button>
                    </p>
                </li>
            </template>
        </draggable>
    </div>

</template>

<script lang="ts" setup>
    import service from '@/axios';
    import { useCounterStore } from '@/stores/counter';
    import { desEncrypt } from '@/utils/des';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { storeToRefs } from 'pinia';
    import { onActivated, reactive, ref, toRaw, watch } from 'vue';
    import draggable from 'vuedraggable'
    import dayjs from 'dayjs'
    const counterStore = useCounterStore()
    const { showLoading, defaultAppNo, regionList } = storeToRefs(counterStore)
    interface Props {
        isDelete: boolean;
        searchParams: any
    }
    const props = withDefaults(defineProps<Props>(), {
        isDelete: false
    })
    const emit = defineEmits<{
        'editMaterial': [value: AppItem]
    }>()
    onActivated(() => {

        getMaterialData()
    })
    interface AppItem {
        id: number
        appId: string;        // 应用编号
        shortName: string;    // 应用简称
        companyName: string;  // 所属公司
        accessName: string;   // 应用访问名
        systemId: string;     // 系统账号id
        developer: string;    // 开发者
        clickCount: number;   // 点击量
        likeCount: number;    // 喜欢数量
        onlineDate: string;   // 上线日期
        weight: number;       // 权值
        coverImage: string;   // 封面图
    }

    const appData = ref<AppItem[]>([

    ])


    //选中模板集合
    const selectedList = ref<any>([])
    const isSelected = (id: number) => {
        return selectedList.value.includes(id)
    }
    const handleCheckBoxChange = (e: any, id: number) => {
        if (e.target.checked) {
            selectedList.value.push(id)
        } else {
            selectedList.value = selectedList.value.filter((item: number) => item !== id)
        }
    }

    //清空选中
    const clearSelected = () => {
        selectedList.value = []
    }


    //复制素材
    const copyFormRef = ref<any>()

    const copyData = reactive({
        region: ''
    })
    const copyRules = reactive({
        region: [
            { required: true, message: '请输入目标地区', trigger: 'blur' }
        ]
    })

    const isShowCopy = ref<boolean>(false)
    watch(() => isShowCopy.value, (newVal) => {
        if (newVal && copyFormRef.value) {
            copyFormRef.value.resetFields()
        }
    })
    const copyChosedItem = () => {
        if (selectedList.value.length === 0) {
            ElMessage.error('请选择要复制的素材')
            return
        }
        console.log('复制素材');
        isShowCopy.value = true

    }
    const handleCopy = (el: any) => {
        el.validate(async (valid: any) => {
            if (valid) {
                console.log('表单验证通过');
                if (showLoading.value) return
                showLoading.value = true



                try {
                    console.log('selectedList', selectedList.value);
                    const params = {
                        timestamp: Date.now(),

                        ids: toRaw(selectedList.value),

                        region: copyData.region,
                    }
                    console.log("🚀 ~ handleCopy ~ params:", params)
                    const enData = desEncrypt(JSON.stringify(params))

                    const res = await service.post('/hairMaterials/copyMaterialTemplate', {
                        enData

                    })
                    console.log("🚀 ~ handleCopy ~ res:", res)
                    if (res.data.code === 200) {
                        ElMessage.success('复制成功')

                        getMaterialData()
                        isShowCopy.value = false
                    } else {
                        ElMessage.error(res.data.msg)
                    }

                } catch (err) {

                } finally {
                    showLoading.value = false
                }
            } else {
                console.log('表单验证失败');
            }
        })
    }






    //编辑素材
    const editInfo = ref<any>()
    const editorTemplate = (item?: any) => {
        editInfo.value = item
        console.log('item', item)
        emit('editMaterial', item)
    }


    //删除素材
    const deleteTemplate = (item: any) => {




        ElMessageBox.confirm('确认删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async () => {
            if (showLoading.value) return
            showLoading.value = true
            try {
                const res = await service.post(`/hairMaterials/del/${item.id}`)
                if (res.data.code === 200) {
                    ElMessage.success('删除成功')
                    getMaterialData()
                } else {
                    ElMessage.error(res.data.msg)
                }
            } catch (err) {
                console.log("🚀 ~ deleteTemplate ~ err:", err)

            } finally {
                showLoading.value = false
            }
        }).catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除'
            })
        })

    }





    //获取素材
    const getMaterialData = async () => {
        showLoading.value = true
        try {
            console.log('子组件获取数据', props.searchParams);
            const params = {
                timestamp: Date.now(),
                appNo: defaultAppNo.value,
                functionValue: props.searchParams.functionValue,
                classificationId: props.searchParams.secondClassId ? props.searchParams.secondClassId : props.searchParams.classId,
                region: props.searchParams.region
            }
            console.log("🚀 ~ getMaterialData ~ params:", params)
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/hairMaterials/list', {
                enData
            })
            console.log("🚀 ~ getMaterialData ~ res:", res)
            if (res.data.code === 200) {
                appData.value = res.data.data.list
                clearSelected()

            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log("🚀 ~ getMaterialData ~ err:", err)

        } finally {
            showLoading.value = false
        }
    }

    // 暴露方法给父组件
    defineExpose({
        copyChosedItem,
        getMaterialData,
        clearSelected
    })

</script>

<style lang="scss" scoped>
    .stickTp_manage {
        .template-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            /* 每行4个项目 */
            gap: 20px;
            /* 项目之间的间距 */
            padding: 0;
            list-style: none;
            margin: 0;
        }

        .template-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 15px;
            border: 1px solid #eee;
            border-radius: 8px;
            transition: transform 0.2s ease;
            cursor: pointer;
            min-width: 0;
            /* 关键属性：允许网格项小于内容最小宽度 */
            overflow: hidden;
            /* 确保内容不会溢出 */
            position: relative;
            /* 为绝对定位的复选框提供定位上下文 */
        }

        .template-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        }

        /* 复选框样式 */
        .checkbox-wrapper {
            position: absolute;
            top: 8px;
            right: 8px;
            z-index: 10;
            cursor: pointer;
        }

        .custom-checkbox {
            display: none;
        }

        .checkbox-label {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid #ddd;
            border-radius: 4px;
            background-color: rgba(255, 255, 255, 0.9);
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            backdrop-filter: blur(2px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .checkbox-label:hover {
            border-color: #409eff;
            background-color: rgba(255, 255, 255, 0.95);
            transform: scale(1.05);
        }

        .custom-checkbox:checked+.checkbox-label {
            background-color: #409eff;
            border-color: #409eff;
        }

        .custom-checkbox:checked+.checkbox-label::after {
            content: '';
            position: absolute;
            left: 6px;
            top: 2px;
            width: 4px;
            height: 8px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
        }

        /* 模板信息样式 */
        .template_data {
            position: absolute;
            top: 8px;
            left: 8px;
            z-index: 9;
            background: linear-gradient(135deg, rgba(64, 158, 255, 0.9), rgba(64, 158, 255, 0.7));
            backdrop-filter: blur(8px);
            border-radius: 8px;
            padding: 6px 10px;
            box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
            cursor: default;
        }

        .template_data:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(64, 158, 255, 0.3);
            background: linear-gradient(135deg, rgba(64, 158, 255, 0.95), rgba(64, 158, 255, 0.8));
        }

        .p_id,
        .p_viewNum {
            margin: 0;
            font-size: 11px;
            color: white;
            font-weight: 500;
            line-height: 1.3;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .p_id {
            margin-bottom: 2px;
        }

        .p_viewNum {
            opacity: 0.9;
        }

        .img-wrapper {
            width: 100%;
            aspect-ratio: 1;

            overflow: hidden;
            border-radius: 4px;
            background-color: #f5f5f5;
        }

        .template-img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            /* 确保图片填充整个容器且不变形 */
        }

        .template-name {
            margin: 10px 0 0;
            font-size: 14px;
            color: #333;
            display: flex;
            column-gap: 5px;
            width: 100%;
            /* 确保宽度占满父容器 */
            align-items: center;
            justify-content: center;
            /* 水平居中对齐 */
            flex-wrap: nowrap;
            /* 强制不换行 */

            .el-button {
                flex: 1;
                /* 按钮平均分配空间 */
                min-width: 0;
                /* 允许按钮收缩 */
                font-size: 12px;
                /* 减小字体以适应空间 */
                padding: 4px 8px;
                /* 减小内边距 */
            }

            .name {
                max-width: 200px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .tag {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 2px 6px;
                font-size: 12px;
                border-radius: 4px;
                font-weight: normal;
                white-space: nowrap;
                line-height: 1.2;
                transition: all 0.2s ease;

                &:hover {
                    transform: translateY(-1px);
                }
            }

            .tag-test {
                color: #8c6200;
                background-color: #fff8e6;
                border: 1px solid #ffe6a6;

                &:hover {
                    background-color: #fff3d9;
                }
            }

            .tag-prod {
                color: #135200;
                background-color: #f0ffe6;
                border: 1px solid #b7eb8f;

                &:hover {
                    background-color: #e4ffcc;
                }
            }
        }

        .ghost-class {
            background-color: #f8f8f8;
            border: 1px dashed #ccc;
            opacity: 0.6;
        }

        .chosen-class {
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }

        .drag-class {
            opacity: 0.8;
            transform: rotate(3deg);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
    }
</style>