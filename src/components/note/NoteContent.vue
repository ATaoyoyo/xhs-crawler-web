<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
    <!-- 笔记标题 -->
    <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
      {{ noteData.title }}
    </h2>
    
    <!-- 作者信息 -->
    <div class="flex items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
      <img :src="noteData.author.avatar" :alt="noteData.author.name"
        class="w-12 h-12 rounded-full mr-3 object-cover" />
      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white">{{ noteData.author.name }}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ noteData.publishTime }}</p>
      </div>
    </div>
    
    <!-- 笔记内容 -->
    <div class="prose prose-gray dark:prose-invert max-w-none mb-6">
      <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
        {{ noteData.content }}
      </p>
      
      <!-- 话题标签 -->
      <div v-if="extractTags(noteData.content).length > 0" class="mt-4 flex flex-wrap gap-2">
        <span v-for="tag in extractTags(noteData.content)" :key="tag"
          class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
          {{ tag }}
        </span>
      </div>
    </div>
    
    <!-- 统计信息 -->
    <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-4">
        <span class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {{ noteData.likes || 0 }} 点赞
        </span>
        <span class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {{ noteData.comments || 0 }} 评论
        </span>
        <span class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          {{ noteData.shares || 0 }} 分享
        </span>
      </div>
      <div class="text-xs">
        笔记ID: {{ noteData.id }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoteContent',
  props: {
    noteData: {
      type: Object,
      required: true,
      default: () => ({
        id: '',
        title: '',
        content: '',
        author: {
          name: '',
          avatar: ''
        },
        publishTime: '',
        likes: 0,
        comments: 0,
        shares: 0
      })
    }
  },
  methods: {
    extractTags(content) {
      if (!content) return []
      const tagRegex = /#([^#\s]+)/g
      const matches = content.match(tagRegex)
      return matches ? matches.map(tag => tag.trim()) : []
    }
  }
}
</script>