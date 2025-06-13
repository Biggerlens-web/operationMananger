<template>
    <el-dialog :model-value="dialogBatchEdite" width="500" title="批量编辑素材" :before-close="handleClose">

        <div class="dialog-content">
            <!-- <div class="dialog_input">
                <span>所属类</span>
                <el-input v-model="formData.type" placeholder="请选择所属类"></el-input>
            </div> -->
            <div class="dialog_input">
                <span>是否付费</span>
                <el-switch v-model="formData.isPaid" active-text="付费" inactive-text="免费"></el-switch>
            </div>
            <div class="dialog_input">
                <span>关联运营类</span>
                <el-checkbox-group v-model="formData.checkList">
                    <el-checkbox label="Option A" value="Value A" />
                    <el-checkbox label="Option B" value="Value B" />
                    <el-checkbox label="Option C" value="Value C" />


                </el-checkbox-group>
            </div>
        </div>


        <div class="dialog-footer">
            <el-button type="primary" @click="handleComfirm">确认</el-button>
            <el-button @click="handleClose">取消</el-button>
        </div>




    </el-dialog>
</template>

<script lang="ts" setup>
    import { reactive, ref } from 'vue';

    const dialogBatchEdite = defineModel('dialogBatchEdite')


    const formData = reactive<any>({
        type: '',
        isPaid: false,
        checkList: []
    })
    const handleClose = () => {
        dialogBatchEdite.value = false

    }
    const handleComfirm = () => {

    }


</script>

<style lang="scss" scoped>
    .dialog-content {
        display: flex;
        flex-direction: column;
        gap: 20px; // 设置子元素之间的间距
        margin-bottom: 20px;
    }

    .dialog_input {
        display: flex;
        align-items: center;
        gap: 10px; // 设置标签和输入框之间的间距

        span {
            width: 80px; // 固定标签宽度，使输入框对齐
            text-align: right;
        }

        .el-input {
            flex-grow: 1; // 让输入框占据剩余空间
        }

        .el-switch {
            flex-grow: 1;
        }
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px; // 设置按钮之间的间距
    }
</style>