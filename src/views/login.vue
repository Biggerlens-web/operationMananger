<template>
    <div class="login-container">
        <div class="login-box">
            <h2>用户登录</h2>
            <!-- <div class="login-type">
                <span :class="{ active: loginType === 'account' }" @click="loginType = 'account'">账号密码登录</span>
                <span :class="{ active: loginType === 'phone' }" @click="loginType = 'phone'">手机号登录</span>
            </div> -->
            <form @submit.prevent="handleSubmit">
                <template v-if="loginType === 'account'">
                    <div class="form-item">
                        <label>用户名</label>
                        <input type="text" v-model="accountForm.username" placeholder="请输入用户名" />
                    </div>
                    <div class="form-item">
                        <label>密码</label>
                        <input type="password" v-model="accountForm.password" placeholder="请输入密码" />
                    </div>
                    <div class="form-item verification-code">
                        <label>验证码</label>
                        <input type="text" v-model="accountForm.verifyCode" placeholder="请输入验证码" />
                        <button type="button" class="send-code-btn" @click="getVerifyCode">
                            {{ '重新获取' }}
                        </button>
                    </div>
                    <div class="form-item" style="text-align: center;">

                        <img :src="verifyCodeUrl" alt="">
                    </div>
                </template>

                <template v-else>
                    <div class="form-item">
                        <label>手机号</label>
                        <input type="text" v-model="phoneForm.phone" placeholder="请输入手机号" />
                    </div>
                    <div class="form-item verification-code">
                        <label>验证码</label>
                        <input type="text" v-model="phoneForm.code" placeholder="请输入验证码" />
                        <button type="button" class="send-code-btn" :disabled="countdown > 0" @click="handleSendCode">
                            {{ countdown > 0 ? `${countdown}s后重新发送` : '发送验证码' }}
                        </button>
                    </div>
                </template>

                <el-button type="primary" native-type="submit" :disabled="loading" style="width: 100%;">
                    {{ loading ? '登录中...' : '登录' }}
                </el-button>

            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, reactive, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import service from '../axios/index.ts'
    import { ElMessage } from 'element-plus'
    import { desEncrypt } from '@/utils/des.ts'
    import { useCounterStore } from '@/stores/counter.ts'
    import { storeToRefs } from 'pinia'
    const counterStore = useCounterStore()
    const { userName, userAvatar } = storeToRefs(counterStore)
    interface AccountForm {
        username: string
        password: string,
        verifyCode: string
    }

    interface PhoneForm {
        phone: string
        code: string
    }

    const router = useRouter()
    const loading = ref(false)
    const loginType = ref<'account' | 'phone'>('account')
    const countdown = ref(0)

    const accountForm = reactive<AccountForm>({
        username: '',
        password: '',
        verifyCode: ''
    })

    const phoneForm = reactive<PhoneForm>({
        phone: '',
        code: ''
    })


    //获取验证码
    const sessionUUID = ref<any>()
    const verifyCodeUrl = ref<any>()
    const getVerifyCode = async () => {
        try {
            const res = await service.get('/verifyCode')
            console.log('res', res);


            verifyCodeUrl.value = `data:image/png;base64,${res.data.data.img}`
            sessionUUID.value = res.data.data.verifyCodeUUID

        } catch (err) {
            console.log('获取失败', err);
        }
    }

    const startCountdown = () => {
        countdown.value = 60
        const timer = setInterval(() => {
            countdown.value--
            if (countdown.value <= 0) {
                clearInterval(timer)
            }
        }, 1000)
    }

    const handleSendCode = async () => {
        if (!phoneForm.phone) {
            ElMessage.error('请输入手机号')
            return
        }

        const phoneRegex = /^1[3-9]\d{9}$/
        if (!phoneRegex.test(phoneForm.phone)) {
            ElMessage.error('请输入正确的手机号')
            return
        }

        try {

            startCountdown()
        } catch (error) {
            ElMessage.error('发送验证码失败：' + (error as Error).message)
        }
    }

    const handleSubmit = async () => {
        if (loginType.value === 'account') {
            if (!accountForm.username || !accountForm.password) {
                ElMessage.error('请输入用户名和密码')
                return
            }
        } else {
            if (!phoneForm.phone || !phoneForm.code) {
                ElMessage.error('请输入手机号和验证码')
                return
            }
        }
        try {
            loading.value = true

            const params = loginType.value === 'account'
                ? {
                    username: accountForm.username,
                    password: accountForm.password,
                    verifyCode: accountForm.verifyCode,
                    verifyCodeUUID: sessionUUID.value,
                    timestamp: new Date().getTime(),
                }
                : {
                    username: phoneForm.phone,
                    verifyCode: phoneForm.code,
                }
            console.log('参数', params);
            const paramsStr = desEncrypt(JSON.stringify(params))
            const res: any = await service.post('/loginAuth',
                {
                    enData: paramsStr
                }
            )
            console.log('登录', res);
            if (res.data.code === 200) {
                ElMessage.success('登录成功')
                localStorage.setItem('token', res.data.data.token ?? '')
                userName.value = res.data.data.userName ?? '管理员'
                userAvatar.value = res.data.data.userAvatar ?? ''
                router.push('/')
            } else {
                ElMessage.error(res.data.msg)
            }
        } catch (error) {
            ElMessage.error('登录失败：' + (error as Error).message)
        } finally {
            loading.value = false
        }
    }


    onMounted(() => {
        getVerifyCode()
    })
