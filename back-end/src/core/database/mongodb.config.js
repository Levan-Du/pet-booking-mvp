import {
	MongoClient
} from 'mongodb';

let client = null;
let database = null;

export async function connectMongoDB() {
	if (database) {
		return database;
	}

	const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
	const dbName = process.env.MONGODB_DB_NAME || 'test';

	try {
		console.log('🔗 正在连接 MongoDB...');
		client = new MongoClient(uri);
		await client.connect();
		database = client.db(dbName);

		console.log('✅ MongoDB 连接测试成功');
		return database;
	} catch (error) {
		console.error('❌ MongoDB 连接失败:', error);
		throw error;
	}
}

export function getMongoDB() {
	if (!database) {
		throw new Error('MongoDB 连接未初始化，请先调用 connectMongoDB()');
	}
	return database;
}

export function getMongoClient() {
	return client;
}