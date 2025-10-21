宠物店预约系统 (Pet Booking System) 🐕🐈
一个完整的全栈宠物店在线预约系统，包含 Taro 前端和 Node.js 后端，支持微信小程序、H5 等多端部署。

🌟 项目特色
全栈解决方案
前端: Taro - 一套代码多端部署

后端: Node.js + Express - 高性能 API 服务

数据库: 支持 MongoDB 和 PostgreSQL 双数据库

架构: 模块化设计，高内聚低耦合

多端支持
📱 微信小程序
🌐 H5 网页版
📱 Android App
📱 iOS App
💻 管理后台
🏗️ 项目架构
```
pet-booking-mvp/
├── front-end-taro/             # Taro + React 前端
│   ├── src/
│   │   ├── pages/             # 页面文件
│   │   │   ├── index/        # 用户预约首页
│   │   │   ├── user/         # 用户中心页面
│   │   │   ├── dashboard/    # 预约管理后台
│   │   │   ├── databoard/    # 数据看板
│   │   │   ├── reports/      # 报表统计
│   │   │   ├── store/        # 店铺介绍
│   │   │   ├── operation-log/# 操作日志
│   │   │   └── admin/        # 管理员登录
│   │   ├── components/       # 公共组件
│   │   ├── utils/            # 工具函数
│   │   ├── shared/           # 共享资源
│   │   └── static/           # 静态资源
│   ├── config/               # 构建配置
│   └── package.json
├── back-end/                  # Node.js + Express 后端
│   ├── src/
│   │   ├── modules/          # 业务模块
│   │   ├── core/             # 核心组件
│   │   ├── routes/           # API路由
│   │   └── shared/           # 共享资源
│   ├── scripts/              # 脚本文件
│   └── package.json
└── README.md
```


🚀 快速开始
环境要求
Node.js 16+

MongoDB 4.4+ 或 PostgreSQL 12+

Taro 3.x(前端开发)

1. 克隆项目
bash
git clone <repository-url>
cd pet-booking-mvp
2. 后端配置
安装后端依赖
bash
cd back-end
npm install
配置环境变量
复制 .env.example 为 .env：

bash
# 数据库类型选择：mongodb 或 postgres
DB_TYPE=mongodb

# MongoDB 配置
MONGODB_URI=mongodb://localhost:27017/pet_booking
MONGODB_DB_NAME=pet_booking

# PostgreSQL 配置
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=pet_booking
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password

# 应用配置
PORT=3000
NODE_ENV=development
初始化数据
bash
npm run init:data
启动后端服务
bash
# 开发模式
npm run dev

# 生产模式
npm start
后端服务将在 http://localhost:3000 启动

3. 前端配置
安装前端依赖
```bash
cd front-end-taro
npm install
```

配置 API 地址
在 `front-end-taro/src/utils/tokenUtils.ts` 和页面文件中，确保 API 请求地址指向后端服务：

```javascript
// API基础URL配置
const API_BASE_URL = 'http://localhost:3001/api'
```

运行前端
```bash
# 开发模式
npm run dev:weapp    # 微信小程序
npm run dev:h5       # H5网页版

# 构建模式
npm run build:weapp  # 构建微信小程序
npm run build:h5     # 构建H5网页版
```

多端支持
- 📱 微信小程序: `npm run dev:weapp`
- 🌐 H5网页版: `npm run dev:h5`
- 📱 React Native: 支持但需要额外配置

📱 功能模块

## 用户端页面
**index (预约首页)**
- 🐾 服务浏览 - 查看宠物服务项目和价格
- 📅 在线预约 - 选择服务、日期和时间
- 🐕 宠物信息 - 记录宠物类型、品种、体型
- 🔔 消息提醒 - 预约确认和提醒

**user (用户中心)**
- 👤 个人信息 - 用户资料和注册信息
- 📋 预约管理 - 查看和管理个人预约记录
- 🏪 店铺介绍 - 查看店铺信息和服务项目
- 🐶 宠物档案 - 管理宠物信息
- 💳 消费记录 - 查看历史消费记录

