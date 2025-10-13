import {
	getDBType
} from '../../core/database/database.config.js';
import {
	ServiceMongoModel
} from '../../core/models/mongodb/service.mongo.model.js';
import {
	ServicePgModel
} from '../../core/models/postgres/service.pg.model.js';

let ServiceModel = null;

export function getServiceModel() {
	if (ServiceModel) {
		return ServiceModel;
	}

	const dbType = getDBType();
	ServiceModel = dbType === 'postgres' ? new ServicePgModel() : new ServiceMongoModel();

	return ServiceModel;
}