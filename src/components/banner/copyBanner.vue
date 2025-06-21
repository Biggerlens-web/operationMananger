<!-- 复制轮播点对话框组件 -->
<template>
    <!-- 对话框容器，用于编辑轮播点 -->
    <el-dialog :model-value="dialogVisible" title="编辑轮播点" width="500" :before-close="handleClose">
        <!-- 表单容器 -->
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
            class="demo-ruleForm" status-icon>
            <!-- 复制轮播点选择器 -->
            <el-form-item label="复制轮播点" prop="copyId">
                <el-select v-model="formData.copyId" placeholder="请选择">
                    <!-- 选项1，后续应该动态加载轮播点列表 -->
                    <el-option v-for="item in bannerPointList"
                        :label="`${item.parentObj.appAbbreviation}【${item.parentObj.appName}】-${item.os}-${item.languageVo.remark}-${item.channels?.channelName}-${item.bannerName}`"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>

        <!-- 对话框底部按钮区域 -->
        <template #footer>
            <div class="dialog-footer">
                <!-- 取消按钮 -->
                <el-button @click="handleClose">取消</el-button>
                <!-- 确定按钮 -->
                <el-button type="primary" @click="handleComfirm(ruleFormRef)">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    // 导入axios服务
    import service from '@/axios';
    import { desEncrypt } from '@/utils/des';
    import { ElMessage } from 'element-plus';
    // 导入Vue组合式API
    import { onMounted, ref, watch } from 'vue'

    // 定义组件属性类型
    const props = defineProps<{
        dialogVisible: boolean  // 对话框显示状态
        copyInfo: any          // 复制信息对象
    }>()
    watch(() => props.dialogVisible, (val) => {
        if (val && props.copyInfo) {
            getAllbannerPoint()
        }
    })
    // 表单引用
    const ruleFormRef = ref(null)

    // 定义事件发射器
    const emit = defineEmits<{
        'update:dialogVisible': [value: any]  // 更新对话框显示状态事件
    }>()

    /**
     * 获取所有轮播点数据
     * 用于填充下拉选择器选项
     */
    const bannerPointList = ref<any>([])
    const getAllbannerPoint = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                id: props.copyInfo
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.get('/base/banner/copyIndex', {
                params: {
                    enData
                }
            })
            console.log('获取所有轮播点', res);
            bannerPointList.value = res.data.data.banners
            // TODO: 将获取到的数据设置到选择器选项中
        } catch (err) {
            console.log('获取所有轮播点失败', err);
        }
    }

    // 组件挂载时获取轮播点数据
    onMounted(() => {

    })

    // 表单数据
    const formData = ref<any>({
        copyId: ''  // 选中的复制轮播点ID
    })

    /**
     * 重置表单数据
     */
    const resetForm = () => {
        formData.value.copyId = ''
    }

    /**
     * 关闭对话框处理函数
     */
    const handleClose = () => {
        resetForm()  // 重置表单
        emit('update:dialogVisible', false)  // 关闭对话框
    }

    /**
     * 确认按钮点击处理函数
     * @param formEL 表单元素引用
     */

    const saveChange = async () => {
        try {
            const params = {
                timestamp: Date.now(),
                id: props.copyInfo,
                copyId: formData.value.copyId
            }

            console.log('复制参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/base/banner/copy', {
                enData
            })
            console.log('复制', res);
            if (res.data.code === 200) {
                ElMessage.success('复制成功')
                handleClose()
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {

            console.log('保存失败', err);
        }
    }
    const handleComfirm = (formEL: any) => {
        if (formEL) {
            // 表单验证
            formEL.validate().then(() => {
                console.log('校验通过')
                // TODO: 执行复制轮播点的业务逻辑
                saveChange()
            }).catch(() => {
                console.log('校验失败')
            })
        }
    }

    // 表单验证规则（当前为空，可根据需要添加验证规则）
    const rules = ref({})
</script>

<!-- 组件样式 -->
<style lang="scss" scoped>
    /* 当前无自定义样式，使用Element Plus默认样式 */
</style>