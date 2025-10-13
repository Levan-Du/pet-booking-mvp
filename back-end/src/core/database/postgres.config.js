import pkg from 'pg';
const {
	Pool
} = pkg;

let pool = null;

export async function connectPostgres() {
	if (pool) {
		return pool;
	}

	pool = new Pool({
		host: process.env.POSTGRES_HOST || 'localhost',
		port: process.env.POSTGRES_PORT || 5432,
		database: process.env.POSTGRES_DB || 'pet_booking',
		user: process.env.POSTGRES_USER || 'postgres',
		password: process.env.POSTGRES_PASSWORD || 'password',
	});

	try {
		const client = await pool.connect();
		console.log('PostgreSQL 连接测试成功');
		client.release();
	} catch (error) {
		console.error('PostgreSQL 连接测试失败:', error);
		throw error;
	}

	return pool;
}

export function getPostgresPool() {
	return pool;
}