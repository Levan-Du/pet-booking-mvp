export const validateRequest = (schema) => {
	return (req, res, next) => {
		const {
			error,
			value
		} = schema.validate(req.body);

		// console.log('validation.middleware.js -> error', JSON.stringify(error), value)

		if (error) {
			return res.status(400).json({
				success: false,
				message: error.details[0].message
			});
		}

		req.validatedData = value;
		next();
	};
};