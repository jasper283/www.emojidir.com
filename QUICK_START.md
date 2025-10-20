# 🚀 快速启动指南

## 立即开始

### 1️⃣ 启动开发服务器

```bash
npm run dev
```

服务器启动后会显示：
```
✓ Ready in 1438ms
- Local:        http://localhost:3000
```

### 2️⃣ 在浏览器中打开

**主地址**：http://localhost:3000

### 3️⃣ 测试多语言

访问不同语言版本：

| 语言       | URL                         | 快捷方式 |
| ---------- | --------------------------- | -------- |
| 🇬🇧 英语     | http://localhost:3000/en    | 默认     |
| 🇯🇵 日语     | http://localhost:3000/ja    |          |
| 🇰🇷 韩语     | http://localhost:3000/ko    |          |
| 🇹🇼 繁体中文 | http://localhost:3000/zh-TW |          |
| 🇨🇳 简体中文 | http://localhost:3000/zh-CN |          |

### 4️⃣ 使用语言切换器

- 点击右上角的 **🌍 图标**
- 从下拉菜单选择语言
- 页面内容立即切换

---

## 🔧 常用命令

```bash
# 开发模式（日常使用）
npm run dev

# 构建生产版本
npm run build

# 运行生产版本
npm run start

# 代码检查
npm run lint

# 生成 Emoji 索引
npm run generate-index
```

---

## 🐛 遇到问题？

### 问题：端口被占用

**错误信息**：
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决方法**：
```bash
# 停止占用端口的进程
pkill -f "next dev"

# 或使用其他端口
PORT=3001 npm run dev
```

---

### 问题：页面显示错误

**解决方法**：
```bash
# 1. 停止服务器
pkill -f "next dev"

# 2. 清理缓存
rm -rf .next

# 3. 重新启动
npm run dev
```

---

### 问题：依赖问题

**解决方法**：
```bash
# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ 验证安装

确认以下内容正常：

1. **服务器启动成功**
   ```
   ✓ Ready in xxxx ms
   - Local: http://localhost:3000
   ```

2. **可以访问页面**
   - 浏览器打开 http://localhost:3000
   - 看到 "Emoji Directory" 标题

3. **语言切换正常**
   - 右上角有地球图标 🌍
   - 可以切换到不同语言

---

## 📚 下一步

- 阅读 `I18N_GUIDE.md` 了解如何添加翻译
- 阅读 `SERVER_MODE_DEPLOYMENT.md` 了解部署方法
- 查看 `FINAL_SUCCESS.md` 了解完整功能

---

## 💡 提示

- **开发模式**支持热重载，修改代码自动刷新
- **浏览器会自动检测语言**，首次访问会重定向
- **所有数据已预加载**，无需额外配置

---

**现在就运行 `npm run dev` 开始使用吧！** 🎉

