/**
 * 获取对象的所有键名并生成新对象
 * @param {Object} obj - 要处理的对象
 * @param {string} parentKey - 父键名（递归调用时使用）
 * @return {Object} - 生成的新对象
 */
export function getKeysAsObject(obj: any, parentKey = '') {
  // 结果对象
  const result: any = {}

  // 遍历对象的所有键
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // 当前完整键名
      const currentKey: any = parentKey ? `${parentKey},${key}` : key
      result[currentKey] = ''
      // 如果值是对象且不是数组或null，递归处理
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        // 递归处理嵌套对象，并合并结果
        const nestedResult = getKeysAsObject(obj[key], currentKey)
        Object.assign(result, nestedResult)
      } else {
        // 非对象值，直接设置为空字符串
        result[currentKey] = ''
      }
    }
  }

  return result
}
