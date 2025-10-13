export function formatDate(date, format = 'YYYY-MM-DD') {
	const d = new Date(date);
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');

	return format
		.replace('YYYY', year)
		.replace('MM', month)
		.replace('DD', day);
}

export function formatTime(time) {
	if (!time) return '';

	if (typeof time === 'string') {
		return time;
	}

	const date = new Date(time);
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');

	return `${hours}:${minutes}`;
}

export function calculateEndTime(startTime, duration) {
	const [hours, minutes] = startTime.split(':').map(Number);
	const totalMinutes = hours * 60 + minutes + duration;

	const endHours = Math.floor(totalMinutes / 60);
	const endMinutes = totalMinutes % 60;

	return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
}