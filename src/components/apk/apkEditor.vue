<template>
    <div>
        <h1>APK修改</h1>
        <el-divider class="divider" />
        <p class="fileInput">
            <el-input></el-input>
            <el-upload class="upload-demo" :show-file-list="false" action="#" multiple :http-request="customUpload">
                <el-button type="primary">点击上传</el-button>
            </el-upload>
        </p>


        <el-card class="content_card">

        </el-card>
    </div>
</template>

<script lang="ts" setup>
    //上传文件
    const customUpload = (options: any) => {
        const formData = new FormData();
        formData.append('file', options.file);
        formData.append('fileName', options.file.name);
    }
</script>

<style lang="scss" scoped>
    .fileInput {
        display: flex;
    }

    .content_card {
        margin-top: 10px;
        height: 500px;
    }
</style>