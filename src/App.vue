<template>
  <div id="app" :class="{ dark: isDarkMode }">
    <!-- 应用头部 -->
    <AppHeader :isDarkMode="isDarkMode" @toggle-dark-mode="toggleDarkMode" />

    <!-- 主要内容区域 -->
    <main
      class="min-h-screen transition-colors duration-300"
      :class="isDarkMode ? 'bg-gray-900' : 'bg-gray-50'"
    >
      <div class="container mx-auto px-4 py-8">
        <!-- URL输入组件 -->
        <NoteUrlInput
          :isDarkMode="isDarkMode"
          :loading="isLoading"
          @fetch-data="fetchNoteData"
        />

        <!-- 笔记内容展示 -->
        <div v-if="noteData && !isLoading" class="note-content-area">
          <!-- 笔记基本信息 -->
          <NoteContent :noteData="noteData" />

          <!-- 下载操作区域 -->
          <DownloadActions
            :images="noteData.images"
            :videos="noteData.videos"
            :isDownloading="isDownloadingAll"
            :downloadProgress="downloadProgress"
            @download-all="downloadAll"
          />

          <!-- 媒体网格展示 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3
              class="text-lg font-semibold mb-4 text-gray-900 dark:text-white"
            >
              媒体内容 ({{ noteData.images.length + noteData.videos.length }}
              项)
            </h3>

            <MediaGrid
              :images="noteData.images"
              :videos="noteData.videos"
              :downloadingStates="downloadingStates"
              @preview-image="openImagePreview"
              @preview-video="openVideoPreview"
              @download-image="downloadSingleImage"
              @download-video="downloadSingleVideo"
            />
          </div>
        </div>

        <!-- 加载状态 -->
        <LoadingSpinner v-if="isLoading" />

        <!-- 空状态提示 -->
        <div
          v-if="!noteData && !isLoading"
          class="text-center py-12 text-gray-500 dark:text-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 mx-auto mb-4 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p class="text-lg font-medium mb-2">暂无笔记数据</p>
          <p class="text-sm">请输入小红书笔记链接开始使用</p>
        </div>
      </div>
    </main>

    <!-- 应用底部 -->
    <AppFooter :isDarkMode="isDarkMode" />

    <!-- 返回顶部按钮 -->
    <BackToTop
      :show="showBackToTop && !isImagePreviewOpen && !isVideoPreviewOpen"
      :isDarkMode="isDarkMode"
      @scroll-to-top="scrollToTop"
    />

    <!-- 图片预览组件 -->
    <ImagePreview
      :visible="isImagePreviewOpen"
      :imageUrl="previewImage.url"
      :imageAlt="previewImage.alt"
      :filename="previewImage.filename"
      @close="closeImagePreview"
      @download="downloadFromPreview"
    />

    <!-- 视频预览组件 -->
    <VideoPreview
      :visible="isVideoPreviewOpen"
      :videoUrl="previewVideo.url"
      :videoTitle="previewVideo.title"
      :filename="previewVideo.filename"
      @close="closeVideoPreview"
      @download="downloadFromVideoPreview"
    />

    <!-- Toast通知组件 -->
    <Toast
      :show="toast.show"
      :message="toast.message"
      :type="toast.type"
      @close="closeToast"
    />
  </div>
</template>

<script>
import AppHeader from "./components/layout/AppHeader.vue";
import AppFooter from "./components/layout/AppFooter.vue";
import NoteUrlInput from "./components/note/NoteUrlInput.vue";
import NoteContent from "./components/note/NoteContent.vue";
import DownloadActions from "./components/download/DownloadActions.vue";
import MediaGrid from "./components/media/MediaGrid.vue";
import ImagePreview from "./components/media/ImagePreview.vue";
import VideoPreview from "./components/media/VideoPreview.vue";
import BackToTop from "./components/common/BackToTop.vue";
import LoadingSpinner from "./components/common/LoadingSpinner.vue";
import Toast from "./components/common/Toast.vue";
import {
  downloadResource,
  downloadMultipleResources,
} from "./utils/download.js";
import { showToast } from "./utils/toast.js";
import { getNoteData } from "./api/index.js";

