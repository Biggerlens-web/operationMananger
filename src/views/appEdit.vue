<template>
    <!-- 应用编辑页面容器 -->
    <div class="app_edit_p  age">
        <!-- 顶部操作栏 -->
        <el-card style="margin-bottom: 20px;text-align: right;">
            <!-- 保存按钮 -->
            <el-button type="primary" @click="saveApp">保存</el-button>
        </el-card>
        <!-- 主内容区域 -->
        <el-card>
            <!-- 应用基本信息表单 -->
            <el-form label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="应用名称">
                            <el-input v-model="appForm.appName" placeholder="请输入应用名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="AppKey">
                            <el-input v-model="appForm.appKey" placeholder="xxxxxxxxxx" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="Account AppID">
                            <el-input v-model="appForm.accountAppId" placeholder="xxxxxxxxxx" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <!-- 平台信息Tabs -->
            <el-tabs v-model="activePlatform" @tab-click="handlePlatformChange" style="margin-top: 20px;">
                <el-tab-pane v-for="system in systemList" :label="system" :name="system">
                    <!-- 平台特定内容 -->
                    <div style="display: flex; justify-content: flex-end; margin-bottom: 10px;">
                        <!-- 添加渠道包名按钮 -->
                        <el-button type="primary" link @click="addChannelPackage">+添加渠道包名</el-button>
                    </div>
                    <!-- 平台详细信息 -->
                    <el-descriptions :column="1" border>
                        <el-descriptions-item label="包名">
                            <!-- 包名列表 -->
                            <div v-for="(pkg, index) in appForm.androidInfo.packages" :key="index"
                                style="display: flex; align-items: center; margin-bottom: 5px;">
                                <el-tag closable @close="removePackage('android', index)" style="margin-right: 5px;">{{
                                    pkg.name }}</el-tag>
                                <el-tag type="info" size="small" style="margin-right: 5px;">{{ pkg.vendor }}</el-tag>
                                <!-- 编辑包名图标 -->
                                <el-icon style="cursor: pointer; " @click="handleEditPackageName(pkg.name, pkg.vendor)">
                                    <EditPen />
                                </el-icon>

                            </div>
                            <!-- 添加包按钮 -->
                            <el-button type="primary" link @click="addPackage('android')">+ 添加包</el-button>
                        </el-descriptions-item>
                        <el-descriptions-item label="渠道名">
                            <div style="display: flex;">
                                <!-- 语言列表 -->
                                <div
                                    style="margin-right: 10px; border-right: 1px solid #eee; padding-right: 10px; display: flex; flex-direction: column;">
                                    <span v-for="lang in appForm.androidInfo.channelLanguages" :key="lang"
                                        @click="selectLanguage('android', lang)"
                                        :class="{ 'selected-language': appForm.androidInfo.selectedLanguage === lang }"
                                        style="cursor: pointer; padding: 2px 5px; border-radius: 3px; margin-bottom: 2px;">
                                        {{ lang }}
                                    </span>
                                    <!-- 添加语言按钮 -->
                                    <el-button type="primary" link size="small" @click="addLanguage('android')"
                                        style="margin-top: 5px;">+ 添加语言</el-button>
                                </div>
                                <!-- 渠道列表 -->
                                <div>
                                    <div v-for="(channel, index) in appForm.androidInfo.channels" :key="index"
                                        style="display: flex; align-items: center; margin-bottom: 5px;">
                                        <el-tag closable @close="removeChannel('android', index)"
                                            style="margin-right: 5px;">{{ channel.name }}</el-tag>
                                        <el-tag type="info" size="small" style="margin-right: 5px;">{{ channel.vendor
                                        }}</el-tag>
                                        <!-- 编辑渠道名图标 -->
                                        <el-icon @click="handleEditChannelName(channel.name, channel.vendor)"
                                            style="cursor: pointer; ">
                                            <EditPen />
                                        </el-icon>
                                    </div>
                                    <!-- 添加渠道按钮 -->
                                    <el-button type="primary" link @click="addChannel('android')">+ 添加渠道</el-button>
                                </div>
                            </div>
                        </el-descriptions-item>
                        <el-descriptions-item label="标签">
                            <!-- 标签列表 -->
                            <el-tag v-for="(tag, index) in appForm.androidInfo.tags" :key="index" closable
                                @close="removeTag('android', index)" style="margin-right: 5px;">{{ tag }}</el-tag>
                            <!-- 动态添加标签输入框 -->
                            <el-input v-if="inputVisible.androidTags" v-model="inputValue.androidTags"
                                @keyup.enter="handleInputConfirm('androidTags')"
                                @blur="handleInputConfirm('androidTags')" size="small" style="width: 90px;"></el-input>
                            <el-button v-else size="small" @click="showInput('androidTags')">+ 添加标签</el-button>
                        </el-descriptions-item>
                    </el-descriptions>
                </el-tab-pane>

            </el-tabs>
            <!-- 添加平台按钮 -->
            <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
                <el-button type="primary" link @click="addPlatform">+添加平台</el-button>
            </div>

            <!-- 项目信息 -->
            <el-descriptions :column="2" border style="margin-top: 20px;">
                <el-descriptions-item label="运营">
                    <el-input v-model="appForm.operator" placeholder="xxx"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="测试">
                    <el-input v-model="appForm.tester" placeholder="xxx"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="需求原型">
                    <el-input v-model="appForm.requirementPrototypeUrl" placeholder="https://"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="产品经理">
                    <el-input v-model="appForm.productManager" placeholder="xxxx"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="UI链接">
                    <el-input v-model="appForm.uiUrl" placeholder="https://"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="UI负责人">
                    <el-input v-model="appForm.uiLead" placeholder="xxxx"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="代码地址">
                    <el-input v-model="appForm.codeUrl" placeholder="https://"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="开发成员">
                    <el-input v-model="appForm.developers" placeholder="xxxx, xxxx"></el-input>
                </el-descriptions-item>
            </el-descriptions>

            <!-- Prowork关联 -->
            <el-form-item label="Prowork关联项目" style="margin-top: 20px;">
                <el-input v-model="appForm.proworkProject" placeholder="xxxx"
                    style="width: 200px; margin-right: 10px;"></el-input>
                <el-button type="primary" @click="linkProwork">关联</el-button>
            </el-form-item>
        </el-card>
    </div>
