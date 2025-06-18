<template>
    <el-table :data="tableData" style="width: 100%;height: 600px;">
        <el-table-column type="expand">
            <template #default="props">
                <div style="padding: 16px;">
                    <el-tabs v-model="activeTab">
                        <el-tab-pane label="Android" name="android">
                            <el-descriptions :column="1" border>
                                <el-descriptions-item label="包名" :span="1">
                                    <div style="display: flex; align-items: center;">

                                        <el-badge style="margin-right: 30px;margin-bottom: 30px;" value="小米"
                                            class="item" type="primary" v-for="pkg in 3">
                                            <el-tag size="small">{{
                                                'com.biggerlens.test'
                                                }}</el-tag>
                                        </el-badge>
                                    </div>
                                </el-descriptions-item>
                                <el-descriptions-item label="渠道名" :span="1">
                                    <div style="display: flex; align-items: center;">
                                        <div
                                            style="margin-right: 10px; border-right: 1px solid #eee; padding-right: 10px;">
                                            <div v-for="lang in getLangs(props.row)" :key="lang" class="lang-item"
                                                :class="{ 'selected-lang': lang === getSelectedLangForRow(props.row) }"
                                                @click="selectLangForRow(props.row, lang)">
                                                {{ lang }}
                                            </div>
                                        </div>
                                        <div>
                                            <el-badge style="margin-right: 30px;margin-bottom: 30px;" value="小米"
                                                class="item" type="primary" v-for="pkg in 3">
                                                <el-tag size="small">{{
                                                    'com.biggerlens.test'
                                                    }}</el-tag>
                                            </el-badge>
                                        </div>
                                    </div>
                                </el-descriptions-item>
                                <el-descriptions-item label="标签" :span="1">
                                    <el-tag size="small" type="success" style="margin-right: 5px;"
                                        v-for="tag in safeAccess(props.row, 'tags', ['图片处理类', '相机类', '地图类'])"
                                        :key="tag">{{
                                            tag }}</el-tag>
                                </el-descriptions-item>
                            </el-descriptions>
                            <el-descriptions :column="3" border style="margin-top: 16px;">
                                <el-descriptions-item label="运营">{{ safeAccess(props.row, 'operator', 'xxx')
                                    }}</el-descriptions-item>
                                <el-descriptions-item label="测试">{{ safeAccess(props.row, 'tester', 'xxx')
                                    }}</el-descriptions-item>
                                <el-descriptions-item label="需求原型"><el-link type="primary"
                                        :href="safeAccess(props.row, 'requirementPrototypeUrl', '#')"
                                        target="_blank">跳转</el-link></el-descriptions-item>
                                <el-descriptions-item label="产品经理">{{ safeAccess(props.row, 'productManager', 'xxxx')
                                    }}</el-descriptions-item>
                                <el-descriptions-item label="UI地址"><el-link type="primary"
                                        :href="safeAccess(props.row, 'uiUrl', '#')"
                                        target="_blank">跳转</el-link></el-descriptions-item>
                                <el-descriptions-item label="UI负责人">{{ safeAccess(props.row, 'uiLead', 'xxxx')
                                    }}</el-descriptions-item>
                                <el-descriptions-item label="代码地址"><el-link type="primary"
                                        :href="safeAccess(props.row, 'codeUrl', '#')"
                                        target="_blank">跳转</el-link></el-descriptions-item>
                                <el-descriptions-item label="开发成员">{{ safeAccess(props.row, 'developers', ['xxx',
                                    'xxx']).join('、')
                                    }}</el-descriptions-item>
                                <el-descriptions-item label="项目配置">{{ safeAccess(props.row, 'projectConfig', '会员服务')
                                    }}</el-descriptions-item>
                            </el-descriptions>
                            <div
                                style="margin-top: 16px; display: flex; justify-content: space-between; align-items: flex-start;">
                                <el-form-item label="备注" style="flex-grow: 1; margin-right: 16px;">
                                    <el-input type="textarea" :rows="3" :value="safeAccess(props.row, 'remarks', '')"
                                        readonly placeholder="备注内容"></el-input>
                                </el-form-item>
                                <el-button type="primary" @click="goToProwork(props.row)"
                                    style="align-self: flex-end;">跳转至Prowork</el-button>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="iOS" name="ios">
                            <el-descriptions :column="1" border>
                                <el-descriptions-item label="包名" :span="1">
                                    <div style="display: flex; align-items: center;">

                                        <el-badge style="margin-right: 30px;margin-bottom: 30px;" value="小米"
                                            class="item" type="primary" v-for="pkg in 3">
                                            <el-tag size="small">{{
                                                'com.biggerlens.test'
                                                }}</el-tag>
                                        </el-badge>
                                    </div>
                                </el-descriptions-item>
                                <el-descriptions-item label="渠道名" :span="1">
                                    <div style="display: flex; align-items: center;">
                                        <div
                                            style="margin-right: 10px; border-right: 1px solid #eee; padding-right: 10px;">
                                            <div v-for="lang in getLangs(props.row)" :key="lang" class="lang-item"
                                                :class="{ 'selected-lang': lang === getSelectedLangForRow(props.row) }"
                                                @click="selectLangForRow(props.row, lang)">
                                                {{ lang }}
                                            </div>
                                        </div>
                                        <div>
                                            <el-badge style="margin-right: 30px;margin-bottom: 30px;" value="小米"
                                                class="item" type="primary" v-for="pkg in 3">
                                                <el-tag size="small">{{
                                                    'com.biggerlens.test'
                                                    }}</el-tag>
                                            </el-badge>
                                        </div>
                                    </div>
                                </el-descriptions-item>
                                <el-descriptions-item label="标签" :span="1">
                                    <el-tag size="small" type="success" style="margin-right: 5px;"
                                        v-for="tag in safeAccess(props.row, 'tags', ['图片处理类', '相机类', '地图类'])"
                                        :key="tag">{{
                                            tag }}</el-tag>
                                </el-descriptions-item>
                            </el-descriptions>
                            <el-descriptions :column="3" border style="margin-top: 16px;">
                                <el-descriptions-item label="运营">{{ safeAccess(props.row, 'operator', 'xxx')
                                    }}</el-descriptions-item>
                                <el-descriptions-item label="测试">{{ safeAccess(props.row, 'tester', 'xxx')
                                    }}</el-descriptions-item>
                                <el-descriptions-item label="需求原型"><el-link type="primary"
                                        :href="safeAccess(props.row, 'requirementPrototypeUrl', '#')"
                                        target="_blank">跳转</el-link></el-descriptions-item>
                                <el-descriptions-item label="产品经理">{{ safeAccess(props.row, 'productManager', 'xxxx')
                                    }}</el-descriptions-item>
                                <el-descriptions-item label="UI地址"><el-link type="primary"
                                        :href="safeAccess(props.row, 'uiUrl', '#')"
                                        target="_blank">跳转</el-link></el-descriptions-item>
                                <el-descriptions-item label="UI负责人">{{ safeAccess(props.row, 'uiLead', 'xxxx')
                                    }}</el-descriptions-item>
                                <el-descriptions-item label="代码地址"><el-link type="primary"
                                        :href="safeAccess(props.row, 'codeUrl', '#')"
                                        target="_blank">跳转</el-link></el-descriptions-item>
                                <el-descriptions-item label="开发成员">{{ safeAccess(props.row, 'developers', ['xxx',
                                    'xxx']).join('、')
                                    }}</el-descriptions-item>
                                <el-descriptions-item label="项目配置">{{ safeAccess(props.row, 'projectConfig', '会员服务')
                                    }}</el-descriptions-item>
                            </el-descriptions>
                            <div
                                style="margin-top: 16px; display: flex; justify-content: space-between; align-items: flex-start;">
                                <el-form-item label="备注" style="flex-grow: 1; margin-right: 16px;">
                                    <el-input type="textarea" :rows="3" :value="safeAccess(props.row, 'remarks', '')"
                                        readonly placeholder="备注内容"></el-input>
                                </el-form-item>
                                <el-button type="primary" @click="goToProwork(props.row)"
                                    style="align-self: flex-end;">跳转至Prowork</el-button>
                            </div>
                        </el-tab-pane>
                    </el-tabs>




                </div>

            </template>
        </el-table-column>
        <el-table-column label="应用编号" prop="appNo" />
        <el-table-column label="应用名称" prop="appName" />
        <el-table-column label="公司名称" prop="companyName" />
        <el-table-column label="AppKey" prop="appKey" />
        <el-table-column label="" prop="appMemberId" />
        <el-table-column label="操作">

            <template #default="scope">
                <el-button type="primary" size="small">获取隐私协议</el-button>
                <el-button type="" size="small">进入</el-button>
            </template>
        </el-table-column>

    </el-table>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';

    const props = defineProps<{
        tableData: any
    }>()

    const activeTab = ref('android');

    // 为每一行存储选中的语言，以 appNo 作为键
    const selectedLangs = ref<Record<string, string>>({});

    // 获取当前行的语言列表
    const getLangs = (row: any): string[] => {
        return safeAccess(row, 'androidInfo.channelLanguages', ['zh', 'en', 'hw_zh', 'ja', 'ko', 'pt']);
    };

    // 获取或设置并获取当前行选中的语言
    const getSelectedLangForRow = (row: any): string | undefined => {
        const rowId = safeAccess(row, 'appNo', null);
        // 如果没有唯一的 rowId，则无法可靠地存储和检索选中状态，但仍会尝试为当前渲染选择第一个
        if (rowId === null) {
            console.warn('Row does not have a unique appNo for language selection state persistence.');
            const langs = getLangs(row);
            return langs.length > 0 ? langs[0] : undefined;
        }

        if (!selectedLangs.value[rowId]) {
            const langs = getLangs(row);
            if (langs.length > 0) {
                selectedLangs.value[rowId] = langs[0]; // 默认选中第一个语言
            }
        }
        return selectedLangs.value[rowId];
    };

    // 设置当前行选中的语言
    const selectLangForRow = (row: any, lang: string) => {
        const rowId = safeAccess(row, 'appNo', null);
        if (rowId === null) {
            // 对于没有 appNo 的行，选择将不会持久化到 selectedLangs
            // 可以考虑一个临时的行内状态，但这会更复杂
            console.warn('Cannot persist language selection: Row does not have a unique appNo.');
            // 触发一次临时的更新，但这不会被记住
            // 查找当前行在 tableData 中的索引，然后直接修改，但这不推荐
            return;
        }
        selectedLangs.value[rowId] = lang;
    };

    // 安全访问嵌套对象属性的辅助函数
    const safeAccess = (obj: any, path: string, defaultValue: any = '') => {
        const keys = path.split('.');
        let result = obj;
        for (const key of keys) {
            if (result && typeof result === 'object' && key in result) {
                result = result[key];
            } else {
                return defaultValue;
            }
        }
        return result === undefined || result === null ? defaultValue : result;
    };

    const goToProwork = (row: any) => {
        // 假设 Prowork 的链接需要 appNo 或其他标识符
        // 您需要根据实际的 Prowork URL 结构来构建这个链接
        const proworkBaseUrl = 'https://prowork.example.com/project/'; // 请替换为实际的 Prowork URL
        const projectId = safeAccess(row, 'appNo', ''); // 或者其他相关ID
        if (projectId) {
            window.open(`${proworkBaseUrl}${projectId}`, '_blank');
        } else {
            console.warn('无法跳转到Prowork：缺少项目标识符');
            // 可以选择性地显示一个用户提示，例如使用 Element Plus 的 ElMessage
        }
    };
</script>

<style lang="scss" scoped>
    .lang-item {
        padding: 3px 6px;
        margin: 3px 0;
        cursor: pointer;
        border-radius: 4px;
        transition: background-color 0.2s ease, color 0.2s ease;
        display: block;
        /* Ensuring each lang takes its own line if container allows */
    }

    .lang-item:hover {
        background-color: #f5f7fa;
        /* Element Plus hover color */
        color: #303133;
    }

    .selected-lang {
        background-color: #409EFF;
        /* Element Plus primary color */
        color: #fff;
        font-weight: 500;
    }

    .selected-lang:hover {
        background-color: #337ecc;
        /* Darker shade on hover for selected item */
        color: #fff;
    }
</style>