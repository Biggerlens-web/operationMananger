<template>
    <div class="container" v-show="showLoading">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
    </div>
</template>

<script lang="ts" setup>
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';

    const stores = useCounterStore()
    const { showLoading } = storeToRefs(stores)

</script>

<style scoped>
    .container {
        position: fixed;
        top: 30px;
        right: 105px;
        border-radius: 50%;
        height: 30px;
        width: 30px;
        z-index: 999999;
        animation: rotate_3922 1.2s linear infinite;
        background-color: #9b59b6;
        background-image: linear-gradient(#9b59b6, #84cdfa, #5ad1cd);
    }

    .container span {
        position: absolute;
        border-radius: 50%;
        height: 100%;
        width: 100%;
        background-color: #9b59b6;
        background-image: linear-gradient(#9b59b6, #84cdfa, #5ad1cd);
    }

    .container span:nth-of-type(1) {
        filter: blur(5px);
    }

    .container span:nth-of-type(2) {
        filter: blur(10px);
    }

    .container span:nth-of-type(3) {
        filter: blur(25px);
    }

    .container span:nth-of-type(4) {
        filter: blur(50px);
    }

    .container::after {
        content: "";
        position: absolute;
        top: 10px;
        left: 10px;
        right: 10px;
        bottom: 10px;
        background-color: #fff;
        border: solid 5px #ffffff;
        border-radius: 50%;
    }

    @keyframes rotate_3922 {
        from {
            transform: translate(-50%, -50%) rotate(0deg);
        }

        to {
            transform: translate(-50%, -50%) rotate(360deg);
        }
    }
</style>