export default {
  name: "App",
  components: {
    AppHeader,
    AppFooter,
    NoteUrlInput,
    NoteContent,
    DownloadActions,
    MediaGrid,
    ImagePreview,
    VideoPreview,
    BackToTop,
    LoadingSpinner,
    Toast,
  },
  data() {
    return {
      isDarkMode: false,
      isLoading: false,
      noteData: null,
      showBackToTop: false,
      isImagePreviewOpen: false,
      previewImage: {
        url: "",
        alt: "",
        filename: "",
      },
      isVideoPreviewOpen: false,
      previewVideo: {
        url: "",
        title: "",
        filename: "",
      },
      downloadingStates: {},
      isDownloadingAll: false,
      downloadProgress: {
        show: false,
        current: 0,
        total: 0,
        currentFile: "",
      },
      toast: {
        show: false,
        message: "",
        type: "info",
      },
    };
  },
  mounted() {
    // 初始化暗黑模式
    this.isDarkMode = localStorage.getItem("darkMode") === "true";

    // 监听滚动事件
    window.addEventListener("scroll", this.handleScroll);

    // 设置toast管理器的回调
    showToast.setCallback(this.showToastMessage);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    // 切换暗黑模式
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem("darkMode", this.isDarkMode.toString());
    },

    // 处理滚动事件
    handleScroll() {
      this.showBackToTop = window.scrollY > 300;
    },

    // 滚动到顶部
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },

    // 获取笔记数据
    async fetchNoteData(url) {
      this.isLoading = true;
      try {
        // 模拟API调用
        const data = await getNoteData(url);

        // 模拟数据
        this.noteData = data;

        showToast("笔记数据获取成功！", "success");

        // 获取成功后自动滚动到笔记内容区域
        this.$nextTick(() => {
          this.scrollToNoteContent();
        });
      } catch (error) {
        console.error("获取笔记数据失败:", error);
        showToast("获取笔记数据失败，请检查链接是否正确", "error");
      } finally {
        this.isLoading = false;
      }
    },

    // 滚动到笔记内容区域
    scrollToNoteContent() {
      const noteContentElement = document.querySelector(".note-content-area");
      if (noteContentElement) {
        noteContentElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    },

    // 打开图片预览
    openImagePreview({ image, index }) {
      this.previewImage = {
        url: image.url,
        alt: image.alt || `图片 ${index + 1}`,
        filename: image.filename || `image_${index + 1}.jpg`,
      };
      this.isImagePreviewOpen = true;
    },

    // 关闭图片预览
    closeImagePreview() {
      this.isImagePreviewOpen = false;
    },

    // 打开视频预览
    openVideoPreview({ video, index }) {
      this.previewVideo = {
        url: video.url,
        title: video.title || `视频 ${index + 1}`,
        filename: video.filename || `video_${index + 1}.mp4`,
      };
      this.isVideoPreviewOpen = true;
    },

    // 关闭视频预览
    closeVideoPreview() {
      this.isVideoPreviewOpen = false;
    },

    // 从视频预览界面下载
    async downloadFromVideoPreview({ url, filename }) {
      try {
        await downloadResource(url, filename);
        showToast("视频下载成功！", "success");
      } catch (error) {
        console.error("下载失败:", error);
        showToast("视频下载失败，请重试", "error");
      }
    },

    // 从预览界面下载
    async downloadFromPreview({ url, filename }) {
      try {
        await downloadResource(url, filename);
        showToast("图片下载成功！", "success");
      } catch (error) {
        console.error("下载失败:", error);
        showToast("下载失败，请重试", "error");
      }
    },

    // 下载单个图片
    async downloadSingleImage({ image, index }) {
      const key = `image-${index}`;
      if (this.downloadingStates[key]) return;

      this.downloadingStates[key] = true;

      try {
        await downloadResource(
          image.url,
          image.filename || `image_${index + 1}.jpg`
        );
        showToast("图片下载成功！", "success");
      } catch (error) {
        console.error("下载失败:", error);

        // 检查是否是混合内容错误
        if (error.message && error.message.includes("Mixed Content")) {
          showToast(
            "下载失败：检测到HTTP资源，请联系管理员配置HTTPS代理",
            "error"
          );
        } else if (error.message && error.message.includes("CORS")) {
          showToast("下载失败：跨域限制，正在尝试代理下载...", "warning");
        } else {
          showToast("图片下载失败，请重试", "error");
        }
      } finally {
        this.downloadingStates[key] = false;
      }
    },

    // 下载单个视频
    async downloadSingleVideo({ video, index }) {
      const key = `video-${index}`;
      if (this.downloadingStates[key]) return;

      this.downloadingStates[key] = true;

      try {
        await downloadResource(
          video.url,
          video.filename || `video_${index + 1}.mp4`
        );
        showToast("视频下载成功！", "success");
      } catch (error) {
        console.error("下载失败:", error);

        // 检查是否是混合内容错误
        if (error.message && error.message.includes("Mixed Content")) {
          showToast(
            "下载失败：检测到HTTP视频资源，请联系管理员配置HTTPS代理",
            "error"
          );
        } else if (error.message && error.message.includes("CORS")) {
          showToast("下载失败：跨域限制，正在尝试代理下载...", "warning");
        } else {
          showToast("视频下载失败，可能是网络问题或文件过大", "error");
        }
      } finally {
        this.downloadingStates[key] = false;
      }
    },

    // 批量下载所有媒体
    async downloadAll() {
      if (this.isDownloadingAll || !this.noteData) return;

      const allMedia = [
        ...this.noteData.images.map((img, index) => ({
          url: img.url,
          filename: img.filename || `image_${index + 1}.jpg`,
          type: "image",
        })),
        ...this.noteData.videos.map((video, index) => ({
          url: video.url,
          filename: video.filename || `video_${index + 1}.mp4`,
          type: "video",
        })),
      ];

      if (allMedia.length === 0) {
        showToast("没有可下载的媒体文件", "warning");
        return;
      }

      this.isDownloadingAll = true;
      this.downloadProgress = {
        show: true,
        current: 0,
        total: allMedia.length,
        currentFile: "",
      };

      try {
        await downloadMultipleResources(allMedia, (progress) => {
          this.downloadProgress.current = progress.completed;
          this.downloadProgress.currentFile = progress.currentFile;
        });

        showToast(`成功下载 ${allMedia.length} 个文件！`, "success");
      } catch (error) {
        console.error("批量下载失败:", error);
        showToast("批量下载过程中出现错误，部分文件可能下载失败", "error");
      } finally {
        this.isDownloadingAll = false;
        this.downloadProgress.show = false;
      }
    },

    // 显示Toast消息
    showToastMessage(message, type = "info") {
      this.toast = {
        show: true,
        message,
        type,
      };
    },

    // 关闭Toast
    closeToast() {
      this.toast.show = false;
    },
  },
};
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 暗黑模式滚动条 */
.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
