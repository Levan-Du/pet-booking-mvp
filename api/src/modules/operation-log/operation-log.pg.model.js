import { PgModel } from '../pg.model.js';

export class OperationLogPgModel extends PgModel {
  constructor() {
    super('operation_logs');
  }

  async create(operationData) {
    const operationLog = {
      operation_type: operationData.operation_type,
      operator: operationData.operator,
      target_appointment_id: operationData.target_appointment_id,
      old_status: operationData.old_status,
      new_status: operationData.new_status,
      details: operationData.details,
      created_at: new Date(),
      updated_at: new Date()
    };

    return await super.create(operationLog);
  }

  async findByAppointmentId(appointmentId) {
    const pool = this.getPool();
    const result = await pool.query(
      `SELECT * FROM ${this.collectionName} 
       WHERE target_appointment_id = $1 
       ORDER BY created_at DESC`,
      [appointmentId]
    );
    return result.rows;
  }

  async findAll(page = 1, limit = 20) {
    const pool = this.getPool();
    const skip = (page - 1) * limit;
    
    const logsResult = await pool.query(
      `SELECT * FROM ${this.collectionName} 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, skip]
    );

    const totalResult = await pool.query(
      `SELECT COUNT(*) FROM ${this.collectionName}`
    );

    const total = parseInt(totalResult.rows[0].count);

    return {
      logs: logsResult.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async findByOperator(operator, page = 1, limit = 20) {
    const pool = this.getPool();
    const skip = (page - 1) * limit;
    
    const logsResult = await pool.query(
      `SELECT * FROM ${this.collectionName} 
       WHERE operator = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [operator, limit, skip]
    );

    const totalResult = await pool.query(
      `SELECT COUNT(*) FROM ${this.collectionName} WHERE operator = $1`,
      [operator]
    );

    const total = parseInt(totalResult.rows[0].count);

    return {
      logs: logsResult.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

export default OperationLogPgModel;