import Joi from 'joi';

export const serviceValidation = {
	create: Joi.object({
		name: Joi.string().min(1).max(100).required()
			.messages({
				'string.empty': '服务名称不能为空',
				'string.max': '服务名称不能超过100个字符'
			}),

		description: Joi.string().max(500).allow('')
			.messages({
				'string.max': '服务描述不能超过500个字符'
			}),

		duration: Joi.number().integer().min(1).max(480).required()
			.messages({
				'number.base': '服务时长必须是数字',
				'number.min': '服务时长不能少于1分钟',
				'number.max': '服务时长不能超过480分钟'
			}),

		price: Joi.number().precision(2).min(0).required()
			.messages({
				'number.base': '价格必须是数字',
				'number.min': '价格不能为负数'
			}),

		is_active: Joi.boolean().default(true)
	}),

	update: Joi.object({
		name: Joi.string().min(1).max(100),
		description: Joi.string().max(500).allow(''),
		duration: Joi.number().integer().min(1).max(480),
		price: Joi.number().precision(2).min(0),
		is_active: Joi.boolean()
	})
};