<template>
    <div class="view">
        <languageEditor v-model:dialog-visible="showLanguageEditor" :languageInfo="languageInfo" />
        <el-card class="filter-card">
            <div>
                <el-button type="primary" @click="addLanguage"> <el-icon>
                        <Plus />
                    </el-icon>新增语言</el-button>
                <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
                    @changeView="changeView" />
            </div>


        </el-card>
        <el-card class="content-card">
            <Transition enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut" mode="out-in">
                <component :is="componentName" :filterParams="filterParams" :tableData="languageData"
                    @editor="editorLanguage" @delete="deleteLanguage"></component>
            </Transition>

            <el-pagination v-show="showPagestion" class="pagesBox" background layout="prev, pager, next"
                v-model:current-page="pageNum" v-model:page-size="pageSize" :total="totalData" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import tableAciton from '@/components/public/tableAciton.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';
    import languageEditor from '@/components/language/languageEditor.vue';
    import { onMounted, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { desEncrypt } from '@/utils/des';
    import service from '@/axios';
    const counterStore = useCounterStore()
    const { showPagestion, showLoading } = storeToRefs(counterStore)
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)


    //分页
    const pageNum = ref<number>(1)
    const pageSize = ref<number>(20)
    const totalData = ref<number>(0)
    watch(() => pageNum.value, () => {
        getUserList()
    })


    //新增语言
    const showLanguageEditor = ref<boolean>(false)
    watch(() => showLanguageEditor.value, (newV) => {
        if (!newV) {
            getUserList()
            languageInfo.value = {
                id: 0,
                languageName: '',
                remark: '',
            }
        }
    })
    const addLanguage = () => {
        console.log('新增语言');
        showLanguageEditor.value = true
    }

    //编辑语言
    const languageInfo = ref<LanguageItem>()
    const editorLanguage = (row: any) => {
        console.log('编辑语言', row);
        languageInfo.value = row
        showLanguageEditor.value = true
    }


    //删除语言
    const delLanguageFn = async (id: number) => {
        try {
            showLoading.value = true
            const res = await service.post(`/base/language/del/${id}`)
            console.log('删除', res);

            if (res.data.code) {

                ElMessage.success('删除成功')
                getUserList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('删除语言失败', err);
        } finally {
            showLoading.value = false
        }
    }
    const deleteLanguage = (row: any) => {
        ElMessageBox.confirm('确定删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',

        }).then(res => {
            delLanguageFn(row.id)


        }).catch(err => {

        })
    }
    // 定义用户类型
    interface LanguageItem {
        id: number;        // 编号
        languageName: string;  // 语言
        remark: string; // 语言说明
    }

    const LanguageNote: any = {
        id: '编号',
        languageName: '语言',
        remark: '语言说明',

    }
    // 生成用户数据
    const languageData = ref<LanguageItem[]>([

    ])
    interface filterParams {
        note: string
        isShow: boolean
        key: string
    }
    const filterParams = ref<filterParams[]>()
    const getUserList = async () => {

        try {

            const params = {
                timestamp: Date.now(),
                pageNum: pageNum.value,
                pageSize: pageSize.value

            }

            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.get('/base/language/list', {
                params: {
                    enData
                }
            })
            console.log('获取语言列表', res);
            languageData.value = res.data.rows
            totalData.value = res.data.total
            const keys = Object.keys(LanguageNote)
            filterParams.value = keys.map((item) => {
                return {
                    note: LanguageNote[item],
                    isShow: true,
                    key: item
                }
            })
            console.log('filterParams', filterParams.value);
        } catch (err) {
            console.log('获取语言列表失败', err);
        } finally {
            showLoading.value = false
        }

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
            height: max-content;

            .pagesBox {
                margin-top: 30px;
            }
        }
    }
</style>