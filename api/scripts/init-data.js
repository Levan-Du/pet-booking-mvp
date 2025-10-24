import {
	connectDatabase
} from '../src/core/database/database.config.js';
import {
	getDBType
} from '../src/core/database/database.config.js';
import {
	getMongoDB
} from '../src/core/database/mongodb.config.js';
import {
	getPostgresPool
} from '../src/core/database/postgres.config.js';
import {
	hashPassword
} from '../src/core/utils/password.util.js';

async function initializeData() {
	try {
		console.log('📝 正在初始化数据...');

		await connectDatabase();
		const dbType = getDBType();

		if (dbType === 'mongodb') {
			await initializeMongoDBData();
		} else {
			await initializePostgresData();
		}

		console.log('✅ 数据初始化完成');
	} catch (error) {
		console.error('❌ 数据初始化失败:', error);
	}
}

async function initializeMongoDBData() {
	const db = getMongoDB();

	// 检查是否已有数据
	const existingServices = await db.collection('services').countDocuments();

	if (existingServices > 0) {
		console.log('📊 数据库中已有服务数据，跳过初始化');
		return;
	}

	// 插入初始服务数据
	const services = [{
			name: "基础洗澡-小型犬",
			description: "适合体重10kg以下的小型犬，包括洗浴、吹干、基础梳理",
			duration: 60,
			price: 80.00,
			is_active: true,
			created_at: new Date()
		},
		{
			name: "基础洗澡-中型犬",
			description: "适合体重10-25kg的中型犬，包括洗浴、吹干、基础梳理",
			duration: 90,
			price: 120.00,
			is_active: true,
			created_at: new Date()
		},
		{
			name: "基础洗澡-大型犬",
			description: "适合体重25kg以上的大型犬，包括洗浴、吹干、基础梳理",
			duration: 120,
			price: 160.00,
			is_active: true,
			created_at: new Date()
		},
		{
			name: "精致美容-小型犬",
			description: "全套美容服务：洗澡、修剪、指甲护理、耳朵清洁",
			duration: 120,
			price: 150.00,
			is_active: true,
			created_at: new Date()
		},
		{
			name: "体外驱虫",
			description: "专业的体外驱虫服务",
			duration: 30,
			price: 60.00,
			is_active: true,
			created_at: new Date()
		}
	];

	await db.collection('services').insertMany(services);
	console.log(`✅ 已插入 ${services.length} 个服务项目`);

	// 插入默认管理员账号
	const adminPassword = await hashPassword('admin123');

	const admin = {
		username: 'admin',
		password_hash: adminPassword,
		created_at: new Date()
	};

	await db.collection('admins').insertOne(admin);
	console.log('✅ 已创建默认管理员账号 (用户名: admin, 密码: admin123)');
}

async function initializePostgresData() {
	const pool = getPostgresPool();

	// 检查是否已有数据
	const result = await pool.query('SELECT COUNT(*) as count FROM services');
	const existingServices = parseInt(result.rows[0].count);

	if (existingServices > 0) {
		console.log('📊 数据库中已有服务数据，跳过初始化');
		return;
	}

	// 插入初始服务数据
	const services = [
		['基础洗澡-小型犬', '适合体重10kg以下的小型犬，包括洗浴、吹干、基础梳理', 60, 80.00],
		['基础洗澡-中型犬', '适合体重10-25kg的中型犬，包括洗浴、吹干、基础梳理', 90, 120.00],
		['基础洗澡-大型犬', '适合体重25kg以上的大型犬，包括洗浴、吹干、基础梳理', 120, 160.00],
		['精致美容-小型犬', '全套美容服务：洗澡、修剪、指甲护理、耳朵清洁', 120, 150.00],
		['体外驱虫', '专业的体外驱虫服务', 30, 60.00]
	];

	for (const service of services) {
		await pool.query(
			'INSERT INTO services (name, description, duration, price) VALUES ($1, $2, $3, $4)',
			service
		);
	}

	console.log(`✅ 已插入 ${services.length} 个服务项目`);

	// 插入默认管理员账号
	const adminPassword = await hashPassword('admin123');

	await pool.query(
		'INSERT INTO admins (username, password_hash) VALUES ($1, $2)',
		['admin', adminPassword]
	);

	console.log('✅ 已创建默认管理员账号 (用户名: admin, 密码: admin123)');
}

// 运行初始化
initializeData().then(() => {
	process.exit(0);
}).catch(error => {
	console.error('初始化失败:', error);
	process.exit(1);
});