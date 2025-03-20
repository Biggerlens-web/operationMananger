<template>
    <div>

        <el-card class="filterBox">
            <el-select filterable v-model="searchParams.companyNo" placeholder="应用" class="filter-select"
                style="width: 200px;">
                <el-option v-for="item in appList" :key="item.appNo"
                    :label="`应用:${item.appAbbreviation} 公司:${item.companyName} [appId:${item.id || item.appNo}]`"
                    :value="item.appNo" />
            </el-select>

        </el-card>
        <el-card class="content_card" @click="enMove">
            <div class="parentBox" ref="parentRef">
                <div class="left" :style="{ width: leftWidth + '%' }">
                    <signTable />
                    <channelTable />
                </div>
                <div class="middle_line" :style="{ left: middlePosition + '%' }" @mousedown="moveline"
                    @mouseup="enMove"></div>
                <div class="right" :style="{ width: (100 - leftWidth) + '%' }">
                    <apkEditor />
                </div>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { reactive, ref } from 'vue';
    import signTable from '@/components/apk/signTable.vue';
    import channelTable from '@/components/apk/channelTable.vue';
    import apkEditor from '@/components/apk/apkEditor.vue';

    const counterStore = useCounterStore()
    const { appList } = storeToRefs(counterStore)
    const searchParams = reactive({
        companyNo: ''
    })






    const parentRef = ref<HTMLElement>()
    const middlePosition = ref<number>(70)
    const leftWidth = ref(70);
    //拖动状态
    let isDragging = false;
    let startX = 0;
    let parentWidth = 0;
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

    const moveline = (e: any) => {
        e.preventDefault()
        startX = e.clientX
        isDragging = true
        if (parentRef.value) {
            parentWidth = parentRef.value.offsetWidth
        }
        document.addEventListener('mousemove', move)
    }

    const enMove = () => {
        console.log('停止移动');
        isDragging = false;
        document.removeEventListener('mousemove', move)
    }
</script>

<style lang="scss" scoped>
    .filterBox {
        margin-bottom: 20px;
    }

    .content_card {
        height: 700px;
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

            .left,
            .right {

                overflow-x: scroll;

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
                column-gap: 100px
            }

            .right {
                box-sizing: border-box;
                padding: 10px;

            }

            .middle_line {
                width: 4px;
                height: 100%;
                background-color: #ccc;
                position: absolute;

                transform: translateX(-50%); // 这个是关键，让元素真正居中
                z-index: 10;
                cursor: ew-resize;


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