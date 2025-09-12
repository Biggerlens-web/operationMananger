<template>
    <!-- 视图主容器 -->
    <div class="view">
        <!-- 公司信息编辑器弹窗 -->
        <companyInfoEditor v-model:dialog-visible="showCompanyEditor" :companyInfo="companyInfo" />

        <!-- 过滤和操作卡片 -->
        <el-card class="filter-card">
            <!-- 卡片头部 -->
            <div class="card-header" style="margin: 0;">
                <!-- 左侧操作按钮 -->
                <div class="left-actions">
                    <!-- 新增公司按钮 -->
                    <el-button type="primary" @click="addCompany" class="add-button">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增公司
                    </el-button>
                    <!-- 下载Excel模板按钮 -->
                    <el-button type="primary" class="add-button" @click="downloadTemplate">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        下载EXECEL模板
                    </el-button>
                    <!-- Excel导入按钮 -->
                    <el-upload action="#" :show-file-list='false' :http-request="importCompany">
                        <el-button type="primary" class="add-button">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            EXECEL导入
                        </el-button>
                    </el-upload>
                </div>
                <!-- 右侧表格操作组件 -->
                <div class="right-actions">
                    <tableAciton @update="getUserList" :filterParams="filterParams" @checkedParams="checkedParams"
                        @changeView="changeView" />
                </div>
            </div>

            <el-divider class="divider" />

            <!-- 过滤器容器 -->
            <div class="filter-container">
                <div class="filter-row">
                    <!-- 公司编号查询输入框 -->
                    <div class="filter-item">
                        <el-input v-model="searchParams.companyNo" placeholder="输入公司编号查询"></el-input>
                    </div>
                    <!-- 公司名称查询输入框 -->
                    <div class="filter-item">
                        <el-input v-model="searchParams.companyName" placeholder="输入公司名称查询"></el-input>
                    </div>

                    <!-- 查询和重置按钮 -->
                    <div class="filter-item filter-actions">
                        <el-button type="primary" @click="getUserList">
                            <el-icon>
                                <Search />
                            </el-icon>
                            查询
                        </el-button>
                        <el-button @click="resetSearch">
                            <el-icon>
                                <Refresh />
                            </el-icon>
                            重置
                        </el-button>
                    </div>
                </div>
            </div>
        </el-card>
        <!-- 内容展示卡片 -->
        <el-card class="content-card">
            <!-- 动态组件，带过渡效果 -->
            <Transition enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut" mode="out-in">
                <component :is="componentName" :filterParams="filterParams" :tableData="companyData"
                    @editor="editorCompany" @delete="deleteCompany"></component>
            </Transition>

            <!-- 分页组件 -->
            <el-pagination v-show="showPagestion" v-model:current-page="pageNum" v-model:page-size="pageSize"
                class="pagesBox" background layout="prev, pager, next" :total="totalData" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
    // 引入所需组件和模块
    import tableAciton from '@/components/public/tableAciton.vue';
    import userTable from '@/components/user/userTable.vue';
    import userList from '@/components/user/userList.vue';
    import companyInfoEditor from '@/components/companyInfo/companyInfoEditor.vue';
    import { onMounted, ref, watch } from 'vue';
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import service from '@/axios';
    import { desEncrypt } from '@/utils/des';

    // 使用Pinia store
    const counterStore = useCounterStore()
    const { showPagestion, appList, OSlist, channelList, showLoading } = storeToRefs(counterStore)

    // 动态组件定义
    const components: any = {
        userTable,
        userList
    }
    const componentStr = ref('userTable')
    const componentName = ref<any>(userTable)

    // 下载Excel模板
    const downloadTemplate = async () => {
        try {
            showLoading.value = true
            const response = await service.get('/companyInfo/importTemplate', {
                responseType: 'blob'
            });

            // 从Content-Disposition响应头中获取文件名
            let fileName = '公司信息导入模板.xlsx'; // 默认文件名
            const disposition = response.headers['content-disposition'];
            if (disposition) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                    fileName = matches[1].replace(/['"]/g, '');
                    try {
                        fileName = decodeURIComponent(fileName); // 解码URL编码的文件名
                    } catch (e) {
                        console.warn('解码Content-Disposition中的文件名失败', e);
                    }
                }
            }

            // 创建Blob对象并触发下载
            const blob = new Blob([response.data], {
                type: response.headers['content-type'] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            ElMessage.success('模板下载成功');
        } catch (err) {
            console.error('下载模板失败', err);
            ElMessage.error('下载模板失败，请检查网络或联系管理员。');
        } finally {
            showLoading.value = false
        }
    }

    // 通过Excel导入公司信息
    const importCompany = async (options: any) => {
        try {
            const { file } = options
            const formData = new FormData()
            formData.append('file', file)
            showLoading.value = true
            const res = await service.post('/companyInfo/importByExcel', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (res.data.code === 200) {
                ElMessage.success(res.data.msg)
                getUserList()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('导入失败', err);
        } finally {
            showLoading.value = false
        }
    }

    // 分页状态
    const pageNum = ref<number>(1)
    const pageSize = ref<number>(10)
    const totalData = ref<number>(0)
    watch(() => pageNum.value, () => {
        getUserList()
    })

    // 新增公司弹窗控制
    const showCompanyEditor = ref<boolean>(false)
    watch(() => showCompanyEditor.value, (newV) => {
        if (!newV) {
            companyInfo.value = {} // 关闭弹窗时清空公司信息
            getUserList() // 重新获取列表
        }
    })
    const addCompany = () => {
        showCompanyEditor.value = true
    }

    // 编辑公司信息
    const companyInfo = ref<any>()
    const editorCompany = (item: any) => {
        companyInfo.value = item
        showCompanyEditor.value = true
    }
    //删除公司
    const deleteCompanyFn = async (companyNo: string) => {
        try {
            showLoading.value = true
            const res = await service.post(`/companyInfo/del/${companyNo}`)
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
    const deleteCompany = (item: any) => {
        ElMessageBox.confirm(
            '此操作将永久删除该公司, 是否继续?',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(() => {
            deleteCompanyFn(item.companyNo)
        })
    }
    //搜索参数
    interface SearchParams {
        companyNo: string
        companyName: string



    }
    const searchParams = ref<SearchParams>(
        {
            companyNo: '',
            companyName: '',

        }
    )
    //重置搜索
    const resetSearch = () => {
        searchParams.value = {
            companyNo: '',
            companyName: '',

        }
        getUserList()
    }
    interface CompanyItem {
        companyNo: string;    // 公司编号
        companyName: string;  // 公司名称
        companyAdd: string;    // 公司简称
        companyEName: string;  // 公司名称（英）
        companyEmail: string;        // 公司邮箱
        appSum: number;     // 公司应用数
    }

    const companyNote: any = {
        companyNo: '公司编号',
        companyName: '公司名称',
        companyAdd: '公司简称',
        companyEName: '公司名称（英）',
        companyEmail: '公司邮箱',
        appSum: '公司应用数'

    }
    // 生成用户数据
    const companyData = ref<CompanyItem[]>([]
    )
    interface filterParams {
        note: string
        isShow: boolean
        key: string
    }
    const filterParams = ref<filterParams[]>()
    const getUserList = async () => {
        try {
            showLoading.value = true

            const params = {
                timestamp: Date.now(),
                pageNum: pageNum.value,
                pageSize: pageSize.value,
                companyNo: searchParams.value.companyNo,
                companyName: searchParams.value.companyName,
            }
            const enData = desEncrypt(JSON.stringify(params))

            const res = await service.post('/companyInfo/list', {
                enData
            })

            console.log('获取公司列表', res);
            if (res.data.code === 200) {
                companyData.value = res.data.rows
                totalData.value = res.data.total
            }
            const keys = Object.keys(companyNote)
            filterParams.value = keys.map((item) => {
                return {
                    note: companyNote[item],
                    isShow: true,
                    key: item
                }
            })
            console.log('filterParams', filterParams.value);
        } catch (err) {

            console.log('获取公司列表失败');
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

            .card-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;

                .left-actions {
                    display: flex;
                    align-items: center;
                    column-gap: 20px;

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
            height: max-content;

            .pagesBox {
                margin-top: 30px;
            }
        }
    }
</style>