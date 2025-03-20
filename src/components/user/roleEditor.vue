<template>
    <el-dialog :model-value="dialogVisible" title="编辑用户" width="500" :before-close="handleClose">
        <ul class="rolesList">
            <li v-for="item in rolesList" :key="item.id">
                <el-checkbox v-model="item.ischecked" :label="item.id">{{ item.name }}</el-checkbox>
            </li>

        </ul>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleComfirm">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';


    const props = defineProps<{
        dialogVisible: boolean
    }>()
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()


    const rolesList = ref<any>([
        {
            id: 1,
            name: "超级管理员",
            code: "SUPER_ADMIN",
            description: "拥有系统所有操作权限，可以管理所有内容",
            permissions: ["*"], // 所有权限
            level: 0, // 最高级别
            isSystem: true,
            createdAt: "2023-01-01 00:00:00",
            updatedAt: "2023-01-01 00:00:00",
            ischecked: true
        },
        {
            id: 2,
            name: "系统管理员",
            code: "SYSTEM_ADMIN",
            description: "管理系统配置和用户账号，但无法进行业务数据的增删改",
            permissions: ["SYSTEM_CONFIG", "USER_MANAGE", "ROLE_MANAGE", "LOG_VIEW"],
            level: 1,
            isSystem: true,
            createdAt: "2023-01-01 00:00:00",
            updatedAt: "2023-01-01 00:00:00",
            ischecked: true
        },
        {
            id: 3,
            name: "内容管理员",
            code: "CONTENT_ADMIN",
            description: "管理内容和资源，可以审核、发布、编辑内容",
            permissions: ["CONTENT_MANAGE", "CONTENT_AUDIT", "CONTENT_PUBLISH"],
            level: 2,
            isSystem: true,
            createdAt: "2023-01-01 00:00:00",
            updatedAt: "2023-01-01 00:00:00",
            ischecked: false
        },
        {
            id: 4,
            name: "运营专员",
            code: "OPERATION_SPECIALIST",
            description: "负责日常运营工作，可以管理活动、广告等",
            permissions: ["ACTIVITY_MANAGE", "AD_MANAGE", "USER_VIEW", "STATISTICS_VIEW"],
            level: 3,
            isSystem: true,
            createdAt: "2023-01-01 00:00:00",
            updatedAt: "2023-05-15 10:30:00",
            ischecked: false
        },
        {
            id: 5,
            name: "客服专员",
            code: "CUSTOMER_SERVICE",
            description: "处理用户反馈和问题，有用户信息查看权限",
            permissions: ["USER_VIEW", "FEEDBACK_MANAGE", "MESSAGE_MANAGE"],
            level: 3,
            isSystem: true,
            createdAt: "2023-01-01 00:00:00",
            updatedAt: "2023-04-10 16:45:22",
            ischecked: false
        },
        {
            id: 6,
            name: "财务专员",
            code: "FINANCE_SPECIALIST",
            description: "管理财务相关数据，处理支付和退款",
            permissions: ["ORDER_VIEW", "PAYMENT_MANAGE", "REFUND_MANAGE", "FINANCE_REPORT"],
            level: 2,
            isSystem: true,
            createdAt: "2023-01-01 00:00:00",
            updatedAt: "2023-03-22 09:15:48",
            ischecked: false
        },
        {
            id: 7,
            name: "数据分析师",
            code: "DATA_ANALYST",
            description: "分析系统数据，生成统计报表",
            permissions: ["STATISTICS_VIEW", "REPORT_MANAGE", "DATA_EXPORT"],
            level: 2,
            isSystem: true,
            createdAt: "2023-01-01 00:00:00",
            updatedAt: "2023-06-18 14:20:35",
            ischecked: false
        },
        {
            id: 8,
            name: "测试人员",
            code: "TESTER",
            description: "系统测试专用账号，拥有除敏感操作外的大部分查看权限",
            permissions: ["USER_VIEW", "CONTENT_VIEW", "SYSTEM_VIEW", "LOG_VIEW"],
            level: 4,
            isSystem: true,
            createdAt: "2023-01-01 00:00:00",
            updatedAt: "2023-02-15 11:30:00",
            ischecked: false
        },
        {
            id: 9,
            name: "编辑",
            code: "EDITOR",
            description: "内容编辑人员，可以创建和编辑内容，但不能发布",
            permissions: ["CONTENT_CREATE", "CONTENT_EDIT"],
            level: 3,
            isSystem: false,
            createdAt: "2023-02-10 09:00:00",
            updatedAt: "2023-02-10 09:00:00",
            ischecked: false
        },
        {
            id: 10,
            name: "访客",
            code: "VISITOR",
            description: "临时访问账号，仅有查看权限，无操作权限",
            permissions: ["USER_VIEW", "CONTENT_VIEW"],
            level: 5,
            isSystem: true,
            createdAt: "2023-01-01 00:00:00",
            updatedAt: "2023-01-01 00:00:00",
            ischecked: false
        }
    ])

    //取消
    const handleClose = () => {
        emit('update:dialogVisible', false)
    }
    //确定
    const handleComfirm = () => {
        handleClose()
    }
</script>

<style lang="scss" scoped></style>