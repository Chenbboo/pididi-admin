// 用户收藏云对象
const db = uniCloud.database()
const cmd = db.command

module.exports = {
  _before: function () {
    const uid = this.getUniIdToken()
    if (!uid) throw new Error('请先登录')
  },

  /**
   * 获取用户收藏列表
   */
  async list(params = {}) {
    const { page = 1, pageSize = 20 } = params
    const uid = this.getUniIdToken()
    const skip = (page - 1) * pageSize

    const result = await db.collection('user_collections')
      .where({ user_id: uid })
      .orderBy({ create_date: 'desc' })
      .skip(skip)
      .limit(pageSize)
      .get()

    // 关联查询文章信息
    if (result.data.length > 0) {
      const articleIds = result.data.map(item => item.article_id)
      const articles = await db.collection('articles')
        .where({ _id: cmd.in(articleIds) })
        .field('_id,title,category,cover,summary,views,collects')
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
   * 切换收藏状态
   * @param {string} params.article_id - 文章ID
   */
  async toggle(params = {}) {
    const { article_id } = params
    const uid = this.getUniIdToken()

    if (!article_id) throw new Error('缺少文章ID')

    // 查询是否已收藏
    const exist = await db.collection('user_collections')
      .where({ user_id: uid, article_id })
      .get()

    if (exist.data.length > 0) {
      // 取消收藏
      await db.collection('user_collections')
        .doc(exist.data[0]._id)
        .remove()

      await db.collection('articles')
        .doc(article_id)
        .update({ collects: cmd.inc(-1) })

      return { collected: false }
    } else {
      // 添加收藏
      await db.collection('user_collections')
        .add({ user_id: uid, article_id, create_date: Date.now() })

      await db.collection('articles')
        .doc(article_id)
        .update({ collects: cmd.inc(1) })

      return { collected: true }
    }
  },

  /**
   * 检查某篇文章是否已收藏
   * @param {string} params.article_id - 文章ID
   */
  async check(params = {}) {
    const { article_id } = params
    const uid = this.getUniIdToken()

    const exist = await db.collection('user_collections')
      .where({ user_id: uid, article_id })
      .count()

    return { collected: exist.total > 0 }
  }
}
