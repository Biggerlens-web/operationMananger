<template>
    <div class="versionHistory_page">
        <el-card>
            <el-tabs v-model="activeTabName">
                <el-tab-pane label="Android" name="android">
                    <el-collapse v-model="activeCollapseNames">
                        <el-collapse-item title="版本 1.1.0" name="1.1.0">
                            <div class="version-section">
                                <h3>未加固</h3>
                                <el-table :data="androidVersions['1.1.0']?.notReinforced" style="width: 100%" border>
                                    <el-table-column prop="id" label="编号" width="80" />
                                    <el-table-column prop="folderName" label="文件夹名" />
                                    <el-table-column prop="appName" label="应用名" />
                                    <el-table-column prop="packageName" label="包名" />
                                    <el-table-column prop="buildVariant" label="Build Variant" />
                                    <el-table-column prop="channel" label="渠道" />
                                    <el-table-column prop="versionName" label="版本 (版本号)" />
                                    <el-table-column prop="uploadTime" label="上传时间" />
                                    <el-table-column prop="uploader" label="上传人" />
                                    <el-table-column prop="fileSize" label="文件大小" />
                                    <el-table-column prop="notes" label="备注" />
                                    <el-table-column prop="usageScenario" label="使用场景" />
                                    <el-table-column prop="fileMD5" label="文件MD5" />
                                    <el-table-column label="操作" width="300" fixed="right">
                                        <template #default="scope">
                                            <el-button size="small" style="margin: 0;margin-right:5px ;"
                                                @click="handleView(scope.row)">查看</el-button>
                                            <el-button size="small" style="margin: 0;margin-right:5px ;" type="primary"
                                                @click="handleModify(scope.row)">修改</el-button>
                                            <el-button size="small" style="margin: 0;margin-right:5px ;" type="success"
                                                @click="handleReinforce(scope.row)">加固</el-button>
                                            <el-button size="small" style="margin: 0;margin-right:5px ;" type="warning"
                                                @click="handleDownload(scope.row)">下载</el-button>
                                            <el-button size="small" style="margin: 0;margin-right:5px ;" type="danger"
                                                @click="handleDelete(scope.row)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div class="version-section">
                                <h3>已加固</h3>
                                <el-table :data="androidVersions['1.1.0']?.reinforced" style="width: 100%" border>
                                    <el-table-column prop="id" label="编号" width="80" />
                                    <el-table-column prop="folderName" label="文件夹名" />
                                    <el-table-column prop="appName" label="应用名" />
                                    <el-table-column prop="packageName" label="包名" />
                                    <el-table-column prop="buildVariant" label="Build Variant" />
                                    <el-table-column prop="channel" label="渠道" />
                                    <el-table-column prop="versionName" label="版本 (版本号)" />
                                    <el-table-column prop="uploadTime" label="上传时间" />
                                    <el-table-column prop="uploader" label="上传人" />
                                    <el-table-column prop="fileSize" label="文件大小" />
                                    <el-table-column prop="notes" label="备注" />
                                    <el-table-column prop="usageScenario" label="使用场景" />
                                    <el-table-column prop="fileMD5" label="文件MD5" />
                                    <el-table-column label="操作" width="300" fixed="right">
                                        <template #default="scope">
                                            <el-button size="small" style="margin: 0;margin-right:5px ;"
                                                @click="handleView(scope.row)">查看</el-button>
                                            <el-button size="small" style="margin: 0;margin-right:5px ;" type="primary"
                                                @click="handleModify(scope.row)">修改</el-button>
                                            <el-button size="small" style="margin: 0;margin-right:5px ;" type="warning"
                                                @click="handleDownload(scope.row)">下载</el-button>
                                            <el-button size="small" style="margin: 0;margin-right:5px ;" type="danger"
                                                @click="handleDelete(scope.row)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-collapse-item>
                        <el-collapse-item title="版本 1.0.0" name="1.0.0">
                            <div class="version-section">
                                <h3>未加固</h3>
                                <el-table :data="androidVersions['1.0.0']?.notReinforced" style="width: 100%" border>
                                    <el-table-column prop="id" label="编号" width="80" />
                                    <el-table-column prop="folderName" label="文件夹名" />
                                    <el-table-column prop="appName" label="应用名" />
                                    <el-table-column prop="packageName" label="包名" />
                                    <el-table-column prop="buildVariant" label="Build Variant" />
                                    <el-table-column prop="channel" label="渠道" />
                                    <el-table-column prop="versionName" label="版本 (版本号)" />
                                    <el-table-column prop="uploadTime" label="上传时间" />
                                    <el-table-column prop="uploader" label="上传人" />
                                    <el-table-column prop="fileSize" label="文件大小" />
                                    <el-table-column prop="notes" label="备注" />
                                    <el-table-column prop="usageScenario" label="使用场景" />
                                    <el-table-column prop="fileMD5" label="文件MD5" />
                                    <el-table-column label="操作" width="300" fixed="right">
                                        <template #default="scope">
                                            <el-button size="small" style="margin: 0;margin-right:5px ;"
                                                @click="handleView(scope.row)">查看</el-button>
                                            <el-button size="small" type="primary" style="margin: 0;margin-right:5px ;"
                                                @click="handleModify(scope.row)">修改</el-button>
                                            <el-button size="small" type="success" style="margin: 0;margin-right:5px ;"
                                                @click="handleReinforce(scope.row)">加固</el-button>
                                            <el-button size="small" type="warning" style="margin: 0;margin-right:5px ;"
                                                @click="handleDownload(scope.row)">下载</el-button>
                                            <el-button size="small" type="danger"
                                                @click="handleDelete(scope.row)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div class="version-section">
                                <h3>已加固</h3>
                                <el-table :data="androidVersions['1.0.0']?.reinforced" style="width: 100%" border>
                                    <el-table-column prop="id" label="编号" width="80" />
                                    <el-table-column prop="folderName" label="文件夹名" />
                                    <el-table-column prop="appName" label="应用名" />
                                    <el-table-column prop="packageName" label="包名" />
                                    <el-table-column prop="buildVariant" label="Build Variant" />
                                    <el-table-column prop="channel" label="渠道" />
                                    <el-table-column prop="versionName" label="版本 (版本号)" />
                                    <el-table-column prop="uploadTime" label="上传时间" />
                                    <el-table-column prop="uploader" label="上传人" />
                                    <el-table-column prop="fileSize" label="文件大小" />
                                    <el-table-column prop="notes" label="备注" />
                                    <el-table-column prop="usageScenario" label="使用场景" />
                                    <el-table-column prop="fileMD5" label="文件MD5" />
                                    <el-table-column label="操作" width="300" fixed="right">
                                        <template #default="scope">
                                            <el-button size="small" style="margin: 0;margin-right:5px ;"
                                                @click="handleView(scope.row)">查看</el-button>
                                            <el-button size="small" style="margin: 0;margin-right:5px ;" type="primary"
                                                @click="handleModify(scope.row)">修改</el-button>
                                            <el-button size="small" style="margin: 0;margin-right:5px ;" type="warning"
                                                @click="handleDownload(scope.row)">下载</el-button>
                                            <el-button size="small" style="margin: 0;margin-right:5px ;" type="danger"
                                                @click="handleDelete(scope.row)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </el-tab-pane>
                <el-tab-pane label="iOS" name="ios">
                    <el-collapse v-model="activeCollapseNames">
                        <el-collapse-item title="版本 1.1.0" name="1.1.0">
                            <div class="version-section">
                                <h3>未加固</h3>
                                <el-table :data="androidVersions['1.1.0']?.notReinforced" style="width: 100%" border>
                                    <el-table-column prop="id" label="编号" width="80" />
                                    <el-table-column prop="folderName" label="文件夹名" />
                                    <el-table-column prop="appName" label="应用名" />
                                    <el-table-column prop="packageName" label="包名" />
                                    <el-table-column prop="buildVariant" label="Build Variant" />
                                    <el-table-column prop="channel" label="渠道" />
                                    <el-table-column prop="versionName" label="版本 (版本号)" />
                                    <el-table-column prop="uploadTime" label="上传时间" />
                                    <el-table-column prop="uploader" label="上传人" />
                                    <el-table-column prop="fileSize" label="文件大小" />
                                    <el-table-column prop="notes" label="备注" />
                                    <el-table-column prop="usageScenario" label="使用场景" />
                                    <el-table-column prop="fileMD5" label="文件MD5" />
                                    <el-table-column label="操作" width="300" fixed="right">
                                        <template #default="scope">
                                            <el-button size="small" style="margin: 0;margin-right:5px ;"
                                                @click="handleView(scope.row)">查看</el-button>
                                            <el-button size="small" style="margin: 0;margin-right:5px ;" type="primary"
                                                @click="handleModify(scope.row)">修改</el-button>
                                            <el-button size="small" style="margin: 0;margin-right:5px ;" type="success"
                                                @click="handleReinforce(scope.row)">加固</el-button>
                                            <el-button size="small" style="margin: 0;margin-right:5px ;" type="warning"
                                                @click="handleDownload(scope.row)">下载</el-button>
                                            <el-button size="small" style="margin: 0;margin-right:5px ;" type="danger"
                                                @click="handleDelete(scope.row)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div class="version-section">
                                <h3>已加固</h3>
                                <el-table :data="androidVersions['1.1.0']?.reinforced" style="width: 100%" border>
                                    <el-table-column prop="id" label="编号" width="80" />
                                    <el-table-column prop="folderName" label="文件夹名" />
                                    <el-table-column prop="appName" label="应用名" />
                                    <el-table-column prop="packageName" label="包名" />
                                    <el-table-column prop="buildVariant" label="Build Variant" />
                                    <el-table-column prop="channel" label="渠道" />
                                    <el-table-column prop="versionName" label="版本 (版本号)" />
                                    <el-table-column prop="uploadTime" label="上传时间" />
                                    <el-table-column prop="uploader" label="上传人" />
                                    <el-table-column prop="fileSize" label="文件大小" />
                                    <el-table-column prop="notes" label="备注" />
                                    <el-table-column prop="usageScenario" label="使用场景" />
                                    <el-table-column prop="fileMD5" label="文件MD5" />
                                    <el-table-column label="操作" width="300" fixed="right">
                                        <template #default="scope">
                                            <el-button size="small" style="margin: 0;margin-right:5px ;"
                                                @click="handleView(scope.row)">查看</el-button>
                                            <el-button size="small" style="margin: 0;margin-right:5px ;" type="primary"
                                                @click="handleModify(scope.row)">修改</el-button>
                                            <el-button size="small" style="margin: 0;margin-right:5px ;" type="warning"
                                                @click="handleDownload(scope.row)">下载</el-button>
                                            <el-button size="small" style="margin: 0;margin-right:5px ;" type="danger"
                                                @click="handleDelete(scope.row)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-collapse-item>
                        <el-collapse-item title="版本 1.0.0" name="1.0.0">
                            <div class="version-section">
                                <h3>未加固</h3>
                                <el-table :data="androidVersions['1.0.0']?.notReinforced" style="width: 100%" border>
                                    <el-table-column prop="id" label="编号" width="80" />
                                    <el-table-column prop="folderName" label="文件夹名" />
                                    <el-table-column prop="appName" label="应用名" />
                                    <el-table-column prop="packageName" label="包名" />
                                    <el-table-column prop="buildVariant" label="Build Variant" />
                                    <el-table-column prop="channel" label="渠道" />
                                    <el-table-column prop="versionName" label="版本 (版本号)" />
                                    <el-table-column prop="uploadTime" label="上传时间" />
                                    <el-table-column prop="uploader" label="上传人" />
                                    <el-table-column prop="fileSize" label="文件大小" />
                                    <el-table-column prop="notes" label="备注" />
                                    <el-table-column prop="usageScenario" label="使用场景" />
                                    <el-table-column prop="fileMD5" label="文件MD5" />
                                    <el-table-column label="操作" width="300">
                                        <template #default="scope">
                                            <el-button size="small" style="margin: 0;margin-right:5px ;"
                                                @click="handleView(scope.row)">查看</el-button>
                                            <el-button size="small" style="margin: 0;margin-right:5px ;" type="primary"
                                                @click="handleModify(scope.row)">修改</el-button>
                                            <el-button size="small" style="margin: 0;margin-right:5px ;" type="success"
                                                @click="handleReinforce(scope.row)">加固</el-button>
                                            <el-button size="small" style="margin: 0;margin-right:5px ;" type="warning"
                                                @click="handleDownload(scope.row)">下载</el-button>
                                            <el-button size="small" style="margin: 0;margin-right:5px ;" type="danger"
                                                @click="handleDelete(scope.row)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div class="version-section">
                                <h3>已加固</h3>
                                <el-table :data="androidVersions['1.0.0']?.reinforced" style="width: 100%" border>
                                    <el-table-column prop="id" label="编号" width="80" />
                                    <el-table-column prop="folderName" label="文件夹名" />
                                    <el-table-column prop="appName" label="应用名" />
                                    <el-table-column prop="packageName" label="包名" />
                                    <el-table-column prop="buildVariant" label="Build Variant" />
                                    <el-table-column prop="channel" label="渠道" />
                                    <el-table-column prop="versionName" label="版本 (版本号)" />
                                    <el-table-column prop="uploadTime" label="上传时间" />
                                    <el-table-column prop="uploader" label="上传人" />
                                    <el-table-column prop="fileSize" label="文件大小" />
                                    <el-table-column prop="notes" label="备注" />
                                    <el-table-column prop="usageScenario" label="使用场景" />
                                    <el-table-column prop="fileMD5" label="文件MD5" />
                                    <el-table-column label="操作" width="300">
                                        <template #default="scope">
                                            <el-button size="small" style="margin: 0;margin-right:5px ;"
                                                @click="handleView(scope.row)">查看</el-button>
                                            <el-button size="small" style="margin: 0;margin-right:5px ;" type="primary"
                                                @click="handleModify(scope.row)">修改</el-button>
                                            <el-button size="small" style="margin: 0;margin-right:5px ;" type="warning"
                                                @click="handleDownload(scope.row)">下载</el-button>
                                            <el-button size="small" style="margin: 0;margin-right:5px ;" type="danger"
                                                @click="handleDelete(scope.row)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
    import { ref, reactive } from 'vue';
    import { ElMessage, ElMessageBox } from 'element-plus';

    interface VersionItem {
        id: string;
        folderName: string;
        appName: string;
        packageName: string;
        buildVariant: string;
        channel: string;
        versionName: string;
        uploadTime: string;
        uploader: string;
        fileSize: string;
        notes: string;
        usageScenario: string;
        fileMD5: string;
    }

    interface VersionGroup {
        notReinforced: VersionItem[];
        reinforced: VersionItem[];
    }

    const activeTabName = ref('android');
    const activeCollapseNames = ref(['1.1.0']); // 默认展开第一个版本

    // 示例数据，后续可以从API获取
    const androidVersions = reactive<Record<string, VersionGroup>>({
        '1.1.0': {
            notReinforced: [
                {
                    id: '001',
                    folderName: 'App_V1.1.0_NotReinforced',
                    appName: '示例应用',
                    packageName: 'com.example.app',
                    buildVariant: 'release',
                    channel: 'official',
                    versionName: '1.1.0 (110)',
                    uploadTime: '2023-10-26 10:00',
                    uploader: '张三',
                    fileSize: '50MB',
                    notes: '初始版本',
                    usageScenario: '常规发布',
                    fileMD5: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4'
                }
            ],
            reinforced: [
                {
                    id: '002',
                    folderName: 'App_V1.1.0_Reinforced',
                    appName: '示例应用 (加固)',
                    packageName: 'com.example.app.reinforced',
                    buildVariant: 'release',
                    channel: 'official',
                    versionName: '1.1.0 (110)',
                    uploadTime: '2023-10-26 11:00',
                    uploader: '李四',
                    fileSize: '52MB',
                    notes: '加固版本',
                    usageScenario: '安全发布',
                    fileMD5: 'f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3'
                }
            ]
        },
        '1.0.0': {
            notReinforced: [
                {
                    id: '003',
                    folderName: 'App_V1.0.0_NotReinforced',
                    appName: '示例应用',
                    packageName: 'com.example.app',
                    buildVariant: 'debug',
                    channel: 'internal',
                    versionName: '1.0.0 (100)',
                    uploadTime: '2023-09-15 14:00',
                    uploader: '王五',
                    fileSize: '48MB',
                    notes: '测试版本',
                    usageScenario: '内部测试',
                    fileMD5: '1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d'
                }
            ],
            reinforced: []
        }
    });

    const handleView = (row: VersionItem) => {
        console.log('查看:', row);
        ElMessage.info(`查看: ${row.appName}`);
    };

    const handleModify = (row: VersionItem) => {
        console.log('修改:', row);
        ElMessageBox.prompt('请输入新的备注信息', '修改备注', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: row.notes,
        })
            .then(({ value }) => {
                row.notes = value; // 仅为示例，实际应调用API更新
                ElMessage.success('备注修改成功');
            })
            .catch(() => {
                ElMessage.info('取消修改');
            });
    };

    const handleReinforce = (row: VersionItem) => {
        console.log('加固:', row);
        ElMessageBox.confirm(`确定要加固应用 ${row.appName} 吗?`, '确认加固', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
            .then(() => {
                // 实际加固逻辑，例如调用API，然后更新列表
                ElMessage.success(`${row.appName} 加固任务已提交`);
            })
            .catch(() => {
                ElMessage.info('取消加固');
            });
    };

    const handleDownload = (row: VersionItem) => {
        console.log('下载:', row);
        ElMessage.info(`开始下载: ${row.appName}`);
        // 实际下载逻辑
    };

    const handleDelete = (row: VersionItem) => {
        console.log('删除:', row);
        ElMessageBox.confirm(`确定要删除 ${row.appName} (${row.versionName}) 吗? 此操作不可恢复。`, '确认删除', {
            confirmButtonText: '确定删除',
            cancelButtonText: '取消',
            type: 'error',
        })
            .then(() => {
                // 实际删除逻辑，例如调用API，然后从列表中移除
                ElMessage.success(`${row.appName} 已删除`);
                // 示例：从数据中移除 (实际应更新整个 androidVersions 或特定版本的列表)
                // 这部分需要更复杂的逻辑来定位和删除项目，暂时简化处理
            })
            .catch(() => {
                ElMessage.info('取消删除');
            });
    };

</script>

<style lang="scss" scoped>
    .versionHistory_page {
        padding: 20px;
        background-color: #f5f7fa;
    }

    .el-card {
        border-radius: 8px;
    }

    .el-tabs {
        :deep(.el-tabs__header) {
            margin-bottom: 20px;
        }

        :deep(.el-tabs__nav-wrap::after) {
            display: none; // 移除tabs下方的默认线条
        }
    }

    .el-collapse {
        border-top: none;
        border-bottom: none;

        :deep(.el-collapse-item__header) {
            font-size: 16px;
            font-weight: bold;
            border-bottom: 1px solid #ebeef5;

            &.is-active {
                border-bottom-color: transparent;
            }
        }

        :deep(.el-collapse-item__wrap) {
            border-bottom: none;
        }

        :deep(.el-collapse-item__content) {
            padding-bottom: 0;
        }
    }

    .version-section {
        margin-bottom: 20px;

        h3 {
            font-size: 15px;
            color: #303133;
            margin-bottom: 15px;
            padding-left: 10px;
            border-left: 3px solid var(--el-color-primary);
        }
    }

    .el-table {
        font-size: 13px;

        :deep(th) {
            background-color: #fafafa;
            color: #606266;
            font-weight: 500;
        }

        :deep(.el-button) {
            margin-right: 5px;

            &:last-child {
                margin-right: 0;
            }
        }
    }

    p {
        text-align: center;
        color: #909399;
        padding: 20px;
    }
</style>