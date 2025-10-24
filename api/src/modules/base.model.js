export class BaseModel {
	constructor(collectionName) {
		this.collectionName = collectionName;
	}

	async find(query = {}) {
		throw new Error('find method must be implemented');
	}

	async findById(id) {
		throw new Error('findById method must be implemented');
	}

	async create(data) {
		throw new Error('create method must be implemented');
	}

	async update(id, data) {
		throw new Error('update method must be implemented');
	}

	async delete(id) {
		throw new Error('delete method must be implemented');
	}
}