<template>

    <el-dialog v-model="dialogVisibleChannel" title="渠道选择" width="500">


        <el-checkbox-group v-model="checkedChannel">
            <el-checkbox v-for="channel in channelList" :label="channel.channelId" :key="channel.channelId">{{
                channel.channelName }}</el-checkbox>
        </el-checkbox-group>
        <template #footer>
            <el-button type="primary" @click="handleComfirmChannel">确定</el-button>
            <el-button @click="dialogVisibleChannel = false">取消</el-button>
        </template>
    </el-dialog>

    <el-dialog v-model="dialogVisibleSign" title="签名选择" width="800">
        <div class="sign-dialog-content">
            <!-- 签名列表表格 -->
            <div class="sign-table-section">

                <el-table :data="props.signsList" style="width: 100%" max-height="300">
                    <el-table-column prop="id" label="编号" width="80" />
                    <el-table-column prop="signName" label="签名名称" width="120" />
                    <el-table-column prop="alias" label="别名" width="120" />
                    <el-table-column prop="packageName" label="包名" min-width="200" />
                    <el-table-column prop="updateTime" label="更新时间" width="150" />
                    <el-table-column label="操作" width="80">
                        <template #default="scope">
                            <el-button type="primary" size="small" @click="handleComfirmSign(scope.row)">选择</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>


        </div>


    </el-dialog>


    <el-dialog v-model="dialogVisibleIcon" title="图标选择" width="900" class="icon-dialog">
        <div class="icon-dialog-content">
            <!-- 图标表格 -->
            <div class="icon-table-section">
                <el-table :data="iconTableData" style="width: 100%" max-height="400" class="icon-table">

                    <el-table-column prop="path" label="路径" width="200" show-overflow-tooltip />
                    <el-table-column prop="type" label="类型" width="80" align="center">
                        <template #default="scope">
                            <el-tag v-for="type in scope.row.type" :key="type" size="small"
                                :type="type === 'icon' ? 'primary' : 'success'">
                                {{ type }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="图标" width="100" align="center">
                        <template #default="scope">
                            <div class="icon-preview">
                                <img :src="`data:image/png;base64,${scope.row.base64}`" :alt="'icon'"
                                    class="icon-img" />
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="尺寸" align="center">
                        <template #default="scope">
                            {{ `${scope.row.sizeWidth}x${scope.row.sizeHight}` }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150" align="center">
                        <template #default="scope">
                            <el-upload class="icon-upload" :show-file-list="false"
                                :on-change="(file: File) => handleIconChange(file, scope.row)" accept="image/*"
                                :auto-upload="false">
                                <el-button type="primary" size="small" icon="Upload">上传图片</el-button>
                            </el-upload>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <template #footer>
            <el-button type="primary" @click="handleComfirmIcon">确定</el-button>
            <el-button @click="dialogVisibleIcon = false">取消</el-button>
        </template>
    </el-dialog>

    <el-dialog v-model="dialogVisibleVersion" title="版本编辑" width="500">
        <div class="version-form">
            <el-form :model="versionForm" label-width="80px" label-position="left">
                <el-form-item label="版本号">
                    <el-input v-model="versionForm.versionCode" placeholder="请输入版本号" />
                </el-form-item>
                <el-form-item label="版本名">
                    <el-input v-model="versionForm.versionName" placeholder="请输入版本名" />
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <el-button type="primary" @click="handleComfirmVersion">确定</el-button>
            <el-button @click="dialogVisibleVersion = false">取消</el-button>
        </template>
    </el-dialog>
    <el-dialog v-model="dialogVisibleLabel" title="名称编辑" width="800">
        <div class="label-table-container">
            <el-table :data="labelList" border style="width: 100%" max-height="400">
                <el-table-column prop="resConfig" label="resConfig" width="120" align="center" />
                <el-table-column prop="resId" label="resId" width="120" align="center" />
                <el-table-column prop="resName" label="resName" width="150" align="center" />
                <el-table-column prop="resValue" label="resValue" min-width="200" align="center">
                    <template #default="scope">
                        <el-input v-model="scope.row.resValue" placeholder="请输入资源值" size="small" />
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <template #footer>
            <el-button type="primary" @click="handleComfirmLabel">确定</el-button>
            <el-button @click="dialogVisibleLabel = false">取消</el-button>
        </template>
    </el-dialog>




    <el-dialog v-model="dialogVisibleXML" title="AndroidManifest.xml" width="80%" top="5vh">
        <div class="xml-content-container">
            <xmp>{{ xmlContent }}</xmp>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisibleXML = false">关闭</el-button>
            </span>
        </template>
    </el-dialog>
    <div style="width: 98%;">
        <h1>APK修改</h1>
        <el-divider class="divider" />
        <p class="fileInput">
            <el-input></el-input>
            <el-upload class="upload-demo" v-model:file-list="files" :show-file-list="false" action="#" multiple
                :http-request="customUpload">
                <el-button type="primary">点击上传</el-button>
            </el-upload>
        </p>

        <!-- 上传进度条 -->
        <div class="progress-container" v-if="showProgress">
            <el-progress :percentage="uploadProgress" :status="progressStatus" :stroke-width="8" :text-inside="true" />
            <p class="progress-text">{{ progressText }}</p>
        </div>

        <div class="content_card">
            <div class="apk-list">
                <div class="apk-item" v-for="(item, index) in viewFileList" :key="index">
                    <div class="apk-content—top">
                        <div class="apk-icon">
                            <el-image :src="`data:image/png;base64,${item.base64Icons[0]}`" fit="cover">
                                <template #placeholder>
                                    <div class="image-slot">Loading<span class="dot">...</span></div>
                                </template>
                            </el-image>
                        </div>
                        <div class="apk-info">
                            <div class="info-row">
                                <span class="label">应用名:</span>
                                <span class="value">{{ item.appLabel }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">英文名:</span>
                                <span class="value">{{ item.appLabelEn }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">包名:</span>
                                <span class="value">{{ item.appPackageName }}</span>
                            </div>

                            <div class="info-row">
                                <span class="label">版本号:</span>
                                <span class="value">{{ item.versionCode }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">版本名:</span>
                                <span class="value">{{ item.versionName }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">SDK(min)版本:</span>
                                <span class="value">{{ item.minSdkVersion }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">SDK(target)版本:</span>
                                <span class="value">{{ item.targetSdkVersion }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">支持架构:</span>
                                <el-tag v-for="arch in item.supportedArchitectures" :key="arch">
                                    {{ arch }}
                                </el-tag>

                            </div>
                            <div class="info-row">
                                <span class="label">加固状态:</span>
                                <span class="value">{{ item.isJiagu ? '加固' : '未加固' }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">权限:</span>
                                <span class="value">当前已申请{{ item.usesPermissions.length }}个权限</span>
                                <el-link type="primary" @click="showXML(item)"
                                    :underline="false">AndroidManifes.xml</el-link>
                            </div>

                        </div>
                        <div class="apk-info">
                            <div class="info-row">
                                <p>渠道:</p>
                                <div class="channel-list">
                                    <el-tag v-for="tag in item.channles" :key="tag" closable
                                        @close="handleRemoveChannel(item, tag)">{{ tag.channelName
                                        }}</el-tag>
                                    <el-button type="text" size="small" @click="handleChangeChannel(item)">+</el-button>
                                </div>
                            </div>
                            <div class="info-row">
                                <p>签名:</p>
                                <div class="channel-list">
                                    <el-tag v-for="tag in item.signs" :key="tag">{{
                                        `签名:${tag.signName}\n签名别名:${tag.alias}`
                                    }}</el-tag>
                                    <el-button type="text" size="small" @click="handleChangeSign(item)">+</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="action-buttons">
                        <el-button size="small" @click="handleChangeIcon(item)">修改图标</el-button>
                        <el-button size="small" @click="handleChangeLabel(item)">修改名称</el-button>
                        <el-button size="small" @click="handleChangeVersion(item)">修改版本</el-button>
                        <el-button type="primary" size="small" @click="start(item)">执行</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import service from '@/axios'
    import { useCounterStore } from '@/stores/counter'
    import { desEncrypt } from '@/utils/des'
    import { ElMessage } from 'element-plus'
    import { storeToRefs } from 'pinia'
    import { ref, watch, onMounted, nextTick } from 'vue'
    const stores = useCounterStore()
    const { channelList } = storeToRefs(stores)
    const props = defineProps<{ signsList: any }>()



    //下载
    const downloadAPk = async (paths: string[]) => {
        try {
            const params = {
                timestamp: Date.now(),
                paths
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/apk/downloadUpdateApk', {
                enData
            }, {
                responseType: 'blob'
            })

            console.log('获取文件', res);

            const blob = res.data
            const fileName = 'apk.apk'
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = fileName
            link.click()
            window.URL.revokeObjectURL(url)
        } catch (err) {
            console.log('获取文件失败', err);
        }
    }


    //执行
    const start = async (item: any) => {
        try {
            console.log('item', item);
            const params = {
                timestamp: Date.now(),
                updateVersionCode: parseInt(item.versionCode),
                updateVersionName: item.versionName,
                labels: item.labels,
                // labels: [],
                // iconInfos: item.iconInfos,

                'iconInfos[0][path]': item.iconInfos[0].path,
                'iconInfos[0][type][]': item.iconInfos[0].type[0],
                'iconInfos[0][base64]': item.iconInfos[0].base64,
                'iconInfos[0][sizeHight]': item.iconInfos[0].sizeHight,
                'iconInfos[0][sizeWidth]': item.iconInfos[0].sizeWidth,

                signId: item.signs[0].id,
                channels: item.channles.map((item: any) => item.channelId),
                path: item.path
            }
            console.log('参数', params);
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.post('/apk/updateApk', {
                enData
            })
            console.log('执行', res);
            if (res.data.code === 200) {
                ElMessage.success('执行成功')
                downloadAPk(res.data.rows)
            } else {
                ElMessage.error(res.data.code)
            }
        } catch (err) {
            console.log('执行失败', err);
        }
    }



    //编辑的app
    const editAppName = ref<string>('')


    //显示xml
    const dialogVisibleXML = ref<boolean>(false)
    const xmlContent = ref<string>('')
    const showXML = (item: any) => {
        xmlContent.value = item.manifestXml
        dialogVisibleXML.value = true
    }


    //名称编辑
    const labelList = ref<any>([])
    const dialogVisibleLabel = ref<boolean>(false)
    const handleComfirmLabel = () => {
        // 更新标签信息
        const editItem = viewFileList.value.find((item: any) => item.appLabel === editAppName.value)
        if (editItem) {
            editItem.label = labelList.value
        }
        dialogVisibleLabel.value = false
    }
    const handleChangeLabel = (item: any) => {
        editAppName.value = item.appLabel
        labelList.value = item.labels || []
        dialogVisibleLabel.value = true
    }

    //版本编辑
    const dialogVisibleVersion = ref<boolean>(false)

    const versionForm = ref({
        versionCode: '',
        versionName: ''
    })
    const handleChangeVersion = (item: any) => {
        editAppName.value = item.appLabel

        // 初始化表单数据
        versionForm.value.versionCode = item.versionCode || ''
        versionForm.value.versionName = item.versionName || ''
        dialogVisibleVersion.value = true
    }
    const handleComfirmVersion = () => {
        // 更新版本信息
        const editItem = viewFileList.value.find((item: any) => item.appLabel === editAppName.value)
        if (editItem) {
            editItem.versionCode = versionForm.value.versionCode
            editItem.versionName = versionForm.value.versionName
        }
        dialogVisibleVersion.value = false
    }
    //图标选择
    const dialogVisibleIcon = ref<boolean>(false)
    const iconTableData = ref([

    ])
    // 图片选择变化处理
    const handleIconChange = (uploadFile: any, rowData: any) => {
        const file = uploadFile.raw || uploadFile

        // 检查文件类型
        const isImage = file.type.startsWith('image/')
        if (!isImage) {
            ElMessage.error('只能上传图片文件!')
            return
        }

        // 检查文件大小 (限制为2MB)
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
            ElMessage.error('上传图片大小不能超过 2MB!')
            return
        }

        //需要修改的图标
        const updateItem = iconTableData.value.find((item: any) => rowData.path == item.path)

        // 读取文件并转换为base64
        const reader = new FileReader()
        reader.onload = (e) => {
            const base64 = e.target?.result as string
            // 创建图片对象获取尺寸
            const img = new Image()
            img.onload = () => {
                const iconData = {
                    ...rowData,
                    name: file.name,
                    preview: base64,
                    base64: base64.split(',')[1], // 去掉data:image/xxx;base64,前缀
                    sizeWidth: img.width,
                    sizeHight: img.height,
                    size: `${img.width}x${img.height}`,
                    file: file
                }
                if (updateItem) {
                    Object.assign(updateItem, {
                        base64: iconData.base64,
                    })
                    ElMessage.success('图片上传成功!')
                } else {
                    ElMessage.error('图片上传失败!')
                }
            }
            img.src = base64
        }
        reader.readAsDataURL(file)
    }

    const handleComfirmIcon = () => {
        const editItem = viewFileList.value.find((item: any) => item.appLabel == editAppName.value)
        if (editItem) {
            editItem.iconInfos = iconTableData.value
            // 同步更新base64Icons数组，确保界面图片显示更新
            editItem.base64Icons = iconTableData.value.map((icon: any) => icon.base64)
            ElMessage.success('修改成功')
            dialogVisibleIcon.value = false

        } else {
            ElMessage.error('修改失败')
        }
    }

    const handleChangeIcon = (item: any) => {
        editAppName.value = item.appLabel
        iconTableData.value = item.iconInfos
        dialogVisibleIcon.value = true
    }



    //签名选择
    const dialogVisibleSign = ref<boolean>(false)

    const handleChangeSign = (item: any) => {
        editAppName.value = item.appLabel
        dialogVisibleSign.value = true
    }
    const handleComfirmSign = (item: any) => {
        console.log('item', item);
        const editItem = viewFileList.value.find((item: any) => item.appLabel == editAppName.value)
        if (editItem) {
            editItem.signs = [item]
            ElMessage.success('修改成功')
        } else {
            ElMessage.error('修改失败')
        }
        dialogVisibleSign.value = false
    }

    //渠道选择
    const dialogVisibleChannel = ref<boolean>(false)
    const checkedChannel = ref<any>([])
    const handleComfirmChannel = async () => {
        console.log('确定渠道选择', checkedChannel.value);
        try {
            const params = {
                timestamp: Date.now(),
                selectChannels: checkedChannel.value,
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.get('/apkSignChannels/select', {
                params: {
                    enData
                }
            })
            console.log('修改渠道', res);
            if (res.data.code === 200) {
                ElMessage.success('修改成功')
                const editItem = viewFileList.value.find((item: any) => item.appLabel == editAppName.value)
                console.log('editItem', editItem);
                res.data.data.selectChannels.forEach((check: any) => {
                    const checkItem = channelList.value.find((item: any) => item.channelId == check)
                    if (checkItem) {
                        editItem.channles.push(checkItem)
                    }
                })

                dialogVisibleChannel.value = false

            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (err) {
            console.log('修改渠道', err);
        }
    }
    watch(() => dialogVisibleChannel.value, (newV) => {
        if (!newV) {
            checkedChannel.value = []
        }
    })
    const handleChangeChannel = (item: any) => {

        editAppName.value = item.appLabel
        const editItem = viewFileList.value.find((item: any) => item.appLabel == editAppName.value)
        if (editItem) {
            checkedChannel.value = editItem.channles.map((item: any) => item.channelId)
        }
        dialogVisibleChannel.value = true
    }

    // 删除渠道标签
    const handleRemoveChannel = (item: any, tag: any) => {
        const editItem = viewFileList.value.find((file: any) => file.appLabel === item.appLabel)
        if (editItem && editItem.channles) {
            const index = editItem.channles.findIndex((channel: any) => channel.channelId === tag.channelId)
            if (index > -1) {
                editItem.channles.splice(index, 1)
            }
        }
    }

    //展示文件数组
    const viewFileList = ref<any>([])


    // 进度条相关状态
    const showProgress = ref(false)
    const uploadProgress = ref(0)
    const progressStatus = ref<'success' | 'exception' | 'warning' | ''>()
    const progressText = ref('')

    //上传文件
    const uploadQueue = ref<File[]>([])
    const isUploading = ref(false)
    const files = ref<File[]>([])
    let timeoutUpload: any = null
    const customUpload = async (options: any) => {
        const file = options.file
        uploadQueue.value.push(file)
        if (timeoutUpload) {
            clearTimeout(timeoutUpload)
        }
        timeoutUpload = setTimeout(() => {
            batchUpload()
        }, 500);


    }

    const batchUpload = async () => {
        if (uploadQueue.value.length === 0 || isUploading.value) {
            return
        }

        isUploading.value = true

        // 显示进度条并初始化
        showProgress.value = true
        uploadProgress.value = 0
        progressStatus.value = ''
        progressText.value = `准备批量上传 ${uploadQueue.value.length} 个文件...`

        // 模拟进度更新
        const progressTimer = setInterval(() => {
            if (uploadProgress.value < 90) {
                uploadProgress.value += Math.random() * 15
                progressText.value = `正在批量上传 ${uploadQueue.value.length} 个文件... ${Math.round(uploadProgress.value)}%`
            }
        }, 200)

        try {
            const formData = new FormData()
            uploadQueue.value.forEach((file: any) => {
                formData.append('apks', file)
            })

            const res = await service.post('/apk/uploadApk', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            // 清除定时器并设置成功状态
            clearInterval(progressTimer)
            uploadProgress.value = 100
            progressStatus.value = 'success'
            progressText.value = `批量上传成功！共上传 ${uploadQueue.value.length} 个文件`

            console.log('批量上传成功', res)
            // 展示文件数组
            viewFileList.value = res.data.rows
            viewFileList.value.forEach(async (item: any) => {
                item.channles = []
                const signs = await getPackageInfo(item.appPackageName)
                item.signs = signs
            })
            // 清空上传队列
            uploadQueue.value = []

            // 3秒后隐藏进度条
            setTimeout(() => {
                showProgress.value = false
            }, 3000)

        } catch (err) {
            // 清除定时器并设置失败状态
            clearInterval(progressTimer)
            uploadProgress.value = 100
            progressStatus.value = 'exception'
            progressText.value = `批量上传失败，请重试（${uploadQueue.value.length} 个文件）`

            console.log('批量上传失败', err)

            // 5秒后隐藏进度条
            setTimeout(() => {
                showProgress.value = false
            }, 5000)
        } finally {
            isUploading.value = false
        }
    }
    const getPackageInfo = async (packageName: string) => {
        try {
            const params = {
                timestamp: Date.now(),
                packageName: packageName
            }
            const enData = desEncrypt(JSON.stringify(params))
            const res = await service.get('/apkSign/findSignByPackageName', {
                params: {
                    enData
                }
            })
            console.log('获取包信息', res);
            return res.data.rows
        } catch (err) {
            console.log('获取包信息失败', err);
        }
    }

</script>

<style lang="scss" scoped>
    .fileInput {
        display: flex;
    }

    .progress-container {
        margin: 15px 0;
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 6px;
        border: 1px solid #e9ecef;

        .progress-text {
            margin: 8px 0 0 0;
            font-size: 14px;
            color: #606266;
            text-align: center;
        }
    }

    .content_card {
        margin-top: 10px;
        height: 600px;
        // overflow-y: auto;
    }

    .apk-list {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .apk-item {
        background: #fff;
        border: 1px solid #e4e7ed;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .apk-content—top {
        display: flex;
        gap: 20px;
        margin-bottom: 15px;
    }

    .apk-icon {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        overflow: hidden;
        flex-shrink: 0;
        border: 1px solid #e4e7ed;

        .el-image {
            width: 100%;
            height: 100%;
        }

        .image-slot {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            background: #f5f7fa;
            color: #909399;
            font-size: 12px;
        }
    }

    .apk-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;

        &:not(:last-child) {
            margin-right: 20px;
        }
    }

    .info-row {
        display: flex;
        gap: 10px;
        font-size: 14px;
        line-height: 1.5;
        width: 98%;
        margin-bottom: 6px;

        .label {
            color: #606266;
            font-weight: 500;
            min-width: 100px;
            flex-shrink: 0;
        }

        .value {
            color: #303133;
            flex: 1;
        }

        .actions {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-left: auto;
        }

        .signature-info {
            color: #67c23a;
            font-size: 12px;
        }

        p {
            color: #606266;
            font-weight: 500;
            min-width: 60px;
            margin: 0;
            flex-shrink: 0;
        }

        .channel-list {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
            flex: 1;

            .el-tag {
                margin-right: 8px;
                background-color: #f0f9ff;
                border-color: #b3d8ff;
                color: #409eff;
            }

            .el-button {
                padding: 4px 8px;
                font-size: 12px;
                border: 1px dashed #d9d9d9;
                background-color: #fafafa;
                color: #666;

                &:hover {
                    border-color: #409eff;
                    color: #409eff;
                }
            }
        }
    }

    .action-buttons {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #f0f0f0;
        display: flex;
        gap: 10px;
        justify-content: flex-end;

        .el-button {
            border-radius: 4px;
            padding: 8px 16px;
            font-size: 13px;

            &:not(.el-button--primary) {
                background-color: #f8f9fa;
                border-color: #e9ecef;
                color: #495057;

                &:hover {
                    background-color: #e9ecef;
                    border-color: #dee2e6;
                }
            }
        }
    }

    // 小尺寸屏幕适配样式
    @media (max-width: 768px) {
        .apk-item {
            padding: 15px;
            margin: 0 10px;
        }

        .apk-content—top {
            flex-direction: column;
            gap: 15px;
        }

        .apk-icon {
            width: 60px;
            height: 60px;
            align-self: flex-start;
        }

        .apk-info {
            &:not(:last-child) {
                margin-right: 0;
            }
        }

        .info-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;

            .label {
                min-width: auto;
                font-size: 13px;
            }

            .value {
                font-size: 13px;
                word-break: break-all;
            }

            .actions {
                margin-left: 0;
                margin-top: 5px;
            }

            .channel-list {
                .el-tag {
                    margin-right: 5px;
                    margin-bottom: 5px;
                    font-size: 11px;
                }

                .el-button {
                    font-size: 11px;
                    padding: 3px 6px;
                }
            }
        }

        .action-buttons {
            flex-direction: column;
            gap: 8px;

            .el-button {
                width: 100%;
                justify-content: center;
            }
        }
    }

    // 超小尺寸屏幕适配样式
    @media (max-width: 480px) {
        .apk-item {
            padding: 12px;
            margin: 0 5px;
        }

        .apk-icon {
            width: 50px;
            height: 50px;
        }

        .info-row {
            .label {
                font-size: 12px;
            }

            .value {
                font-size: 12px;
            }

            .channel-list {
                .el-tag {
                    font-size: 10px;
                    padding: 2px 6px;
                }
            }
        }

        .action-buttons {
            .el-button {
                font-size: 12px;
                padding: 6px 12px;
            }
        }
    }

    // 图标选择弹窗样式
    .icon-dialog {
        .el-dialog__body {
            padding: 20px;
        }
    }

    .icon-dialog-content {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .icon-table-section {
        .icon-table {
            border: 1px solid #ebeef5;
            border-radius: 6px;
            overflow: hidden;

            .el-table__header {
                background-color: #f8f9fa;
            }

            .el-table__row {
                &:hover {
                    background-color: #f5f7fa;
                }
            }
        }

        .icon-preview {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 60px;
            height: 60px;
            border: 1px solid #e4e7ed;
            border-radius: 4px;
            background-color: #f8f9fa;
            margin: 0 auto;

            .icon-img {
                max-width: 50px;
                max-height: 50px;
                object-fit: contain;
                border-radius: 2px;
            }
        }
    }

    .selected-icon-section {
        border-top: 1px solid #e4e7ed;
        padding-top: 20px;

        h4 {
            margin: 0 0 15px 0;
            color: #303133;
            font-size: 16px;
            font-weight: 600;
        }

        .selected-icon-preview {
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 15px;
            background-color: #f8f9fa;
            border: 1px solid #e4e7ed;
            border-radius: 6px;

            .selected-icon-img {
                width: 80px;
                height: 80px;
                object-fit: contain;
                border: 1px solid #e4e7ed;
                border-radius: 4px;
                background-color: #fff;
                padding: 5px;
            }

            .selected-icon-info {
                flex: 1;

                p {
                    margin: 5px 0;
                    color: #606266;
                    font-size: 14px;
                    line-height: 1.5;

                    strong {
                        color: #303133;
                        font-weight: 600;
                    }
                }
            }
        }
    }

    /* 版本编辑表单样式 */
    .version-form {
        padding: 20px 0;

        .el-form {
            .el-form-item {
                margin-bottom: 24px;

                .el-form-item__label {
                    font-weight: 600;
                    color: #303133;
                    font-size: 14px;
                }

                .el-input {
                    .el-input__wrapper {
                        border-radius: 6px;
                        transition: all 0.3s;

                        &:hover {
                            border-color: #409eff;
                        }

                        &.is-focus {
                            border-color: #409eff;
                            box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
                        }
                    }

                    .el-input__inner {
                        font-size: 14px;
                        padding: 12px 15px;

                        &::placeholder {
                            color: #c0c4cc;
                            font-size: 14px;
                        }
                    }
                }
            }
        }
    }

    /* 标签表格样式 */
    .label-table-container {
        padding: 20px 0;

        .el-table {
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

            .el-table__header {
                th {
                    background-color: #f8f9fa;
                    color: #303133;
                    font-weight: 600;
                    font-size: 14px;
                    border-bottom: 2px solid #e4e7ed;
                }
            }

            .el-table__body {
                tr {
                    transition: background-color 0.3s;

                    &:hover {
                        background-color: #f5f7fa;
                    }

                    td {
                        padding: 12px 8px;
                        font-size: 13px;
                        color: #606266;
                        border-bottom: 1px solid #ebeef5;

                        .el-input {
                            .el-input__wrapper {
                                border-radius: 4px;
                                transition: all 0.3s;

                                &:hover {
                                    border-color: #409eff;
                                }

                                &.is-focus {
                                    border-color: #409eff;
                                    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
                                }
                            }

                            .el-input__inner {
                                font-size: 13px;
                                padding: 8px 12px;

                                &::placeholder {
                                    color: #c0c4cc;
                                    font-size: 13px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /* XML 内容显示样式 */
    .xml-content-container {
        xmp {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.4;
            background-color: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 15px;
            margin: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
            max-height: 400px;
            overflow-y: auto;
            color: #333;
        }
    }

    /* 图标上传组件样式 */
    .icon-upload {
        display: inline-block;

        .el-upload {
            display: inline-block;
        }

        .el-button {
            font-size: 12px;
            padding: 5px 10px;
        }
    }


</style>