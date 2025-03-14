<template>
    <div class="user-list-container">
        <ul class="user-list">
            <li v-for="item in tableData" :key="item.id" class="user-item">
                <div class="user-card">
                    <!-- 左侧：头像和基本信息 -->
                    <div class="user-primary">
                        <div v-if="avatarShow()" class="user-avatar">
                            <img :src="item.avatar" alt="用户头像">
                            <div class="user-status" :class="getStatusClass(item)"></div>
                        </div>

                        <div class="user-basic-info">
                            <!-- 假设有姓名和用户名字段 -->
                            <h3 class="user-name">{{
                                item.name
                                ||
                                item.text
                                ||
                                item.shortName
                                ||
                                item.companyName
                                ||
                                item.carouselName
                                ||
                                item.typeName
                                ||
                                item.channelName
                                ||
                                item.imageName
                                ||
                                item.language
                                ||
                                item.tag ||
                                '' }}
                            </h3>

                        </div>
                    </div>

                    <!-- 中间：详细信息 -->
                    <div class="user-details">
                        <div class="details-grid">
                            <div v-for="param in visibleParams" :key="param.key" class="detail-item">
                                <div class="detail-icon">
                                    <el-icon>
                                        <component :is="getIconForParam(param.key)" />
                                    </el-icon>
                                </div>
                                <div class="detail-content">
                                    <div class="detail-label">{{ param.note }}</div>
                                    <div class="detail-value">{{ formatValue(item[param.key], param.key) }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 右侧：操作按钮 -->
                    <div class="user-actions">
                        <el-button type="primary" size="small" plain @click="handleEditor(item)">
                            <el-icon>
                                <Edit />
                            </el-icon>
                            编辑
                        </el-button>
                        <el-button style="margin: 0;" type="danger" size="small" plain @click="handleDelete(item)">
                            <el-icon>
                                <Delete />
                            </el-icon>
                            删除
                        </el-button>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from 'vue'
    const props = defineProps<{
        filterParams: any
        tableData: any
    }>()

    import {
        User, Phone, Message, Calendar, Location,
        Connection, Lock, Edit, Delete
    } from '@element-plus/icons-vue'

    // 计算可见的参数（不包括头像）
    const visibleParams = computed(() => {
        return props.filterParams.filter((param: any) =>
            param.key !== 'avatar' && param.isShow
        )
    })

    // 获取参数对应的图标
    const getIconForParam = (key: string) => {
        const iconMap: Record<string, string> = {
            name: 'User',
            username: 'User',
            gender: 'User',
            phone: 'Phone',
            email: 'Message',
            lastLoginTime: 'Calendar',
            lastLoginIp: 'Connection',
            loginCount: 'Connection',
            remark: 'Edit'
            // 添加更多映射...
        }

        return iconMap[key] || 'Document'
    }

    // 格式化显示的值
    const formatValue = (value: any, key: string) => {
        if (value === undefined || value === null) return '暂无数据'

        // 根据不同字段类型格式化
        switch (key) {
            case 'lastLoginTime':
                return formatDate(value)
            case 'loginCount':
                return `${value} 次`
            case 'gender':
                return value === '男' ? '👨 男' : '👩 女'
            default:
                return value
        }
    }

    // 简单的日期格式化函数
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '暂无记录'

        try {
            const date = new Date(dateStr)
            return date.toLocaleString()
        } catch (e) {
            return dateStr
        }
    }

    // 获取用户状态样式类
    const getStatusClass = (user: any) => {
        // 这里可以根据实际数据判断用户状态
        // 例如根据最后登录时间或其他状态字段
        const now = new Date()
        const lastLogin = user.lastLoginTime ? new Date(user.lastLoginTime) : null

        if (!lastLogin) return 'status-inactive'

        const daysDiff = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)

        if (daysDiff < 1) return 'status-online'
        if (daysDiff < 7) return 'status-active'
        return 'status-inactive'
    }

    const avatarShow = () => {
        const index = props.filterParams.findIndex((item: any) => item.key === 'avatar')
        if (index != -1) {
            return props.filterParams[index].isShow
        }
    }

    const handleEditor = (item: any) => {

    }
    const handleDelete = (item: any) => {

    }
</script>

<style lang="scss" scoped>
    .user-list-container {
        height: 600px;
        overflow-y: auto;
        padding: 16px;
        background-color: #f5f7fa;
        border-radius: 8px;
        box-sizing: border-box;

        &::-webkit-scrollbar {
            width: 8px;
        }

        &::-webkit-scrollbar-thumb {
            background-color: #c0c4cc;
            border-radius: 4px;
        }

        &::-webkit-scrollbar-track {
            background-color: #f5f7fa;
        }
    }

    .user-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .user-item {
        margin-bottom: 16px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .user-card {
        display: flex;
        align-items: center;
        padding: 20px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.1);
        }
    }

    .user-primary {
        display: flex;
        align-items: center;
        min-width: 200px;
        padding-right: 20px;
        border-right: 1px solid #ebeef5;
    }

    .user-avatar {
        position: relative;
        margin-right: 16px;

        img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #fff;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .user-status {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: 2px solid #fff;
        }

        .status-online {
            background-color: #67c23a;
        }

        .status-active {
            background-color: #409eff;
        }

        .status-inactive {
            background-color: #909399;
        }
    }

    .user-basic-info {
        .user-name {
            margin: 0 0 4px;
            font-size: 16px;
            font-weight: 600;
            color: #303133;
        }

        .user-username {
            margin: 0;
            font-size: 14px;
            color: #909399;
        }
    }

    .user-details {
        flex-grow: 1;
        padding: 0 20px;
        overflow-x: auto;

        &::-webkit-scrollbar {
            height: 6px;
        }

        &::-webkit-scrollbar-thumb {
            background-color: #c0c4cc;
            border-radius: 3px;
        }

        .details-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 16px;
        }

        .detail-item {
            display: flex;
            align-items: flex-start;
        }

        .detail-icon {
            margin-right: 10px;
            color: #409eff;

            .el-icon {
                font-size: 18px;
            }
        }

        .detail-content {
            flex-grow: 1;
            min-width: 0;
        }

        .detail-label {
            font-size: 12px;
            color: #909399;
            margin-bottom: 4px;
        }

        .detail-value {
            font-size: 14px;
            color: #303133;
            word-break: break-word;
        }
    }

    .user-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-width: 100px;
        padding-left: 20px;
        border-left: 1px solid #ebeef5;
    }

    /* 响应式调整 */
    @media (max-width: 992px) {
        .user-card {
            flex-direction: column;
            align-items: stretch;
        }

        .user-primary {
            border-right: none;
            border-bottom: 1px solid #ebeef5;
            padding-right: 0;
            padding-bottom: 16px;
            margin-bottom: 16px;
            width: 100%;
        }

        .user-details {
            padding: 0 0 16px;
            border-bottom: 1px solid #ebeef5;
            margin-bottom: 16px;

            .details-grid {
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            }
        }

        .user-actions {
            flex-direction: row;
            padding-left: 0;
            border-left: none;
            justify-content: flex-end;
            width: 100%;
        }
    }

    @media (max-width: 576px) {
        .user-details .details-grid {
            grid-template-columns: 1fr;
        }
    }
</style>