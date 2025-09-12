// 环境变量工具函数

// 获取应用标题
export function getAppTitle(): string {
  return import.meta.env.VITE_APP_TITLE || '运营管理系统'
}

// 获取API基础URL
export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL || ''
}

// 判断是否为开发环境
export function isDevelopment(): boolean {
  return import.meta.env.VITE_APP_ENV === 'development'
}

// 判断是否为生产环境
export function isProduction(): boolean {
  return import.meta.env.VITE_APP_ENV === 'production'
}

// 判断是否开启调试模式
export function isDebugMode(): boolean {
  return import.meta.env.VITE_APP_DEBUG === 'true'
}

// 获取应用版本
export function getAppVersion(): string {
  return import.meta.env.VITE_APP_VERSION || '1.0.0'
}

// 打印环境信息（仅在开发环境）
export function logEnvInfo(): void {
  if (isDevelopment()) {
    console.log('🚀 应用环境信息:')
    console.log('📱 应用标题:', getAppTitle())
    console.log('🌍 运行环境:', import.meta.env.VITE_APP_ENV)
    console.log('🔗 API地址:', getApiBaseUrl())
    console.log('🐛 调试模式:', isDebugMode())
    console.log('📦 应用版本:', getAppVersion())
  }
}