<!-- APK签名和渠道管理视图 -->
<template>
    <div>

        <!-- <el-card class="filterBox">
            <el-select filterable v-model="searchParams.companyNo" placeholder="应用" class="filter-select"
                style="width: 200px;">
                <el-option v-for="item in appList" :key="item.appNo"
                    :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                    :value="item.appNo" />
            </el-select>

        </el-card> -->
        <!-- 内容卡片区域，包含可拖动布局 -->
        <el-card class="content_card" @click="enMove">
            <div class="parentBox" ref="parentRef">
                <!-- 左侧区域，显示签名和渠道列表 -->
                <div class="left" :style="{ width: leftWidth + '%' }">
                    <signTable :signList="signList" @delete='deleteFn' @update="getData" />
                    <channelTable :channelList="channelList" @delete='deleteFn2' @update="getData" />
                </div>
                <!-- 中间可拖动分割线 -->
                <div class="middle_line" :style="{ left: middlePosition + '%' }" @mousedown="moveline"
                    @mouseup="enMove"></div>
                <!-- 右侧区域，显示APK编辑器 -->
                <div class="right" :style="{ width: (100 - leftWidth) + '%' }">
                    <apkEditor :signsList="signList" />
                </div>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
    // 引入Pinia store
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    // 引入Vue相关API
    import { onMounted, reactive, ref, watch } from 'vue';
    // 引入子组件
    import signTable from '@/components/apk/signTable.vue';
    import channelTable from '@/components/apk/channelTable.vue';
    import apkEditor from '@/components/apk/apkEditor.vue';
    // 引入加密工具
    import { desEncrypt } from '@/utils/des';
    // 引入axios实例
    import service from '@/axios';
    // 引入Element Plus组件
    import { ElMessage, ElMessageBox } from 'element-plus';

    // 使用Pinia store
    const counterStore = useCounterStore()
    const { defaultAppNo, showLoading } = storeToRefs(counterStore) // 从store中解构状态，保持响应式


    // 分页状态 (当前未使用)
    const pageNum = ref<number>(1)
    const pageSize = ref<number>(10)
    const totalData = ref<number>(0)
    // 搜索参数
    const searchParams = reactive({
        appNo: defaultAppNo.value
    })






    // 布局相关引用和状态
    const parentRef = ref<HTMLElement>() // 父容器引用
    const middlePosition = ref<number>(70) // 分割线位置百分比
    const leftWidth = ref(70); // 左侧区域宽度百分比
    // 拖动状态变量
    let isDragging = false;
    let startX = 0; // 拖动起始X坐标
    let parentWidth = 0; // 父容器宽度
    /**
     * @description: 鼠标移动事件，处理分割线拖动
     * @param {MouseEvent} e 事件对象
     */
    const move = (e: any) => {

        if (!isDragging) return
        // 计算移动距离
        const moveX = e.clientX - startX;
        startX = e.clientX;
        // 根据移动距离更新位置（百分比）
        const percentageMoved = (moveX / parentWidth) * 100;
        const newPosition = middlePosition.value + percentageMoved;
        // 限制拖动范围（10% - 90%）
        if (newPosition >= 10 && newPosition <= 90) {
            middlePosition.value = newPosition;
            leftWidth.value = newPosition;
        }
    }

    /**
     * @description: 鼠标按下事件，开始拖动
     * @param {MouseEvent} e 事件对象
     */
    const moveline = (e: any) => {
        e.preventDefault()
        startX = e.clientX
        isDragging = true
        if (parentRef.value) {
            parentWidth = parentRef.value.offsetWidth
        }
        document.addEventListener('mousemove', move)
    }

    /**
     * @description: 鼠标松开事件，停止拖动
     */
    const enMove = () => {
        console.log('停止移动');
        isDragging = false;
        document.removeEventListener('mousemove', move)
    }


    /**
     * @description: 删除签名
     * @param {any} item 要删除的签名项
     */
    const deleteFn = async (item: any) => {
        ElMessageBox.confirm('确认删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async () => {
            try {

                showLoading.value = true
                const res = await service.post(`/apkSign/del/${item.id}`)
                if (res.data.code === 200) {
                    ElMessage.success('删除成功')
                    getData()
                }
            } catch (err) {
                console.log('删除签名失败', err);
            } finally {
                showLoading.value = false
            }
        }).catch(() => {
            //取消删除
        })
    }
    /**
     * @description: 删除渠道
     * @param {any} item 要删除的渠道项
     */
    const deleteFn2 = (item: any) => {
        ElMessageBox.confirm('确认删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async () => {
            try {
                showLoading.value = true
                const res = await service.post(`/apkSignChannels/del/${item.id}`)
                if (res.data.code === 200) {
                    ElMessage.success('删除成功')
                    getData()
                }
            } catch (err) {
                console.log('删除签名失败', err);
            } finally {
                showLoading.value = false
            }
        }).catch(() => {
            //取消删除
        })
    }
    // 签名列表数据
    const signList = ref<any>([


    ])

    // 渠道列表数据
    const channelList = ref<any>([


    ])

    /**
     * @description: 获取签名列表数据
     * @returns {Promise<any>} API响应
     */
    const getSignList = async () => {
        try {
            const params = {
                pageNum: 1,
                pageSize: 9999,
                appNo: searchParams.appNo,
                timestamp: Date.now()
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/apkSign/list', {
                enData
            })
            return res
        } catch (err) {
            console.log('获取签名列表', err);
        } finally {
            showLoading.value = false

        }
    }
    /**
     * @description: 获取渠道列表数据
     * @returns {Promise<any>} API响应
     */
    const getChannelsList = async () => {
        try {

            const params = {
                pageNum: 1,
                pageSize: 9999,
                timestamp: Date.now()
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post('/apkSignChannels/list', {
                enData
            })
            return res
        } catch (err) {

            console.log('获取渠道失败', err);
        } finally {
            showLoading.value = false

        }
    }

    /**
     * @description: 统一获取签名和渠道列表数据
     */
    const getData = async () => {
        try {

            const [signRes, channelRes] = await Promise.all([
                getSignList(),
                getChannelsList()
            ])


            console.log('签名列表:', signRes)

            signList.value = signRes?.data.rows
            console.log('渠道列表:', channelRes)

            channelList.value = channelRes?.data.rows

        } catch (err) {
            console.log('获取数据失败', err)
        }
    }



    //监听应用变化
    watch(() => defaultAppNo.value, () => {

        searchParams.appNo = defaultAppNo.value
        getData()
    })
    onMounted(() => {
        getData()
    })
</script>

<style lang="scss" scoped>
    .filterBox {
        margin-bottom: 20px;
    }

    .content_card {
        height: 800px;
        display: flex; // 确保自身也是flex布局

        :deep(.el-card__body) {
            width: 100%;
        }

        .parentBox {
            display: flex;
            height: 100%;
            width: 100%;
            flex: 1;
            position: relative;
            overflow: hidden;
            /* 防止内容超出 */

            .left,
            .right {
                overflow-x: auto;
                /* 改为auto，只在需要时显示滚动条 */
                overflow-y: auto;
                flex-shrink: 0;
                /* 防止flex收缩 */

                /* 现代浏览器通用属性 (Firefox) */
                scrollbar-width: thin;
                scrollbar-color: rgba(0, 0, 0, 0.3) rgba(0, 0, 0, 0.1);

                /* WebKit/Blink浏览器 (Chrome, Safari, Opera, Edge) */
                &::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                    /* 横向滚动条高度 */
                }

                &::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 10px;
                    margin: 4px 0;
                }

                &::-webkit-scrollbar-thumb {
                    background-color: rgba(0, 0, 0, 0.2);
                    border-radius: 10px;
                    transition: background-color 0.3s;

                    &:hover {
                        background-color: rgba(0, 0, 0, 0.4);
                    }
                }

                /* 横向和纵向滚动条交汇处 */
                &::-webkit-scrollbar-corner {
                    background: transparent;
                }

                /* 只在hover时显示滚动条 */
                &:not(:hover)::-webkit-scrollbar-thumb {
                    background-color: rgba(0, 0, 0, 0.1);
                }
            }

            .left {
                display: flex;
                column-gap: 100px;
                min-width: 0;
                /* 允许flex项目收缩到内容以下 */
            }

            .right {
                box-sizing: border-box;
                padding: 10px;
                min-width: 0;
                /* 允许flex项目收缩到内容以下 */
            }

            .middle_line {
                width: 4px;
                height: 100%;
                background-color: #ccc;
                position: absolute;
                transform: translateX(-50%); // 这个是关键，让元素真正居中
                z-index: 10;
                cursor: ew-resize;
                flex-shrink: 0;
                /* 防止分割线被压缩 */

                &::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: #999;
                    transform: scaleX(0);
                    transform-origin: center;
                    transition: transform 0.3s ease;
                }

                &:hover {
                    background-color: #ccc;
                    /* 保持原背景色 */

                    &::after {
                        transform: scaleX(2);
                        /* 使宽度从中间向两侧扩展为原来的2倍 */
                        box-shadow: 0 0 5px rgba(153, 153, 153, 0.5);
                    }
                }
            }
        }
    }
</style>