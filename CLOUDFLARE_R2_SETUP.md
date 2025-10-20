# Cloudflare R2 配置指南

将 emoji assets 上传到 Cloudflare R2，实现全球 CDN 加速访问。

## 优势

- ✅ **减小部署包大小**：不需要在每次部署时上传 12,625 个文件
- ✅ **更快的加载速度**：利用 Cloudflare 全球 CDN 边缘缓存
- ✅ **更快的构建**：不需要复制大量资源文件
- ✅ **节省成本**：R2 不收取出站流量费用

## 步骤一：安装和登录 Wrangler

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login
```

## 步骤二：创建 R2 存储桶

```bash
# 创建存储桶
wrangler r2 bucket create find-emoji-assets

# 查看存储桶列表
wrangler r2 bucket list
```

## 步骤三：上传 Assets

### 方法 A：使用自动化脚本（推荐）

```bash
node scripts/upload-to-r2.js
```

### 方法 B：手动上传

```bash
# 上传整个 assets 目录
wrangler r2 object put find-emoji-assets/assets --file=./assets --recursive
```

### 方法 C：通过 Cloudflare Dashboard

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **R2** > 选择存储桶 `find-emoji-assets`
3. 点击 **Upload** 上传整个 `assets` 文件夹

> ⏱️ 注意：上传 12,625 个文件可能需要 10-30 分钟，请耐心等待。

## 步骤四：配置公共访问

### 1. 启用公共访问

在 Cloudflare Dashboard 中：
1. 进入 R2 存储桶 `find-emoji-assets`
2. 点击 **Settings** > **Public Access**
3. 点击 **Allow Access** 启用公共访问
4. 系统会生成一个公共 URL，如：`https://pub-xxxxxxxxxxxxx.r2.dev`

### 2. （可选）绑定自定义域名

如果你想使用自定义域名：

1. 在 R2 存储桶设置中点击 **Custom Domains**
2. 添加你的域名，如：`cdn.yourdomain.com`
3. 按照提示配置 DNS 记录
4. 等待 DNS 生效

## 步骤五：配置环境变量

### 1. 创建 .env.local 文件

```bash
cp .env.local.example .env.local
```

### 2. 填入 CDN URL

编辑 `.env.local`：

```env
# 使用 R2 自动生成的公共 URL
R2_PUBLIC_CDN_URL=https://pub-xxxxxxxxxxxxx.r2.dev

# 或使用自定义域名
# R2_PUBLIC_CDN_URL=https://cdn.yourdomain.com
```

### 3. 重启开发服务器

```bash
npm run dev
```

现在图片会从 CDN 加载！🎉

## 步骤六：配置 Cloudflare Pages 环境变量

在部署到 Cloudflare Pages 时：

1. 进入 Cloudflare Pages 项目设置
2. 进入 **Settings** > **Environment variables**
3. 添加变量：
   - **Variable name**: `R2_PUBLIC_CDN_URL`
   - **Value**: `https://pub-xxxxxxxxxxxxx.r2.dev`
4. 保存并重新部署

## 验证

### 本地验证

```bash
# 启动开发服务器
npm run dev

# 打开浏览器开发者工具 > Network
# 检查图片请求是否来自 CDN URL
```

### 检查配置

创建一个测试脚本：

```bash
node -e "console.log('CDN URL:', process.env.R2_PUBLIC_CDN_URL)"
```

## 性能对比

| 方案          | 部署大小 | 首次加载 | 全球访问 | 构建时间 |
| ------------- | -------- | -------- | -------- | -------- |
| 本地 assets   | ~500MB   | 较慢     | 较慢     | 较慢     |
| Cloudflare R2 | ~2MB     | 快       | 快       | 快       |

## 更新 Assets

当你需要更新 emoji 资源时：

```bash
# 重新上传
node scripts/upload-to-r2.js

# 或手动上传单个文件
wrangler r2 object put find-emoji-assets/assets/NewEmoji/3D/new_emoji.png \
  --file=./assets/NewEmoji/3D/new_emoji.png
```

## 缓存清除

R2 + Cloudflare CDN 会自动缓存资源。如果需要清除缓存：

1. 在 Cloudflare Dashboard 中进入 **Caching**
2. 点击 **Purge Cache** > **Purge Everything**
3. 或使用 API 清除特定文件

## 成本估算

Cloudflare R2 定价（2024年）：

- **存储**：$0.015/GB/月（约 500MB = $0.0075/月）
- **Class A 操作**（写入）：$4.50/百万次
- **Class B 操作**（读取）：$0.36/百万次
- **出站流量**：免费！❤️

预估月成本：**< $1**（几乎免费！）

## 故障排除

### 问题：图片加载失败

**检查：**
- CDN URL 是否正确
- R2 存储桶是否启用公共访问
- 文件路径是否正确（应包含 `assets/` 前缀）

### 问题：CORS 错误

在 R2 存储桶设置中配置 CORS：

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET"],
    "AllowedHeaders": ["*"]
  }
]
```

### 问题：上传失败

- 检查网络连接
- 确认已登录：`wrangler login`
- 检查 Cloudflare 账号权限
- 尝试减小批量上传的文件数量

## 回退到本地 Assets

如果 CDN 出现问题，可以快速回退：

```bash
# 删除或注释掉 .env.local 中的 CDN_URL
# R2_PUBLIC_CDN_URL=

# 重启开发服务器
npm run dev
```

系统会自动使用本地 assets。

## 进阶：设置缓存规则

在 Cloudflare 中为 R2 设置自定义缓存规则：

1. **Cache-Control**: `public, max-age=31536000, immutable`
2. **CDN Cache TTL**: 1 年
3. **Browser Cache TTL**: 1 年

因为 emoji 文件很少变化，可以设置长缓存时间。

## 参考文档

- [Cloudflare R2 文档](https://developers.cloudflare.com/r2/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Next.js 环境变量](https://nextjs.org/docs/basic-features/environment-variables)

