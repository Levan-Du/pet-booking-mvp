import {
	getDBType
} from '../../core/database/database.config.js';
import {
	AppointmentMongoModel
} from '../../core/models/mongodb/appointment.mongo.model.js';
import {
	AppointmentPgModel
} from '../../core/models/postgres/appointment.pg.model.js';

let AppointmentModel = null;

export function getAppointmentModel() {
	if (AppointmentModel) {
		return AppointmentModel;
	}

	const dbType = getDBType();
	AppointmentModel = dbType === 'postgres' ? new AppointmentPgModel() : new AppointmentMongoModel();

	return AppointmentModel;
}