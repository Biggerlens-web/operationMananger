<template>
    <div class="view">
        <advTypeEditor v-model:dialog-visible="showAdvTypeEditor" /> <el-card class="filter-card">
            <div>
                <el-button type="primary" @click="addAdvType"> <el-icon>
                        <Plus />
                    </el-icon>新增广告类型</el-button>
                <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
                    @changeView="changeView" />
            </div>
        </el-card>
        <el-card class="content-card">
            <Transition enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut" mode="out-in">
                <component :is="componentName" :filterParams="filterParams" :tableData="advData" @editor="editorAdvType"
                    @delete="deleteAdvType"></component>
            </Transition>

            <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                :total="1000" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import tableAciton from '@/components/public/tableAciton.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';
    import advTypeEditor from '@/components/advType/advTypeEditor.vue';
    import { onMounted, ref } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessageBox } from 'element-plus';
    const counterStore = useCounterStore()
    const { showPagestion } = storeToRefs(counterStore)
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)

    //新增广告类型
    const showAdvTypeEditor = ref<boolean>(false)
    const addAdvType = () => {
        showAdvTypeEditor.value = true
    }
    //编辑广告类型
    const editorAdvType = (item: any) => {
        console.log('编辑广告类型', item);
        showAdvTypeEditor.value = true
    }

    //删除广告类型
    const deleteAdvType = (item: any) => {
        ElMessageBox.confirm(
            '此操作将永久删除该广告类型, 是否继续?',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
    }
    interface AdvItem {
        id: number;        // 编号
        typeId: string;    // 广告类型编号
        typeName: string;  // 广告类型名称
    }

    const advNote: any = {
        id: '编号',
        typeId: '广告类型编号',
        typeName: '广告类型名称',

    }
    // 生成用户数据
    const advData = ref<AdvItem[]>([
        {
            id: 1,
            typeId: 'AD001',
            typeName: '横幅广告'
        },
        {
            id: 2,
            typeId: 'AD002',
            typeName: '弹窗广告'
        },
        {
            id: 3,
            typeId: 'AD003',
            typeName: '视频广告'
        },
        {
            id: 4,
            typeId: 'AD004',
            typeName: '原生广告'
        },
        {
            id: 5,
            typeId: 'AD005',
            typeName: '信息流广告'
        },
        {
            id: 6,
            typeId: 'AD006',
            typeName: '开屏广告'
        },
        {
            id: 7,
            typeId: 'AD007',
            typeName: '插屏广告'
        },
        {
            id: 8,
            typeId: 'AD008',
            typeName: '激励视频'
        },
        {
            id: 9,
            typeId: 'AD009',
            typeName: '贴片广告'
        },
        {
            id: 10,
            typeId: 'AD010',
            typeName: '悬浮广告'
        }
    ])
    interface filterParams {
        note: string
        isShow: boolean
        key: string
    }
    const filterParams = ref<filterParams[]>()
    const getUserList = async () => {
        console.log('获取用户列表');
        const dataItem = advData.value[0]
        const keys = Object.keys(dataItem)
        filterParams.value = keys.map((item) => {
            return {
                note: advNote[item],
                isShow: true,
                key: item
            }
        })
        console.log('filterParams', filterParams.value);
    }
    //参数显影
    const checkedParams = ({ key, checked }: any) => {
        console.log('修改参数', key, checked);
        const item = filterParams.value?.find((item) => item.key === key)
        if (item) {
            item.isShow = checked
        }

    }
    //切换显示模式
    const changeView = () => {

        const keys = Object.keys(components)
        const keyItem = keys.find((item) => item !== componentStr.value)
        if (keyItem) {
            componentStr.value = keyItem
            componentName.value = components[keyItem]
        }
        console.log('keyItem', keyItem);
    }
    onMounted(() => {
        getUserList();
        showPagestion.value = true
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
            height: calc(100vh - 220px);

            .pagesBox {
                margin-top: 30px;
            }
        }
    }
</style>