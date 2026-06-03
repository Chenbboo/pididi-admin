// 浏览历史云对象
const db = uniCloud.database()
const cmd = db.command

module.exports = {
  _before: function () {
    const uid = this.getUniIdToken()
    if (!uid) throw new Error('请先登录')
  },

  /**
   * 获取浏览历史列表
   */
  async list(params = {}) {
    const { page = 1, pageSize = 20 } = params
    const uid = this.getUniIdToken()
    const skip = (page - 1) * pageSize

    const result = await db.collection('browse_history')
      .where({ user_id: uid })
      .orderBy({ browse_time: 'desc' })
      .skip(skip)
      .limit(pageSize)
      .get()

    if (result.data.length > 0) {
      const articleIds = result.data.map(item => item.article_id)
      const articles = await db.collection('articles')
        .where({ _id: cmd.in(articleIds) })
        .field('_id,title,category,cover,summary')
        .get()

      const articleMap = {}
      articles.data.forEach(a => { articleMap[a._id] = a })

      return result.data.map(item => ({
        ...item,
        article: articleMap[item.article_id] || null
      }))
    }

    return []
  },

  /**
   * 记录浏览
   * @param {string} params.article_id - 文章ID
   */
  async record(params = {}) {
    const { article_id } = params
    const uid = this.getUniIdToken()

    if (!article_id) throw new Error('缺少文章ID')

    const now = Date.now()
    const exist = await db.collection('browse_history')
      .where({ user_id: uid, article_id })
      .get()

    if (exist.data.length > 0) {
      await db.collection('browse_history')
        .doc(exist.data[0]._id)
        .update({ browse_time: now })
    } else {
      await db.collection('browse_history')
        .add({ user_id: uid, article_id, browse_time: now })
    }

    return { ok: true }
  }
}
