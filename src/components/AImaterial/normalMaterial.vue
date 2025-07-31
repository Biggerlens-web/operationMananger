<template>
    <div class="stickTp_manage">
        <draggable tag="ul" v-model="appData" item-key="id" :animation="200" class="template-grid"
            ghost-class="ghost-class" chosen-class="chosen-class" drag-class="dragging-class"
            :group="{ name: 'items' }">
            <template #item="{ element, index }">
                <li :key="element.id" class="template-item">
                    <!-- 右上角复选框 -->
                    <!-- <div class="checkbox-wrapper" @click.stop>
                        <input type="checkbox" :id="`checkbox-${element.id}`" :checked="isSelected(element.id)"
                            @change="handleCheckBoxChange($event, element.id)" class="custom-checkbox" />
                        <label :for="`checkbox-${element.id}`" class="checkbox-label"></label>
                    </div> -->

                    <div class="template_data" @click.stop>
                        <p class="p_id">ID:{{ element.id }}</p>
                        <p class="p_viewNum">点击量:{{ element.clickCount }}</p>
                        <p class="p_viewNum">喜欢数:{{ element.likeCount }}</p>
                        <p class="p_viewNum">上线日期:{{ element.onlineDate }}</p>
                        <p class="p_viewNum">权值:{{ element.weight }}</p>
                    </div>

                    <div class="img-wrapper">
                        <img :src="element.coverImage" alt="素材封面" class="template-img" />
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
    import { onActivated, ref } from 'vue';
    import draggable from 'vuedraggable'

    interface Props {
        isDelete: boolean;
    }
    const props = withDefaults(defineProps<Props>(), {
        isDelete: false
    })
    const emit = defineEmits<{
        'editMaterial': [value: AppItem]
    }>()
    onActivated(() => {
        console.log('普通素材激活');
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
        {
            id: 1,
            appId: 'APP001',
            shortName: '时尚穿搭',
            companyName: '美图科技',
            accessName: 'fashion-style',
            systemId: 'SYS001',
            developer: '张三',
            clickCount: 15420,
            likeCount: 2340,
            onlineDate: '2024-01-15',
            weight: 0.85,
            coverImage: 'https://picsum.photos/300/200?random=1'
        },
        {
            id: 2,
            appId: 'APP002',
            shortName: '美妆教程',
            companyName: '美图科技',
            accessName: 'makeup-tutorial',
            systemId: 'SYS002',
            developer: '李四',
            clickCount: 23680,
            likeCount: 4120,
            onlineDate: '2024-02-20',
            weight: 0.92,
            coverImage: 'https://picsum.photos/300/200?random=2'
        },
        {
            id: 3,
            appId: 'APP003',
            shortName: '风景摄影',
            companyName: '创意工坊',
            accessName: 'landscape-photo',
            systemId: 'SYS003',
            developer: '王五',
            clickCount: 8950,
            likeCount: 1580,
            onlineDate: '2024-03-10',
            weight: 0.78,
            coverImage: 'https://picsum.photos/300/200?random=3'
        },
        {
            id: 4,
            appId: 'APP004',
            shortName: '卡通头像',
            companyName: '趣味设计',
            accessName: 'cartoon-avatar',
            systemId: 'SYS004',
            developer: '赵六',
            clickCount: 31200,
            likeCount: 5670,
            onlineDate: '2024-01-28',
            weight: 0.95,
            coverImage: 'https://picsum.photos/300/200?random=4'
        },
        {
            id: 5,
            appId: 'APP005',
            shortName: '商务模板',
            companyName: '专业设计',
            accessName: 'business-template',
            systemId: 'SYS005',
            developer: '孙七',
            clickCount: 12750,
            likeCount: 2890,
            onlineDate: '2024-02-14',
            weight: 0.88,
            coverImage: 'https://picsum.photos/300/200?random=5'
        },
        {
            id: 6,
            appId: 'APP006',
            shortName: '节日贺卡',
            companyName: '节庆创意',
            accessName: 'holiday-card',
            systemId: 'SYS006',
            developer: '周八',
            clickCount: 18640,
            likeCount: 3450,
            onlineDate: '2024-03-05',
            weight: 0.82,
            coverImage: 'https://picsum.photos/300/200?random=6'
        }
    ])


    //选中模板集合
    // const selectedList = ref<any>([])
    // const isSelected = (id: number) => {
    //     return selectedList.value.includes(id)
    // }
    // const handleCheckBoxChange = (e: any, id: number) => {
    //     if (e.target.checked) {
    //         selectedList.value.push(id)
    //     } else {
    //         selectedList.value = selectedList.value.filter((item: number) => item !== id)
    //     }
    // }




    //编辑素材
    const editInfo = ref<any>()
    const editorTemplate = (item?: any) => {
        editInfo.value = item
        console.log('item', item)
        emit('editMaterial', item)
    }


    //删除素材
    const deleteTemplate = (item: any) => {

    }





    //获取素材
    const getMaterialData = async () => {
        try {
            console.log('子组件获取数据');
        } catch (err) {

        } finally {

        }
    }

    // 暴露方法给父组件
    defineExpose({
        getMaterialData
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