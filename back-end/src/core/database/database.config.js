import dotenv from 'dotenv';
import {
	connectMongoDB
} from './mongodb.config.js';
import {
	connectPostgres
} from './postgres.config.js';

dotenv.config();

const DB_TYPE = process.env.DB_TYPE || 'mongodb';

let dbConnection = null;
let isConnecting = false;
let connectionPromise = null;

export async function connectDatabase() {
	if (dbConnection) {
		return dbConnection;
	}

	if (isConnecting) {
		return connectionPromise;
	}

	isConnecting = true;

	connectionPromise = new Promise(async (resolve, reject) => {
		try {
			if (DB_TYPE === 'postgres') {
				dbConnection = await connectPostgres();
				console.log('✅ 已连接到 PostgreSQL 数据库');
			} else {
				dbConnection = await connectMongoDB();
				console.log('✅ 已连接到 MongoDB 数据库');
			}

			isConnecting = false;
			resolve(dbConnection);
		} catch (error) {
			isConnecting = false;
			console.error('❌ 数据库连接失败:', error);
			reject(error);
		}
	});

	return connectionPromise;
}

export function getDBType() {
	return DB_TYPE;
}

export function getDBConnection() {
	return dbConnection;
}

export function isDatabaseConnected() {
	return dbConnection !== null;
}