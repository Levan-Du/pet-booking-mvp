# 宠物预约系统后端 API

基于 Node.js + Express + MongoDB 的宠物服务预约系统后端服务。

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- MongoDB >= 4.4
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 环境配置
创建 `.env` 文件：
```env
# 数据库类型选择：mongodb 或 postgres
DB_TYPE=mongodb

# MongoDB 配置
MONGODB_URI=mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.8
MONGODB_DB_NAME=booking

# PostgreSQL 配置（可选）
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=e-booking
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password

# 应用配置
PORT=3000
NODE_ENV=development
```

### 初始化数据
```bash
npm run init:data
```
这将创建：
- 默认管理员账号（用户名: `admin`, 密码: `admin123`）
- 初始服务项目数据

### 启动服务
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

## 📡 API 接口文档

### 基础信息
- **服务地址**: `http://localhost:3000`
- **API 前缀**: `/api`
- **数据格式**: JSON
- **字符编码**: UTF-8

### 响应格式
```json
{
  "success": true|false,
  "message": "响应消息",
  "data": {} // 响应数据（成功时）
}
```

## 🔐 认证说明

### 认证类型
- **🔒 需要管理员认证** - 使用 `authenticateAdmin` 中间件
- **🔓 公开接口** - 无需认证
- **🔑 需要 Token 认证** - 使用 `authenticateToken` 中间件

### 认证方式
在请求头中添加：
```http
Authorization: Bearer <your-token>
```

---

## 📋 API 接口列表

### 🏥 服务管理 (`/api/services`)

#### 🔓 获取服务列表
```http
GET /api/services
```
**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "service_id",
      "name": "基础洗澡-小型犬", 
      "description": "适合体重10kg以下的小型犬",
      "duration": 60,
      "price": 80.00,
      "is_active": true
    }
  ]
}
```

#### 🔓 获取单个服务
```http
GET /api/services/:id
```

#### 🔒 创建服务 **[需要管理员认证]**
```http
POST /api/services
Authorization: Bearer <admin-token>
```
**请求体**:
```json
{
  "name": "服务名称",
  "description": "服务描述", 
  "duration": 60,
  "price": 80.00
}
```

#### 🔒 更新服务 **[需要管理员认证]**
```http
PUT /api/services/:id
Authorization: Bearer <admin-token>
```

#### 🔒 删除服务 **[需要管理员认证]**
```http
DELETE /api/services/:id
Authorization: Bearer <admin-token>
```

---

### 📅 预约管理 (`/api/appointments`)

#### 🔓 获取可用时段
```http
GET /api/appointments/available-slots?date=2024-01-01&service_id=xxx
```

#### 🔓 创建预约
```http
POST /api/appointments
```
**请求体**:
```json
{
  "service_id": "service_id",
  "appointment_date": "2024-01-01",
  "appointment_time": "10:00",
  "customer_name": "张三",
  "customer_phone": "13800138000",
  "pet_type": "dog",
  "pet_breed": "金毛",
  "pet_size": "大型",
  "special_notes": "宠物比较胆小"
}
```

#### 🔒 获取所有预约 **[需要管理员认证]**
```http
GET /api/appointments?status=pending&date=2024-01-01
Authorization: Bearer <admin-token>
```

#### 🔒 获取今日预约 **[需要管理员认证]**
```http
GET /api/appointments/today
Authorization: Bearer <admin-token>
```

#### 🔒 获取单个预约 **[需要管理员认证]**
```http
GET /api/appointments/:id
Authorization: Bearer <admin-token>
```

#### 🔒 更新预约状态 **[需要管理员认证]**
```http
PUT /api/appointments/:id/status
Authorization: Bearer <admin-token>
```
**请求体**:
```json
{
  "status": "confirmed|completed|cancelled"
}
```

---

### 👨‍💼 管理员功能 (`/api/admin`)

#### 🔓 管理员登录
```http
POST /api/admin/login
```
**请求体**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```
**响应示例**:
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "jwt-token",
    "admin": {
      "id": "admin_id",
      "username": "admin"
    }
  }
}
```

#### 🔒 获取管理员信息 **[需要管理员认证]**
```http
GET /api/admin/profile
Authorization: Bearer <admin-token>
```

#### 🔒 获取统计数据 **[需要管理员认证]**
```http
GET /api/admin/stats
Authorization: Bearer <admin-token>
```

#### 🔒 修改密码 **[需要管理员认证]**
```http
PUT /api/admin/change-password
Authorization: Bearer <admin-token>
```
**请求体**:
```json
{
  "currentPassword": "当前密码",
  "newPassword": "新密码"
}
```

---

### 🔐 认证管理 (`/api/auth`)

#### 🔑 验证 Token **[需要 Token 认证]**
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

#### 🔒 获取用户信息 **[需要管理员认证]**
```http
GET /api/auth/profile
Authorization: Bearer <admin-token>
```

#### 🔑 退出登录 **[需要 Token 认证]**
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

#### 🔒 清理过期会话 **[需要管理员认证]**
```http
DELETE /api/auth/sessions/cleanup
Authorization: Bearer <admin-token>
```

---

## 🛠️ 开发工具

### 健康检查
```http
GET /health
```

### 项目结构
```
back-end/
├── src/
│   ├── app.js                 # 应用入口
│   ├── routes.js              # 主路由
│   ├── core/                  # 核心功能
│   │   ├── database/          # 数据库配置
│   │   ├── middleware/        # 中间件
│   │   ├── models/            # 数据模型
│   │   └── utils/             # 工具函数
│   └── modules/               # 业务模块
│       ├── admin/             # 管理员模块
│       ├── appointment/       # 预约模块
│       ├── auth/              # 认证模块
│       └── service/           # 服务模块
├── scripts/
│   └── init-data.js           # 数据初始化脚本
├── package.json
└── .env                       # 环境配置
```

### 可用脚本
```bash
npm start          # 启动生产服务器
npm run dev        # 启动开发服务器（热重载）
npm run init:data  # 初始化数据库数据
npm test           # 运行测试（待实现）
```

## 🔒 权限说明

### 公开接口 🔓
- 服务列表查询
- 单个服务查询
- 可用时段查询
- 创建预约
- 管理员登录

### 管理员权限接口 🔒
- 服务管理（增删改）
- 预约管理（查看、状态更新）
- 管理员信息管理
- 统计数据查看
- 会话管理

### Token 认证接口 🔑
- Token 验证
- 退出登录

## 🐛 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权（需要登录） |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 📝 开发说明

- 所有需要管理员权限的接口都使用 `authenticateAdmin` 中间件
- 数据验证使用 Joi 库进行参数校验
- 支持 MongoDB 和 PostgreSQL 双数据库
- 使用 JWT 进行身份认证
- 所有密码都经过 bcrypt 加密存储

## 🔧 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `PORT` | 服务端口 | 3000 |
| `NODE_ENV` | 运行环境 | development |
| `DB_TYPE` | 数据库类型 | mongodb |
| `MONGODB_URI` | MongoDB 连接字符串 | - |
| `MONGODB_DB_NAME` | MongoDB 数据库名 | booking |