export const loggingMiddleware = (req, res, next) => {
	const start = Date.now();

	// console.log('authorization:', req.headers.authorization);
	console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${res.statusCode}`);

	res.on('finish', () => {
		const duration = Date.now() - start;
		console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
	});

	next();
};