<!-- 广告类型管理视图 -->
<template>
    <div class="view">
        <!-- 广告类型编辑器 -->
        <advTypeEditor v-model:dialog-visible="showAdvTypeEditor" :advTypeInfo="advTypeInfo" />
        <!-- 过滤和操作区域 -->
        <el-card class="filter-card">
            <div>
                <!-- 新增广告类型按钮 -->
                <el-button type="primary" @click="addAdvType">
                    <el-icon>
                        <Plus />
                    </el-icon>新增广告类型</el-button>
                <!-- 表格操作组件 -->
                <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
                    @changeView="changeView" />
            </div>
        </el-card>
        <!-- 内容显示区域 -->
        <el-card class="content-card">
            <!-- 动态组件，用于表格和列表视图切换 -->
            <Transition enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut" mode="out-in">
                <component :is="componentName" :filterParams="filterParams" :tableData="advData" @editor="editorAdvType"
                    @delete="deleteAdvType"></component>
            </Transition>

            <!-- 分页组件 -->
            <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                :total="totalData" v-model:current-page="pageNum" v-model:page-size="pageSize" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import tableAciton from '@/components/public/tableAciton.vue'
    import userTable from '@/components/user/userTable.vue'
    import userList from '@/components/user/userList.vue'
    import advTypeEditor from '@/components/advType/advTypeEditor.vue'
    import { onMounted, ref, watch } from 'vue'
    // 引入 Pinia store
    import { useCounterStore } from '@/stores/counter'
    import { storeToRefs } from 'pinia'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { desEncrypt } from '@/utils/des'
    import service from '@/axios'
    // 使用 Pinia store
    const counterStore = useCounterStore()
    const { showPagestion, showLoading } = storeToRefs(counterStore) // 响应式地访问 store 中的状态
    // 定义可切换的组件
    const components: any = {
        userTable, // 表格视图
        userList,  // 列表视图
    }
    const componentStr = ref('userTable') // 当前组件名称字符串
    const componentName = ref<any>(userTable) // 当前动态组件的引用

    // 分页状态
    const pageNum = ref<number>(1) // 当前页码
    const pageSize = ref<number>(20) // 每页显示数量
    const totalData = ref<number>(0) // 总数据条数
    // 监听页码变化，触发数据获取
    watch(
        () => pageNum.value,
        () => {
            getUserList()
        },
    )

    // 新增广告类型逻辑
    const showAdvTypeEditor = ref<boolean>(false) // 控制编辑器弹窗显示
    // 监听弹窗关闭，重置信息并刷新列表
    watch(() => showAdvTypeEditor.value, (newV) => {
        if (!newV) {
            advTypeInfo.value = { // 重置广告类型信息
                typeId: '',
                typeName: '',
                id: 0,
            }
            getUserList() // 刷新列表
        }
    })
    // 打开新增广告类型弹窗
    const addAdvType = () => {
        showAdvTypeEditor.value = true
    }
    // 编辑广告类型逻辑
    const advTypeInfo = ref<AdvItem>() // 存储待编辑的广告类型信息
    // 打开编辑广告类型弹窗并传入数据
    const editorAdvType = (item: AdvItem) => {
        console.log('编辑广告类型', item)
        advTypeInfo.value = item
        showAdvTypeEditor.value = true
    }

    // 删除广告类型逻辑
    /**
     * @description: 调用API删除广告类型
     * @param {number} id 广告类型ID
     */
    const delAdvFn = async (id: number) => {
        try {
            showLoading.value = true
            const res = await service.post(`/base/advType/del/${id}`)
            console.log('删除', res);
            if (res.data.code === 200) {
                ElMessage.success('删除成功')
                getUserList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('删除失败', err);
        } finally {
            showLoading.value = false
        }
    }
    // 弹出确认框并执行删除
    const deleteAdvType = (item: any) => {
        ElMessageBox.confirm('此操作将永久删除该广告类型, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then((res) => {
            delAdvFn(item.id)
        })
    }
    // 广告类型数据接口定义
    interface AdvItem {
        id: number // 编号
        typeId: string // 广告类型编号
        typeName: string // 广告类型名称
        [key: string]: any
    }

    // 用于表格列的显示名称映射
    const advNote: any = {
        id: '编号',
        typeId: '广告类型编号',
        typeName: '广告类型名称',
    }
    // 广告类型数据列表
    const advData = ref<AdvItem[]>([])
    // 过滤参数接口定义
    interface filterParams {
        note: string // 显示名称
        isShow: boolean // 是否显示
        key: string // 对应字段
    }
    const filterParams = ref<filterParams[]>() // 过滤参数数组

    /**
     * @description: 获取广告类型列表数据
     */
    const getUserList = async () => {
        try {
            const params = {
                pageNum: pageNum.value,
                pageSize: pageSize.value,
                timestamp: Date.now(),
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.get('/base/advType/list', {
                params: {
                    enData,
                },
            })
            console.log('获取广告类型列表', res)
            totalData.value = res.data.total
            advData.value = res.data.rows

            const keys = Object.keys(advNote)
            filterParams.value = keys.map((item) => {
                return {
                    note: advNote[item],
                    isShow: true,
                    key: item,
                }
            })
            console.log('filterParams', filterParams.value)
        } catch (err) {
            console.log('获取广告类型列表失败', err)
        } finally {
            showLoading.value = false
        }
    }
    /**
     * @description: 控制表格列的显示/隐藏
     * @param {string} key 字段名
     * @param {boolean} checked 是否选中
     */
    const checkedParams = ({ key, checked }: any) => {
        console.log('修改参数', key, checked)
        const item = filterParams.value?.find((item) => item.key === key)
        if (item) {
            item.isShow = checked
        }
    }
    /**
     * @description: 切换表格/列表视图
     */
    const changeView = () => {
        const keys = Object.keys(components)
        const keyItem = keys.find((item) => item !== componentStr.value)
        if (keyItem) {
            componentStr.value = keyItem
            componentName.value = components[keyItem]
        }
        console.log('keyItem', keyItem)
    }
    // 组件挂载后执行
    onMounted(() => {
        getUserList() // 获取初始数据
        showPagestion.value = true // 显示分页
    })
</script>

<style scoped lang="scss">
    .view {
        .filter-card {
            width: 100%;
            margin-bottom: 20px;

            div {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
        }

        .content-card {
            height: max-content;

            .pagesBox {
                margin-top: 30px;
            }
        }
    }
</style>
