export const errorHandler = (err, req, res, next) => {
	console.error('错误详情:', err);

	if (err.name === 'MongoError' || err.name === 'MongoServerError') {
		if (err.code === 11000) {
			return res.status(409).json({
				success: false,
				message: '数据已存在'
			});
		}
		return res.status(500).json({
			success: false,
			message: '数据库错误'
		});
	}

	if (err.code === '23505') {
		return res.status(409).json({
			success: false,
			message: '数据已存在'
		});
	}

	if (err.code === '23503') {
		return res.status(400).json({
			success: false,
			message: '关联数据不存在'
		});
	}

	if (err.isJoi) {
		return res.status(400).json({
			success: false,
			message: err.details[0].message
		});
	}

	if (err.message && err.statusCode) {
		return res.status(err.statusCode).json({
			success: false,
			message: err.message
		});
	}

	res.status(500).json({
		success: false,
		message: process.env.NODE_ENV === 'development' ? err.message : '服务器内部错误'
	});
};

export const notFoundHandler = (req, res) => {
	res.status(404).json({
		success: false,
		message: `路由 ${req.method} ${req.path} 不存在`
	});
};