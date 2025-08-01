<template>
  <div class="max-w-3xl mx-auto">
    <div
      class="border rounded-xl p-8 shadow-sm transition-all duration-200"
      :class="
        isDarkMode
          ? 'bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-gray-900/10'
          : 'bg-white border-gray-200 hover:shadow-lg hover:shadow-gray-900/5'
      "
    >
      <div class="space-y-6">
        <!-- 输入框 -->
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 transition-colors"
              :class="isDarkMode ? 'text-gray-400' : 'text-gray-400'"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <textarea
            v-model="noteUrl"
            placeholder="粘贴小红书笔记分享文本或链接..."
            rows="3"
            class="w-full pl-12 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-base resize-none"
            :class="[
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 placeholder-gray-400 focus:bg-gray-600'
                : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 placeholder-gray-500 focus:bg-white',
              urlValidationStatus === 'invalid'
                ? 'border-red-500 focus:ring-red-500'
                : '',
              urlValidationStatus === 'valid'
                ? 'border-green-500 focus:ring-green-500'
                : '',
            ]"
            @keyup.enter="fetchData"
            @input="onInputChange"
            @focus="onInputFocus"
            @blur="onInputBlur"
          ></textarea>

          <!-- 验证状态图标 -->
          <div
            class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none"
          >
            <svg
              v-if="urlValidationStatus === 'valid'"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <svg
              v-else-if="urlValidationStatus === 'invalid'"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        <!-- 验证提示信息 -->
        <div
          v-if="validationMessage"
          class="text-sm flex items-center"
          :class="
            urlValidationStatus === 'valid'
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {{ validationMessage }}
        </div>

        <!-- 提取的URL显示 -->
        <div
          v-if="extractedUrl && extractedUrl !== noteUrl.trim()"
          class="p-3 rounded-lg border transition-colors"
          :class="
            isDarkMode
              ? 'bg-gray-700 border-gray-600'
              : 'bg-blue-50 border-blue-200'
          "
        >
          <div
            class="text-sm font-medium mb-1"
            :class="isDarkMode ? 'text-gray-300' : 'text-blue-800'"
          >
            已提取的链接：
          </div>
          <div
            class="text-sm font-mono break-all"
            :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'"
          >
            {{ extractedUrl }}
          </div>
        </div>

        <!-- 获取按钮 -->
        <button
          @click="fetchData"
          class="w-full py-4 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          :disabled="!isValidUrl || loading"
          :class="[
            isDarkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:hover:bg-blue-600'
              : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:hover:bg-blue-600',
            loading ? 'cursor-wait' : '',
          ]"
        >
          <span v-if="loading" class="flex items-center justify-center">
            <svg
              class="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            获取中...
          </span>
          <span v-else class="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            获取笔记
          </span>
        </button>

        <!-- 使用说明 -->
        <div class="mt-4 space-y-2">
          <div
            class="flex items-center justify-center text-sm"
            :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>支持小红书笔记分享文本和链接</span>
          </div>

          <!-- 支持格式说明 -->
          <div
            class="text-xs text-center space-y-1"
            :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'"
          >
            <div>✓ 完整分享文本（包含链接）</div>
            <div>✓ 直接链接（http://xhslink.com/...）</div>
            <div>✓ 无协议链接（xhslink.com/...）</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NoteUrlInput",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    isDarkMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      noteUrl: "",
      extractedUrl: "",
      urlValidationStatus: "", // 'valid', 'invalid', ''
      validationMessage: "",
    };
  },
  computed: {
    isValidUrl() {
      return this.urlValidationStatus === "valid" && this.extractedUrl !== "";
    },
  },
  mounted() {
    // 初始化时验证默认URL
    this.validateAndExtractUrl();
  },
  methods: {
    // 输入变化时的处理
    onInputChange() {
      this.validateAndExtractUrl();
    },

    // 验证并提取URL
    validateAndExtractUrl() {
      const text = this.noteUrl.trim();

      if (!text) {
        this.resetValidation();
        return;
      }

      // 提取URL
      const url = this.extractUrlFromText(text);

      if (url) {
        this.extractedUrl = url;
        this.urlValidationStatus = "valid";
        this.validationMessage = "检测到有效的小红书链接";
      } else {
        this.extractedUrl = "";
        this.urlValidationStatus = "invalid";
        this.validationMessage = "未检测到有效的小红书链接，请检查输入内容";
      }
    },

    // 从文本中提取小红书URL
    extractUrlFromText(text) {
      // 小红书域名模式
      const domains = ["xiaohongshu.com", "xhslink.com", "www.xiaohongshu.com"];

      // 1. 首先尝试匹配完整的HTTP/HTTPS链接
      const httpRegex =
        /https?:\/\/(?:www\.)?(?:xiaohongshu\.com|xhslink\.com)\/[^\s\u4e00-\u9fa5]*/gi;
      const httpMatches = text.match(httpRegex);
      if (httpMatches && httpMatches.length > 0) {
        return this.cleanUrl(httpMatches[0]);
      }

      // 2. 尝试匹配无协议的链接
      const noProtocolRegex =
        /(?:www\.)?(?:xiaohongshu\.com|xhslink\.com)\/[^\s\u4e00-\u9fa5]*/gi;
      const noProtocolMatches = text.match(noProtocolRegex);
      if (noProtocolMatches && noProtocolMatches.length > 0) {
        return this.cleanUrl("https://" + noProtocolMatches[0]);
      }

      // 3. 尝试从分享文本中提取（更宽松的匹配）
      const shareRegex = /(?:xiaohongshu\.com|xhslink\.com)[^\s]*/gi;
      const shareMatches = text.match(shareRegex);
      if (shareMatches && shareMatches.length > 0) {
        let url = shareMatches[0];
        if (!url.startsWith("http")) {
          url = "https://" + url;
        }
        return this.cleanUrl(url);
      }

      return null;
    },

    // 清理URL，移除多余字符
    cleanUrl(url) {
      // 移除URL末尾的标点符号和特殊字符
      return url.replace(/[，。！？；：""''（）【】\s]+$/, "");
    },

    // 重置验证状态
    resetValidation() {
      this.extractedUrl = "";
      this.urlValidationStatus = "";
      this.validationMessage = "";
    },

    // 获取数据
    fetchData() {
      if (this.isValidUrl && !this.loading) {
        // 发送提取的URL而不是原始文本
        this.$emit("fetch-data", this.extractedUrl);
      }
    },

    // 输入框获得焦点
    onInputFocus() {
      // 可以添加焦点时的特殊处理
    },

    // 输入框失去焦点
    onInputBlur() {
      // 可以添加失焦时的特殊处理
    },
  },
};
</script>

<style scoped>
/* 自定义样式 */
.border-green-500 {
  border-color: #10b981;
}

.border-red-500 {
  border-color: #ef4444;
}

.focus\:ring-green-500:focus {
  --tw-ring-color: #10b981;
}

.focus\:ring-red-500:focus {
  --tw-ring-color: #ef4444;
}

.text-green-600 {
  color: #059669;
}

.text-red-600 {
  color: #dc2626;
}

.dark .text-green-400 {
  color: #34d399;
}

.dark .text-red-400 {
  color: #f87171;
}
</style>
