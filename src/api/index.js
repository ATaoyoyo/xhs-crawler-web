// 根据环境自动选择API基础URL
const getApiBaseUrl = () => {
  // 开发环境使用代理
  if (import.meta.env.DEV) {
    return '/api'
  }
  
  // 生产环境使用环境变量或默认值
  return import.meta.env.VITE_API_BASE_URL
}

export const getPostContentApi = async (url) => {
  const apiBaseUrl = getApiBaseUrl()
  const apiUrl = import.meta.env.DEV ? `${apiBaseUrl}/scraper` : `${apiBaseUrl}/scraper`
  
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ shareText: url }),
  });
  return res.json();
};

export const getNoteData = async (url) => {
  // 检查URL是否包含小红书域名
  if (!url.includes("xiaohongshu.com") && !url.includes("xhslink.com")) {
    throw new Error("请输入有效的小红书笔记链接");
  }

  const res = await getPostContentApi(url);
  if (res.code !== 200) {
    throw new Error("请求失败");
  }
  const data = res.data;
  return {
    title: data.title,
    authorName: "",
    authorAvatar: "",
    publishTime: "",
    content: "",
    images:
      data.type === "image" ? data.content.map((item) => ({ url: item })) : [],
    videos:
      data.type === "video"
        ? [{ url: data.content.video, cover: data.content.cover }]
        : [],
  };
};
