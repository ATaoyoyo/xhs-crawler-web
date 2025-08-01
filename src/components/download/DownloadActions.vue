<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 my-6">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">下载操作</h3>
    
    <div class="flex flex-col sm:flex-row gap-3">
      <!-- 下载全部图片 -->
      <button @click="downloadAllImages"
        :disabled="isDownloading || (!images.length && !videos.length)"
        class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 flex items-center justify-center">
        <svg v-if="!isDownloading" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <div v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
        {{ isDownloading ? '下载中...' : '快速下载全部' }}
      </button>
      
      <!-- 下载统计 -->
      <div class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-sm text-gray-600 dark:text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4" />
        </svg>
        {{ images.length }} 张图片 · {{ videos.length }} 个视频
      </div>
    </div>
    
    <!-- 下载进度 -->
    <div v-if="downloadProgress.show" class="mt-4">
      <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
        <span>下载进度</span>
        <span>{{ downloadProgress.current }}/{{ downloadProgress.total }}</span>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
          :style="{ width: `${(downloadProgress.current / downloadProgress.total) * 100}%` }"></div>
      </div>
      <div v-if="downloadProgress.currentFile" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        正在下载: {{ downloadProgress.currentFile }}
      </div>
    </div>
    
    <!-- 下载提示 -->
    <div class="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
      <div class="flex items-start">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="text-sm text-yellow-800 dark:text-yellow-200">
          <p class="font-medium mb-1">下载说明：</p>
          <ul class="list-disc list-inside space-y-1 text-xs">
            <li>点击单个媒体文件可预览或直接下载</li>
            <li>批量下载会自动处理重复点击防护</li>
            <li>视频文件较大，下载时间可能较长</li>
            <li>如遇下载失败，请检查网络连接后重试</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DownloadActions',
  props: {
    images: {
      type: Array,
      default: () => []
    },
    videos: {
      type: Array,
      default: () => []
    },
    isDownloading: {
      type: Boolean,
      default: false
    },
    downloadProgress: {
      type: Object,
      default: () => ({
        show: false,
        current: 0,
        total: 0,
        currentFile: ''
      })
    }
  },
  emits: ['download-all'],
  methods: {
    downloadAllImages() {
      if (this.isDownloading) return
      this.$emit('download-all')
    }
  }
}
</script>