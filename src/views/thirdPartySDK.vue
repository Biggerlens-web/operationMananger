<template>
    <div class="thirdPartySDK_page">
        <el-card>
            <el-tabs v-model="activeTab">
                <p>
                    <el-button @click="addSystem()">+添加系统</el-button>
                </p>
                <el-tab-pane label="Android" name="android">
                    <div class="android-config">
                        <el-descriptions label-width="200" title="Android 版本信息" :column="1" border class="version-info">
                            <el-descriptions-item label="TargetSdkVersion">{{ sdkForm.android.targetSdkVersion
                                }}</el-descriptions-item>
                            <el-descriptions-item label="GradleVersion">{{ sdkForm.android.gradleVersion
                                }}</el-descriptions-item>
                        </el-descriptions>

                        <!-- 核心依赖配置 -->
                        <div class="config-section">
                            <div class="section-header">
                                <h3>核心依赖</h3>
                                <el-button type="primary" text @click="addItem('mainDependencies')">添加依赖</el-button>
                            </div>
                            <el-table :data="sdkForm.android.mainDependencies" style="width: 100%" border>
                                <el-table-column label="标签" width="120">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.tag" placeholder="标签"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="依赖名" width="180">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.dependencyName" placeholder="依赖名"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Group" width="180">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.group" placeholder="Group"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Name (Artifact)" width="180">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.artifact" placeholder="Artifact ID"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Version" width="120">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.version" placeholder="Version"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="依赖配置" min-width="200">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.configLine" placeholder="例如: implementation '...'"
                                            type="textarea" :autosize="{ minRows: 1 }"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="100" fixed="right">
                                    <template #default="scope">
                                        <el-button type="danger" text
                                            @click="removeItem('mainDependencies', scope.$index)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>

                        <!-- 权限配置 -->
                        <div class="config-section">
                            <div class="section-header">
                                <h3>权限配置</h3>
                                <el-button type="primary" text @click="addItem('permissionConfigs')">添加权限</el-button>
                            </div>
                            <el-table :data="sdkForm.android.permissionConfigs" style="width: 100%" border>
                                <el-table-column label="标签" width="120">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.tag" placeholder="标签"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="权限名/依赖名" width="180">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.dependencyName" placeholder="权限名/依赖名"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Group" width="180">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.group" placeholder="Group"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Name (Artifact)" width="180">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.artifact" placeholder="Artifact ID"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Version" width="120">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.version" placeholder="Version"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="配置/描述" min-width="200">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.configLine" placeholder="配置或描述信息" type="textarea"
                                            :autosize="{ minRows: 1 }"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="100" fixed="right">
                                    <template #default="scope">
                                        <el-button type="danger" text
                                            @click="removeItem('permissionConfigs', scope.$index)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>

                        <!-- 插件配置 -->
                        <div class="config-section">
                            <div class="section-header">
                                <h3>插件配置</h3>
                                <el-button type="primary" text @click="addItem('pluginConfigs')">添加插件</el-button>
                            </div>
                            <el-table :data="sdkForm.android.pluginConfigs" style="width: 100%" border>
                                <el-table-column label="标签" width="120">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.tag" placeholder="标签"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="插件名/依赖名" width="180">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.dependencyName" placeholder="插件名/依赖名"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Group" width="180">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.group" placeholder="Group"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Name (Artifact)" width="180">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.artifact" placeholder="Artifact ID"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Version" width="120">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.version" placeholder="Version"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="配置/ID" min-width="200">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.configLine" placeholder="apply plugin: '...' or ID"
                                            type="textarea" :autosize="{ minRows: 1 }"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="100" fixed="right">
                                    <template #default="scope">
                                        <el-button type="danger" text
                                            @click="removeItem('pluginConfigs', scope.$index)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>

                        <!-- 其他依赖配置 -->
                        <div class="config-section">
                            <div class="section-header">
                                <h3>其他依赖配置</h3>
                                <el-button type="primary" text @click="addItem('otherDependencies')">添加依赖</el-button>
                            </div>
                            <el-table :data="sdkForm.android.otherDependencies" style="width: 100%" border>
                                <el-table-column label="标签" width="120">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.tag" placeholder="标签"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="依赖名" width="180">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.dependencyName" placeholder="依赖名"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Group" width="180">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.group" placeholder="Group"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Name (Artifact)" width="180">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.artifact" placeholder="Artifact ID"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Version" width="120">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.version" placeholder="Version"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="依赖配置" min-width="200">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.configLine" placeholder="例如: implementation '...'"
                                            type="textarea" :autosize="{ minRows: 1 }"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="100" fixed="right">
                                    <template #default="scope">
                                        <el-button type="danger" text
                                            @click="removeItem('otherDependencies', scope.$index)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="iOS" name="ios">
                    <div class="ios-config">
                        <div class="android-config">
                            <el-descriptions label-width="200" title="Android 版本信息" :column="1" border
                                class="version-info">
                                <el-descriptions-item label="TargetSdkVersion">{{ sdkForm.android.targetSdkVersion
                                    }}</el-descriptions-item>
                                <el-descriptions-item label="GradleVersion">{{ sdkForm.android.gradleVersion
                                    }}</el-descriptions-item>
                            </el-descriptions>

                            <!-- 核心依赖配置 -->
                            <div class="config-section">
                                <div class="section-header">
                                    <h3>核心依赖</h3>
                                    <el-button type="primary" text @click="addItem('mainDependencies')">添加依赖</el-button>
                                </div>
                                <el-table :data="sdkForm.android.mainDependencies" style="width: 100%" border>
                                    <el-table-column label="标签" width="120">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.tag" placeholder="标签"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="依赖名" width="180">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.dependencyName" placeholder="依赖名"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Group" width="180">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.group" placeholder="Group"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Name (Artifact)" width="180">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.artifact" placeholder="Artifact ID"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Version" width="120">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.version" placeholder="Version"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="依赖配置" min-width="200">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.configLine"
                                                placeholder="例如: implementation '...'" type="textarea"
                                                :autosize="{ minRows: 1 }"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="100" fixed="right">
                                        <template #default="scope">
                                            <el-button type="danger" text
                                                @click="removeItem('mainDependencies', scope.$index)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>

                            <!-- 权限配置 -->
                            <div class="config-section">
                                <div class="section-header">
                                    <h3>权限配置</h3>
                                    <el-button type="primary" text
                                        @click="addItem('permissionConfigs')">添加权限</el-button>
                                </div>
                                <el-table :data="sdkForm.android.permissionConfigs" style="width: 100%" border>
                                    <el-table-column label="标签" width="120">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.tag" placeholder="标签"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="权限名/依赖名" width="180">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.dependencyName"
                                                placeholder="权限名/依赖名"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Group" width="180">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.group" placeholder="Group"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Name (Artifact)" width="180">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.artifact" placeholder="Artifact ID"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Version" width="120">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.version" placeholder="Version"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="配置/描述" min-width="200">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.configLine" placeholder="配置或描述信息"
                                                type="textarea" :autosize="{ minRows: 1 }"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="100" fixed="right">
                                        <template #default="scope">
                                            <el-button type="danger" text
                                                @click="removeItem('permissionConfigs', scope.$index)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>

                            <!-- 插件配置 -->
                            <div class="config-section">
                                <div class="section-header">
                                    <h3>插件配置</h3>
                                    <el-button type="primary" text @click="addItem('pluginConfigs')">添加插件</el-button>
                                </div>
                                <el-table :data="sdkForm.android.pluginConfigs" style="width: 100%" border>
                                    <el-table-column label="标签" width="120">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.tag" placeholder="标签"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="插件名/依赖名" width="180">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.dependencyName"
                                                placeholder="插件名/依赖名"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Group" width="180">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.group" placeholder="Group"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Name (Artifact)" width="180">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.artifact" placeholder="Artifact ID"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Version" width="120">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.version" placeholder="Version"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="配置/ID" min-width="200">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.configLine"
                                                placeholder="apply plugin: '...' or ID" type="textarea"
                                                :autosize="{ minRows: 1 }"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="100" fixed="right">
                                        <template #default="scope">
                                            <el-button type="danger" text
                                                @click="removeItem('pluginConfigs', scope.$index)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>

                            <!-- 其他依赖配置 -->
                            <div class="config-section">
                                <div class="section-header">
                                    <h3>其他依赖配置</h3>
                                    <el-button type="primary" text
                                        @click="addItem('otherDependencies')">添加依赖</el-button>
                                </div>
                                <el-table :data="sdkForm.android.otherDependencies" style="width: 100%" border>
                                    <el-table-column label="标签" width="120">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.tag" placeholder="标签"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="依赖名" width="180">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.dependencyName" placeholder="依赖名"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Group" width="180">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.group" placeholder="Group"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Name (Artifact)" width="180">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.artifact" placeholder="Artifact ID"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Version" width="120">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.version" placeholder="Version"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="依赖配置" min-width="200">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.configLine"
                                                placeholder="例如: implementation '...'" type="textarea"
                                                :autosize="{ minRows: 1 }"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="100" fixed="right">
                                        <template #default="scope">
                                            <el-button type="danger" text
                                                @click="removeItem('otherDependencies', scope.$index)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import type { TabsPaneContext } from 'element-plus';

    interface DependencyConfigItem {
        id: number;
        tag: string;
        dependencyName: string;
        group: string;
        artifact: string;
        version: string;
        configLine: string;
    }

    interface AndroidConfig {
        targetSdkVersion: string;
        gradleVersion: string;
        mainDependencies: DependencyConfigItem[];
        permissionConfigs: DependencyConfigItem[];
        pluginConfigs: DependencyConfigItem[];
        otherDependencies: DependencyConfigItem[];
    }

    interface IosConfig {
        targetSdkVersion: string;
        gradleVersion: string;
        mainDependencies: DependencyConfigItem[];
        permissionConfigs: DependencyConfigItem[];
        pluginConfigs: DependencyConfigItem[];
        otherDependencies: DependencyConfigItem[];
    }

    interface SdkForm {
        android: AndroidConfig;
        ios: IosConfig;
    }



    //新增系统
    const addSystem = () => {
        console.log('新增系统');
    }


    const activeTab = ref<'android' | 'ios'>('android');

    const sdkForm = ref<SdkForm>({
        android: {
            targetSdkVersion: '24',
            gradleVersion: '24',
            mainDependencies: [],
            permissionConfigs: [],
            pluginConfigs: [],
            otherDependencies: [],
        },
        ios: {
            targetSdkVersion: '24',
            gradleVersion: '24',
            mainDependencies: [],
            permissionConfigs: [],
            pluginConfigs: [],
            otherDependencies: [],
        }
    });

    let nextItemId = 1;
    const createEmptyItem = (): DependencyConfigItem => ({
        id: nextItemId++,
        tag: '',
        dependencyName: '',
        group: '',
        artifact: '',
        version: '',
        configLine: ''
    });

    const addItem = (section: keyof Omit<AndroidConfig, 'targetSdkVersion' | 'gradleVersion'>) => {
        sdkForm.value.android[section].push(createEmptyItem());
    };

    const removeItem = (section: keyof Omit<AndroidConfig, 'targetSdkVersion' | 'gradleVersion'>, index: number) => {
        sdkForm.value.android[section].splice(index, 1);
    };

    const saveConfiguration = () => {
        // Placeholder for save logic
        console.log('Saving configuration:', JSON.parse(JSON.stringify(sdkForm.value)));
        // ElMessage.success('配置已保存'); // Optional: Show success message
    };

</script>

<style lang="scss" scoped>
    .thirdPartySDK_page {
        padding: 20px;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .version-info {
        margin-bottom: 20px;
    }

    .config-section {
        margin-bottom: 30px;
        padding: 15px;
        border: 1px solid #ebeef5;
        border-radius: 4px;
        background-color: #fff;

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;

            h3 {
                margin: 0;
                font-size: 16px;
                color: #303133;
            }
        }
    }

    .el-table {
        font-size: 13px;
    }

    .el-table th,
    .el-table td {
        padding: 8px 0;
    }

    .el-input,
    .el-textarea {
        font-size: 13px;
    }

</style>