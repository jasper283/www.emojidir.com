# 📥 R2 下载解决方案

## 🎯 **问题说明**

Cloudflare R2 的 CORS 策略可能限制直接从浏览器下载文件。

---

## ✅ **解决方案：API 路由代理**

### 架构图
```
浏览器
  ↓ (点击下载)
Next.js API Route (/api/download)
  ↓ (服务器端请求)
Cloudflare R2
  ↓ (返回文件)
Next.js API Route
  ↓ (代理响应)
浏览器下载
```

---

## 🛠️ **实现细节**

### 1. API 路由 (`app/api/download/route.ts`)

**功能：**
- 接收前端下载请求
- 从R2获取文件（服务器端，无CORS限制）
- 设置正确的响应头
- 将文件流式传输到浏览器

**关键代码：**
```typescript
export async function GET(request: NextRequest) {
  const url = searchParams.get('url');
  
  // 从R2获取文件
  const response = await fetch(url);
  const blob = await response.blob();
  
  // 返回文件，设置下载headers
  return new NextResponse(blob, {
    headers: {
      'Content-Type': response.headers.get('Content-Type'),
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=31536000',
    },
  });
}
```

### 2. 前端调用更新

**旧方法（直接fetch）：**
```typescript
// ❌ CORS错误
const response = await fetch('https://emojidir.com/asset.png');
```

**新方法（API代理）：**
```typescript
// ✅ 通过API路由代理
const response = await fetch(
  `/api/download?url=${encodeURIComponent('https://emojidir.com/asset.png')}`
);
```

---

## 🔒 **安全考虑**

### 1. URL 验证（推荐添加）

在 `app/api/download/route.ts` 中添加：

```typescript
// 只允许从自己的CDN下载
const ALLOWED_DOMAINS = [
  'emojidir.com',
  'your-r2-bucket.r2.cloudflarestorage.com'
];

const urlObj = new URL(url);
if (!ALLOWED_DOMAINS.some(domain => urlObj.hostname.includes(domain))) {
  return NextResponse.json(
    { error: 'Invalid URL' },
    { status: 403 }
  );
}
```

### 2. 速率限制（生产环境推荐）

```typescript
// 使用 Redis 或内存缓存
const rateLimit = await checkRateLimit(request.ip);
if (!rateLimit.allowed) {
  return NextResponse.json(
    { error: 'Too many requests' },
    { status: 429 }
  );
}
```

---

## ⚡ **性能优化**

### 1. 流式传输（大文件）

```typescript
// 对于大文件，使用流式传输
const response = await fetch(url);
return new NextResponse(response.body, {
  headers: {
    'Content-Type': response.headers.get('Content-Type'),
    'Content-Disposition': `attachment; filename="${filename}"`,
  },
});
```

### 2. 缓存策略

```typescript
headers: {
  // 浏览器缓存1年（emoji不变）
  'Cache-Control': 'public, max-age=31536000, immutable',
}
```

---

## 🌐 **R2 CORS 配置（备选方案）**

如果你想直接从R2下载，需要在Cloudflare配置CORS：

### 在 Cloudflare R2 设置

```json
[
  {
    "AllowedOrigins": ["https://your-domain.com"],
    "AllowedMethods": ["GET"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["Content-Length", "Content-Type"],
    "MaxAgeSeconds": 3600
  }
]
```

### 使用 wrangler CLI

```bash
wrangler r2 bucket cors put <BUCKET_NAME> --cors-config cors.json
```

---

## 📊 **方案对比**

| 方案          | 优点                                 | 缺点                     | 推荐度 |
| ------------- | ------------------------------------ | ------------------------ | ------ |
| **API代理**   | ✅ 无CORS问题<br>✅ 完全控制<br>✅ 安全 | ⚠️ 服务器带宽消耗         | ⭐⭐⭐⭐⭐  |
| **R2 CORS**   | ✅ 直接下载<br>✅ 节省服务器资源       | ❌ 需要配置<br>❌ 安全风险 | ⭐⭐⭐    |
| **预签名URL** | ✅ 临时访问<br>✅ 安全                 | ❌ 需要生成逻辑<br>❌ 复杂 | ⭐⭐⭐⭐   |

