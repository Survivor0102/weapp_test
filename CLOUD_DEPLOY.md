# 待办清单小程序 - 云开发部署指南 📱☁️

## 🚀 云开发环境配置

### 步骤 1：开通云开发

1. **打开微信开发者工具**
2. **点击工具栏「云开发」按钮**
3. **开通云开发服务**（免费版即可）
4. **记录环境 ID**（如：`todo-app-dev`）

### 步骤 2：修改配置

#### app.js
```javascript
wx.cloud.init({
  env: 'your-env-id', // 替换为你的环境 ID
  traceUser: true
})
```

#### project.config.json
```json
{
  "appid": "你的小程序 AppID",
  "cloudfunctionRoot": "cloudfunctions/"
}
```

### 步骤 3：上传云函数

在微信开发者工具中：

1. **右键 `cloudfunctions/todo` 目录**
2. **选择「上传并部署：云端安装依赖」**
3. **等待上传完成**
4. **同样操作上传 `category` 和 `pomodoro`**

### 步骤 4：创建数据库集合

在云开发控制台：

1. **点击「数据库」**
2. **创建集合 `todos`**
3. **创建集合 `categories`**
4. **创建集合 `pomodoro`**

#### 数据库索引建议

**todos 集合：**
- `_openid` (升序)
- `createdAt` (降序)
- `completed` (升序)

**pomodoro 集合：**
- `_openid` (升序)
- `completedAt` (降序)

### 步骤 5：启用云开发模式

修改 `utils/storage.js`：
```javascript
const USE_CLOUD = true  // 改为 true 启用云开发
```

---

## 📁 云函数说明

### todo - 待办管理

| 操作 | action | 参数 |
|------|--------|------|
| 获取所有 | `getAll` | - |
| 添加 | `add` | `data`: 待办数据 |
| 更新 | `update` | `id`, `data` |
| 删除 | `remove` | `id` |
| 批量删除 | `batchRemove` | `ids: []` |

### category - 分类管理

| 操作 | action | 参数 |
|------|--------|------|
| 获取所有 | `getAll` | - |
| 添加 | `add` | `data`: 分类数据 |
| 更新 | `update` | `id`, `data` |
| 删除 | `remove` | `id` |

### pomodoro - 番茄钟记录

| 操作 | action | 参数 |
|------|--------|------|
| 记录 | `record` | `todoId`, `duration` |
| 今日统计 | `getTodayStats` | - |
| 历史统计 | `getHistoryStats` | `startDate`, `endDate` |

---

## 🗄️ 数据库结构

### todos 集合
```javascript
{
  _id: "自动生成",
  _openid: "用户 OpenID",
  title: "待办标题",
  completed: false,
  categoryId: "分类 ID",
  priority: "high",  // high/medium/low
  dueDate: 1711353600000,
  focusTime: 50,  // 专注分钟数
  createdAt: Date,  // 服务器时间
  updatedAt: Date
}
```

### categories 集合
```javascript
{
  _id: "自动生成",
  _openid: "用户 OpenID",
  name: "工作",
  color: "#3498db",
  icon: "work",
  isDefault: true,  // 是否默认分类
  createdAt: Date
}
```

### pomodoro 集合
```javascript
{
  _id: "自动生成",
  _openid: "用户 OpenID",
  todoId: "待办 ID",  // 可选
  duration: 25,  // 分钟
  completedAt: Date
}
```

---

## 🔄 数据迁移（可选）

如果已有本地数据，可以迁移到云端：

```javascript
// 在小程序中运行
const todos = wx.getStorageSync('todos')
const categories = wx.getStorageSync('categories')

// 批量上传到云端
wx.cloud.callFunction({
  name: 'todo',
  data: { action: 'migrate', data: todos }
})
```

---

## 🎯 切换模式

### 本地模式（开发测试）
```javascript
// utils/storage.js
const USE_CLOUD = false
```

### 云端模式（生产环境）
```javascript
// utils/storage.js
const USE_CLOUD = true
```

---

## 📊 免费额度

微信云开发免费版额度：

- **数据库**：2GB 存储，5GB 流量/月
- **云函数**：10 万次调用/月
- **云存储**：5GB 存储，10GB 流量/月

**个人项目完全够用！**

---

## ⚠️ 注意事项

1. **云函数需要上传后才能调用**
2. **数据库权限默认仅创建者可读写**
3. **云函数调用有延迟（200-500ms）**
4. **建议保留本地存储作为降级方案**

---

## 🐛 常见问题

### Q: 云函数调用失败？
A: 检查是否已上传云函数，环境 ID 是否正确

### Q: 数据库查询为空？
A: 检查 `_openid` 是否正确，权限设置

### Q: 如何调试云函数？
A: 在云开发控制台查看云函数日志

---

**开发者:** Survivor0102  
**更新日期:** 2026-03-25
