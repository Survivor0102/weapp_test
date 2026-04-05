# 📝 待办清单 + 🍅 番茄钟

> 一个简洁高效的个人任务管理工具 —— 把小程序升级成了网站

**在线预览** | **技术栈** | **功能** | **部署**

---

## ✨ 这是什么？

这是一个**待办事项管理 + 番茄钟专注**的 Web 应用。

灵感来自微信小程序，现在用 **Vue3 + Flask** 重新实现，可以在浏览器里随时使用。

**适合谁：**
- 🎯 需要管理日常任务的人
- 🍅 想用番茄工作法保持专注的人
- 💻 想要简洁、不臃肿的工具的人

---

## 🎯 核心功能

| 功能 | 说明 |
|------|------|
| ✅ 待办事项 | 添加、编辑、删除任务，标记完成 |
| 🏷️ 分类管理 | 自定义分类（工作/学习/生活...），每个分类独立颜色 |
| 🔴 优先级 | 高/中/低优先级，重要事情一目了然 |
| 📅 截止日期 | 设置任务的截止时间 |
| 🍅 番茄钟 | 25 分钟专注 + 5 分钟休息，记录专注时长 |
| 📊 统计卡片 | 实时查看任务完成情况 |

---

## 🚀 5 分钟快速启动

### 前提条件

确保已安装：
- [Node.js 18+](https://nodejs.org/)
- [Python 3.9+](https://www.python.org/)

### 一键启动（推荐）

```bash
# 克隆项目
cd weapp_test

# 启动后端（终端 1）
cd backend
pip install -r requirements.txt
python app.py

# 启动前端（新开终端 2）
cd frontend
npm install
npm run dev
```

### 访问应用

打开浏览器访问：**http://localhost:5173**

看到界面就说明成功了！🎉

---

## 📸 界面预览

### 首页 - 待办列表
- 顶部统计卡片（全部/未完成/已完成）
- 筛选栏（全部/未完成/已完成/分类）
- 任务列表（支持勾选完成、编辑、删除）
- 右下角悬浮按钮添加新任务

### 番茄钟
- 三种模式：工作 (25min) / 短休息 (5min) / 长休息 (15min)
- 可关联待办事项
- 今日专注统计（最多 8 个番茄）

### 分类管理
- 自定义分类名称和颜色
- 系统默认分类不可删除

---

## 🏗️ 项目结构

```
weapp_web/
├── backend/              # 后端（Flask + SQLite）
│   ├── app.py           # 主程序
│   ├── models.py        # 数据模型
│   ├── database.py      # 数据库配置
│   ├── routes/          # API 路由
│   └── requirements.txt # Python 依赖
│
├── frontend/            # 前端（Vue3 + Element Plus）
│   ├── src/
│   │   ├── views/      # 页面组件
│   │   ├── components/ # 可复用组件
│   │   ├── api/        # API 请求
│   │   ├── stores/     # 状态管理 (Pinia)
│   │   └── router/     # 路由配置
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 📡 API 接口

后端运行在 `http://localhost:5000`

### 待办事项

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/todos` | 获取所有待办 |
| POST | `/api/todos` | 创建待办 |
| PUT | `/api/todos/:id` | 更新待办 |
| DELETE | `/api/todos/:id` | 删除待办 |
| GET | `/api/todos/stats` | 获取统计 |

### 分类

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/categories` | 获取所有分类 |
| POST | `/api/categories` | 创建分类 |
| PUT | `/api/categories/:id` | 更新分类 |
| DELETE | `/api/categories/:id` | 删除分类 |

### 番茄钟

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/pomodoro` | 记录一次专注 |
| GET | `/api/pomodoro/today` | 今日统计 |
| GET | `/api/pomodoro/history` | 历史统计 |

> 详细 API 文档见 [API.md](./API.md)

---

## 🎨 技术栈

### 前端
- **Vue 3** - Composition API + `<script setup>`
- **Element Plus** - UI 组件库
- **Pinia** - 状态管理
- **vue-router** - 路由
- **Axios** - HTTP 请求
- **Vite** - 构建工具

### 后端
- **Flask** - Web 框架
- **SQLAlchemy** - ORM
- **SQLite** - 数据库（无需配置，开箱即用）
- **Flask-CORS** - 跨域支持

---

## 💾 数据存储

数据保存在本地 SQLite 数据库：
```
backend/instance/todo_app.db
```

**无需配置数据库**，首次运行自动创建。

---

## 🌐 生产部署

### 前端构建
```bash
cd frontend
npm run build
```
产物在 `dist/` 目录，可部署到任意静态托管（Vercel、Netlify、GitHub Pages）。

### 后端部署
```bash
# 安装 Gunicorn
pip install gunicorn

# 启动
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

可部署到 Railway、Render、Heroku 等平台。

---

## ❓ 常见问题

**Q: 前端启动报错 `npm ERR!`？**
A: 确保 Node.js 版本 >= 18，可尝试删除 `node_modules` 后重新 `npm install`。

**Q: 后端启动报错 `ModuleNotFoundError`？**
A: 确保在 `backend` 目录下运行 `pip install -r requirements.txt`。

**Q: 页面空白或无法加载？**
A: 检查后端是否正常启动（访问 http://localhost:5000/api/todos 应返回 JSON）。

**Q: 数据会丢失吗？**
A: 数据保存在本地数据库文件，除非手动删除，否则会一直保留。

---

## 🤝 贡献

欢迎提 Issue 和 PR！

- 发现 Bug？→ 提 Issue
- 有新功能想法？→ 提 Issue 讨论
- 想贡献代码？→ Fork → 修改 → PR

---

## 📄 许可证

MIT License - 随便用，记得保留版权声明就行。

---

## 🙏 致谢

- 灵感来自微信小程序版本
- UI 设计参考现代简洁风格
- 感谢所有开源项目的贡献者

---

**Made with ❤️ by Survivor0102**
