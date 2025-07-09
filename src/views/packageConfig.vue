<template>
    <div class="packageConfig_page">
        <el-card>
            <el-tabs v-model="activeTab">
                <el-tab-pane label="Android" name="android">
                    <div class="android-package-config">
                        <!-- 密钥配置 -->
                        <div class="config-section">
                            <h3 class="section-title">密钥配置</h3>
                            <el-table :data="keystoreConfig" style="width: 100%" border>
                                <el-table-column prop="channel" label="渠道" width="180">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.channel" placeholder="渠道"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="keystoreFile" label="密钥库文件" width="180">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.keystoreFile" placeholder="密钥库文件"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="keystorePassword" label="密钥库密码" width="180">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.keystorePassword" placeholder="密钥库密码"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="alias" label="别名" width="180">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.alias" placeholder="别名"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="aliasPassword" label="别名密码">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.aliasPassword" placeholder="别名密码"></el-input>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>

                        <!-- 打包配置 -->
                        <div class="config-section">
                            <h3 class="section-title">打包配置</h3>
                            <p class="section-subtitle">安装包渠道 对应 要打出哪些渠道包</p>
                            <el-table :data="packagingConfig" style="width: 100%" border>
                                <el-table-column prop="localChannelName" label="本地渠道名" width="180"></el-table-column>
                                <el-table-column label="对应打包渠道">
                                    <template #default="scope">
                                        <el-button icon="Plus" circle size="small"
                                            @click="handleAddPackageChannel(scope.row)"
                                            style="margin-right: 8px;"></el-button>
                                        <el-tag v-for="tag in scope.row.packageChannels" :key="tag.name" closable
                                            :disable-transitions="false"
                                            @close="handleRemovePackageChannel(scope.row, tag)"
                                            style="margin-right: 5px; margin-bottom: 5px;">
                                            {{ tag.name }}
                                        </el-tag>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>

                        <!-- 加固配置 -->
                        <div class="config-section reinforcement-section">
                            <el-form-item label="加固配置">
                                <el-switch v-model="reinforcementEnabled"></el-switch>
                                <span class="reinforcement-label">上传release包后是否先加固</span>
                            </el-form-item>
                        </div>

                        <div class="form-actions">
                            <el-button type="primary" @click="savePackageConfig">保存配置</el-button>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="iOS" name="ios">
                    <div class="ios-package-config">
                        <!-- 密钥配置 -->
                        <div class="config-section">
                            <h3 class="section-title">密钥配置</h3>
                            <el-table :data="keystoreConfig" style="width: 100%" border>
                                <el-table-column prop="channel" label="渠道" width="180">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.channel" placeholder="渠道"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="keystoreFile" label="密钥库文件" width="180">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.keystoreFile" placeholder="密钥库文件"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="keystorePassword" label="密钥库密码" width="180">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.keystorePassword" placeholder="密钥库密码"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="alias" label="别名" width="180">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.alias" placeholder="别名"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="aliasPassword" label="别名密码">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.aliasPassword" placeholder="别名密码"></el-input>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>

                        <!-- 打包配置 -->
                        <div class="config-section">
                            <h3 class="section-title">打包配置</h3>
                            <p class="section-subtitle">安装包渠道 对应 要打出哪些渠道包</p>
                            <el-table :data="packagingConfig" style="width: 100%" border>
                                <el-table-column prop="localChannelName" label="本地渠道名" width="180"></el-table-column>
                                <el-table-column label="对应打包渠道">
                                    <template #default="scope">
                                        <el-button icon="Plus" circle size="small"
                                            @click="handleAddPackageChannel(scope.row)"
                                            style="margin-right: 8px;"></el-button>
                                        <el-tag v-for="tag in scope.row.packageChannels" :key="tag.name" closable
                                            :disable-transitions="false"
                                            @close="handleRemovePackageChannel(scope.row, tag)"
                                            style="margin-right: 5px; margin-bottom: 5px;">
                                            {{ tag.name }}
                                        </el-tag>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>

                        <!-- 加固配置 -->
                        <div class="config-section reinforcement-section">
                            <el-form-item label="加固配置">
                                <el-switch v-model="reinforcementEnabled"></el-switch>
                                <span class="reinforcement-label">上传release包后是否先加固</span>
                            </el-form-item>
                        </div>

                        <div class="form-actions">
                            <el-button type="primary" @click="savePackageConfig">保存配置</el-button>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import { ElMessage, ElMessageBox } from 'element-plus';

    interface KeystoreItem {
        channel: string;
        keystoreFile: string;
        keystorePassword: string;
        alias: string;
        aliasPassword: string;
    }

    interface PackageChannelTag {
        name: string;

    }

    interface PackagingItem {
        id: string; // 或者 number，用于唯一标识行
        localChannelName: string;
        packageChannels: PackageChannelTag[];
    }

    const activeTab = ref<'android' | 'ios'>('android');

    const keystoreConfig = ref<KeystoreItem[]>([
        { channel: '全部渠道', keystoreFile: 'xx', keystorePassword: 'xx', alias: 'xx', aliasPassword: 'xx' },
        // 可以添加更多行的默认数据或通过方法动态添加
    ]);


    const packagingConfig = ref<PackagingItem[]>([
        { id: 'china', localChannelName: 'china', packageChannels: [{ name: '360-1' }, { name: '百度-9' }, { name: '小米-4' }, { name: '联想-7' }, { name: '华为-8' }, { name: 'oppo-6' }, { name: 'vivo-13' }, { name: '荣耀-16' }, { name: '抖音-douyin' }, { name: '应用宝-2' }, { name: 'PP助手-3' }] },
        { id: 'umeng', localChannelName: 'umeng', packageChannels: [{ name: '360-1' }, { name: '百度-9' }, { name: '联想-7' }, { name: '荣耀-16' }, { name: '应用宝-2' }, { name: 'PP助手-3' }, { name: '酷安-15' }] },
        { id: 'xiaomi', localChannelName: 'xiaomi', packageChannels: [{ name: '小米-4' }] },
        { id: 'huawei', localChannelName: 'huawei', packageChannels: [{ name: '华为-8' }] },
        { id: 'oppo', localChannelName: 'oppo', packageChannels: [{ name: 'oppo-6' }] },
        { id: 'vivo', localChannelName: 'vivo', packageChannels: [{ name: 'vivo-13' }] },
        { id: 'honor', localChannelName: 'honor', packageChannels: [{ name: '荣耀-16' }] },
        { id: 'qq', localChannelName: 'qq', packageChannels: [{ name: '应用宝-2' }] },
        { id: 'douyin', localChannelName: 'douyin', packageChannels: [{ name: '抖音-douyin' }] },
        { id: 'samsung', localChannelName: 'samsung', packageChannels: [{ name: 'samsung-14' }] },
        { id: 'google', localChannelName: 'google', packageChannels: [{ name: 'google-12' }] },
    ]);

    const reinforcementEnabled = ref(false);

    // 模拟可选的打包渠道列表
    const availableChannels = ref<PackageChannelTag[]>([
        { name: '360-1' }, { name: '百度-9' }, { name: '小米-4' }, { name: '联想-7' }, { name: '华为-8' },
        { name: 'oppo-6' }, { name: 'vivo-13' }, { name: '荣耀-16' }, { name: '抖音-douyin' }, { name: '应用宝-2' },
        { name: 'PP助手-3' }, { name: '酷安-15' }, { name: 'samsung-14' }, { name: 'google-12' }, { name: '魅族-5' }, { name: '豌豆荚-10' }
    ]);

    const handleAddPackageChannel = (row: PackagingItem) => {
        // 这里可以弹出一个对话框让用户选择渠道
        // 为简化，我们随机添加一个当前行没有的渠道
        ElMessageBox.prompt('请输入要添加的渠道包名称', '添加渠道包', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /.+/,
            inputErrorMessage: '渠道包名称不能为空'
        }).then(({ value }) => {
            if (value && !row.packageChannels.find(ch => ch.name === value)) {
                row.packageChannels.push({ name: value });
                ElMessage.success(`渠道 ${value} 添加成功`);
            } else if (row.packageChannels.find(ch => ch.name === value)) {
                ElMessage.warning(`渠道 ${value} 已存在`);
            }
        }).catch(() => {
            ElMessage.info('已取消添加');
        });
    };

    const handleRemovePackageChannel = (row: PackagingItem, tag: PackageChannelTag) => {
        row.packageChannels.splice(row.packageChannels.indexOf(tag), 1);
        ElMessage.success(`渠道 ${tag.name} 已移除`);
    };

    const savePackageConfig = () => {
        console.log('Keystore Config:', keystoreConfig.value);
        console.log('Packaging Config:', packagingConfig.value);
        console.log('Reinforcement Enabled:', reinforcementEnabled.value);
        ElMessage.success('配置已保存到控制台！');
        // 在实际应用中，这里会调用API将数据发送到后端
    };

</script>

<style lang="scss" scoped>
    .packageConfig_page {
        padding: 20px;
    }

    .config-section {
        margin-bottom: 30px;

        .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
        }

        .section-subtitle {
            font-size: 14px;
            color: #606266;
            margin-bottom: 15px;
        }
    }

    .reinforcement-section {
        display: flex;
        align-items: center;

        .el-form-item {
            margin-bottom: 0; // 移除默认的表单项间距
            display: flex;
            align-items: center;
        }

        .reinforcement-label {
            margin-left: 10px;
            font-size: 14px;
            color: #606266;
        }
    }

    .form-actions {
        margin-top: 20px;
        text-align: right;
    }

    :deep(.el-table th.el-table__cell) {
        background-color: #f5f7fa; // 表头背景色
    }

    :deep(.el-tag) {
        cursor: pointer;
    }
</style>