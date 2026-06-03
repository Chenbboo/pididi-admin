// CTA 配置云对象
const db = uniCloud.database()

module.exports = {
  /**
   * 获取所有启用的 CTA 配置
   */
  async get(params = {}) {
    const result = await db.collection('cta_config')
      .where({ enabled: true })
      .orderBy({ type: 'asc' })
      .get()

    return result.data
  },

  /**
   * 获取指定类型的 CTA 配置
   * @param {string} params.type - CTA类型：A|B|C|D
   */
  async getByType(params = {}) {
    const { type } = params
    const result = await db.collection('cta_config')
      .where({ type, enabled: true })
      .get()

    return result.data[0] || null
  }
}
