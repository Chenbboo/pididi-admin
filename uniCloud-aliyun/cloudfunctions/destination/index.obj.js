// 目的地云对象
const db = uniCloud.database()

module.exports = {
  /**
   * 获取目的地列表
   */
  async list(params = {}) {
    const result = await db.collection('destinations')
      .where({ status: 'active' })
      .orderBy({ sort: 'asc' })
      .field('_id,name,name_en,region,cover,summary,article_count')
      .get()

    return result.data
  },

  /**
   * 获取目的地详情
   * @param {string} params.id - 目的地ID
   */
  async detail(params = {}) {
    const { id } = params
    const result = await db.collection('destinations')
      .doc(id)
      .get()

    if (!result.data || result.data.length === 0) {
      return { errCode: 404, errMsg: '目的地不存在' }
    }

    return result.data[0]
  }
}
