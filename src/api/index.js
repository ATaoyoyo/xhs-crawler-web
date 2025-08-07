// 根据环境自动选择API基础URL
const getApiBaseUrl = () => {
  // 开发环境使用代理
  if (import.meta.env.DEV) {
    return "/api";
  }

  // 生产环境使用环境变量或默认值
  return import.meta.env.VITE_API_BASE_URL;
};

export const getPostContentApi = async (url) => {
  const apiBaseUrl = getApiBaseUrl();
  const apiUrl = import.meta.env.DEV
    ? `${apiBaseUrl}/api/spider`
    : `${apiBaseUrl}/api/spider`;

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: url }),
  });
  return res.json();
};

export const getNoteData = async (url) => {
  // 检查URL是否包含小红书域名
  if (!url.includes("xiaohongshu.com") && !url.includes("xhslink.com")) {
    throw new Error("请输入有效的小红书笔记链接");
  }

  const res = await getPostContentApi(url);
  if (!res.success) {
    throw new Error("请求失败");
  }
  const data = res.data;
  const { detail, media, tags, user, interact } = data;

  return {
    id: detail.postId,
    ip: detail.ip,
    title: detail.title,
    authorName: user.userName,
    authorAvatar: user.userAvatar,
    publishTime: detail.date,
    content: detail.content,
    likes: interact.likedCount,
    comments: interact.commentCount,
    shares: interact.shareCount,
    collects: interact.collectedCount,
    images: media.postImages.map((item) => ({ url: item })),
    videos: media.postVideos.map((item) => ({ url: item })),
  };
};
