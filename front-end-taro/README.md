# 宠物服务预约 - Taro版本

这是一个基于Taro框架的宠物服务预约小程序项目，从UniApp X项目迁移而来。

## 项目结构

```
front-end-taro/
├── src/                    # 源代码目录
│   ├── app.ts              # 应用入口文件
│   ├── app.config.ts       # 应用配置文件
│   ├── app.scss            # 全局样式
│   ├── pages/              # 页面目录
│   │   ├── index/          # 首页
│   │   ├── admin/           # 管理页面
│   │   ├── dashboard/       # 仪表板
│   │   └── reports/         # 报表页面
│   ├── components/          # 公共组件
│   └── utils/              # 工具函数
├── config/                 # 构建配置
├── dist/                   # 构建输出目录
└── package.json            # 项目配置
```

## 功能特性

- 🐕 宠物服务预约系统
- 📱 响应式设计，支持多端
- 🔐 管理员登录认证
- 📊 数据统计报表
- 🎨 现代化UI设计

## 开发环境搭建

### 安装依赖

```bash
cd front-end-taro
npm install
```

### 开发命令

```bash
# 微信小程序开发
npm run dev:weapp

# H5开发
npm run dev:h5

# 支付宝小程序开发
npm run dev:alipay

# 百度小程序开发
npm run dev:swan

# 字节跳动小程序开发
npm run dev:tt

# QQ小程序开发
npm run dev:qq

# 京东小程序开发
npm run dev:jd

# React Native开发
npm run dev:rn
```

### 构建命令

```bash
# 微信小程序构建
npm run build:weapp

# H5构建
npm run build:h5

# 其他平台构建类似
```

## 技术栈

- **框架**: Taro 3.x
- **UI框架**: React 18.x
- **语言**: TypeScript
- **样式**: SCSS
- **构建工具**: Webpack 5

## 页面说明

### 首页 (/pages/index)
- 服务选择
- 日期时间选择
- 宠物信息填写
- 预约提交

### 管理员登录 (/pages/admin/login)
- 管理员身份验证
- Token管理

### 管理后台 (/pages/dashboard)
- 预约列表查看
- 预约状态管理
- 数据筛选

### 报表页面 (/pages/reports)
- 数据统计展示
- 图表可视化

## 注意事项

1. 项目需要连接后端API服务（默认地址：http://localhost:3000）
2. 静态资源文件需要放置在 `src/static/` 目录下
3. 开发时请确保安装了对应的开发者工具

## 迁移说明

本项目从UniApp X项目迁移而来，主要变更包括：

- 语法从Vue 3 + UTS迁移到React + TypeScript
- 组件库从UniApp组件迁移到Taro组件
- API调用方式适配Taro框架
- 样式文件从UVue样式迁移到SCSS

## 许可证

MIT License