</script>

<style scoped>
    .login-container {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    .login-box {
        width: 400px;
        padding: 40px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    h2 {
        text-align: center;
        margin-bottom: 30px;
        color: #333;
        font-size: 24px;
        font-weight: 600;
    }

    .login-type {
        display: flex;
        justify-content: center;
        margin-bottom: 30px;
        border-bottom: 1px solid #eee;
    }

    .login-type span {
        padding: 12px 24px;
        margin: 0 8px;
        cursor: pointer;
        color: #666;
        font-size: 15px;
        transition: all 0.3s ease;
        position: relative;
    }

    .login-type span.active {
        color: #409eff;
    }

    .login-type span.active::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #409eff;
    }

    .form-item {
        margin-bottom: 24px;
    }

    label {
        display: block;
        margin-bottom: 8px;
        color: #333;
        font-size: 14px;
        font-weight: 500;
    }

    input {
        width: 100%;
        padding: 12px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        font-size: 14px;
        color: #333;
        transition: all 0.3s ease;
        outline: none;
        box-sizing: border-box;
    }

    input:focus {
        border-color: #409eff;
        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }

    input::placeholder {
        color: #c0c4cc;
    }

    .verification-code {
        position: relative;
    }

    .send-code-btn {
        position: absolute;
        right: 0px;

        top: 26px;

        width: auto;

        height: 44px;

        padding: 0 15px;
        font-size: 14px;
        color: #fff;
        background-color: #409eff;
        border: none;
        border-radius: 0 4px 4px 0;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .send-code-btn:hover:not(:disabled) {
        background-color: #66b1ff;
    }

    .send-code-btn:disabled {
        background-color: #a0cfff;
        cursor: not-allowed;
    }

    .submit-btn {
        width: 100%;
        padding: 12px;
        font-size: 16px;
        font-weight: 500;
        color: white;
        background-color: #409eff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 10px;
    }

    .submit-btn:hover:not(:disabled) {
        background-color: #66b1ff;
    }

    .submit-btn:disabled {
        background-color: #a0cfff;
        cursor: not-allowed;
    }

    .form-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        font-size: 14px;
    }

    .remember-me {
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .remember-me input[type="checkbox"] {
        width: auto;
        margin-right: 6px;
        cursor: pointer;
    }

    .remember-me span {
        color: #666;
    }

    .forgot-password {
        color: #409eff;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .forgot-password:hover {
        color: #66b1ff;
        text-decoration: underline;
    }

    @media (max-width: 480px) {
        .login-box {
            width: 90%;
            padding: 20px;
            margin: 0 20px;
        }

        .login-type span {
            padding: 10px 16px;
            font-size: 14px;
        }

        .send-code-btn {
            font-size: 12px;
            padding: 0 10px;
        }
    }
</style>