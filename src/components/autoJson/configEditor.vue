<template>
    <el-dialog v-model="dialogEditor" title="Tips" width="500" :before-close="handleClose">
        <span>This is a message</span>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">Cancel</el-button>
                <el-button type="primary" @click="handleComfirm">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    const props = defineProps<{
        dialogEditor: boolean
    }>()
    const emits = defineEmits<{
        'update:dialogEditor': [value: boolean]
    }>()
    const handleClose = () => {
        emits('update:dialogEditor', false)
    }
    const handleComfirm = () => {
        handleClose()
    }
</script>

<style lang="scss" scoped></style>