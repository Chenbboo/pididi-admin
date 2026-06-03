// 目的地云对象
const db = uniCloud.database()

module.exports = {
  /**
   * 种子数据
   */
  async seed() {
    const exist = await db.collection('destinations').count()
    if (exist.total > 0) return { ok: false, msg: '已有数据' }
    const list = [
      { name: '胡志明市', name_en: 'Ho Chi Minh City', region: '南部', summary: '越南的经济中心，东方巴黎，高端旅游门户', article_count: 0, sort: 1, status: 'active' },
      { name: '河内', name_en: 'Hanoi', region: '北部', summary: '千年古都，法式殖民风情与东方韵味交织', article_count: 0, sort: 2, status: 'active' },
      { name: '岘港', name_en: 'Da Nang', region: '中部', summary: '最美海岸线，顶级度假酒店聚集地', article_count: 0, sort: 3, status: 'active' },
      { name: '芽庄', name_en: 'Nha Trang', region: '南部', summary: '果冻海、潜水圣地、海岛度假天堂', article_count: 0, sort: 4, status: 'active' },
      { name: '会安', name_en: 'Hoi An', region: '中部', summary: '世界文化遗产古镇，灯笼与月光之城', article_count: 0, sort: 5, status: 'active' },
      { name: '富国岛', name_en: 'Phu Quoc', region: '南部', summary: '越南最大岛屿，奢华海岛度假', article_count: 0, sort: 6, status: 'active' },
      { name: '大叻', name_en: 'Da Lat', region: '中部高地', summary: '高原避暑胜地，法式别墅与花城', article_count: 0, sort: 7, status: 'active' },
      { name: '沙坝', name_en: 'Sapa', region: '北部', summary: '梯田、番西邦峰、少数民族文化', article_count: 0, sort: 8, status: 'active' },
    ]
    for (const d of list) await db.collection('destinations').add(d)
    return { ok: true, count: list.length }
  },

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
