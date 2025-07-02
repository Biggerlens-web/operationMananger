<template>
    <div class="view">
        <privacyTemplate v-model:dialogVisible="dialogSDKtemplateVisible" />
        <prermissionTemplate v-model:dialogVisible="dialogPermissiontemplateVisible" />
        <otherTemplate v-model:dialogVisible="dialogOthertemplateVisible" />
        <el-card class="filter-card">
            <div class="card-header" style="margin: 0;">
                <div class="left-actions">
                    <el-upload ref="upload" class="upload-demo" action="#" :limit="1" :http-request="uploadJson"
                        :show-file-list="false">
                        <el-button style="margin: 0px;" type="primary" class="add-button">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            通过json文件添加
                        </el-button>
                    </el-upload>
                    <el-button style="margin: 0px;" type="primary" class="add-button" @click="showSDKtemplate">
                        第三方SDK模板
                    </el-button>
                    <el-button style="margin: 0px;" type="primary" class="add-button" @click="showPermissiontemplate">
                        权限模板
                    </el-button>
                    <el-button style="margin: 0px;" type="primary" class="add-button" @click="showOthertemplate">
                        其他说明模板
                    </el-button>
                </div>
                <div class="right-actions">

                </div>
            </div>


        </el-card>
        <el-card class="content-card">
            <echartTree :treeData="treeData" @nodeClick="handleNodeClick" @nodeExpand="handleNodeExpand"
                @nodeCollapse="handleNodeCollapse" @edit="handleEdit" ref="treeRef" @del="deleteNode"
                @create="handleCreate" />
        </el-card>
    </div>
    <editNode v-model:dialogVisable="dialogVisableEditNode" :nodeInfo="nodeInfo" :addInfo="addInfo" />
</template>

<script lang="ts" setup>
    import { onMounted, ref, watch } from 'vue';
    import echartTree from '@/components/echartTree.vue';
    import privacyTemplate from '@/components/privacy/privacyTemplate.vue';
    import prermissionTemplate from '@/components/privacy/prermissionTemplate.vue';
    import otherTemplate from '@/components/privacy/otherTemplate.vue';
    import service from '@/axios';
    import type { UploadRequestOptions } from 'element-plus'
    import { desEncrypt } from '@/utils/des';
    import editNode from '@/components/privacy/editor/editNode.vue';
    import { ElMessage } from 'element-plus';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    const stores = useCounterStore()
    const { showLoading } = storeToRefs(stores)
    //显示SDK模板

    const dialogSDKtemplateVisible = ref(false);
    const showSDKtemplate = () => {
        dialogSDKtemplateVisible.value = true;
    }


    //上传json
    const uploadJson = async (options: UploadRequestOptions) => {
        console.log('上传json', options);
        try {
            const formData = new FormData()
            formData.append('file', options.file)
            showLoading.value = true
            const res = await service.post('/privacy/jsonByFile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log('上传json', res);
        } catch (err) {
            console.log('上传失败', err);
        } finally {
            showLoading.value = false
        }
    }



    //显示权限模板
    const dialogPermissiontemplateVisible = ref(false);
    const showPermissiontemplate = () => {
        dialogPermissiontemplateVisible.value = true;
    }

    //显示其他模板
    const dialogOthertemplateVisible = ref(false);
    const showOthertemplate = () => {
        dialogOthertemplateVisible.value = true;
    }


    //编辑节点
    const dialogVisableEditNode = ref<boolean>(false)

    watch(() => dialogVisableEditNode.value, (newV) => {
        if (!newV) {
            getPrivacyList()
        }
    })
    // 树组件引用
    const treeRef = ref()

    //获取隐私政策列表
    const treeData = ref<any>()
    const getPrivacyList = async () => {
        try {
            showLoading.value = true
            const res = await service.get('/appAdmin/privacyPolicy')
            console.log('获取隐私列表', res);
            res.data.data.list.forEach((item: any) => {
                item.level = 1
                item.label = item.companyName || ''
                item.id = item.id || item.companyNo
                item.isLeaf = false
                item.hasChildren = true
            })
            treeData.value = res.data.data.list

        } catch (err) {
            console.log('获取隐私列表失败', err);
        } finally {
            showLoading.value = false
        }
    }



    // 节点点击事件处理
    const handleNodeClick = (data: any, node: any) => {
        console.log('节点点击:', data, node)
        // 可以在这里处理节点选中逻辑
    }

    // 节点展开事件处理
    const handleNodeExpand = (data: any, node: any) => {
        console.log('节点展开:', data, node)
    }

    // 节点收起事件处理
    const handleNodeCollapse = (data: any, node: any) => {
        console.log('节点收起:', data, node)
    }

    // 编辑事件处理
    const nodeInfo = ref<any>()
    const handleEdit = (data: any) => {
        console.log('编辑节点:', data)
        nodeInfo.value = data
        dialogVisableEditNode.value = true
        // 可以在这里打开编辑弹窗或跳转到编辑页面
    }


    //删除节点
    const deleteNode = async (data: any) => {
        console.log('删除节点', data);
        const { id } = data
        try {
            showLoading.value = true
            const res = await service.post(`/privacy/deleteDetail/${id}`)
            console.log('删除成功', res);
            if (res.data.code === 200) {
                ElMessage.success('删除成功')
                getPrivacyList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('删除节点失败', err);
        } finally {
            showLoading.value = false
        }
    }

    //新增节点
    const addInfo = ref<any>({})
    const handleCreate = (data: any) => {

        const appNo = data.parent.data.appNo

        addInfo.value.appNo = appNo
        addInfo.value.os = data.data.id.toLowerCase()
        dialogVisableEditNode.value = true
    }


    // 树操作方法
    const expandAllNodes = () => {
        treeRef.value?.expandAll()
    }

    const collapseAllNodes = () => {
        treeRef.value?.collapseAll()
    }

    const getSelectedNodes = () => {
        return treeRef.value?.getCheckedNodes()
    }

    onMounted(() => {
        getPrivacyList()
    })

</script>

<style lang="scss" scoped>
    .view {
        .filter-card {
            width: 100%;
            margin-bottom: 20px;

            .card-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;

                .left-actions {
                    display: flex;
                    align-items: center;
                    gap: 12px;

                    .add-button {
                        font-weight: 500;

                        .el-icon {
                            margin-right: 4px;
                        }
                    }
                }

                .right-actions {
                    display: flex;
                    align-items: center;
                }
            }

            .divider {
                margin: 12px 0;
            }

            .filter-container {
                .filter-row {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 16px;

                    &:last-child {
                        margin-bottom: 0;
                    }

                    .filter-item {
                        // flex: 1;
                        width: 200px;
                        /* 允许元素收缩到比内容更小 */
                    }

                    .button-group {
                        display: flex;
                        justify-content: flex-end;
                        gap: 8px;
                        width: 100%;
                    }
                }
            }
        }

        .content-card {
            height: calc(100vh - 220px);

            .pagesBox {
                margin-top: 30px;
            }
        }
    }
</style>