import Cookies from 'js-cookie'

// Token相关的Cookie配置
const TOKEN_KEY = 'auth_token'
const TOKEN_EXPIRES = 7 // 7天过期

/**
 * Cookie工具类
 */
export class CookieUtils {
  /**
   * 设置token到Cookie
   * @param token - 认证token
   * @param expires - 过期天数，默认7天
   */
  static setToken(token: string, expires: number = TOKEN_EXPIRES): void {
    Cookies.set(TOKEN_KEY, token, {
      expires,
      secure: window.location.protocol === 'https:', // HTTPS环境下启用secure
      sameSite: 'strict', // 防止CSRF攻击
      path: '/', // 全站可用
    })
  }

  /**
   * 从Cookie获取token
   * @returns token字符串或undefined
   */
  static getToken(): string | undefined {
    return Cookies.get(TOKEN_KEY)
  }

  /**
   * 删除token Cookie
   */
  static removeToken(): void {
    Cookies.remove(TOKEN_KEY, { path: '/' })
  }

  /**
   * 检查token是否存在
   * @returns 是否存在token
   */
  static hasToken(): boolean {
    return !!Cookies.get(TOKEN_KEY)
  }

  /**
   * 设置任意Cookie值
   * @param key - Cookie键名
   * @param value - Cookie值
   * @param options - Cookie选项
   */
  static set(key: string, value: string, options?: Cookies.CookieAttributes): void {
    Cookies.set(key, value, options)
  }

  /**
   * 获取任意Cookie值
   * @param key - Cookie键名
   * @returns Cookie值或undefined
   */
  static get(key: string): string | undefined {
    return Cookies.get(key)
  }

  /**
   * 删除任意Cookie
   * @param key - Cookie键名
   * @param options - Cookie选项
   */
  static remove(key: string, options?: Cookies.CookieAttributes): void {
    Cookies.remove(key, options)
  }
}

// 导出便捷函数
export const { setToken, getToken, removeToken, hasToken } = CookieUtils

// 默认导出
export default CookieUtils
