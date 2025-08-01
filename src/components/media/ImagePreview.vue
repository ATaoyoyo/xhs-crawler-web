<template>
  <div v-if="visible" 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
    @click="close">
    <div class="relative w-full h-full flex items-center justify-center p-4 sm:p-6 md:p-8">
      <img :src="imageUrl" :alt="imageAlt" 
        class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        @click.stop />
      
      <!-- 关闭按钮 -->
      <button @click="close" 
        class="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-all duration-200 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <!-- 下载按钮 -->
      <button @click="download" 
        class="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center text-sm sm:text-base z-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span class="hidden sm:inline">下载</span>
      </button>
      
      <!-- 图片信息 -->
      <div class="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 px-2 py-1 sm:px-3 sm:py-2 bg-black bg-opacity-50 text-white rounded-lg text-xs sm:text-sm z-10">
        {{ imageAlt }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImagePreview',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    imageUrl: {
      type: String,
      default: ''
    },
    imageAlt: {
      type: String,
      default: ''
    },
    filename: {
      type: String,
      default: ''
    }
  },
  emits: ['close', 'download'],
  watch: {
    visible(newVal) {
      // 控制背景滚动
      document.body.style.overflow = newVal ? 'hidden' : 'auto'
    }
  },
  mounted() {
    // 添加键盘事件监听
    document.addEventListener('keydown', this.handleKeydown)
  },
  beforeUnmount() {
    // 移除键盘事件监听
    document.removeEventListener('keydown', this.handleKeydown)
    // 确保页面滚动恢复正常
    document.body.style.overflow = 'auto'
  },
  methods: {
    close() {
      this.$emit('close')
    },
    download() {
      this.$emit('download', {
        url: this.imageUrl,
        filename: this.filename || this.imageAlt
      })
    },
    handleKeydown(event) {
      if (event.key === 'Escape' && this.visible) {
        this.close()
      }
    }
  }
}
</script>