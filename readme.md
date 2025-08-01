# 小红书笔记爬虫工具

一个用于爬取小红书单篇笔记图片和视频的 Web 应用，支持预览和批量下载功能。

## ✨ 功能特色

- 🔗 **智能链接解析**：支持多种小红书分享格式
- 🖼️ **图片预览**：全屏图片预览和下载
- 🎬 **视频播放**：内置视频播放器，支持全屏播放
- 📱 **响应式设计**：完美适配桌面和移动设备
- 🌙 **暗黑模式**：护眼的暗黑主题
- ⬇️ **批量下载**：一键下载所有媒体文件
- 🔒 **HTTPS 支持**：解决混合内容问题

## 🚀 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn
- 现代浏览器

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/your-username/xhs-crawler-web.git
cd xhs-crawler-web

# 安装依赖
npm install
```

### 环境配置

1. 复制环境变量模板：

```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入您的后端 API 地址：

```env
VITE_API_BASE_URL=https://your-api-domain.com
```

### 开发运行

```bash
# 启动开发服务器
npm run dev

# 访问 http://localhost:5174
```

### 生产构建

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 🔐 隐私保护

### 敏感信息处理

本项目已配置 `.gitignore` 来保护敏感信息：

- ✅ 环境变量文件 (`.env*`)
- ✅ 部署脚本 (`deploy.sh`)
- ✅ 服务器配置 (`nginx.conf`)
- ✅ 构建输出 (`dist/`)

### 安全最佳实践

1. **永远不要提交真实的配置文件**
2. **使用环境变量存储敏感信息**
3. **定期更换 API 密钥和证书**
4. **启用 HTTPS 和安全头部**

## 📁 项目结构

```
xhs-crawler-web/
├── public/                 # 静态资源
│   ├── favicon.ico        # 网站图标
│   ├── favicon.svg        # SVG图标
│   └── manifest.json      # PWA配置
├── src/                   # 源代码
│   ├── api/              # API接口
│   ├── components/       # Vue组件
│   ├── utils/           # 工具函数
│   └── assets/          # 资源文件
├── .env.example         # 环境变量模板
└── README.md           # 项目说明
```

## 🛠️ 技术栈

- **前端框架**：Vue 3
- **构建工具**：Vite
- **样式框架**：Tailwind CSS
- **服务器**：Nginx
- **部署**：Shell 脚本

## 🔗 相关链接

- [Vue.js 文档](https://vuejs.org/)
- [Vite 文档](https://vitejs.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/)

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## ⚠️ 免责声明

本工具仅供学习和研究使用，请遵守相关网站的使用条款和法律法规。

---

## 🔧 开发者配置

### 首次设置

1. Fork 本项目到您的 GitHub 账户
2. 克隆您的 Fork 版本
3. 按照上述步骤配置环境
4. 开始开发！

### 环境变量说明

| 变量名              | 说明              | 示例                      |
| ------------------- | ----------------- | ------------------------- |
| `VITE_API_BASE_URL` | 后端 API 基础地址 | `https://api.example.com` |
| `VITE_APP_TITLE`    | 应用标题          | `小红书笔记爬虫工具`      |
| `VITE_THEME_COLOR`  | 主题色            | `#FF2442`                 |

记住：**永远不要将包含真实配置的文件提交到公共仓库！**
