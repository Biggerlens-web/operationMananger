<template>
    <el-table :data="tableData" border style="width: 100%" height="600px">
        <template v-for="item in filterParams" :key="item.key">
            <el-table-column :prop="item.key" :label="item.note" v-if="item.isShow" min-width="130">
                <template v-if="item.key === 'avatar' || item.key === 'thumbnail' || item.key === 'image'"
                    #default="scope">
                    <img style="width:100%" :src="scope.row[item.key]" alt="">
                </template>
                <template
                    v-if="item.key === 'isCanPay' || item.key === 'isShowTaobao' || item.key === 'open' || item.key === 'loginBeforeMemPage' || item.key === 'backBtnVisible' || item.key === 'rightEnterVipUI' || item.key === 'showUpdateVip' || item.key === 'rightShowAdsUnlock'"
                    #default="scope">
                    <el-switch v-model="scope.row[item.key]" :active-value="true" :inactive-value="false"
                        @change="switchChange(scope.row, item.key)" />
                </template>

                <template
                    v-if="item.key === 'photoEditTitle' || item.key === 'version' || item.key === 'taobaoPageLink' || item.key === 'helpMeTitle' || item.key === 'taobaoPageLink' || item.key === 'wechatServiceLink'"
                    #default="scope">
                    <el-input v-model="scope.row[item.key]" @blur="handleInput(scope.row, item.key)" />
                </template>

                <template
                    v-if="item.key === 'price' || item.key === 'functionStartNum' || item.key === 'timeOn' || item.key === 'adsVideoUnlockCount' || item.key === 'adsVideoUseCount' || item.key === 'freeCount' || item.key === 'paymentAmount' || item.key === 'paymentUnlockCount' || item.key === 'paymentUseCount' || item.key === 'questionnaireUseCount' || item.key === 'questionnaireUnlockCount' || item.key === 'shareAppUnlockCount' || item.key === 'shareAppUseCount'"
                    #default="scope">
                    <el-input-number @change="handleNumInput(scope.row, item.key)" style="width: 100px;" size="small"
                        v-model="scope.row[item.key]" />
                </template>

                <template v-if="item.key === 'i18nConfig'" #default="scope">
                    <el-button @click="eidtorLanguage(scope.row)">配置</el-button>
                </template>
                <template v-if="item.key === 'autoOpen'" #default="scope">
                    <el-select v-model="scope.row[item.key]" @change="changeAutoOpen(scope.row)">
                        <el-option v-for="el in scope.row.subPageConfigAutoOpenVos" :label="el.autoOpenName"
                            :value="Number(el.autoOpenId)" />

                    </el-select>

                    <el-button @click="addAutoOpenMethod(scope.row)"
                        style="width: 100%;margin-top: 10px;">添加</el-button>
                </template>
                <template v-if="item.key === 'international'" #default="scope">
                    <p v-for="(value, key) in JSON.parse(scope.row.international)" :key="key">
                        {{ initLanguage(key) }}:{{ value }}
                    </p>

                </template>
                <template v-if="item.key === 'probability'" #default="scope">
                    <el-select v-model="scope.row[item.key]" @change="saveChangeProbability(scope.row)">
                        <el-option v-for="value in initProbabilitys(scope.row.probabilitys)" :key="value" :label="value"
                            :value="value" />
                    </el-select>
                </template>
                <template v-if="item.key === 'bannerImgs' || item.key === 'noPayTimes'" #default="scope">

                    <p v-for="el in JSON.parse(scope.row[item.key])" :key="item">
                        {{ el }}
                    </p>
                    <p>
                        <el-button type="primary" size="small" @click="addListData(scope.row, item.key)">添加</el-button>
                    </p>

                </template>
                <template v-if="item.key === 'subPageConfigHWProductsVos'" #default="scope">

                    <p v-for="el in scope.row[item.key]" :key="el.id">
                        {{ `${el.productName}:${el.productId}` }}
                    </p>
                    <p>
                        <el-button type="primary" size="small" @click="editProductsSort(scope.row)">编辑</el-button>
                    </p>

                </template>
            </el-table-column>
        </template>

        <el-table-column label="操作" fixed="right" width="150" v-if="showAction">
            <template #default="scope">
                <el-button style="margin: 0;" type="text" size="small" @click="banUser(scope.row)" v-if="userList">{{
                    scope.row.status === 1 ? '禁用' : '启用' }}</el-button>
                <el-button v-if="isUpdate" style="margin: 0;" type="text" size="small" @click="updateInfo(scope.row)">{{
                    '提交修改' }}</el-button>
                <el-button style="margin: 0;" type="text" size="small" @click="handleRoles(scope.row)"
                    v-if="userList">分配角色</el-button>
                <el-button v-if="roleList" style="margin: 0;" type="text" size="small"
                    @click="onAssginRole(scope.row)">分配权限</el-button>

                <el-button style="margin: 0;" type="text" size="small" @click="scanImg(scope.row)"
                    v-if="bannerPath">扫描该路径下图片</el-button>
                <el-button style="margin: 0;" type="text" size="small" v-if="banner"
                    @click="setBannerImg(scope.row)">配置轮播图</el-button>
                <el-button style="margin: 0;" type="text" size="small" v-if="copy"
                    @click="copyInfo(scope.row)">复制</el-button>

                <el-button style="margin: 0;" type="text" size="small" @click="handleView(scope.row)"
                    v-if="viewButton || isShowButton(scope.row, 'view')">查看</el-button>
                <el-button v-if="moveIndex || isShowButton(scope.row, 'topIndex')" style="margin: 0;" type="text"
                    size="small" @click="goMove(scope.row, 'topMove')">置顶</el-button>
                <el-button v-if="moveIndex || isShowButton(scope.row, 'upIndex')" style="margin: 0;" type="text"
                    size="small" @click="goMove(scope.row, 'upMove')">上移</el-button>
                <el-button v-if="moveIndex || isShowButton(scope.row, 'downIndex')" style="margin: 0;" type="text"
                    size="small" @click="goMove(scope.row, 'downMove')">下移</el-button>
                <el-button v-if="isEditJSON" style="margin: 0;" type="text"
                    @click="editorJSON(scope.row)">JSON配置</el-button>
                <el-button v-if="isDownload" style="margin: 0;" type="text"
                    @click="downloadOSS(scope.row)">下载OSS文件</el-button>
                <el-button style="margin: 0;" type="text" size="small" @click="handleEditor(scope.row)"
                    v-if="!ishideEdit">编辑</el-button>

                <el-button style="margin: 0;" type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>

            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts" setup>
    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ref, onMounted } from 'vue'
    import { useRoute } from 'vue-router';

    const route = useRoute()
    const emit = defineEmits<{
        'editor': [value: any],
        'delete': [value: any],
        'rolesEditor': [value: any],
        'ban': [value: any],
        'assginRole': [value: any],
        'scanImg': [value: any],
        'copyItem': [value: any]
        'AutoOpenMethod': [value: any],
        'editorLanguage': [value: any],
        'view': [value: any],
        'moveIndex': [value: any]
        'setBannerImg': [value: any]
        'saveChangeProbability': [value: any]
        'switchChange': [value: any]
        'updateInfo': [value: any]
        'editorJSON': [value: any]
        'download': [value: any]
        'addListData': [value: any]
        'handleInput': [value: any]
        'handleNumInput': [value: any]
        'changeAutoOpen': [value: any]
        'editProductsSort': [value: any]
    }>()

    const stores = useCounterStore()
    const { international } = storeToRefs(stores)
    const initLanguage = (key: string | number) => {

        const findItem = international.value.find((item: any) => item.value === key)
        if (findItem) {
            return findItem.language
        } else {
            return key
        }
    }
    const props = withDefaults(defineProps<{
        tableData: any
        filterParams: any
        showAction: boolean
        userList: boolean
        roleList: boolean
        bannerPath: boolean,
        viewButton: boolean
        moveIndex: boolean
        totalItems: number
        copy: boolean
        banner: boolean
        isUpdate: boolean
        isEditJSON: boolean
        isDownload: boolean
        ishideEdit: boolean
    }>(), {
        showAction: true,
        userList: false,
        viewButton: false,
        roleList: false,
        bannerPath: false
    })






    //格式化概率选择
    const initProbabilitys = (item: any) => {
        if (typeof item === 'string' && item !== 'undefined') {
            return JSON.parse(item)
        } else {
            return item
        }
    }

    const showMoveBtnPath = ['/clothingMaterials/index', '/sticker/index', '/background/index', '/templateUp/index', '/mask/index']

    const isShowButton = (row: any, type: string) => {


        const path = route.path
        if (!showMoveBtnPath.includes(path)) {
            return false
        }
        if (type === 'view') {
            return true
        }

        if (row.operationClass === 1) {
            if (type === 'topIndex') {
                return false
            } else if (type === 'downIndex') {
                return false
            } else if (type === 'upIndex') {
                return false
            }
        } else {
            return true

        }

    }

    const goMove = (item: any, moveType: string) => {
        const { id } = item
        emit('moveIndex', { id, moveType })

    }


    const handleView = (item: any) => {
        console.log('查看', item)
        emit('view', item)
    }
    const handleEditor = (item: any) => {
        console.log('编辑', item)
        emit('editor', item)

    }
    const handleDelete = (item: any) => {
        console.log('删除', item)
        emit('delete', item)
    }




    //选择自动打开方案
    const changeAutoOpen = (item: any) => {
        emit('changeAutoOpen', item)
    }


    //编辑商品排序
    const editProductsSort = (item: any) => {
        emit('editProductsSort', item)
    }



    //添加列表数据
    const addListData = (item: any, key: string) => {
        console.log('添加列表数据', item, key)
        const obj = {
            key,
            ...item
        }
        emit('addListData', obj)
    }



    //编辑json
    const editorJSON = (item: any) => {
        console.log('编辑json', item)
        emit('editorJSON', item)
    }

    //下载oss文件
    const downloadOSS = (item: any) => {
        console.log('下载oss', item)
        emit('download', item)
    }

    //分配角色
    const handleRoles = (item: any) => {
        console.log('分配角色', item)
        emit('rolesEditor', item)
    }


    //修改数字输入框
    const handleNumInput = (item: any, key: string) => {
        console.log('修改数字输入框', item, key);
        const obj = {
            ...item,
            key
        }
        emit('handleNumInput', obj)
    }
    //switch切换
    const switchChange = (item: any, key: string) => {
        console.log('切换', item);

        const obj = {
            ...item,
            key
        }
        emit('switchChange', obj)
    }

    //选择概率
    const saveChangeProbability = (item: any) => {
        console.log('概率', item.probability);
        emit('saveChangeProbability', item)
    }

    //禁用用户
    const banUser = (item: any) => {
        console.log('禁用用户', item)
        emit('ban', item)
    }



    //提交修改
    const updateInfo = (item: any) => {
        emit('updateInfo', item)
    }
    //分配权限
    const onAssginRole = (item: any) => {
        console.log('分配权限', item)
        emit('assginRole', item)
    }
    //扫描轮播图路径下的图片
    const scanImg = (item: any) => {
        console.log('扫描轮播图路径下的图片', item)
        emit('scanImg', item)
    }

    //复制
    const copyInfo = (item: any) => {
        console.log('复制', item);
        emit('copyItem', item)
    }



    //配置轮播图
    const setBannerImg = (item: any) => {
        console.log('配置轮播图', item)
        emit('setBannerImg', item)
    }

    //添加自动打开方案
    const addAutoOpenMethod = (item: any) => {
        console.log('添加自动打开方案')
        emit('AutoOpenMethod', item)
    }

    //配置国际化
    const eidtorLanguage = (item: any) => {
        console.log('配置国际化', item)
        emit('editorLanguage', item)
    }

    //修改输入框
    const handleInput = (item: any, key: string) => {
        const obj = {
            key,
            ...item
        }
        emit('handleInput', obj)
    }
</script>

<style lang="scss" scoped></style>