---

## 🚀 **推荐方案：API 代理 + 边缘缓存**

### 架构优化

```typescript
// app/api/download/route.ts
export const runtime = 'edge'; // 使用边缘运行时

export async function GET(request: NextRequest) {
  const url = searchParams.get('url');
  
  // 验证URL
  if (!isAllowedUrl(url)) {
    return new Response('Forbidden', { status: 403 });
  }
  
  // 检查缓存
  const cache = caches.default;
  const cacheKey = new Request(url);
  let response = await cache.match(cacheKey);
  
  if (!response) {
    // 缓存未命中，从R2获取
    response = await fetch(url);
    
    // 存入缓存
    const responseToCache = response.clone();
    await cache.put(cacheKey, responseToCache);
  }
  
  return response;
}
```

---

## 💡 **混合方案（最佳实践）**

### 1. 小文件（< 1MB）：API 代理
```typescript
if (fileSize < 1024 * 1024) {
  return `/api/download?url=${url}`;
}
```

### 2. 大文件：预签名 URL
```typescript
// 生成临时访问链接（有效期1小时）
const signedUrl = await generatePresignedUrl(url, 3600);
return signedUrl;
```

---

## 🔧 **当前实现说明**

### 已实现
✅ API 代理路由 (`/api/download`)
✅ 前端调用更新
✅ 错误处理和提示

### URL 格式
```
/api/download?url=https://emojidir.com/assets/example.png
```

### 使用示例
```typescript
// Fluent Emoji
downloadEmoji(
  getAssetUrl('assets/emoji/3d/emoji.png'),
  'emoji_3d.png'
);

// Noto Emoji
downloadEmoji(
  getAssetUrl('nato-emoji/png/128/emoji_u1f947.png'),
  'emoji_128px.png'
);
```

---

## ⚙️ **环境配置**

### 开发环境
- ✅ 直接代理下载
- ✅ 无需额外配置

### 生产环境（推荐配置）

#### 1. Vercel 部署
- 自动支持 Edge Functions
- 全球CDN加速
- 无需额外配置

#### 2. Cloudflare Workers
```javascript
// worker.js
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const assetUrl = url.searchParams.get('url');
    
    // 从R2获取并返回
    const response = await fetch(assetUrl);
    return new Response(response.body, {
      headers: {
        ...response.headers,
        'Content-Disposition': 'attachment'
      }
    });
  }
}
```

---

## 📈 **性能监控**

### 关键指标
- **下载成功率**: > 99%
- **平均响应时间**: < 500ms
- **缓存命中率**: > 80%

### 监控代码
```typescript
const startTime = Date.now();

try {
  await downloadEmoji(url, filename);
  const duration = Date.now() - startTime;
  
  // 上报成功
  analytics.track('download_success', { duration, platform });
} catch (error) {
  // 上报失败
  analytics.track('download_error', { error, url });
}
```

---

## 🐛 **常见问题**

### Q1: 下载速度慢？
**A**: 使用边缘缓存或CDN加速

### Q2: 大文件下载超时？
**A**: 增加超时时间或使用流式传输

### Q3: 并发下载限制？
**A**: 实现下载队列或使用Web Worker

---

## ✅ **完成状态**

- [x] API 代理路由
- [x] 前端调用更新
- [x] 错误处理
- [x] 文件命名
- [ ] URL 白名单验证（可选）
- [ ] 速率限制（可选）
- [ ] 边缘缓存（可选）

---

## 🎊 **总结**

通过 API 路由代理方案：
- ✅ 完全绕过 CORS 限制
- ✅ 服务器端控制下载权限
- ✅ 支持所有平台和尺寸
- ✅ 用户体验流畅
- ✅ 易于维护和扩展

