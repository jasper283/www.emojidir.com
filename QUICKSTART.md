# 快速开始指南

## 🚀 立即开始

### 1. 安装依赖
```bash
npm install
```

### 2. 生成 emoji 索引
```bash
npm run generate-index
```
这会扫描所有 emoji 资源并生成索引文件，大约需要 10-30 秒。

### 3. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000 查看你的网站！🎉

## 📦 构建生产版本

```bash
npm run build
```

构建完成后，静态文件会在 `out` 目录中。

## ☁️ 部署到 Cloudflare Pages

### 方法 A：通过 Git 自动部署（推荐）

1. 将代码推送到 GitHub/GitLab
2. 在 [Cloudflare Dashboard](https://dash.cloudflare.com/) 创建 Pages 项目
3. 连接你的仓库
4. 设置构建命令：`npm run build`
5. 设置输出目录：`out`
6. 点击部署

完成！每次推送代码都会自动重新部署。

### 方法 B：手动部署

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 构建项目
npm run build

# 部署到 Cloudflare Pages
wrangler pages deploy out
```

## 🎯 主要功能

- ✅ 按分类浏览 emoji
- ✅ 关键词搜索
- ✅ 4 种显示样式（3D、彩色、扁平、高对比）
- ✅ 响应式设计
- ✅ 点击表情查看详情
- ✅ 一键复制表情

## 📝 下一步

查看完整文档：
- `README.md` - 项目概述和详细说明
- `DEPLOYMENT.md` - 部署和优化指南

享受使用！🎨

