<template>
    <el-dialog :model-value="dialogVisible" width="500" title="批量编辑标签" :before-close="handleClose">
        <el-form-item label="标签">
            <el-select v-model="chosedTagList" multiple filterable placeholder="请选择">
                <el-option v-for="tag in tagList" :key="tag" :label="tag" :value="tag"></el-option>
            </el-select>
            <!-- <el-button type="primary" @click="openTagAdd">添加标签</el-button> -->
        </el-form-item>


        <p class="comfirm_box" style="text-align: right;">
            <el-button type="primary" @click="comfirmBatchTag">确定</el-button>
            <el-button @click="handleClose">取消</el-button>
        </p>
    </el-dialog>
    <el-dialog v-model="showAddTag" width="500" title="添加标签" :before-close="handleCloseTagadd">
        <el-form>
            <el-form-item label="标签名称" prop="tagName">
                <el-input v-model="tagName" placeholder="请输入标签名称"></el-input>
            </el-form-item>
        </el-form>

        <p class="comfirm_box" style="text-align: right;">
            <el-button type="primary" @click="addTagSubmit">确定</el-button>
            <el-button @click="handleCloseTagadd">取消</el-button>
        </p>
    </el-dialog>
</template>

<script lang="ts" setup>
    import { useCounterStore } from '@/stores/counter'
    import { onMounted, ref, watch } from 'vue'
    import { storeToRefs } from 'pinia'
    import { ElMessage } from 'element-plus'
    import { desEncrypt } from '@/utils/des'
    import service from '@/axios'
    import { useRoute } from 'vue-router'
    const stores = useCounterStore()

    const { tagList, showLoading } = storeToRefs(stores)

    const props = defineProps<{
        chosedItem: any
    }>()
    const dialogVisible = defineModel('dialogShow')

    onMounted(() => {


    })


    //已选择标签列表
    const chosedTagList = ref<any>([])

    watch(() => dialogVisible.value, (newV) => {

        if (newV) {
            chosedTagList.value = []
        }
    })

    const handleClose = () => {
        dialogVisible.value = false
    }
    const route = useRoute()
    const comfirmBatchTag = async () => {
        console.log('chosedTagList', chosedTagList.value);
        if (showLoading.value) {
            ElMessage.warning('正在保存。。。');
            return
        }
        try {
            const params = {
                timestamp: Date.now(),
                labels: chosedTagList.value,
                ids: props.chosedItem
            }
            const { type } = route.query
            let url: string = ''
            switch (type) {
                case 'clothing':
                    url = '/clothingMaterialsDetail/batchLabelSave'
                    break;
                case 'sitcker':
                    url = '/stickerDetail/batchLabelSave'
                    break;
                case 'background':
                    url = '/backgroundDetail/batchLabelSave'
                    break;
                case 'template':
                    url = '/templateUpDetail/batchLabelSave'
                    break
                case 'mask':
                    url = '/maskDetail/batchLabelSave'
                    break
                case 'wallpapper':
                    url = '/wallpaperDetail/batchLabelSave'
                    break
                case 'shape':
                    url = '/shapeDetail/batchLabelSave'
                    break
            }
            const enData = desEncrypt(JSON.stringify(params))
            showLoading.value = true
            const res = await service.post(url, {
                enData
            })
            console.log('批量编辑标签', res);
            if (res.data.code === 200) {
                ElMessage.success(res.data.msg)
                handleClose()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            ElMessage.error('网络错误')
            console.log('批量编辑标签失败', err);
        } finally {
            showLoading.value = false
        }
    }


    //添加标签
    const showAddTag = ref<boolean>(false)
    const tagName = ref<string>('')//标签名称
    const handleCloseTagadd = () => {
        showAddTag.value = false
    }
    const openTagAdd = () => {
        showAddTag.value = true
    }
    //添加标签确定
    const addTagSubmit = () => {
        if (tagName.value == '') {
            ElMessage.error('请输入标签名称')
            return
        }
    }

</script>

<style lang="scss" scoped></style>