<template>
    <div class="deploymentFileManager_page">
        <el-drawer v-model="drawer" title="应用图片" :direction="direction" :before-close="handleClose">
            <ul class="images_box">
                <li v-for="item in viewImages" :key="item">
                    <img :src="item" alt="">
                </li>
            </ul>
            <template #footer>
                <div style="flex: auto">
                    <el-button type="primary" @click="drawerUploadImage">上传图片</el-button>
                    <el-button>取消</el-button>
                    <el-button type="primary">提交</el-button>
                </div>
            </template>
        </el-drawer>
        <el-card>
            <el-button type="primary">应用部署</el-button>
            <el-button type="primary">新增公司</el-button>
        </el-card>
        <el-card class="content_card" ref="contentCardRef">

            <el-table :data="appList" border style="width: 100%">
                <el-table-column prop="company" label="所属公司" />
                <el-table-column prop="name" label="应用名称" />
                <el-table-column prop="logo" label="应用 logo">
                    <template #default="scope">
                        <img v-if="scope.row.logo" :src="scope.row.logo" alt="应用 logo"
                            style="width: 50px; height: 50px;">
                        <el-button v-else type="primary" link @click="handleUploadLogo(scope.row)">
                            上传logo
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="intro" label="应用介绍" />
                <el-table-column prop="images" label="应用图片">
                    <template #default="scope">
                        <el-button type="primary" link @click="handleImages(scope.row)">
                            图片展示/上传
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="apk" label="应用 apk 包地址" class-name="apk-column">
                    <template #default="scope">
                        <div class="apk_cell">
                            <el-link v-if="scope.row.apk" :href="scope.row.apk" target="_blank">
                                {{ scope.row.apk }}
                            </el-link>
                            <el-button v-else type="primary" link @click="handleUploadApk(scope.row)">
                                上传apk
                            </el-button>
                        </div>

                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right">
                    <template #default="scope">
                        <el-button link type="danger" size="small">
                            删除
                        </el-button>
                        <el-button link type="primary" size="small">
                            编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination ref="paginationRef" layout="prev, pager, next" :total="50" />
        </el-card>

    </div>

</template>

<script lang="ts" setup>

    import { ref, onMounted, onUnmounted } from 'vue'
    // 部署应用列表：每一项包含所属公司、应用名称、应用 logo、应用介绍、应用图片（数组）
    interface DeploymentApp {
        company: string;   // 所属公司
        name: string;      // 应用名称
        logo: string;      // 应用 logo（图片地址或 base64）
        intro: string;     // 应用介绍
        images: string[];  // 应用图片（列表，图片地址或 base64）
        apk: string;        // 应用 apk 包地址（下载链接）
    }

    // 示例数据：实际项目中可通过接口请求获取
    const appList = ref<DeploymentApp[]>([
        {
            company: '示例科技有限公司',
            name: '示例应用 A',
            logo: '',
            intro: '这是一个用于演示的应用 A，用于展示部署信息与资源。',
            images: [
                'https://example.com/images/app-a-1.png',
                'https://example.com/images/app-a-2.png'
            ],
            apk: 'https://example.com/downloads/app-a.apk'
        },
        {
            company: '未来信息技术公司',
            name: '示例应用 B',
            logo: 'https://example.com/images/app-b-logo.png',
            intro: '示例应用 B，支持多平台部署与自动化版本管理。',
            images: [
                'https://example.com/images/app-b-1.png'
            ],
            apk: 'https://example.com/downloads/app-b.apk'
        }
    ])


    const handleUploadLogo = (app: DeploymentApp) => {
        console.log('上传logo', app);
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.click()
        input.addEventListener('change', (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = () => {
                    app.logo = reader.result as string
                    console.log('上传logo成功', app);
                    input.remove()
                }
            }
        })


    }

    const drawer = ref(false)
    // Element Plus Drawer 的方向取值：'rtl' | 'ltr' | 'ttb' | 'btt'
    // 这里用 'rtl'（right-to-left），表示从右侧滑出
    const direction = ref('rtl')
    const handleClose = (done: any) => {
        done()
    }

    const viewImages = ref<any>([])
    const handleImages = (app: DeploymentApp) => {
        console.log('上传图片', app);
        viewImages.value = app.images
        drawer.value = true

    }



    onMounted(() => {

    })

    onUnmounted(() => {

    })

    // 上传 APK：生成可下载的临时链接
    const handleUploadApk = (app: DeploymentApp) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'application/vnd.android.package-archive,application/octet-stream'
        input.click()
        input.addEventListener('change', (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
                const url = URL.createObjectURL(file)
                app.apk = url
                // 注意：为避免内存泄露，使用后可以在合适的时机 URL.revokeObjectURL(url)
            }
        })
    }
    const drawerUploadImage = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.click()
        input.addEventListener('change', (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = () => {
                    viewImages.value.push(reader.result as string)
                    console.log('上传图片成功', viewImages.value);
                    input.remove()
                }
            }
        })
    }







</script>

<style lang="scss" scoped>
    .deploymentFileManager_page {

        display: flex;
        flex-direction: column;
        row-gap: 20px;
        height: 100%;

        .content_card {
            flex: 1;

            :deep(.el-card__body) {
                height: 100%;
                display: flex;
                flex-direction: column;
            }
        }

        .table_wrap {
            /* 让表格区域占用剩余空间，分页等内容自然占位在下方 */
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .images_box {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            list-style: none;
            padding: 0;
            margin: 0;


            li {
                background-color: #f8f9fa;
                border-radius: 8px;
                border: 1px solid #e4e7ed;
                padding: 12px;
                /* 关键：为每个项提供 flex-basis，避免所有项在一行被压缩而不换行 */
                /* 响应式：每项基础宽度约 240px，不够时自动换行 */
                flex: 0 1 166px;
                height: 200px;
                display: flex;
                align-items: center;
                justify-content: center;

                img {
                    width: 100%;
                    height: auto;
                }

            }
        }

        /* APK 列：超出自动换行 */
        .apk_cell {
            white-space: normal;
            /* 允许换行 */
            word-break: break-all;
            /* 长链接/长单词强制断行 */
            overflow-wrap: anywhere;
            /* 更现代的断行方式 */
            line-height: 1.4;
        }

        /* 兼容 Element Plus 表格单元格可能设置的 nowrap 等样式，仅作用于本列 */
        :deep(.apk-column .cell) {
            white-space: normal;
        }
    }
</style>