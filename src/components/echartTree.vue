<template>
    <div class="tree-container">
        <el-tree ref="treeRef" :data="treeData" :props="treeProps" :default-expand-all="false"
            :expand-on-click-node="true" :check-on-click-node="true" :highlight-current="true" :show-checkbox="false"
            :icon="''" node-key="id" class="custom-tree" :lazy="true" :load="loadNode" @node-click="handleNodeClick"
            @node-expand="handleNodeExpand" @node-collapse="handleNodeCollapse">
            <template #default="{ node, data }">
                <div class="custom-tree-node">
                    <div class="node-header">
                        <template v-if="node.level !== 5">
                            <span class="node-label"
                                v-if="node.level !== 5 && node.label !== 'SDK' && node.label !== '权限' && node.label !== '说明' && node.label !== 'otherservers'">{{
                                    node.label }}</span>

                            <span class="node-label" v-else>{{ node.label }}</span>
                        </template>
                        <template v-else-if="node.level === 5">
                            <span class="node-label"
                                v-if="node.level === 5 && node.label != '渠道' && node.label != '其他说明' && node.label != '应用权限' && node.label !== '第三方SDK'">{{
                                    node.label }}:{{ node.data.value }}</span>
                            <span class="node-label" v-else>{{ `${node.label}` }}</span>
                        </template>

                        <div class="node-actions">
                            <el-button v-if="data.level === 2" type="text" size="small"
                                @click.stop="handleUrlClick(data)">
                                查看该应用下所有url
                            </el-button>
                            <el-button v-if="data.level === 4" type="text" size="small"
                                @click.stop="handleEdit(node, data)">
                                编辑节点
                            </el-button>
                            <el-button v-if="data.level === 3" type="text" size="small"
                                @click.stop="handleCreate(node)">
                                新增节点
                            </el-button>
                            <el-button v-if="data.level === 4" type="text" size="small" @click.stop="handleDel(data)">
                                删除节点
                            </el-button>
                        </div>
                    </div>

                    <!-- 文本框容器 -->
                    <div v-if="node.level === 6 && node.label === 'SDK'" class="textarea-container">
                        <div v-for="(text, index) in node.data.arr" :key="index" class="custom-text-box">
                            {{ text || '暂无SDK信息' }}
                        </div>
                    </div>
                    <div v-else-if="node.level === 6 && node.label === '权限'" class="textarea-container">
                        <div v-for="(text, index) in node.data.arr" :key="index" class="custom-text-box">
                            {{ text || '暂无权限信息' }}
                        </div>
                    </div>
                    <div v-else-if="node.level === 6 && node.label === '说明'" class="textarea-container">
                        <div v-for="(text, index) in node.data.arr" :key="index" class="custom-text-box">
                            {{ text || '暂无其他服务信息' }}
                        </div>
                    </div>
                </div>
            </template>
        </el-tree>
    </div>

    <appUrlLInk v-model:dialog-visible="showapplink" :appNo="viewAppNo" :appName="viewAppName" />
</template>