## 管理后台页面
**dashboard (预约管理)**
- 📊 预约管理 - 确认、完成、取消预约
- 🔄 状态管理 - 待确认、已确认、进行中、已完成、已取消、客户爽约
- 📱 扫码签到 - 二维码扫描签到功能

**databoard (数据看板)**
- 📈 实时统计 - 今日各状态预约数量统计
- ⏰ 自动刷新 - 每分钟自动更新数据
- 📊 可视化展示 - 图表形式展示业务数据

**reports (报表统计)**
- 📋 详细报表 - 预约数据统计和分析
- 📅 时间筛选 - 按日期范围查询数据
- 📊 多维度分析 - 服务类型、时间段等多维度统计

**operation-log (操作日志)**
- 📝 操作记录 - 记录所有用户和管理员操作
- 🔍 日志查询 - 支持按时间、操作类型筛选
- 📋 详细记录 - 操作时间、用户、操作内容等信息

**store (店铺介绍)**
- 🏪 店铺信息 - 店铺介绍、地址、联系方式
- 💼 服务项目 - 详细的服务列表和价格
- 📞 客服联系 - 在线客服和联系方式

**admin/login (管理员登录)**
- 🔐 身份验证 - 管理员登录认证
- 🔒 安全防护 - JWT token验证机制
- 👥 权限管理 - 不同角色的权限控制

🔧 技术栈详情

## 前端技术栈 (Taro + React)
- **框架**: Taro 3.x (支持多端开发)
- **语言**: TypeScript + React
- **UI组件**: Taro UI 组件 + 自定义组件
- **状态管理**: React Context API
- **网络请求**: Taro.request
- **国际化**: 自定义多语言支持
- **路由**: Taro 原生路由系统
- **样式**: SCSS + rpx 响应式单位

## 后端技术栈 (Node.js + Express)
- **运行时**: Node.js
- **框架**: Express.js
- **数据库**: 支持 MongoDB 和 PostgreSQL 双数据库
- **认证**: JWT Token 认证
- **安全**: bcryptjs 密码加密 + 输入验证
- **CORS**: 跨域支持
- **日志**: 自定义操作日志系统
- **工具**: 响应式工具类 + 错误处理中间件

开发工具
IDE: VS Code (前端和后端开发)

包管理: npm

开发工具: nodemon

环境管理: dotenv

🗄️ 数据库设计
核心数据表
服务表 (services)
字段	类型	描述
id	ObjectId/Serial	主键
name	String	服务名称
description	Text	服务描述
duration	Integer	服务时长(分钟)
price	Decimal	服务价格
is_active	Boolean	是否激活
created_at	Timestamp	创建时间
预约表 (appointments)
字段	类型	描述
id	ObjectId/Serial	主键
customer_name	String	客户姓名
customer_phone	String	客户电话
pet_type	String	宠物类型
pet_breed	String	宠物品种
pet_size	String	宠物体型
special_notes	Text	特殊要求
service_id	ObjectId/Integer	服务ID
appointment_date	Date	预约日期
appointment_time	Time	预约时间
end_time	Time	结束时间
status	String	预约状态
created_at	Timestamp	创建时间
管理员表 (admins)
字段	类型	描述
id	ObjectId/Serial	主键
username	String	用户名
password_hash	String	密码哈希
created_at	Timestamp	创建时间
🔌 API 接口文档
基础信息
基础URL: http://localhost:3000/api

认证方式: Basic Auth (管理员接口)

默认管理员: admin / admin123

主要接口
服务接口
GET /services - 获取服务列表

GET /services/:id - 获取服务详情

POST /services - 创建服务 (管理员)

PUT /services/:id - 更新服务 (管理员)

DELETE /services/:id - 删除服务 (管理员)

预约接口
GET /appointments/available-slots - 获取可预约时段

POST /appointments - 创建预约

