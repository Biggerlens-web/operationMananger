<template>
    <el-dialog :model-value="dialogVisible" title="" width="1000" :before-close="handleClose">
        <el-tree :data="data" @node-click="handleNodeClick" :default-expand-all="true">

            <template #default="{ node, data }">
                <div class="root-node">
                    <span :class="{ linkStyle: node.label.includes('http') }" @click="viewLink(node.label)">{{
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
    const { OSlist } = storeToRefs(stores)
    const props = defineProps<{
        dialogVisible: boolean
        appNo: any
    }>()

    const getAppInfo = async (os: string) => {
        try {
            const params = {
                timestamp: Date.now(),
                appNo: props.appNo,
                os
            }
            console.log('参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post(`/appInfoDetail/findByAppNo`, {
                enData
            })

            console.log('获取应用信息', res);
            if (res.data.rows.length) {
                const appInfo: any = {

                    label: res.data.rows[0].os
                }
                data.value.push(appInfo)
            }

        } catch (err) {
            console.log('获取应用信息失败', err);

        }
    }

    watch(() => props.dialogVisible, (newV) => {
        if (newV && props.appNo) {
            console.log('props.data', props.appNo);
            OSlist.value.forEach((item: string) => {
                getAppInfo(item)
            })
        }
    })
    const data = ref<any>(
        [
            // {
            //     label: 'android',
            //     children: [
            //         {
            //             label: 'zh',
            //             children: [
            //                 {
            //                     label: '隐私政策',
            //                     children: [
            //                         {
            //                             label: 'https://privacy.biggerlens.cn/app/privacy?name=fullstackPhoneMove&os=android&language=zh&channelNo=2',
            //                         },
            //                         {
            //                             label: 'https://privacy.biggerlens.cn/app/privacy?name=fullstackPhoneMove&os=android&language=zh&channelNo=2',
            //                         },
            //                         {
            //                             label: 'https://privacy.biggerlens.cn/app/privacy?name=fullstackPhoneMove&os=android&language=zh&channelNo=2',
            //                         },
            //                         {
            //                             label: 'https://privacy.biggerlens.cn/app/privacy?name=fullstackPhoneMove&os=android&language=zh&channelNo=2',
            //                         },
            //                         {
            //                             label: 'https://privacy.biggerlens.cn/app/privacy?name=fullstackPhoneMove&os=android&language=zh&channelNo=2',
            //                         },
            //                         {
            //                             label: 'https://privacy.biggerlens.cn/app/privacy?name=fullstackPhoneMove&os=android&language=zh&channelNo=2',
            //                         },

            //                     ]
            //                 }
            //             ]
            //         },
            //     ]
            // }
        ]
    )

    const viewLink = (label: string) => {
        if (!label.includes('http')) return
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