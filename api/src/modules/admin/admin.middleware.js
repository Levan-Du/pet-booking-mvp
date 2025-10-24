import {
	adminValidation
} from './admin.validation.js';

/**
 * 管理员登录验证中间件
 */
export const validateAdminLogin = (req, res, next) => {
	const {
		error
	} = adminValidation.login.validate(req.body);
	// console.log('admin.controller.js -> validateAdminLogin -> error', error)

	if (error) {
		return res.status(400).json({
			success: false,
			message: '输入验证失败',
			errors: error.details.map(detail => detail.message)
		});
	}

	next();
};

/**
 * 管理员修改密码验证中间件
 */
export const validateChangePassword = (req, res, next) => {
	const {
		error
	} = adminValidation.changePassword.validate(req.body);

	if (error) {
		return res.status(400).json({
			success: false,
			message: '输入验证失败',
			errors: error.details.map(detail => detail.message)
		});
	}

	next();
};