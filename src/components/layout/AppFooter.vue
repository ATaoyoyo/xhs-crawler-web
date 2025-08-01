<template>
  <footer class="border-t transition-colors duration-300"
    :class="isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- 工具介绍 -->
        <div>
          <h3 class="text-lg font-semibold mb-4 transition-colors duration-300"
            :class="isDarkMode ? 'text-white' : 'text-gray-900'">
            关于工具
          </h3>
          <p class="text-sm leading-relaxed transition-colors duration-300"
            :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
            这是一个用于下载小红书笔记中图片和视频的工具。支持批量下载，界面简洁美观，完全免费使用。
          </p>
        </div>
        
        <!-- 使用说明 -->
        <div>
          <h3 class="text-lg font-semibold mb-4 transition-colors duration-300"
            :class="isDarkMode ? 'text-white' : 'text-gray-900'">
            使用说明
          </h3>
          <ul class="text-sm space-y-2 transition-colors duration-300"
            :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
            <li class="flex items-start">
              <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
              复制小红书笔记链接
            </li>
            <li class="flex items-start">
              <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
              粘贴到输入框并点击获取
            </li>
            <li class="flex items-start">
              <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
              选择需要的图片或视频下载
            </li>
          </ul>
        </div>
        
        <!-- 技术信息 -->
        <div>
          <h3 class="text-lg font-semibold mb-4 transition-colors duration-300"
            :class="isDarkMode ? 'text-white' : 'text-gray-900'">
            技术栈
          </h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="tech in techStack" :key="tech"
              class="px-2 py-1 text-xs rounded-full transition-colors duration-300"
              :class="isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'">
              {{ tech }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- 分割线 -->
      <div class="border-t mt-8 pt-6 transition-colors duration-300"
        :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <!-- 版权信息 -->
          <div class="text-sm transition-colors duration-300"
            :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
            <p>&copy; 2025 小红书内容提供工具. 仅供学习交流使用.</p>
          </div>
          
          <!-- 链接 -->
          <div class="flex items-center space-x-6 text-sm">
            <!-- <a href="#" 
              class="transition-colors duration-200 hover:underline"
              :class="isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
              使用条款
            </a>
            <a href="#" 
              class="transition-colors duration-200 hover:underline"
              :class="isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
              隐私政策
            </a>
            <a href="#" 
              class="transition-colors duration-200 hover:underline"
              :class="isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
              反馈建议
            </a> -->
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  props: {
    isDarkMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      techStack: ['Vue.js', 'Tailwind CSS', 'JavaScript', 'HTML5', 'CSS3']
    }
  }
}
</script>