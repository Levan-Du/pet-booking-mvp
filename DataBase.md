# 宠物服务预约系统 - 数据库结构文档

## 概述

本系统支持两种数据库：MongoDB 和 PostgreSQL，通过工厂模式实现数据库无关性。

## 数据库表结构

### 1. 管理员表 (admins)

**MongoDB 集合 / PostgreSQL 表**

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| _id (MongoDB) / id (PostgreSQL) | ObjectId / SERIAL | 主键 | PRIMARY KEY |
| username | VARCHAR(50) | 用户名 | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | 密码哈希 | NOT NULL |
| access_token | VARCHAR(255) | 访问令牌 | NULLABLE |
| created_at | TIMESTAMP | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 更新时间 | DEFAULT CURRENT_TIMESTAMP |

**索引：**
- username (唯一索引)

### 2. 管理员会话表 (admin_sessions)

**MongoDB 集合 / PostgreSQL 表**

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| _id (MongoDB) / id (PostgreSQL) | ObjectId / SERIAL | 主键 | PRIMARY KEY |
| admin_id | ObjectId / INTEGER | 管理员ID | FOREIGN KEY REFERENCES admins(id) |
| token | VARCHAR(255) | 会话令牌 | NOT NULL |
| expires_at | TIMESTAMP | 过期时间 | NOT NULL |
| created_at | TIMESTAMP | 创建时间 | DEFAULT CURRENT_TIMESTAMP |

**索引：**
- token (索引)
- expires_at (索引)
- admin_id (索引)

### 3. 服务表 (services)

**MongoDB 集合 / PostgreSQL 表**

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| _id (MongoDB) / id (PostgreSQL) | ObjectId / SERIAL | 主键 | PRIMARY KEY |
| name | VARCHAR(100) | 服务名称 | NOT NULL |
| type | VARCHAR(50) | 服务类型 | NOT NULL |
| description | TEXT | 服务描述 | NULLABLE |
| duration | INTEGER | 服务时长(分钟) | NOT NULL |
| price | DECIMAL(10,2) | 服务价格 | NOT NULL |
| is_active | BOOLEAN | 是否激活 | DEFAULT TRUE |
| created_at | TIMESTAMP | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 更新时间 | DEFAULT CURRENT_TIMESTAMP |

**索引：**
- type (索引)
- is_active (索引)

### 4. 预约表 (appointments)

**MongoDB 集合 / PostgreSQL 表**

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| _id (MongoDB) / id (PostgreSQL) | ObjectId / SERIAL | 主键 | PRIMARY KEY |
| customer_name | VARCHAR(100) | 客户姓名 | NOT NULL |
| customer_phone | VARCHAR(20) | 客户电话 | NOT NULL |
| pet_type | VARCHAR(50) | 宠物类型 | NOT NULL |
| pet_breed | VARCHAR(50) | 宠物品种 | NULLABLE |
| pet_size | VARCHAR(20) | 宠物体型 | NULLABLE |
| special_notes | TEXT | 特殊说明 | NULLABLE |
| service_id | ObjectId / INTEGER | 服务ID | FOREIGN KEY REFERENCES services(id) |
| appointment_date | DATE | 预约日期 | NOT NULL |
| appointment_time | TIME | 预约时间 | NOT NULL |
| end_time | TIME | 结束时间 | NOT NULL |
| status | VARCHAR(20) | 状态 | DEFAULT 'pending' |
| created_at | TIMESTAMP | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 更新时间 | DEFAULT CURRENT_TIMESTAMP |

**状态枚举：**
- pending: 待处理
- confirmed: 已确认
- completed: 已完成
- cancelled: 已取消
- broken: 爽约

**索引：**
- appointment_date (索引)
- appointment_time (索引)
- status (索引)
- service_id (索引)
- customer_phone (索引)

## 表关系

```
admins (1) ←→ (∞) admin_sessions
services (1) ←→ (∞) appointments
```

## 数据库模型类

### 基础模型类

1. **BaseModel** - 抽象基类
   - find(query): 查询多条记录
   - findById(id): 根据ID查询单条记录
   - create(data): 创建记录
   - update(id, data): 更新记录
   - delete(id): 删除记录

2. **MongoModel** - MongoDB实现
   - 继承BaseModel
   - 提供MongoDB特定的方法(getCollection, getObjectId)

3. **PgModel** - PostgreSQL实现
   - 继承BaseModel
   - 提供PostgreSQL特定的方法(getPool)

### 业务模型类

1. **AdminModel** - 管理员模型
   - findByUsername(username): 根据用户名查找管理员
   - updatePassword(id, newPasswordHash): 更新密码
   - getStats(): 获取统计信息
   - updateAccessToken(adminId, token): 更新访问令牌

2. **AuthModel** - 认证模型
   - validateAdminCredentials(username, passwordHash): 验证管理员凭据
   - getAdminById(id): 根据ID获取管理员信息
   - createSession(adminId, token, expiresAt): 创建会话
   - getSessionByToken(token): 根据令牌获取会话
   - deleteSession(token): 删除会话
   - cleanupExpiredSessions(): 清理过期会话

3. **AppointmentModel** - 预约模型
   - findByUserId(userId): 根据用户ID查找预约
   - find(query): 查询预约（支持关联服务信息）
   - checkTimeConflict(): 检查时间冲突

4. **ServiceModel** - 服务模型
   - findByType(type): 根据类型查找服务

## 数据库配置

### MongoDB 配置
- 数据库名: pet_booking
- 集合: admins, admin_sessions, services, appointments

### PostgreSQL 配置
- 数据库名: pet_booking
- 表: admins, admin_sessions, services, appointments

## 数据示例

### 服务数据示例
```sql
INSERT INTO services (name, type, description, duration, price) VALUES
('基础洗澡', '洗澡', '基础洗澡服务', 60, 50.00),
('美容造型', '美容', '专业美容造型', 120, 150.00),
('健康检查', '医疗', '基础健康检查', 30, 80.00);
```

### 预约状态流转
```
pending → confirmed → completed
pending → cancelled
pending → broken (爽约)
```

## 注意事项

1. **时间冲突检查**: 系统会自动检查预约时间冲突
2. **会话管理**: 会话有自动过期清理机制
3. **密码安全**: 密码以哈希形式存储
4. **数据一致性**: 外键约束确保数据完整性

## 维护建议

1. 定期清理过期会话记录
2. 监控预约表的索引性能
3. 定期备份重要数据
4. 监控数据库连接池状态