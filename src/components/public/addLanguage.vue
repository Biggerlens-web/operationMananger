<template>
    <el-dialog :model-value="showEditor" title="" width="500" :before-close="handleClose">
        <ul class="fieldList">
            <li class="fieldItem" v-for="(el, index) in languageContentList" :key="el.language">
                <el-select v-model="el.language" style="width: 120px;" placeholder="请选择语言">
                    <el-option v-for="item in international" :key="item.value" :label="item.language"
                        :value="item.value" />
                </el-select>
                <el-input v-model="el.value" placeholder="请输入文案" />
                <el-button type="danger" @click="remove(index)">删除</el-button>
            </li>
            <li>
                <el-button style="width: 100%;" @click="add">
                    添加一个
                </el-button>
            </li>
        </ul>

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

    import { useCounterStore } from '@/stores/counter';
    import { storeToRefs } from 'pinia';
    import { ref, watch } from 'vue'
    const stores = useCounterStore()
    const { international } = storeToRefs(stores)
    console.log('international', international.value);
    const props = defineProps<{
        showEditor: boolean
        languageArr: any
    }>()

    const counterStore = useCounterStore()
    const { appList, OSlist, channelList } = storeToRefs(counterStore)
    const emit = defineEmits<{
        'update:showEditor': [value: boolean]
        'comfirm': [value: any]
    }>()

    watch(() => props.showEditor, (newV) => {
        if (newV) {
            languageContentList.value = JSON.parse(JSON.stringify(props.languageArr))
        }
    })

    const languageContentList = ref<any>([

    ])
    //新增语言文案
    const add = () => {
        languageContentList.value.push({
            language: '',
            value: ''
        })
    }
    //删除语言文案
    const remove = (index: number) => {
        languageContentList.value.splice(index, 1)
    }







    const handleClose = () => {

        emit('update:showEditor', false)
    }
    const handleComfirm = () => {
        emit('comfirm', languageContentList.value)
    }
</script>

<style lang="scss" scoped>

    .fieldList {
        .fieldItem {
            display: flex;
            column-gap: 5px;
            margin-bottom: 10px;
        }
    }
</style>