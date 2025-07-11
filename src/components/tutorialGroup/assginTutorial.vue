<template>
    <el-dialog v-model="dialogVisible">

    </el-dialog>
</template>

<script lang="ts" setup>
    const dialogVisible = defineModel('dialogAssgin', {
        type: Boolean,
        default: false
    })
</script>

<style lang="scss" scoped></style>