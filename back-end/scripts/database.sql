-- 创建服务项目表
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 创建预约表
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(50) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  pet_type VARCHAR(20) NOT NULL,
  pet_breed VARCHAR(50),
  pet_size VARCHAR(20),
  special_notes TEXT,
  service_id INTEGER NOT NULL REFERENCES services(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 创建管理员表
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 管理员会话表
CREATE TABLE IF NOT EXISTS admin_sessions (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- 插入初始服务数据
INSERT INTO services (name, description, duration, price) VALUES 
('基础洗澡-小型犬', '适合体重10kg以下的小型犬，包括洗浴、吹干、基础梳理', 60, 80.00),
('基础洗澡-中型犬', '适合体重10-25kg的中型犬，包括洗浴、吹干、基础梳理', 90, 120.00),
('基础洗澡-大型犬', '适合体重25kg以上的大型犬，包括洗浴、吹干、基础梳理', 120, 160.00),
('精致美容-小型犬', '全套美容服务：洗澡、修剪、指甲护理、耳朵清洁', 120, 150.00),
('体外驱虫', '专业的体外驱虫服务', 30, 60.00);

-- 插入默认管理员账号 (密码: admin123)
INSERT INTO admins (username, password_hash) VALUES 
('admin', '$2a$10$8K1p/a0dRTl0x.SxYeT8u.4n3OWUB5EiBZjqp6Q.DRWP6Z.1dGvS2');