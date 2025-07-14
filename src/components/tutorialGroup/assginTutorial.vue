<template>
    <el-dialog v-model="dialogVisible" title="分配教程" width="1300" :before-close="handleBeforeClose">
        <el-card class="stickTp_manage">

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



                        <div class="img-wrapper">
                            <img :src="element.coverImgUrl" alt="" class="template-img" />
                        </div>

                    </li>
                </template>
            </draggable>
        </el-card>
        <template #footer>
            <el-button type="primary" @click="assign">分配</el-button>
            <el-button type="primary" @click="selectAll">全部选中</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    import service from '@/axios';
    import draggable from 'vuedraggable'
    import { useCounterStore } from '@/stores/counter';
    import { desEncrypt } from '@/utils/des';
    import { storeToRefs } from 'pinia';
    import { watch, ref } from 'vue';
    import { fi } from 'element-plus/es/locales.mjs';
    import { ElMessage } from 'element-plus';
    const stores = useCounterStore()
    const { defaultAppNo, showLoading } = storeToRefs(stores)
    const dialogVisible = defineModel('dialogAssgin', {
        type: Boolean,
        default: false
    })
    const props = defineProps<{
        searchParams: any
        groupId: number | string
    }>()

    const handleBeforeClose = () => {
        selectedList.value = []
        dialogVisible.value = false
    }
    const appData = ref<any>([])
    const getTutorialList = async () => {
        showLoading.value = true
        try {
            const params = {
                timestamp: Date.now(),
                appNo: defaultAppNo.value,
                os: props.searchParams.os,
                region: props.searchParams.region,
                tutorialType: props.searchParams.tutorialType,
                category: props.searchParams.category,
                language: props.searchParams.region !== 'domestic' ? props.searchParams.language : "zh",
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/tutorial/list', {
                enData
            })
            console.log('获取教程列表', res);
            appData.value = res.data.rows
        } catch (err) {
            console.log('获取教程列表失败', err);

        } finally {
            showLoading.value = false
        }
    }
    watch(() => dialogVisible.value, (newVal) => {
        if (newVal) {
            getTutorialList()
        }
    })



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


    const assign = async () => {
        if (showLoading.value) {
            ElMessage({
                message: '请稍后',
                type: 'info',
            })
            return
        }
        showLoading.value = true
        try {
            const params = {
                timestamp: Date.now(),
                groupId: props.groupId,
                tutorialIds: selectedList.value
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/tutorialGroup/assign', {
                enData
            })
            if (res.data.code === 200) {
                ElMessage.success('分配成功')
                handleBeforeClose()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {

        } finally {
            showLoading.value = false
        }
    }

    const selectAll = () => {
        selectedList.value = appData.value.map((item: any) => item.id)
    }
</script>

<style lang="scss" scoped>
    .stickTp_manage {

        height: 600px;
        overflow-y: scroll;

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