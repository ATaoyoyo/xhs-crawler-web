<template>
  <div class="note-preview">
    <!-- 笔记内容 -->
    <NoteContent :noteData="noteData" />
    
    <!-- 下载操作 -->
    <DownloadActions 
      :images="noteData.images"
      :videos="noteData.videos"
      :isDownloading="isDownloadingAll"
      :downloadProgress="downloadProgress"
      @download-all="downloadAll" />
    
    <!-- 媒体网格 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        媒体内容 ({{ noteData.images.length + noteData.videos.length }} 项)
      </h3>
      
      <MediaGrid 
        :images="noteData.images"
        :videos="noteData.videos"
        :downloadingStates="downloadingStates"
        @preview-image="$emit('preview-image', $event)"
        @download-image="$emit('download-image', $event)"
        @download-video="$emit('download-video', $event)" />
    </div>
  </div>
</template>

<script>
import NoteContent from './note/NoteContent.vue'
import DownloadActions from './download/DownloadActions.vue'
import MediaGrid from './media/MediaGrid.vue'

export default {
  name: 'NotePreview',
  components: {
    NoteContent,
    DownloadActions,
    MediaGrid
  },
  props: {
    noteData: {
      type: Object,
      required: true
    },
    downloadingStates: {
      type: Object,
      default: () => ({})
    },
    isDownloadingAll: {
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
  emits: ['preview-image', 'download-image', 'download-video', 'download-all'],
  methods: {
    downloadAll() {
      this.$emit('download-all')
    }
  }
}
</script>