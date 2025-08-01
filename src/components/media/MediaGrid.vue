<template>
  <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
    <!-- 图片展示 -->
    <div
      v-for="(image, index) in images"
      :key="`image-${index}`"
      class="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square"
    >
      <img
        :src="image.url"
        :alt="image.alt || `图片 ${index + 1}`"
        class="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
        @click="previewImage(image, index)"
        loading="lazy"
      />

      <!-- 悬停遮罩 -->
      <div
        class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center"
      >
        <div
          class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2"
        >
          <!-- 预览按钮 -->
          <button
            @click="previewImage(image, index)"
            class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>

          <!-- 下载按钮 -->
          <button
            @click="downloadImage(image, index)"
            :disabled="downloadingStates[`image-${index}`]"
            class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all duration-200 disabled:opacity-50"
          >
            <svg
              v-if="!downloadingStates[`image-${index}`]"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <div
              v-else
              class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></div>
          </button>
        </div>
      </div>

      <!-- 图片序号 -->
      <div
        class="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded"
      >
        {{ index + 1 }}
      </div>
    </div>

    <!-- 视频展示 -->
    <div
      v-for="(video, index) in videos"
      :key="`video-${index}`"
      class="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square"
    >
      <video
        :src="video.url"
        class="w-full h-full object-cover"
        :poster="video.cover"
        preload="metadata"
        controls
      >
        您的浏览器不支持视频播放。
      </video>

      <!-- 播放按钮覆盖层 -->
      <div
        class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center cursor-pointer"
        @click="previewVideo(video, index)"
      >
        <button
          class="w-16 h-16 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 ml-1"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>

      <!-- 悬停操作按钮 -->
      <div
        class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end justify-end p-3"
      >
        <div
          class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2"
        >
          <!-- 预览按钮 -->
          <button
            @click.stop="previewVideo(video, index)"
            class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all duration-200"
            title="预览视频"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
          
          <!-- 下载按钮 -->
          <button
            @click.stop="downloadVideo(video, index)"
            :disabled="downloadingStates[`video-${index}`]"
            class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all duration-200 disabled:opacity-50"
            title="下载视频"
          >
            <svg
              v-if="!downloadingStates[`video-${index}`]"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <div
              v-else
              class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></div>
          </button>
        </div>
      </div>

      <!-- 视频标识 -->
      <div
        class="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs rounded flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-3 w-3 mr-1"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
        视频 {{ index + 1 }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MediaGrid",
  props: {
    images: {
      type: Array,
      default: () => [],
    },
    videos: {
      type: Array,
      default: () => [],
    },
    downloadingStates: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["preview-image", "preview-video", "download-image", "download-video"],
  methods: {
    previewImage(image, index) {
      this.$emit("preview-image", { image, index });
    },
    previewVideo(video, index) {
      this.$emit("preview-video", { video, index });
    },
    downloadImage(image, index) {
      this.$emit("download-image", { image, index });
    },
    downloadVideo(video, index) {
      this.$emit("download-video", { video, index });
    },
  },
};
</script>
