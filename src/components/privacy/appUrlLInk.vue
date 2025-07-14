<template>
    <el-dialog :model-value="dialogVisible" title="" width="1000" :before-close="handleClose">
        <el-tree :data="data" @node-click="handleNodeClick" :default-expand-all="true">

            <template #default="{ node, data }">
                <div class="root-node">
                    <span :class="{ linkStyle: node.label.includes('https') }" @click="viewLink(node.label)">{{

                        node.label }}</span>
                </div>
            </template>
        </el-tree>
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

    import service from '@/axios';
    import { useCounterStore } from '@/stores/counter';
    import { desEncrypt } from '@/utils/des';
    import { storeToRefs } from 'pinia';
    import { ref, watch } from 'vue'
    const stores = useCounterStore()
    const { OSlist, showLoading } = storeToRefs(stores)
    const props = defineProps<{
        dialogVisible: boolean
        appNo: any
        appName: string
    }>()

    const getAppInfo = async (os: string) => {
        try {
            const params = {
                timestamp: Date.now(),
                appNo: props.appNo,
                os
            }

            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post(`/appInfoDetail/findByAppNo`, {
                enData
            })
            console.log('获取应用信息', res);
            if (res.data.rows.length) {
                const appInfo: any = {

                    label: res.data.rows[0].os,
                    children: []
                }
                res.data.rows.forEach((item: any) => {
                    console.log('语言', item);
                    const child: any = {
                        label: item.language,
                        children: [
                            {
                                label: '隐私政策',
                                value: 'privacy',
                                children: []
                            },
                            {
                                label: '用户协议',
                                value: 'userAgreement',
                                children: []
                            },
                            {
                                label: '第三方共享清单',
                                value: 'thirdSDK',
                                children: []
                            },
                            {
                                label: '个人信息收集清单',
                                value: 'userInfo',
                                children: []
                            }
                        ]
                    }

                    if (item.channelVos.length) {
                        item.channelVos.forEach((channel: any) => {
                            child.children.forEach((el: any) => {

                                const url = `https://privacy.biggerlens.cn/app/${el.value}?name=${props.appName}&os=${os.toLowerCase()}&language=${item.language}&channelNo=${channel.channelNo}`
                                el.children.push({
                                    label: url,

                                })
                            })

                        })


                    } else {
                        child.children.forEach((el: any) => {
                            const url = `https://privacy.biggerlens.cn/app/${el.value}?name=${props.appName}&os=${os.toLowerCase()}&language=${item.language}`
                            el.children.push({
                                label: url,

                            })
                        })
                    }
                    appInfo.children.push(child)
                })
                data.value.push(appInfo)
            }
            console.log('data,', data.value);

        } catch (err) {
            console.log('获取应用信息失败', err);

        } finally {
            showLoading.value = false
        }
    }

    watch(() => props.dialogVisible, (newV) => {
        if (newV && props.appNo) {

            OSlist.value.forEach((item: any) => {
                getAppInfo(item.value)
            })
        }
        if (!newV) {
            data.value = []
        }
    })
    const data = ref<any>(
        [

        ]
    )

    const viewLink = (label: string) => {
        if (!label.includes('http')) return
        console.log('label', label);
        window.open(label)
    }
    const handleNodeClick = () => {

    }
    const emit = defineEmits<{
        'update:dialogVisible': [value: boolean]
    }>()

    const handleClose = () => {
        emit('update:dialogVisible', false)
    }
    const handleComfirm = () => {
        handleClose()
    }
</script>

<style lang="scss" scoped>

    .linkStyle {
        color: blue;
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }
</style>