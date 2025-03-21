<template>
    <div class="image-preview-container">
        <!-- 主图预览区域 -->
        <div class="main-image-container">
            <div class="main-image-wrapper" :style="{ transform: `scale(${zoomLevel})` }">
                <img :src="currentImage.url" :alt="currentImage.alt || '预览图片'" class="main-image" @click="toggleZoom" />
            </div>

            <!-- 导航箭头 -->
            <div class="navigation-arrows" v-if="images.length > 1">
                <div class="nav-arrow nav-prev" @click="prevImage">
                    <i class="arrow-icon left"></i>
                </div>
                <div class="nav-arrow nav-next" @click="nextImage">
                    <i class="arrow-icon right"></i>
                </div>
            </div>

            <!-- 图片计数 -->
            <div class="image-counter">{{ currentIndex + 1 }}/{{ images.length }}</div>
        </div>

        <!-- 缩略图预览区域 -->
        <div class="thumbnails-container" v-if="images.length > 1">
            <div class="thumbnail-scroll-button prev" @click="scrollThumbnails('left')" v-show="canScrollLeft">
                <i class="arrow-icon left"></i>
            </div>

            <div class="thumbnails-wrapper" ref="thumbnailsWrapper">
                <div v-for="(image, index) in images" :key="index" class="thumbnail-item"
                    :class="{ active: index === currentIndex }" @click="selectImage(index)"
                    :ref="el => { if (el) thumbnailItemsRefs[index] = el as HTMLElement }">
                    <img :src="image.thumbnail || image.url" :alt="`缩略图 ${index + 1}`" />
                </div>
            </div>

            <div class="thumbnail-scroll-button next" @click="scrollThumbnails('right')" v-show="canScrollRight">
                <i class="arrow-icon right"></i>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'

    interface ImageItem {
        url: string;
        thumbnail?: string;
        alt?: string;
    }

    interface Props {
        images: ImageItem[];
        initialIndex?: number;
    }

    const props = withDefaults(defineProps<Props>(), {
        initialIndex: 0
    })

    const emit = defineEmits<{
        (e: 'change', index: number): void
    }>()

    // 当前显示的图片索引
    const currentIndex = ref<number>(props.initialIndex)

    // 当前显示的图片
    const currentImage = computed<ImageItem>(() => {
        return props.images[currentIndex.value] || { url: '' }
    })

    // 缩放级别
    const zoomLevel = ref<number>(1)

    // 缩略图滚动相关
    const thumbnailsWrapper = ref<HTMLElement | null>(null)
    const thumbnailItemsRefs = ref<Record<number, HTMLElement>>({})
    const canScrollLeft = ref<boolean>(false)
    const canScrollRight = ref<boolean>(false)

    // 切换到上一张图片
    const prevImage = (): void => {
        if (currentIndex.value > 0) {
            currentIndex.value--
        } else {
            currentIndex.value = props.images.length - 1
        }
        scrollToCurrentThumbnail()
        emit('change', currentIndex.value)
    }

    // 切换到下一张图片
    const nextImage = (): void => {
        if (currentIndex.value < props.images.length - 1) {
            currentIndex.value++
        } else {
            currentIndex.value = 0
        }
        scrollToCurrentThumbnail()
        emit('change', currentIndex.value)
    }

    // 选择特定图片
    const selectImage = (index: number): void => {
        currentIndex.value = index
        emit('change', currentIndex.value)
    }

    // 切换缩放状态
    const toggleZoom = (): void => {
        zoomLevel.value = zoomLevel.value === 1 ? 1.5 : 1
    }

    // 滚动缩略图
    const scrollThumbnails = (direction: 'left' | 'right'): void => {
        if (!thumbnailsWrapper.value) return

        const scrollAmount = direction === 'left' ? -200 : 200
        thumbnailsWrapper.value.scrollLeft += scrollAmount

        checkScrollability()
    }

    // 检查缩略图是否可以滚动
    const checkScrollability = (): void => {
        if (!thumbnailsWrapper.value) return

        const { scrollLeft, scrollWidth, clientWidth } = thumbnailsWrapper.value

        canScrollLeft.value = scrollLeft > 0
        canScrollRight.value = scrollLeft + clientWidth < scrollWidth
    }

    // 滚动到当前选中的缩略图
    const scrollToCurrentThumbnail = (): void => {
        nextTick(() => {
            const thumbnail = thumbnailItemsRefs.value[currentIndex.value]
            const wrapper = thumbnailsWrapper.value

            if (!thumbnail || !wrapper) return

            const thumbnailRect = thumbnail.getBoundingClientRect()
            const wrapperRect = wrapper.getBoundingClientRect()

            // 计算缩略图中心位置相对于可视区域的偏移
            const thumbnailCenter = thumbnailRect.left + thumbnailRect.width / 2
            const wrapperCenter = wrapperRect.left + wrapperRect.width / 2

            // 平滑滚动到让当前缩略图居中的位置
            wrapper.scrollLeft += (thumbnailCenter - wrapperCenter)

            checkScrollability()
        })
    }

    // 键盘快捷键
    const handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'ArrowLeft') {
            prevImage()
        } else if (e.key === 'ArrowRight') {
            nextImage()
        } else if (e.key === 'Escape') {
            zoomLevel.value = 1
        }
    }

    // 监听滚动事件
    const handleScroll = (): void => {
        checkScrollability()
    }

    onMounted(() => {
        // 添加键盘监听
        window.addEventListener('keydown', handleKeyDown)

        // 添加滚动监听
        if (thumbnailsWrapper.value) {
            thumbnailsWrapper.value.addEventListener('scroll', handleScroll)
        }

        // 初始化滚动检查
        nextTick(() => {
            checkScrollability()
            scrollToCurrentThumbnail()
        })
    })

    // 在组件卸载时移除事件监听
    onUnmounted(() => {
        window.removeEventListener('keydown', handleKeyDown)

        if (thumbnailsWrapper.value) {
            thumbnailsWrapper.value.removeEventListener('scroll', handleScroll)
        }
    })

    // 当图片数组或初始索引改变时更新
    watch(
        () => props.images,
        () => {
            nextTick(() => {
                checkScrollability()
            })
        },
        { deep: true }
    )

    watch(
        () => props.initialIndex,
        (newIndex) => {
            currentIndex.value = newIndex
            nextTick(() => {
                scrollToCurrentThumbnail()
            })
        }
    )
