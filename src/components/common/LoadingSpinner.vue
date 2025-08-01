<template>
  <div class="flex flex-col items-center justify-center py-12">
    <!-- 加载动画 -->
    <div class="relative">
      <div class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <div class="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-400 rounded-full animate-spin animation-delay-150"></div>
    </div>
    
    <!-- 加载文字 -->
    <p class="mt-4 text-gray-600 dark:text-gray-400 text-sm">
      {{ message }}
    </p>
    
    <!-- 加载提示 -->
    <div class="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      正在处理中，请稍候...
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    message: {
      type: String,
      default: '正在加载笔记数据...'
    },
    size: {
      type: String,
      default: 'medium',
      validator: value => ['small', 'medium', 'large'].includes(value)
    }
  },
  computed: {
    spinnerClass() {
      const sizes = {
        small: 'w-8 h-8',
        medium: 'w-12 h-12',
        large: 'w-16 h-16'
      }
      return sizes[this.size] || sizes.medium
    }
  }
}
</script>

<style scoped>
.animation-delay-150 {
  animation-delay: 150ms;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>