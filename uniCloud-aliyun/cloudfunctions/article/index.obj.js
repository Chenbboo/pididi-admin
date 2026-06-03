// 攻略文章云对象
const db = uniCloud.database()
const cmd = db.command

module.exports = {
  _before: function () {
    // clientInfo 包含平台、设备信息
  },

  /**
   * 获取文章列表（分页 + 分类 + 排序）
   * @param {Object} params
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页条数
   * @param {string} params.category - 分类筛选
   * @param {string} params.sort - 排序：latest | hot
   */
  async list(params = {}) {
    const { page = 1, pageSize = 10, category, sort = 'latest' } = params
    const skip = (page - 1) * pageSize

    const where = { status: 'published' }
    if (category && category !== '全部') {
      where.category = category
    }

    const orderBy = sort === 'hot' ? { views: 'desc' } : { publish_date: 'desc' }

    const [listResult, countResult] = await Promise.all([
      db.collection('articles')
        .where(where)
        .orderBy(orderBy)
        .skip(skip)
        .limit(pageSize)
        .field('_id,title,category,cover,summary,views,collects,publish_date')
        .get(),
      db.collection('articles')
        .where(where)
        .count()
    ])

    return {
      list: listResult.data,
      total: countResult.total,
      page,
      pageSize,
      hasMore: skip + pageSize < countResult.total
    }
  },

  /**
   * 获取文章详情
   * @param {string} params.id - 文章ID
   */
  async detail(params = {}) {
    const { id } = params
    const result = await db.collection('articles')
      .doc(id)
      .get()

    if (!result.data || result.data.length === 0) {
      return { errCode: 404, errMsg: '文章不存在' }
    }

    // 更新浏览量
    await db.collection('articles')
      .doc(id)
      .update({
        views: cmd.inc(1)
      })

    return result.data[0]
  },

  /**
   * 获取热门文章
   * @param {number} params.limit - 条数
   */
  async hot(params = {}) {
    const { limit = 6 } = params
    const result = await db.collection('articles')
      .where({ status: 'published' })
      .orderBy({ views: 'desc' })
      .limit(limit)
      .field('_id,title,category,cover,summary,views,collects,publish_date')
      .get()

    return result.data
  },

  /**
   * 搜索文章
   * @param {string} params.keyword - 搜索关键词
   */
  async search(params = {}) {
    const { keyword, page = 1, pageSize = 20 } = params
    const skip = (page - 1) * pageSize

    const result = await db.collection('articles')
      .where({
        status: 'published',
        $or: [
          { title: new RegExp(keyword, 'i') },
          { summary: new RegExp(keyword, 'i') }
        ]
      })
      .orderBy({ publish_date: 'desc' })
      .skip(skip)
      .limit(pageSize)
      .field('_id,title,category,cover,summary,views,collects,publish_date')
      .get()

    return { list: result.data, keyword }
  }
}
