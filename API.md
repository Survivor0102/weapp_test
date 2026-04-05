# API 接口文档

## 基础信息

- **Base URL**: `http://localhost:5000/api`
- **Content-Type**: `application/json`
- **字符集**: UTF-8

## 响应格式

所有接口返回统一的 JSON 格式：

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

**成功响应：**
```json
{
  "success": true,
  "data": { ... }
}
```

**错误响应：**
```json
{
  "success": false,
  "error": "错误信息"
}
```

---

## 待办事项 (Todos)

### 1. 获取所有待办

**请求**
```http
GET /api/todos
```

**响应**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "完成任务",
      "description": "详细描述",
      "category_id": 1,
      "category": {
        "id": 1,
        "name": "工作",
        "color": "#3498db",
        "icon": "work"
      },
      "priority": "high",
      "due_date": "2024-01-01T10:00:00",
      "completed": false,
      "completed_at": null,
      "focus_time": 0,
      "created_at": "2024-01-01T09:00:00",
      "updated_at": "2024-01-01T09:00:00"
    }
  ]
}
```

### 2. 创建待办

**请求**
```http
POST /api/todos
Content-Type: application/json

{
  "title": "新任务",
  "description": "任务描述（可选）",
  "category_id": 1,
  "priority": "medium",
  "due_date": "2024-01-01T10:00:00"
}
```

**字段说明**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 标题（最大 100 字符） |
| description | string | 否 | 描述（最大 500 字符） |
| category_id | integer | 否 | 分类 ID |
| priority | string | 否 | 优先级：high/medium/low，默认 medium |
| due_date | string | 否 | ISO 8601 格式日期时间 |

**响应**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "新任务",
    ...
  }
}
```

### 3. 获取单个待办

**请求**
```http
GET /api/todos/:id
```

**响应**
```json
{
  "success": true,
  "data": { ... }
}
```

### 4. 更新待办

**请求**
```http
PUT /api/todos/:id
Content-Type: application/json

{
  "title": "更新标题",
  "completed": true
}
```

**可更新字段**

| 字段 | 类型 | 说明 |
|------|------|------|
| title | string | 标题 |
| description | string | 描述 |
| category_id | integer | 分类 ID |
| priority | string | 优先级 |
| due_date | string | 截止日期 |
| completed | boolean | 完成状态 |
| focus_time | integer | 专注时间（分钟） |

**响应**
```json
{
  "success": true,
  "data": { ... }
}
```

### 5. 删除待办

**请求**
```http
DELETE /api/todos/:id
```

**响应**
```json
{
  "success": true
}
```

### 6. 获取统计

**请求**
```http
GET /api/todos/stats
```

**响应**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "completed": 4,
    "active": 6
  }
}
```

---

## 分类 (Categories)

### 1. 获取所有分类

**请求**
```http
GET /api/categories
```

**响应**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "工作",
      "color": "#3498db",
      "icon": "work",
      "is_default": true,
      "created_at": "2024-01-01T00:00:00",
      "updated_at": "2024-01-01T00:00:00"
    }
  ]
}
```

> 首次调用时会自动创建默认分类：工作、生活、学习、其他

### 2. 创建分类

**请求**
```http
POST /api/categories
Content-Type: application/json

{
  "name": "新分类",
  "color": "#e74c3c",
  "icon": "work"
}
```

**字段说明**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 分类名称（最大 20 字符） |
| color | string | 否 | 颜色值（十六进制），默认 #3498db |
| icon | string | 否 | 图标：work/life/study/other，默认 other |

**响应**
```json
{
  "success": true,
  "data": { ... }
}
```

### 3. 更新分类

**请求**
```http
PUT /api/categories/:id
Content-Type: application/json

{
  "name": "新名称",
  "color": "#2ecc71"
}
```

**响应**
```json
{
  "success": true,
  "data": { ... }
}
```

### 4. 删除分类

**请求**
```http
DELETE /api/categories/:id
```

**响应**
```json
{
  "success": true
}
```

> ⚠️ 注意：默认分类（is_default=true）不能删除

---

## 番茄钟 (Pomodoro)

### 1. 记录番茄钟

**请求**
```http
POST /api/pomodoro
Content-Type: application/json

{
  "todo_id": 1,
  "duration": 25
}
```

**字段说明**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| todo_id | integer | 否 | 关联的待办 ID |
| duration | integer | 否 | 时长（分钟），默认 25 |

**响应**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "todo_id": 1,
    "duration": 25,
    "completed_at": "2024-01-01T10:25:00"
  }
}
```

### 2. 获取今日统计

**请求**
```http
GET /api/pomodoro/today
```

**响应**
```json
{
  "success": true,
  "data": {
    "count": 5,
    "total_minutes": 125,
    "records": [
      {
        "id": 1,
        "todo_id": 1,
        "duration": 25,
        "completed_at": "2024-01-01T10:25:00"
      }
    ]
  }
}
```

### 3. 获取历史统计

**请求**
```http
GET /api/pomodoro/history?start_date=2024-01-01&end_date=2024-01-31
```

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| start_date | string | 否 | 开始日期（ISO 8601） |
| end_date | string | 否 | 结束日期（ISO 8601） |

**响应**
```json
{
  "success": true,
  "data": {
    "total_count": 30,
    "total_minutes": 750,
    "daily_stats": {
      "2024-01-01": {
        "count": 5,
        "minutes": 125
      },
      "2024-01-02": {
        "count": 4,
        "minutes": 100
      }
    }
  }
}
```

---

## 健康检查

**请求**
```http
GET /api/health
```

**响应**
```json
{
  "success": true,
  "message": "服务运行正常",
  "status": "healthy"
}
```

---

## 错误码

| HTTP 状态码 | 说明 |
|------------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