</template>

<script lang="ts" setup Vapor>
    // 引入Vue相关API和Element Plus组件
    import { ref, reactive } from 'vue';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { EditPen } from '@element-plus/icons-vue';

    // 定义渠道信息接口
    interface ChannelInfo {
        name: string;
        vendor?: string; // 厂商信息对于iOS渠道可能不是必须的，设为可选
    }

    // 定义包信息接口
    interface PackageInfo {
        name: string;
        vendor?: string;
    }

    // 定义平台特定信息接口
    interface PlatformSpecificInfo {
        packages: PackageInfo[];
        channelLanguages: string[];
        selectedLanguage: string;
        channels: ChannelInfo[];
        tags: string[];
    }

    // 定义应用表单数据结构接口
    interface AppFormType {
        appName: string;
        appKey: string;
        accountAppId: string;
        androidInfo: PlatformSpecificInfo;
        iosInfo: PlatformSpecificInfo;
        operator: string;
        tester: string;
        requirementPrototypeUrl: string;
        productManager: string;
        uiUrl: string;
        uiLead: string;
        codeUrl: string;
        developers: string;
        proworkProject: string;
    }



    // 支持的平台列表
    const systemList = ref<any>(['android', 'ios'])

    // 应用表单响应式数据
    const appForm = reactive<AppFormType>({
        appName: '',
        appKey: 'XXXXXXXXXX', // 示例数据，实际应从后端获取或生成
        accountAppId: 'XXXXXXXXXX', // 示例数据
        androidInfo: {
            packages: [{ name: 'com.biggerlens.test', vendor: '小米' }, { name: 'com.biggerlens.xiaomitest', vendor: 'OPPO' }],
            channelLanguages: ['zh', 'en', 'hw_zh'],
            selectedLanguage: 'zh',
            channels: [{ name: 'knockout', vendor: '小米' }, { name: 'Proknockour 智能抠图', vendor: '华为' }, { name: 'Proknockour 智能抠图', vendor: 'OPPO' }],
            tags: ['图片处理类', '相机类', '地图类'],
        },
        iosInfo: {
            packages: [],
            channelLanguages: ['en', 'zh'],
            selectedLanguage: 'en',
            channels: [],
            tags: [],
        },
        operator: 'xxx',
        tester: 'xxx',
        requirementPrototypeUrl: 'https://',
        productManager: 'xxxx',
        uiUrl: 'https://',
        uiLead: 'xxxx',
        codeUrl: 'https://',
        developers: 'xxxx, xxxx',
        proworkProject: 'xxxx',
    });



    const handleEditPackageName = (pkaName: string, vendor?: string) => {
        console.log('编辑包名');
        ElMessageBox.prompt(`请输入${activePlatform.value === 'android' ? '包名' : 'Bundle ID'}和厂商（可选，用&分隔）`, `编辑${activePlatform.value === 'android' ? '包名' : 'Bundle ID'}`, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: `${pkaName} ${vendor}`,
        }).then(({ value }) => {
            if (value) {
                ElMessage.success(`包名已更新${value}`);
            }
        });
    }



    const activePlatform = ref('android');

    const inputVisible = reactive({
        androidTags: false,
        iosTags: false,
    });
    const inputValue = reactive({
        androidTags: '',
        iosTags: '',
    });

    const handlePlatformChange = (tab: any) => {
        console.log('Platform changed to:', tab.paneName);
    };

    const addChannelPackage = () => {

    };

    const addPackage = (platform: 'android' | 'ios') => {
        const placeholder = platform === 'android' ? 'com.example.app' : 'com.example.bundleid';
        ElMessageBox.prompt(`请输入${platform === 'android' ? '包名' : 'Bundle ID'}和厂商（可选，用&分隔）`, `添加${platform === 'android' ? '包' : 'Bundle ID'}`, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: `${placeholder} 小米`,
        })
            .then(({ value }) => {
                if (value) {
                    const parts = value.split('&');
                    console.log('parts', parts);
                    const name = parts[0];
                    const vendor = parts.length > 1 ? parts.slice(1).join('&') : '';
                    if (platform === 'android') {
                        appForm.androidInfo.packages.push({ name, vendor });
                    } else {
                        (appForm.iosInfo.packages as Array<{ name: string; vendor: string }>).push({ name, vendor });
                    }
                    ElMessage.success('添加成功');
                }
            })
            .catch(() => { });
    };

    const removePackage = (platform: 'android' | 'ios', index: number) => {
        if (platform === 'android') {
            appForm.androidInfo.packages.splice(index, 1);
        } else {
            appForm.iosInfo.packages.splice(index, 1);
        }
    };

    const addLanguage = (platform: 'android' | 'ios') => {
        ElMessageBox.prompt('请输入语言代码 (例如: ja, ko)', '添加语言', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^[a-z]{2}(_[A-Z]{2})?$/,
            inputErrorMessage: '无效的语言代码格式'
        })
            .then(({ value }) => {
                if (value) {
                    if (platform === 'android') {
                        if (!appForm.androidInfo.channelLanguages.includes(value)) {
                            appForm.androidInfo.channelLanguages.push(value);
                        } else {
                            ElMessage.warning('语言已存在');
                        }
                    } else {
                        if (!appForm.iosInfo.channelLanguages.includes(value)) {
                            appForm.iosInfo.channelLanguages.push(value);
                        } else {
                            ElMessage.warning('语言已存在');
                        }
                    }
                }
            })
            .catch(() => { });
    };

    const selectLanguage = (platform: 'android' | 'ios', lang: string) => {
        if (platform === 'android') {
            appForm.androidInfo.selectedLanguage = lang;
        } else {
            appForm.iosInfo.selectedLanguage = lang;
        }
        // 后续可以根据选中的语言加载对应的渠道信息等
        console.log(`Selected language for ${platform}: ${lang}`);
    };



    const handleEditChannelName = (name: string, vendor?: string) => {
        console.log('编辑渠道名');
        ElMessageBox.prompt(`请输入渠道名和厂商（可选，用&分隔）`, `编辑渠道名`, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: `${name} ${vendor}`,
        }).then(({ value }) => {
            if (value) {
                ElMessage.success(`渠道名已更新${value}`);
            }
        });
    }


    const addChannel = (platform: 'android' | 'ios') => {
        ElMessageBox.prompt('请输入渠道名和厂商（可选，用&分隔）', '添加渠道', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: 'mychannel 小米'
        })
            .then(({ value }) => {
                if (value) {
                    const parts = value.split('&');
                    const name = parts[0];
                    const vendor = parts.length > 1 ? parts.slice(1).join('&') : '';
                    if (platform === 'android') {
                        appForm.androidInfo.channels.push({ name, vendor });
                    } else {
                        (appForm.iosInfo.channels as Array<{ name: string; vendor: string }>).push({ name, vendor });
                    }
                    ElMessage.success('渠道添加成功');
                }
            })
            .catch(() => { });
    };

    const removeChannel = (platform: 'android' | 'ios', index: number) => {
        if (platform === 'android') {
            appForm.androidInfo.channels.splice(index, 1);
        } else {
            appForm.iosInfo.channels.splice(index, 1);
        }
    };

    const showInput = (type: 'androidTags' | 'iosTags') => {
        inputVisible[type] = true;
        // nextTick(() => { inputRef.value!.input!.focus(); }); // 如果需要自动聚焦
    };

    const handleInputConfirm = (type: 'androidTags' | 'iosTags') => {
        const currentInputValue = inputValue[type];
        if (currentInputValue) {
            if (type === 'androidTags') {
                appForm.androidInfo.tags.push(currentInputValue);
            } else {
                (appForm.iosInfo.tags as string[]).push(currentInputValue);
            }
        }
        inputVisible[type] = false;
        inputValue[type] = '';
    };

    const removeTag = (platform: 'android' | 'ios', index: number) => {
        if (platform === 'android') {
            appForm.androidInfo.tags.splice(index, 1);
        } else {
            appForm.iosInfo.tags.splice(index, 1);
        }
    };

    const addPlatform = () => {

    };

    const linkProwork = () => {

    };

    const saveApp = () => {
        console.log('保存应用');
    };

</script>

<style lang="scss" scoped>
    .app_edit_page {
        padding: 20px;
    }

    .el-form-item {
        margin-bottom: 18px;
    }

    .el-tag+.el-tag {
        margin-left: 10px;
    }

    .el-tag {
        margin-bottom: 5px;
        /* 确保标签换行时有间距 */
    }

    .selected-language {
        background-color: #409EFF;
        color: white;
        font-weight: bold;
    }
</style>