</script>

<style scoped lang="scss">
    .image-preview-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    /* 主图区域样式 */
    .main-image-container {
        position: relative;
        width: 100%;
        height: 400px;
        background-color: #f5f7fa;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    .main-image-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s ease;
    }

    .main-image {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        cursor: zoom-in;
    }

    /* 导航箭头样式 */
    .navigation-arrows {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .nav-arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        pointer-events: auto;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transition: all 0.2s ease;

        &:hover {
            background-color: rgba(255, 255, 255, 0.95);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        &.nav-prev {
            left: 20px;
        }

        &.nav-next {
            right: 20px;
        }
    }

    .arrow-icon {
        width: 10px;
        height: 10px;
        border-style: solid;
        border-width: 2px 2px 0 0;

        &.left {
            transform: rotate(-135deg);
            margin-left: 4px;
        }

        &.right {
            transform: rotate(45deg);
            margin-right: 4px;
        }
    }

    /* 图片计数样式 */
    .image-counter {
        position: absolute;
        bottom: 15px;
        right: 15px;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
    }

    /* 缩略图区域样式 */
    .thumbnails-container {
        position: relative;
        width: 100%;
        padding: 15px 0;
        display: flex;
        align-items: center;
        background-color: #fff;
        border-top: 1px solid #ebeef5;
    }

    .thumbnail-scroll-button {
        flex-shrink: 0;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #f2f6fc;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin: 0 10px;
        transition: all 0.2s ease;

        &:hover {
            background-color: #e6ebf5;
        }

        .arrow-icon {
            width: 8px;
            height: 8px;
        }
    }

    .thumbnails-wrapper {
        flex: 1;
        display: flex;
        overflow-x: auto;
        overflow-y: hidden;
        scroll-behavior: smooth;
        scrollbar-width: none;
        /* Firefox */

        &::-webkit-scrollbar {
            display: none;
            /* Chrome, Safari, Edge */
        }
    }

    .thumbnail-item {
        flex-shrink: 0;
        width: 80px;
        height: 60px;
        margin: 0 5px;
        border-radius: 4px;
        overflow: hidden;
        cursor: pointer;
        border: 2px solid transparent;
        transition: all 0.2s ease;

        &:hover {
            border-color: #c0c4cc;
        }

        &.active {
            border-color: #409eff;
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    /* 响应式设计 */
    @media (max-width: 768px) {
        .main-image-container {
            height: 300px;
        }

        .thumbnail-item {
            width: 60px;
            height: 45px;
        }

        .nav-arrow {
            width: 32px;
            height: 32px;
        }
    }
</style>