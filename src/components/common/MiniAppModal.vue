<template>
  <transition name="modal" appear>
    <div v-if="visible" class="modal-overlay" @click.self="close">
      <div class="modal-content" :class="isDarkMode ? 'dark' : ''">
        <!-- 装饰性背景光晕 -->
        <div class="glow-bg"></div>

        <!-- 关闭按钮 -->
        <button class="close-btn" @click="close">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- 顶部标签 -->
        <div class="badge">
          <span class="badge-dot"></span>
          小程序专享
        </div>

        <!-- 二维码区域 -->
        <div class="qrcode-section">
          <div class="qrcode-frame">
            <div class="qrcode-inner">
              <img src="@/assets/miniapp.png" alt="小程序二维码" class="qrcode-image" />
            </div>
            <!-- 装饰角落 -->
            <div class="corner corner-tl"></div>
            <div class="corner corner-tr"></div>
            <div class="corner corner-bl"></div>
            <div class="corner corner-br"></div>
          </div>
        </div>

        <!-- 标题区域 -->
        <div class="text-section">
          <h2 class="title">获取更多专属能力</h2>
          <p class="subtitle">扫码进入小程序，解锁高效下载体验</p>
        </div>

        <!-- 功能亮点 -->
        <div class="features">
          <div class="feature-item">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="feature-text">
              <span class="feature-title">批量下载</span>
              <span class="feature-desc">高清图片无压缩</span>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="feature-text">
              <span class="feature-title">视频下载</span>
              <span class="feature-desc">去水印保存</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'MiniAppModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isDarkMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(8px);
}

.modal-content {
  position: relative;
  background: linear-gradient(145deg, #ffffff 0%, #fafafa 100%);
  border-radius: 24px;
  padding: 40px 36px 36px;
  max-width: 380px;
  width: 90%;
  text-align: center;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.modal-content.dark {
  background: linear-gradient(145deg, #1f2937 0%, #111827 100%);
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

/* 装饰性光晕 */
.glow-bg {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: rotate(90deg);
}

.dark .close-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #f9fafb;
}

.dark .close-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* 顶部标签 */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  color: #dc2626;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  margin-bottom: 24px;
  border: 1px solid rgba(220, 38, 38, 0.2);
}

.dark .badge {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%);
  border-color: rgba(220, 38, 38, 0.3);
}

.badge-dot {
  width: 6px;
  height: 6px;
  background: #dc2626;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 二维码区域 */
.qrcode-section {
  display: flex;
  justify-content: center;
  margin-bottom: 28px;
}

.qrcode-frame {
  position: relative;
  padding: 12px;
  background: white;
  border-radius: 16px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.dark .qrcode-frame {
  background: #374151;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.qrcode-inner {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.qrcode-image {
  display: block;
  width: 160px;
  height: 160px;
  object-fit: contain;
}

/* 装饰角落 */
.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 3px solid #dc2626;
}

.corner-tl {
  top: -4px;
  left: -4px;
  border-right: none;
  border-bottom: none;
  border-radius: 8px 0 0 0;
}

.corner-tr {
  top: -4px;
  right: -4px;
  border-left: none;
  border-bottom: none;
  border-radius: 0 8px 0 0;
}

.corner-bl {
  bottom: -4px;
  left: -4px;
  border-right: none;
  border-top: none;
  border-radius: 0 0 0 8px;
}

.corner-br {
  bottom: -4px;
  right: -4px;
  border-left: none;
  border-top: none;
  border-radius: 0 0 8px 0;
}

/* 文字区域 */
.text-section {
  margin-bottom: 24px;
}

.title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.dark .title {
  color: #f9fafb;
}

.subtitle {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.dark .subtitle {
  color: #9ca3af;
}

/* 功能亮点 */
.features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.2s;
}

.dark .feature-item {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border-color: rgba(255, 255, 255, 0.05);
}

.feature-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.feature-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-radius: 10px;
  color: #dc2626;
  flex-shrink: 0;
}

.feature-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.feature-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.dark .feature-title {
  color: #f9fafb;
}

.feature-desc {
  font-size: 12px;
  color: #6b7280;
}

.dark .feature-desc {
  color: #9ca3af;
}

/* 动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.92) translateY(20px);
}
</style>