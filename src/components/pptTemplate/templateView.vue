<template>
    <el-dialog :model-value="dialogVisible" title="" width="1000" :before-close="handleClose">
        <imagePreivew :images="galleryImages" :initial-index="selectedIndex" @change="handleImageChange" />

    </el-dialog>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import imagePreivew from '../imagePreivew.vue';
    const props = defineProps<{
        dialogVisible: boolean
    }>()

    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()

    const handleClose = () => {
        emit('update:dialogVisible', false)

    }
    const handleConfirm = () => {
        handleClose()
    }

    //展示图片索引
    const selectedIndex = ref<number>(0);

    const handleImageChange = () => {

    }

    const galleryImages = ref<any>([
        {
            url: 'https://example.com/images/image1-large.jpg',
            thumbnail: 'https://example.com/images/image1-thumb.jpg',
            alt: '图片1描述'
        },
        {
            url: 'https://example.com/images/image2-large.jpg',
            thumbnail: 'https://example.com/images/image2-thumb.jpg',
            alt: '图片2描述'
        },
        {
            url: 'https://example.com/images/image3-large.jpg',
            thumbnail: 'https://example.com/images/image3-thumb.jpg',
            alt: '图片3描述'
        },
        {
            url: 'https://example.com/images/image1-large.jpg',
            thumbnail: 'https://example.com/images/image1-thumb.jpg',
            alt: '图片1描述'
        },
        {
            url: 'https://example.com/images/image2-large.jpg',
            thumbnail: 'https://example.com/images/image2-thumb.jpg',
            alt: '图片2描述'
        },
        {
            url: 'https://example.com/images/image3-large.jpg',
            thumbnail: 'https://example.com/images/image3-thumb.jpg',
            alt: '图片3描述'
        }
        ,
        {
            url: 'https://example.com/images/image1-large.jpg',
            thumbnail: 'https://example.com/images/image1-thumb.jpg',
            alt: '图片1描述'
        },
        {
            url: 'https://example.com/images/image2-large.jpg',
            thumbnail: 'https://example.com/images/image2-thumb.jpg',
            alt: '图片2描述'
        },
        {
            url: 'https://example.com/images/image3-large.jpg',
            thumbnail: 'https://example.com/images/image3-thumb.jpg',
            alt: '图片3描述'
        },
        {
            url: 'https://example.com/images/image1-large.jpg',
            thumbnail: 'https://example.com/images/image1-thumb.jpg',
            alt: '图片1描述'
        },
        {
            url: 'https://example.com/images/image2-large.jpg',
            thumbnail: 'https://example.com/images/image2-thumb.jpg',
            alt: '图片2描述'
        },
        {
            url: 'https://example.com/images/image3-large.jpg',
            thumbnail: 'https://example.com/images/image3-thumb.jpg',
            alt: '图片3描述'
        },
        {
            url: 'https://example.com/images/image1-large.jpg',
            thumbnail: 'https://example.com/images/image1-thumb.jpg',
            alt: '图片1描述'
        },
        {
            url: 'https://example.com/images/image2-large.jpg',
            thumbnail: 'https://example.com/images/image2-thumb.jpg',
            alt: '图片2描述'
        },
        {
            url: 'https://example.com/images/image3-large.jpg',
            thumbnail: 'https://example.com/images/image3-thumb.jpg',
            alt: '图片3描述'
        },
        {
            url: 'https://example.com/images/image1-large.jpg',
            thumbnail: 'https://example.com/images/image1-thumb.jpg',
            alt: '图片1描述'
        },
        {
            url: 'https://example.com/images/image2-large.jpg',
            thumbnail: 'https://example.com/images/image2-thumb.jpg',
            alt: '图片2描述'
        },
        {
            url: 'https://example.com/images/image3-large.jpg',
            thumbnail: 'https://example.com/images/image3-thumb.jpg',
            alt: '图片3描述'
        }

    ])
</script>

<style lang="scss" scoped></style>