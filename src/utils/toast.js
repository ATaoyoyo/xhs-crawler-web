/**
 * Toast 通知工具
 */

let toastCallback = null

/**
 * 设置Toast回调函数
 * @param {Function} callback - 回调函数
 */
export function setToastCallback(callback) {
  toastCallback = callback
}

/**
 * 显示Toast通知
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 (success, error, warning, info)
 * @param {number} duration - 显示时长(毫秒)
 */
export function showToast(message, type = 'info', duration = 3000) {
  if (toastCallback) {
    toastCallback(message, type)
    
    // 自动隐藏
    if (duration > 0) {
      setTimeout(() => {
        if (toastCallback) {
          toastCallback('', type, false)
        }
      }, duration)
    }
  } else {
    // 降级到console输出
    console.log(`[${type.toUpperCase()}] ${message}`)
  }
}

// 便捷方法
export const toast = {
  success: (message, duration) => showToast(message, 'success', duration),
  error: (message, duration) => showToast(message, 'error', duration),
  warning: (message, duration) => showToast(message, 'warning', duration),
  info: (message, duration) => showToast(message, 'info', duration)
}

// 为了兼容性，导出showToast作为默认函数
showToast.setCallback = setToastCallback
export default showToast