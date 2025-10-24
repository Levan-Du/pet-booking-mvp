export function successResponse(data, message = '操作成功') {
	return {
		success: true,
		message,
		data
	};
}

export function errorResponse(message, code = null) {
	const response = {
		success: false,
		message
	};

	if (code) {
		response.code = code;
	}

	return response;
}

export function paginatedResponse(data, pagination) {
	return {
		success: true,
		data: data,
		pagination
	};
}