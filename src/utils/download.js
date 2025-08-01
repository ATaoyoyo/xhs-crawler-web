/**
 * 下载工具函数
 */

// 防抖映射，防止重复下载
const downloadingMap = new Map();

/**
 * 处理URL协议，确保HTTPS兼容性
 * @param {string} url - 原始URL
 * @returns {string} 处理后的URL
 */
function processUrl(url) {
  if (!url) return url;

  // 如果当前页面是HTTPS，将HTTP链接转换为HTTPS
  if (window.location.protocol === "https:" && url.startsWith("http://")) {
    console.warn("检测到HTTP资源，尝试转换为HTTPS:", url);
    return url.replace("http://", "https://");
  }

  return url;
}

/**
 * 通过后端代理下载资源（用于处理混合内容问题）
 * @param {string} url - 资源URL
 * @param {string} filename - 文件名
 * @returns {Promise<Blob>} 资源Blob
 */
async function downloadViaProxy(url, filename) {
  // 获取API基础URL
  const getApiBaseUrl = () => {
    if (import.meta.env.DEV) {
      return "/api";
    }
    return import.meta.env.VITE_API_BASE_URL;
  };

  const apiBaseUrl = getApiBaseUrl();
  const proxyUrl = `${apiBaseUrl}/proxy-download`;

  console.log("使用代理下载:", url);

  const response = await fetch(proxyUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: url,
      filename: filename,
    }),
  });

  if (!response.ok) {
    throw new Error(`代理下载失败: ${response.status} ${response.statusText}`);
  }

  return await response.blob();
}

/**
 * 直接下载资源
 * @param {string} url - 资源URL
 * @param {Object} options - 下载选项
 * @returns {Promise<Blob>} 资源Blob
 */
async function downloadDirect(url, options = {}) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      Referer: "https://www.xiaohongshu.com/",
      ...options.headers,
    },
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error(`下载失败: ${response.status} ${response.statusText}`);
  }

  return await response.blob();
}

/**
 * 下载单个资源文件
 * @param {string} url - 资源URL
 * @param {string} filename - 文件名
 * @param {Object} options - 下载选项
 */
export async function downloadResource(url, filename, options = {}) {
  // 防抖检查
  if (downloadingMap.has(url)) {
    console.warn("文件正在下载中，请勿重复点击");
    return;
  }

  downloadingMap.set(url, true);

  try {
    let blob;
    let finalUrl = processUrl(url);

    // 添加随机参数避免缓存
    const downloadUrl = `${finalUrl}${
      finalUrl.includes("?") ? "&" : "?"
    }_t=${Date.now()}`;

    try {
      // 首先尝试直接下载
      blob = await downloadDirect(downloadUrl, options);
      console.log(`直接下载成功: ${filename}`);
    } catch (directError) {
      console.warn("直接下载失败，尝试其他方法:", directError.message);

      // 如果是混合内容错误或CORS错误，尝试使用代理
      if (
        directError.message.includes("Mixed Content") ||
        directError.message.includes("CORS") ||
        directError.message.includes("Failed to fetch") ||
        (window.location.protocol === "https:" && url.startsWith("http://"))
      ) {
        try {
          blob = await downloadViaProxy(url, filename);
          console.log(`代理下载成功: ${filename}`);
        } catch (proxyError) {
          console.warn("代理下载失败，尝试强制HTTPS:", proxyError.message);

          // 最后尝试：强制转换为HTTPS并重试
          if (url.startsWith("http://")) {
            const httpsUrl = url.replace("http://", "https://");
            blob = await downloadDirect(httpsUrl, options);
            console.log(`HTTPS转换下载成功: ${filename}`);
          } else {
            throw proxyError;
          }
        }
      } else {
        throw directError;
      }
    }

    // 创建下载链接
    const downloadLink = document.createElement("a");
    const objectUrl = URL.createObjectURL(blob);

    downloadLink.href = objectUrl;
    downloadLink.download = sanitizeFilename(filename);
    downloadLink.style.display = "none";

    // 触发下载
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // 清理对象URL
    setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 1000);

    console.log(`文件下载成功: ${filename}`);
  } catch (error) {
    console.error("下载失败:", error);
    throw error; // 重新抛出错误，让调用者处理
  } finally {
    // 延迟清除防抖标记，避免用户快速重试
    setTimeout(() => {
      downloadingMap.delete(url);
    }, 2000);
  }
}

/**
 * 批量下载多个资源
 * @param {Array} resources - 资源列表 [{url, filename, type}]
 * @param {Function} onProgress - 进度回调函数
 * @param {Object} options - 下载选项
 */
export async function downloadMultipleResources(
  resources,
  onProgress,
  options = {}
) {
  const { concurrent = 3, delay = 500 } = options;
  let completed = 0;
  const total = resources.length;
  const errors = [];

  // 分批下载，避免同时发起太多请求
  for (let i = 0; i < resources.length; i += concurrent) {
    const batch = resources.slice(i, i + concurrent);

    // 并发下载当前批次
    const promises = batch.map(async (resource, batchIndex) => {
      try {
        // 更新进度
        if (onProgress) {
          onProgress({
            completed,
            total,
            currentFile: resource.filename,
            currentIndex: i + batchIndex,
          });
        }

        await downloadResource(resource.url, resource.filename, {
          headers:
            resource.type === "video"
              ? {
                  Range: "bytes=0-",
                }
              : {},
        });

        completed++;

        // 更新完成进度
        if (onProgress) {
          onProgress({
            completed,
            total,
            currentFile: resource.filename,
            currentIndex: i + batchIndex,
          });
        }
      } catch (error) {
        errors.push({
          resource,
          error: error.message,
        });
        console.error(`下载失败 ${resource.filename}:`, error);
      }
    });

    // 等待当前批次完成
    await Promise.allSettled(promises);

    // 批次间延迟，避免请求过于频繁
    if (i + concurrent < resources.length) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // 返回下载结果
  return {
    total,
    completed,
    failed: errors.length,
    errors,
  };
}

/**
 * 获取文件扩展名
 * @param {string} url - 文件URL
 * @returns {string} 文件扩展名
 */
export function getFileExtension(url) {
  try {
    const pathname = new URL(url).pathname;
    const extension = pathname.split(".").pop();
    return extension || "unknown";
  } catch {
    return "unknown";
  }
}

/**
 * 生成安全的文件名
 * @param {string} filename - 原始文件名
 * @returns {string} 安全的文件名
 */
export function sanitizeFilename(filename) {
  // 移除或替换不安全的字符
  return filename
    .replace(/[<>:"/\\|?*]/g, "_")
    .replace(/\s+/g, "_")
    .substring(0, 200); // 限制文件名长度
}

/**
 * 检查是否支持下载
 * @returns {boolean} 是否支持
 */
export function isDownloadSupported() {
  return typeof document !== "undefined" && "createElement" in document;
}
