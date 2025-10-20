# 🚀 Quick Reference - Emoji Directory

## 📍 **URL 结构快速参考**

### 基础 URL 模式
```
/{locale}/{platform}-emoji/{unicode}
```

### 实际示例
```bash
# 平台主页
/en/fluent-emoji          # 英语 + Fluent Emoji
/zh-CN/noto-emoji         # 简体中文 + Noto Emoji
/ja/native-emoji          # 日语 + 原生平台

# Emoji 详情页
/en/fluent-emoji/1f947    # 🥇 1st place medal
/zh-CN/fluent-emoji/1f600 # 😀 grinning face
/ja/noto-emoji/2764       # ❤️ red heart
```

---

## 🌍 **支持的语言**

| 语言     | 代码    | URL 示例              |
| -------- | ------- | --------------------- |
| English  | `en`    | `/en/fluent-emoji`    |
| 日本語   | `ja`    | `/ja/fluent-emoji`    |
| 한국어   | `ko`    | `/ko/fluent-emoji`    |
| 繁體中文 | `zh-TW` | `/zh-TW/fluent-emoji` |
| 简体中文 | `zh-CN` | `/zh-CN/fluent-emoji` |

---

## 🎨 **支持的平台**

| 平台         | URL Slug       | 图标 |
| ------------ | -------------- | ---- |
| Fluent Emoji | `fluent-emoji` | 🎨    |
| Noto Emoji   | `noto-emoji`   | 🌐    |
| Native       | `native-emoji` | 💻    |

---

## 🔗 **常用链接**

### 开发环境
```bash
# 启动开发服务器
npm run dev

# 访问本地网站
http://localhost:3000

# 测试不同语言
http://localhost:3000/en
http://localhost:3000/zh-CN
http://localhost:3000/ja
```

### 测试URL
```bash
# 主页（自动重定向）
curl http://localhost:3000/

# 语言首页（自动重定向到默认平台）
curl http://localhost:3000/en

# 平台页面
curl http://localhost:3000/en/fluent-emoji

# Emoji详情页
curl http://localhost:3000/en/fluent-emoji/1f947
```

---

## 🛠️ **组件使用**

### 平台切换器
```tsx
import PlatformSwitcher from '@/components/PlatformSwitcher';

<PlatformSwitcher currentPlatform={selectedPlatform} />
```

### 语言切换器
```tsx
import LanguageSwitcher from '@/components/LanguageSwitcher';

<LanguageSwitcher />
```

### Emoji卡片（支持跳转详情页）
```tsx
import EmojiCard from '@/components/EmojiCard';

<EmojiCard emoji={emoji} style={selectedStyle} />
```

---

## 📱 **导航逻辑**

### 1. 用户访问根路径
```
用户访问: /
↓
检测浏览器语言: zh-CN
↓
重定向: /zh-CN
↓
重定向: /zh-CN/fluent-emoji
```

### 2. 切换平台
```
当前页面: /zh-CN/fluent-emoji
↓
用户点击: Noto Emoji
↓
导航到: /zh-CN/noto-emoji
```

### 3. 切换语言
```
当前页面: /zh-CN/fluent-emoji
↓
用户选择: English
↓
导航到: /en/fluent-emoji
```

### 4. 查看详情
```
当前页面: /en/fluent-emoji
↓
用户点击emoji卡片
↓
导航到: /en/fluent-emoji/1f947
```

---

## 📝 **文件位置**

### 路由文件
```
app/
├── [locale]/
│   ├── page.tsx                    # 语言首页（重定向）
│   └── [platform]/
│       ├── page.tsx                # 平台主页
│       └── [unicode]/
│           └── page.tsx            # Emoji详情页
```

### 组件文件
```
components/
├── EmojiCard.tsx                   # Emoji卡片
├── EmojiGrid.tsx                   # Emoji网格
├── PlatformSwitcher.tsx            # 平台切换器
├── LanguageSwitcher.tsx            # 语言切换器
└── FilterSidebar.tsx               # 筛选侧边栏
```

### 配置文件
```
i18n/
├── config.ts                       # 语言配置
└── request.ts                      # 请求配置

messages/
├── en.json                         # 英语翻译
├── zh-CN.json                      # 简体中文翻译
├── ja.json                         # 日语翻译
├── ko.json                         # 韩语翻译
└── zh-TW.json                      # 繁体中文翻译
```

---

## 🐛 **常见问题**

### 1. 页面404
**问题**: 访问 `/en/fluent-emoji` 返回404
**解决**: 检查服务器是否已重启，确保新路由已加载

### 2. 语言切换不工作
**问题**: 点击语言切换器没有反应
**解决**: 检查 `LanguageSwitcher` 组件是否正确保留了平台路径

### 3. 详情页加载失败
**问题**: Emoji详情页显示 "Emoji Not Found"
**解决**: 检查 Unicode 编码是否正确，确保不包含 "u" 前缀

### 4. 图片加载失败
**问题**: Emoji图片显示为字符
**解决**: 检查 CDN 配置，确保 `getAssetUrl` 函数正常工作

---

## ✅ **测试检查清单**

- [ ] 访问根路径自动重定向
- [ ] 浏览器语言检测正常
- [ ] 平台切换保持语言
- [ ] 语言切换保持平台
- [ ] Emoji卡片可点击查看详情
- [ ] 详情页正确显示所有信息
- [ ] 所有语言翻译正确显示
- [ ] 图片正确加载
- [ ] 复制功能正常工作
- [ ] 返回按钮正常工作

---

## 🎊 **完成！**

现在你已经拥有了一个完整的、SEO友好的多语言Emoji目录网站！

**主要特性：**
- ✅ 多语言支持（5种语言）
- ✅ 多平台支持（3个平台）
- ✅ SEO友好的URL结构
- ✅ Emoji详情页
- ✅ 平台和语言切换
- ✅ 浏览器语言自动检测
- ✅ 响应式设计
- ✅ 复制到剪贴板功能