<script lang="ts" setup>
    import { ref, computed } from 'vue'
    import { ElTree } from 'element-plus'
    import appUrlLInk from './privacy/appUrlLInk.vue'
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    const stores = useCounterStore()
    const { OSlist, showLoading } = storeToRefs(stores)
    // 定义组件props
    const props = defineProps<{
        treeData?: TreeNode[]

    }>()

    // 定义事件
    const emit = defineEmits<{
        nodeClick: [data: TreeNode, node: any]
        nodeExpand: [data: TreeNode, node: any]
        nodeCollapse: [data: TreeNode, node: any]
        edit: [data: TreeNode]
        del: [data: TreeNode]
        create: [data: TreeNode]
    }>()

    // 定义树节点接口
    interface TreeNode {
        id: string | number
        label: string
        url?: string
        editable?: boolean
        children?: TreeNode[]
        isLeaf?: boolean
        hasChildren?: boolean
        [key: string]: any
    }

    // 树组件引用
    const treeRef = ref<InstanceType<typeof ElTree>>()

    // 树组件配置
    const treeProps = {
        children: 'children',
        label: 'label',
        isLeaf: 'isLeaf'
    }

    // 弹窗状态
    const showapplink = ref(false)
    const viewAppNo = ref<number | string>('')
    const viewAppName = ref<string>('')
    const currentUrlData = ref<TreeNode | null>(null)

    // 节点点击事件
    const handleNodeClick = (data: TreeNode, node: any) => {
        emit('nodeClick', data, node)
    }

    // 节点展开事件
    const handleNodeExpand = (data: TreeNode, node: any) => {
        emit('nodeExpand', data, node)
    }

    // 节点收起事件
    const handleNodeCollapse = (data: TreeNode, node: any) => {
        emit('nodeCollapse', data, node)
    }

    // 处理URL点击
    const handleUrlClick = (data: TreeNode) => {
        // currentUrlData.value = data
        console.log('data', data);
        viewAppNo.value = data.appNo
        viewAppName.value = data.appName
        showapplink.value = true
    }





    // 处理编辑
    const handleEdit = (node: TreeNode, data: TreeNode) => {

        const obj = {
            ...data,
            appNo: node.parent.parent.data.appNo,
        }
        emit('edit', obj)
    }

    //删除节点
    const handleDel = (data: TreeNode) => {
        console.log('删除节点', data);
        emit('del', data)
    }

    //新增节点
    const handleCreate = (node: TreeNode) => {
        console.log('新增节点', node);
        emit('create', node)
    }
    // 懒加载节点数据
    const loadNode = async (node: any, resolve: (data: TreeNode[]) => void) => {
        console.log('node', node);
        showLoading.value = true
        try {
            console.log('懒加载节点数据:', node)
            // 根据节点数据动态加载子节点
            if (node.data.level === 1) {
                // 加载公司下的隐私政策详情
                const params = {
                    timestamp: Date.now(),
                    companyNo: node.data.companyNo,
                }

                const enData = desEncrypt(JSON.stringify(params))
                const res = await service.post(`/appInfo/findByCompanyId`, {
                    enData
                })

                console.log('获取子元素', res);
                const childrenData = res.data.rows.map((item: any) => ({
                    id: item.appNo,
                    label: item.appAbbreviation,
                    url: item.url,
                    editable: true,
                    isLeaf: false,
                    isHasChildren: true,
                    level: 2,
                    ...item
                }))

                resolve(childrenData)
            } else if (node.data.level === 2) {
                const childrenData = OSlist.value.map((item: any) => {
                    return {
                        id: item,
                        label: item,
                        url: item.url,
                        editable: true,
                        isLeaf: false,
                        isHasChildren: true,
                        level: 3,

                    }
                })
                console.log('os', OSlist.value);
                resolve(childrenData)
            } else if (node.data.level === 3) {

                const params = {
                    timestamp: Date.now(),
                    os: node.data.id,
                    appNo: node.parent.data.appNo
                }
                console.log('参数', params);
                const enData = desEncrypt(JSON.stringify(params))
                const res = await service.post(`/appInfoDetail/findByAppNo`, {
                    enData
                })

                console.log('获取系统下数据', res);
                const childrenData = res.data.rows.map((item: any) => {
                    console.log('item', item);
                    return {
                        id: item.id,
                        label: item.language,
                        url: item.url,
                        editable: true,
                        isLeaf: false,
                        isHasChildren: true,
                        level: 4,
                        ...item
                    }
                })
                console.log('childrenData', childrenData);
                resolve(childrenData)
            } else if (node.data.level === 4) {
                console.log('父级', node.data);
                const childrenData = [

                    {
                        id: 'updateData',
                        label: '更新时间',
                        value: node.data.updateData,
                        level: 5,
                        isLeaf: true,
                        isHasChildren: false,
                    }, {
                        id: 'appEmail',
                        label: '邮箱',
                        value: node.data.appEmail,
                        level: 5,
                        isLeaf: true,
                        isHasChildren: false,
                    },
                    {
                        id: 'companyName',
                        label: '公司',
                        value: node.data.companyName,
                        level: 5,
                        isLeaf: true,
                        isHasChildren: false,
                    },
                    {
                        id: 'appName',
                        label: '应用名1',
                        value: node.data.appName,
                        level: 5,
                        isLeaf: true,
                        isHasChildren: false,
                    },
                    {
                        id: 'appName1',
                        label: '应用名2',
                        value: node.data.appName1,
                        level: 5,
                        isLeaf: true,
                        isHasChildren: false,
                    },
                    {
                        id: 'channels',
                        label: '渠道',

                        level: 5,
                        isLeaf: false,
                        isHasChildren: true,
                        channels: node.data.channelVos
                    },
                    {
                        id: 'threesdksVos',
                        label: '第三方SDK',
                        level: 5,
                        isLeaf: false,
                        isHasChildren: true,
                        threesdksVos: node.data.threesdksVos
                    },
                    {
                        id: 'permissionstrsVos',
                        label: '应用权限',
                        level: 5,
                        isLeaf: false,
                        isHasChildren: true,
                        permissionstrVos: node.data.permissionstrsVos
                    },
                    {
                        id: 'otherserversVos',
                        label: '其他说明',
                        level: 5,
                        isLeaf: false,
                        isHasChildren: true,
                        otherserversVos: node.data.otherserversVos
                    }
                ]
                resolve(childrenData)
            } else if (node.data.level === 5) {
                let childrenData = []

                if (node.label === '其他说明') {
                    childrenData = node.data.otherserversVos.map((item: any) => {
                        return {
                            id: item.id,
                            label: '说明',
                            value: item.text,
                            level: 6,
                            isLeaf: true,
                            isHasChildren: false,
                        }
                    })
                } else if (node.label === '第三方SDK') {
                    childrenData = node.data.threesdksVos.map((item: any) => {
                        return {
                            id: item.id,
                            label: 'SDK',
                            value: item.text,
                            level: 6,
                            isLeaf: true,
                            isHasChildren: false,
                            arr: [item.text, item.text1, item.text2, item.text3, item.text4, item.text5],
                            ...item
                        }
                    })
                } else if (node.label === '应用权限') {
                    childrenData = node.data.permissionstrVos.map((item: any) => {
                        return {
                            id: item.id,
                            label: '权限',
                            value: item.text,
                            level: 6,
                            isLeaf: true,
                            isHasChildren: false,
                            arr: [item.text, item.text1, item.text2],
                            ...item
                        }
                    })
                } else {
                    childrenData = node.data.channels.map((item: any) => {
                        return {
                            id: item.id,
                            label: item.channelNo,
                            value: item.channelNo,
                            level: 6,
                            isLeaf: true,
                            isHasChildren: false,
                            ...item
                        }
                    })
                }
                resolve(childrenData)

            }
            else {
                // 默认空数据
                resolve([])
            }
        } catch (err) {
            console.log('懒加载失败:', err)
            resolve([])
        } finally {
            showLoading.value = false
        }
    }

    // 暴露方法给父组件
    const getCheckedNodes = () => {
        return treeRef.value?.getCheckedNodes()
    }

    const getCheckedKeys = () => {
        return treeRef.value?.getCheckedKeys()
    }

    const setCheckedKeys = (keys: (string | number)[]) => {
        treeRef.value?.setCheckedKeys(keys)
    }

    const expandAll = () => {
        const nodes = treeRef.value?.store.nodesMap
        if (nodes) {
            Object.values(nodes).forEach((node: any) => {
                node.expanded = true
            })
        }
    }

    const collapseAll = () => {
        const nodes = treeRef.value?.store.nodesMap
        if (nodes) {
            Object.values(nodes).forEach((node: any) => {
                node.expanded = false
            })
        }
    }

    // 向外暴露方法
    defineExpose({
        getCheckedNodes,
        getCheckedKeys,
        setCheckedKeys,
        expandAll,
        collapseAll,
        treeRef
    })
