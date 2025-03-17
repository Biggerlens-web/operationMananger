<template>
    <div class="view">
        <el-card class="filter-card">
            <div>
                <el-button type="primary"> <el-icon>
                        <Plus />
                    </el-icon>新增语言</el-button>
                <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
                    @changeView="changeView" />
            </div>


        </el-card>
        <el-card class="content-card">
            <Transition enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut" mode="out-in">
                <component :is="componentName" :filterParams="filterParams" :tableData="languageData"></component>
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
    import { onMounted, ref } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    const counterStore = useCounterStore()
    const { showPagestion } = storeToRefs(counterStore)
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)
    // 定义用户类型
    interface LanguageItem {
        id: number;        // 编号
        language: string;  // 语言
        description: string; // 语言说明
    }

    const LanguageNote: any = {
        id: '编号',
        language: '语言',
        description: '语言说明',

    }
    // 生成用户数据
    const languageData = ref<LanguageItem[]>([
        {
            id: 1,
            language: 'JavaScript',
            description: '用于网页交互的脚本语言'
        },
        {
            id: 2,
            language: 'TypeScript',
            description: 'JavaScript的超集，添加了类型系统'
        },
        {
            id: 3,
            language: 'Python',
            description: '简单易学的通用编程语言'
        },
        {
            id: 4,
            language: 'Java',
            description: '面向对象的编程语言'
        },
        {
            id: 5,
            language: 'C++',
            description: '系统级编程语言'
        },
        {
            id: 6,
            language: 'C#',
            description: '微软开发的面向对象语言'
        },
        {
            id: 7,
            language: 'PHP',
            description: '服务器端脚本语言'
        },
        {
            id: 8,
            language: 'Ruby',
            description: '动态面向对象语言'
        },
        {
            id: 9,
            language: 'Go',
            description: 'Google开发的系统语言'
        },
        {
            id: 10,
            language: 'Swift',
            description: 'Apple开发的移动开发语言'
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
        const dataItem = languageData.value[0]
        const keys = Object.keys(dataItem)
        filterParams.value = keys.map((item) => {
            return {
                note: LanguageNote[item],
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