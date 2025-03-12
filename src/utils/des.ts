import CryptoJS from 'crypto-js'

// DES 加密函数
export function desEncrypt(message: string, key: string = 'BdAI49tneLIvk1VIMpWwFZ1Jj2nFnhion2Ul8oIEQ8Liaca72nb16Br4qDNx6T2', iv: string = 'bigger77'): string {
    // 将密钥和偏移值转换为 CryptoJS 的格式
    const keyHex = CryptoJS.enc.Utf8.parse(key)
    const ivHex = CryptoJS.enc.Utf8.parse(iv)

    // 加密
    const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        iv: ivHex, // 使用偏移值（IV）
        mode: CryptoJS.mode.CBC, // CBC 模式
        padding: CryptoJS.pad.Pkcs7 // 填充方式
    })

    return encrypted.toString()
}

// DES解密
export const decryptDes = (encryptedText: string, key = 'BdAI49tneLIvk1VIMpWwFZ1Jj2nFnhion2Ul8oIEQ8Liaca72nb16Br4qDNx6T2', iv = 'bigger77') => {
    const keyHex = CryptoJS.enc.Utf8.parse(key) // 密钥
    const ivHex = CryptoJS.enc.Utf8.parse(iv) // 偏移量
    const option = {
        iv: ivHex,
        mode: CryptoJS.mode.CBC, // 保持与加密时相同的模式
        padding: CryptoJS.pad.Pkcs7 // 保持与加密时相同的填充方式
    }
    const decrypted = CryptoJS.DES.decrypt(encryptedText, keyHex, option)
    return decrypted.toString(CryptoJS.enc.Utf8) // 将解密结果转换为字符串
}