GET /appointments - 获取预约列表 (管理员)

PUT /appointments/:id/status - 更新预约状态 (管理员)

管理接口
POST /admin/login - 管理员登录

GET /admin/stats - 获取统计数据

PUT /admin/change-password - 修改密码

🎯 部署指南
后端部署
使用 PM2 (推荐)
bash
npm install -g pm2
pm2 start src/app.js --name "pet-booking-api"
使用 Docker
dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
前端部署
H5 部署
```bash
npm run build:h5
```
将生成的 dist 目录部署到 Web 服务器

小程序部署
```bash
npm run build:weapp
```
使用微信开发者工具上传审核

App 部署
Taro 支持 React Native 构建，需要额外配置

🧪 测试指南
后端测试
bash
# 健康检查
curl http://localhost:3000/health

# 测试服务列表
curl http://localhost:3000/api/services

# 测试管理员登录
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
前端测试
```bash
npm run dev:h5
```
在浏览器中测试预约流程

测试管理后台功能

🔄 开发工作流
功能开发
创建功能分支

后端 API 开发

前端页面开发

接口联调测试

提交 Pull Request

代码规范
使用 ESLint 进行代码检查

遵循 React 函数式组件最佳实践

统一的错误处理机制

详细的代码注释

🐛 常见问题
数据库连接问题
问题: 无法连接数据库
解决:

检查数据库服务是否启动

验证连接字符串配置

检查网络和防火墙设置

跨域问题
问题: 前端请求被浏览器阻止
解决:

后端已配置 CORS

检查前端请求地址是否正确

确认端口配置

认证失败
问题: 管理员登录失败
解决:

确认用户名密码正确 (admin/admin123)

检查 Basic Auth header 格式

验证管理员数据是否初始化

时间冲突
问题: 预约时间冲突检测异常
解决:

检查服务时长配置

验证时间格式

确认时区设置

📈 业务逻辑
预约流程
## 用户预约流程
1. **服务选择** - 用户在首页选择宠物服务项目
2. **时间选择** - 选择预约日期和可用时间段
3. **信息填写** - 填写客户信息、宠物信息、特殊要求
4. **预约提交** - 系统生成预约单号和用户token
5. **状态管理** - 预约状态流转：待确认 → 已确认 → 进行中 → 已完成

## 用户token系统
- **首次预约** - 自动生成用户token和设备ID
- **页面跳转** - 根据token和预约状态自动跳转
- **状态检查** - 有token有预约 → 用户中心"我的"页面
- **状态检查** - 有token无预约 → 用户中心"预约"页面

## 多语言支持
- 🌐 国际化架构 - React Context API 管理语言状态
- 🔄 语言切换 - 支持中英文切换
- 📱 响应式设计 - 适配不同屏幕尺寸
- 🎨 现代UI - 美观的用户界面和交互体验

时间管理
营业时间: 9:00 - 18:00

预约间隔: 30分钟

冲突检测: 自动防止重复预约

状态流转
text
pending → confirmed → completed
         ↓
      cancelled
🤝 贡献指南
我们欢迎各种形式的贡献！

报告问题
使用 Issue 模板报告 bug

提供详细的重现步骤

包括环境信息和错误日志

功能建议
描述新功能的用途和场景

提供详细的功能设计

讨论实现方案

代码贡献
Fork 项目

创建功能分支

编写代码和测试

提交 Pull Request

📄 许可证
本项目采用 MIT 许可证 - 查看 LICENSE 文件了解详情。

🆘 技术支持
📧 邮箱: [项目维护者邮箱]

💬 微信群: [技术交流群]

🐛 Issues: [GitHub Issues]

🔮 路线图
近期计划
微信消息模板推送

预约提醒功能

客户会员系统

服务评价功能

远期规划
多门店支持

员工管理系统

财务报表

移动端 App 优化

宠物店预约系统 - 为宠物店和宠物主人提供便捷的在线预约服务！ 🐾✨

让每一次宠物服务都变得简单愉快！
