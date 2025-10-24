import Joi from 'joi';

export const adminValidation = {
	login: Joi.object({
		username: Joi.string().min(1).max(50).required()
			.messages({
				'string.empty': '用户名不能为空'
			}),

		password: Joi.string().min(1).required()
			.messages({
				'string.empty': '密码不能为空'
			})
	}),

	changePassword: Joi.object({
		currentPassword: Joi.string().min(1).required()
			.messages({
				'string.empty': '当前密码不能为空'
			}),

		newPassword: Joi.string().min(6).required()
			.messages({
				'string.empty': '新密码不能为空',
				'string.min': '新密码长度不能少于6位'
			})
	})
};