</script>

<style lang="scss" scoped>
    .tree-container {
        width: 100%;
        height: 656px;
        overflow: auto;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        padding: 10px;
        background-color: #fff;
    }

    .custom-tree {
        width: 100%;

        :deep(.el-tree-node__content) {
            height: auto;
            min-height: 36px;
            line-height: 36px;
            padding: 4px 0;

            &:hover {
                background-color: #f5f7fa;
            }
        }

        :deep(.el-tree-node__expand-icon) {
            color: #606266;
            font-size: 12px;
            margin-right: 8px;
            transition: transform 0.3s ease;

            &.expanded {
                transform: rotate(90deg);
            }

            &.is-leaf {
                visibility: hidden;
            }
        }
    }

    .custom-tree-node {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        width: 100%;
        padding-right: 8px;
        flex-direction: column;

        .node-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
        }

        .node-label {
            flex: 1;
            font-size: 14px;
            color: #606266;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .node-actions {
            display: flex;
            gap: 4px;
            opacity: 0;
            transition: opacity 0.2s;

            .el-button {
                padding: 2px 6px;
                font-size: 12px;

                &:hover {
                    color: #409eff;
                }
            }
        }

        &:hover .node-actions {
            opacity: 1;
        }
    }

    // 多行输入框样式优化
    .textarea-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
        padding: 8px;
        background-color: #f8f9fa;
        border-radius: 6px;
        border: 1px solid #e4e7ed;

        .custom-text-box {
            width: 200px;
            height: 80px;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            background-color: #f5f7fa;
            padding: 8px 12px;
            font-size: 13px;
            line-height: 1.4;
            color: #606266;
            word-wrap: break-word;
            word-break: break-all;
            overflow-y: auto;
            overflow-x: hidden;
            white-space: pre-wrap;
            box-sizing: border-box;
            margin: 4px;
            flex-shrink: 0;

            // 滚动条样式
            &::-webkit-scrollbar {
                width: 6px;
            }

            &::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 3px;
            }

            &::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 3px;

                &:hover {
                    background: #a8a8a8;
                }
            }
        }

        .custom-textarea {
            :deep(.el-textarea__inner) {
                border-radius: 4px;
                border: 1px solid #dcdfe6;
                background-color: #ffffff;
                font-size: 13px;
                line-height: 1.4;
                padding: 8px 12px;
                resize: vertical;
                transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

                &:focus {
                    border-color: #409eff;
                    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
                }

                &:disabled {
                    background-color: #f5f7fa;
                    border-color: #e4e7ed;
                    color: #c0c4cc;
                    cursor: not-allowed;
                }

                &::placeholder {
                    color: #a8abb2;
                    font-size: 12px;
                }
            }

            // 输入框间距
            &+.custom-textarea {
                margin-top: 6px;
            }
        }

        // 容器标题样式（如果需要）
        &::before {
            content: attr(data-label);
            font-size: 12px;
            color: #909399;
            font-weight: 500;
            margin-bottom: 4px;
        }
    }

    // 响应式设计
    @media (max-width: 768px) {
        .tree-container {
            height: 500px;
            padding: 8px;
        }

        .custom-tree-node {
            .node-actions {
                opacity: 1; // 移动端始终显示操作按钮
            }
        }

        .textarea-container {
            padding: 6px;
            gap: 6px;

            .custom-textarea {
                :deep(.el-textarea__inner) {
                    font-size: 12px;
                    padding: 6px 10px;
                }
            }
        }
    }
</style>