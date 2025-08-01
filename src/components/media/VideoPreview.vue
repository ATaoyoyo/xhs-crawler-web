<template>
  <div v-if="visible" 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
    @click="close">
    <div class="relative w-full h-full flex items-center justify-center p-4 sm:p-6 md:p-8">
      <!-- 视频播放器 -->
      <video ref="videoPlayer"
        :src="videoUrl" 
        class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        controls
        preload="metadata"
        @click.stop
        @loadedmetadata="onVideoLoaded"
        @error="onVideoError">
        您的浏览器不支持视频播放。
      </video>
      
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
        <span class="hidden sm:inline">下载视频</span>
      </button>
      
      <!-- 视频信息 -->
      <div class="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 px-2 py-1 sm:px-3 sm:py-2 bg-black bg-opacity-50 text-white rounded-lg text-xs sm:text-sm z-10">
        <div class="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <span>{{ videoTitle }}</span>
        </div>
        <div v-if="videoDuration" class="text-xs opacity-75 mt-1">
          时长: {{ formatDuration(videoDuration) }}
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="isLoading" 
        class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
        <div class="text-center text-white">
          <div class="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p class="text-sm">视频加载中...</p>
        </div>
      </div>
      
      <!-- 错误状态 -->
      <div v-if="hasError" 
        class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
        <div class="text-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm">视频加载失败</p>
          <button @click="retryLoad" 
            class="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition-colors">
            重试
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoPreview',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    videoUrl: {
      type: String,
      default: ''
    },
    videoTitle: {
      type: String,
      default: '视频'
    },
    filename: {
      type: String,
      default: ''
    }
  },
  emits: ['close', 'download'],
  data() {
    return {
      isLoading: true,
      hasError: false,
      videoDuration: 0
    }
  },
  watch: {
    visible(newVal) {
      // 控制背景滚动
      document.body.style.overflow = newVal ? 'hidden' : 'auto'
      
      if (newVal) {
        this.isLoading = true
        this.hasError = false
        this.videoDuration = 0
      } else {
        // 关闭时暂停视频
        if (this.$refs.videoPlayer) {
          this.$refs.videoPlayer.pause()
        }
      }
    },
    videoUrl() {
      if (this.visible) {
        this.isLoading = true
        this.hasError = false
        this.videoDuration = 0
      }
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
        url: this.videoUrl,
        filename: this.filename || this.videoTitle
      })
    },
    handleKeydown(event) {
      if (!this.visible) return
      
      if (event.key === 'Escape') {
        this.close()
      } else if (event.key === ' ' || event.key === 'Spacebar') {
        // 空格键控制播放/暂停
        event.preventDefault()
        this.togglePlay()
      }
    },
    togglePlay() {
      if (this.$refs.videoPlayer) {
        if (this.$refs.videoPlayer.paused) {
          this.$refs.videoPlayer.play()
        } else {
          this.$refs.videoPlayer.pause()
        }
      }
    },
    onVideoLoaded() {
      this.isLoading = false
      this.hasError = false
      if (this.$refs.videoPlayer) {
        this.videoDuration = this.$refs.videoPlayer.duration
      }
    },
    onVideoError() {
      this.isLoading = false
      this.hasError = true
      console.error('视频加载失败:', this.videoUrl)
    },
    retryLoad() {
      this.isLoading = true
      this.hasError = false
      if (this.$refs.videoPlayer) {
        this.$refs.videoPlayer.load()
      }
    },
    formatDuration(seconds) {
      if (!seconds || isNaN(seconds)) return '00:00'
      
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = Math.floor(seconds % 60)
      
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
  }
}
</script>

<style scoped>
/* 自定义视频控件样式 */
video::-webkit-media-controls-panel {
  background-color: rgba(0, 0, 0, 0.8);
}

video::-webkit-media-controls-play-button,
video::-webkit-media-controls-pause-button {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
}

video::-webkit-media-controls-timeline {
  background-color: rgba(255, 255, 255, 0.3);
}

video::-webkit-media-controls-current-time-display,
video::-webkit-media-controls-time-remaining-display {
  color: white;
}
</style>