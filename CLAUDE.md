# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

小红书笔记爬虫工具的 Web 前端，使用 Vue 3 + Vite + Tailwind CSS 构建。后端 API 需要自行部署。

## 常用命令

```bash
npm run dev      # 启动开发服务器 (localhost:5174)
npm run build    # 生产构建
npm run preview  # 预览构建结果
```

## 开发配置

- **API 代理**: 开发环境下 `/api` 请求会被代理到 `VITE_DEV_PROXY_TARGET`，代理规则在 `vite.config.js` 中配置
- **环境变量**: `VITE_API_BASE_URL` 用于生产环境指定后端地址

## 代码架构

```
src/
├── api/index.js          # API 调用层（getNoteData、getPostContentApi）
├── components/
│   ├── note/             # 笔记相关组件（输入、预览、内容）
│   ├── media/            # 媒体展示组件（图片网格、视频预览）
│   ├── layout/           # 布局组件（头部、底部）
│   ├── common/           # 通用组件（Toast、Loading、BackToTop）
│   └── download/         # 下载操作组件
├── utils/                # 工具函数（download、toast、mockData）
└── App.vue               # 根组件
```

## 技术要点

- **API 规范**: 笔记数据通过 POST `/api/spider` 获取，请求体 `{content: url}`，返回 `{code: 200, data: {detail, media, tags, user, interact}}`
- **媒体格式**: 图片 `media.postImages[]`，视频 `media.postVideos[]`
- **URL 校验**: 只接受 xiaohongshu.com 和 xhslink.com 域名
- **构建优化**: vendor chunk 单独打包（vue），utils chunk 包含 download 和 toast

## 环境变量

| 变量名 | 说明 |
|--------|------|
| `VITE_API_BASE_URL` | 生产环境后端 API 地址 |
| `VITE_DEV_PROXY_TARGET` | 开发环境代理目标地址 |