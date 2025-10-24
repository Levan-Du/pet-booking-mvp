import Joi from 'joi';
import { VALID_STATUSES } from '../../shared/enums/appointment-status.js';
import { APPOINTMENT_STATUS } from '../../shared/enums/appointment-status.js'

export const appointmentValidation = {
	create: Joi.object({
		customer_name: Joi.string().min(1).max(50).required()
			.messages({
				'string.empty': '客户姓名不能为空',
				'string.max': '客户姓名不能超过50个字符'
			}),

		customer_phone: Joi.string().pattern(/^1[3-9]\d{9}$/).required()
			.messages({
				'string.pattern.base': '请输入有效的手机号码'
			}),

		pet_type: Joi.string().valid('dog', 'cat', 'other').required()
			.messages({
				'any.only': '宠物类型必须是狗、猫或其他'
			}),

		pet_breed: Joi.string().max(50).allow('')
			.messages({
				'string.max': '宠物品种不能超过50个字符'
			}),

		pet_size: Joi.string().valid('small', 'medium', 'large').required()
			.messages({
				'any.only': '宠物体型必须是小型、中型或大型'
			}),

		special_notes: Joi.string().max(500).allow('')
			.messages({
				'string.max': '特殊要求不能超过500个字符'
			}),

		service_id: Joi.alternatives().try(
			Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
			Joi.number().integer().positive()
		).required()
			.messages({
				'alternatives.match': '服务ID格式不正确'
			}),

		service_name: Joi.string().max(500).allow('')
			.messages({
				'string.max': '特殊要求不能超过500个字符'
			}),

		status: Joi.string().required()
			.messages({
				'alternatives.match': '服务ID格式不正确'
			}),

		appointment_date: Joi.date().iso().min('now').required()
			.messages({
				'date.base': '预约日期格式不正确',
				'date.min': '预约日期不能是过去的时间'
			}),

		appointment_time: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
			.messages({
				'string.pattern.base': '预约时间格式不正确'
			})
	}),

	updateStatus: Joi.object({
		status: Joi.string().valid(...VALID_STATUSES).required()
	})
};