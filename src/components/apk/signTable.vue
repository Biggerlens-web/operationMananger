<template>
    <div>
        <signEditor v-model:dialog-visible="showSignEditor" />
        <h1>
            签名
        </h1>
        <p style="margin: 20px 0px;">
            <el-button type="primary" size="small" @click="handleAdd()">新增</el-button>
        </p>
        <el-table :data="signList" border style="width: 500px" height="550px">
            <el-table-column prop="id" label="编号">
            </el-table-column>
            <el-table-column prop="signatureName" label="签名名称" />
            <el-table-column prop="alias" label="别名" />
            <el-table-column prop="packageName" label="包名" />
            <el-table-column prop="updateTime" label="更新时间" />
            <el-table-column label="操作" fixed="right" width="80">
                <template #default="scope">
                    <el-button style="margin: 0;" type="text" size="small"
                        @click="handleEditor(scope.row)">编辑</el-button>
                    <el-button style="margin: 0;" type="text" size="small"
                        @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import signEditor from './signEditor.vue';
    import { ElMessageBox } from 'element-plus';
    interface SignItem {
        id: number;           // 编号
        signatureName: string; // 签名名称
        alias: string;         // 别名
        packageName: string;   // 包名
        updateTime: string;    //
    }


    //新增签名
    const showSignEditor = ref<boolean>(false)



    const signList = ref<SignItem[]>([
        {
            id: 1,
            signatureName: "com.example.meitu",
            alias: "美图秀秀官方签名",
            packageName: "com.meitu.meiyancamera",
            updateTime: "2023-07-15 10:30:22"
        },
        {
            id: 2,
            signatureName: "com.example.faceu",
            alias: "Faceu激萌签名",
            packageName: "com.lemon.faceu",
            updateTime: "2023-08-05 14:45:36"
        },
        {
            id: 3,
            signatureName: "com.example.b612",
            alias: "B612咔叽签名",
            packageName: "com.campmobile.snowcamera",
            updateTime: "2023-06-10 09:15:48"
        },
        {
            id: 4,
            signatureName: "com.example.wuta",
            alias: "无他相机签名",
            packageName: "com.benqu.wuta",
            updateTime: "2023-07-22 16:20:33"
        },
        {
            id: 5,
            signatureName: "com.example.qingyan",
            alias: "轻颜相机签名",
            packageName: "com.gorgeous.lite",
            updateTime: "2023-08-15 11:40:15"
        },
        {
            id: 6,
            signatureName: "com.example.ulike",
            alias: "轻甜相机签名",
            packageName: "com.gorgeous.ulike",
            updateTime: "2023-06-30 20:05:12"
        },
        {
            id: 7,
            signatureName: "com.example.insta360",
            alias: "Insta360签名",
            packageName: "com.arashivision.insta360akiko",
            updateTime: "2023-05-18 12:25:44"
        },
        {
            id: 8,
            signatureName: "com.example.pitu",
            alias: "天天P图签名",
            packageName: "com.tencent.ttpic",
            updateTime: "2023-07-05 15:50:28"
        },
        {
            id: 9,
            signatureName: "com.example.android.camera",
            alias: "Android系统相机签名",
            packageName: "com.android.camera2",
            updateTime: "2023-04-12 13:15:36"
        },
        {
            id: 10,
            signatureName: "com.example.soda",
            alias: "苏打相机签名",
            packageName: "com.changba.sodacamera",
            updateTime: "2023-08-20 09:30:42"
        },

    ])

    //新增
    const handleAdd = () => {
        console.log('新增')
        showSignEditor.value = true
    }
    //编辑
    const handleEditor = (item: any) => {
        console.log('编辑', item)
        showSignEditor.value = true
    }
    //删除
    const handleDelete = (item: any) => {
        console.log('删除', item)

        ElMessageBox.confirm(
            '此操作将永久删除该签名, 是否继续?',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
    }
</script>

<style lang="scss" scoped></style>