宠物店预约系统 (Pet Booking System) 🐕🐈
一个完整的全栈宠物店在线预约系统，包含 UniApp X 前端和 Node.js 后端，支持微信小程序、H5 等多端部署。

🌟 项目特色
全栈解决方案
前端: UniApp X - 一套代码多端部署

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
text
pet-booking-mvp/
├── frontend/                    # UniApp X 前端
│   ├── pages/                  # 页面文件
│   │   ├── index/             # 预约首页
│   │   └── admin/             # 管理后台
│   ├── static/                # 静态资源
│   ├── manifest.json          # 应用配置
│   ├── pages.json             # 页面配置
│   └── App.vue                # 应用入口
├── backend/                   # Node.js 后端
│   ├── src/
│   │   ├── modules/           # 功能模块
│   │   ├── core/              # 核心组件
│   │   ├── app.js             # 应用入口
│   │   └── routes.js          # 路由聚合
│   ├── scripts/               # 脚本文件
│   ├── .env                   # 环境变量
│   └── package.json
└── README.md


🚀 快速开始
环境要求
Node.js 16+

MongoDB 4.4+ 或 PostgreSQL 12+

HBuilder X (前端开发)

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
使用 HBuilder X 打开项目
下载并安装 HBuilder X

打开 HBuilder X

文件 → 打开 → 选择 frontend 文件夹

配置 API 地址
在 frontend 项目中，确保 API 请求地址指向后端服务：

javascript
// 在页面中使用的请求示例
const response = await uni.request({
  url: 'http://localhost:3000/api/services', // 确保这是正确的后端地址
  method: 'GET'
});
运行前端
在 HBuilder X 中：

选择运行 → 运行到浏览器 → Chrome

或选择运行到小程序模拟器

📱 功能模块
用户端功能
🐾 服务浏览 - 查看宠物服务项目和价格

📅 在线预约 - 选择服务、日期和时间

🐕 宠物信息 - 记录宠物类型、品种、体型

📋 预约管理 - 查看和管理个人预约

🔔 消息提醒 - 预约确认和提醒

管理端功能
👥 客户管理 - 查看客户和宠物信息

📊 预约管理 - 确认、完成、取消预约

💼 服务管理 - 添加、编辑、删除服务项目

📈 数据统计 - 业务数据分析和报表

🔐 权限管理 - 管理员账户和权限控制

🔧 技术栈详情
前端技术栈
框架: UniApp X (基于 Vue 3)

语言: UTS (Universal TypeScript)

UI 组件: 原生组件 + 自定义样式

状态管理: 组合式 API

网络请求: uni.request

后端技术栈
运行时: Node.js

框架: Express.js

数据库:

MongoDB with Mongoose

PostgreSQL with pg

认证: Basic Authentication

验证: Joi

安全: bcryptjs 密码加密

CORS: 跨域支持

开发工具
IDE: HBuilder X (前端) + VS Code (后端)

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
在 HBuilder X 中选择 发行 → 网站-PC Web 或手机 H5

将生成的 dist 文件部署到 Web 服务器

小程序部署
在 HBuilder X 中选择 发行 → 小程序-微信

使用微信开发者工具上传审核

App 部署
在 HBuilder X 中选择 发行 → 原生 App-云打包

生成 Android APK 或 iOS IPA

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
在 HBuilder X 中运行到浏览器

测试预约流程

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

遵循 Vue 3 组合式 API 最佳实践

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
用户选择服务项目

系统显示可预约时段

用户填写宠物和联系信息

系统检查时间冲突

创建预约记录

管理员确认预约

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
