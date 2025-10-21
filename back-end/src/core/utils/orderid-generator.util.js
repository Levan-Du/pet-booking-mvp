class OrderIdGenerator {
  constructor() {
    // 使用内存存储各业务的序列号 {业务码: 序列号}
    this.sequences = new Map();
    // 存储当前日期，用于判断是否需要重置序列号
    this.currentDate = this.getCurrentDateString();
  }

  /**
   * 获取当前日期字符串 (YYYYMMDD)
   */
  getCurrentDateString() {
    const now = new Date();
    return now.getFullYear() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0');
  }

  /**
   * 检查并重置序列号（如果需要）
   */
  checkAndResetSequence() {
    const today = this.getCurrentDateString();
    if (today !== this.currentDate) {
      // 日期变化，重置所有序列号和当前日期
      this.sequences.clear();
      this.currentDate = today;
      console.log(`订单号生成器：日期已重置为 ${today}`);
    }
  }

  /**
   * 获取下一个序列号
   * @param {string} businessCode - 业务代码
   * @returns {number} 序列号
   */
  getNextSequence(businessCode) {
    this.checkAndResetSequence();

    const currentSequence = this.sequences.get(businessCode) || 0;
    const nextSequence = currentSequence + 1;

    // 序列号范围：1-99999
    if (nextSequence > 99999) {
      throw new Error(`业务 ${businessCode} 当日订单量已达上限 99999`);
    }

    this.sequences.set(businessCode, nextSequence);
    return nextSequence;
  }

  /**
   * 生成订单号
   * @param {string} businessCode - 业务代码 (2-4位)
   * @returns {string} 订单号
   */
  generate(businessCode = '10') {
    try {
      const sequence = this.getNextSequence(businessCode);
      const timestamp = Date.now();
      const date = new Date(timestamp);

      // 生成随机数 (2位)
      const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');

      // 格式化时间（去掉年份前两位，更简洁）
      const timeStr =
        date.getFullYear().toString().substr(2) + // 年后2位
        (date.getMonth() + 1).toString().padStart(2, '0') + // 月
        date.getDate().toString().padStart(2, '0') + // 日
        date.getHours().toString().padStart(2, '0') + // 时
        date.getMinutes().toString().padStart(2, '0') + // 分
        date.getSeconds().toString().padStart(2, '0'); // 秒

      // 组合订单号: 业务码 + 日期(6) + 时间(6) + 序列号(5) + 随机数(2)
      // 总长度: 业务码长度 + 19
      return `${businessCode}${timeStr}${sequence.toString().padStart(5, '0')}${random}`;
    } catch (error) {
      console.error('生成订单号失败:', error.message);
      throw error;
    }
  }

  /**
   * 获取当前序列号状态（用于监控）
   */
  getSequenceStatus() {
    this.checkAndResetSequence();

    const status = {};
    for (const [businessCode, sequence] of this.sequences) {
      status[businessCode] = {
        sequence,
        date: this.currentDate,
        remaining: 99999 - sequence
      };
    }
    return status;
  }

  /**
   * 手动重置序列号（用于测试或特殊情况）
   */
  resetSequences() {
    this.sequences.clear();
    this.currentDate = this.getCurrentDateString();
    console.log('所有业务序列号已重置');
  }
}

export default new OrderIdGenerator()