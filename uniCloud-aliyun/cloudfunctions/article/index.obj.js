// 攻略文章云对象
const db = uniCloud.database()
const cmd = db.command

module.exports = {
  _before: function () {
    // clientInfo 包含平台、设备信息
  },

  /**
   * 创建文章
   */
  async create(params = {}) {
    const { title, category, cover, summary, content } = params
    if (!title || !category) return { errCode: 400, errMsg: '标题和分类不能为空' }

    const result = await db.collection('articles').add({
      title,
      category,
      cover: cover || '',
      summary: summary || '',
      content: content || '',
      views: 0,
      collects: 0,
      status: 'published',
      publish_date: Date.now(),
    })

    return { _id: result.id, ok: true }
  },

  /**
   * 插入种子数据（仅首次使用）
   */
  async seed() {
    const exist = await db.collection('articles').count()
    if (exist.total > 0) return { ok: false, msg: '数据库已有数据，跳过种子注入' }

    const articles = [
      { title: '胡志明市顶级酒店盘点 | 住在传奇里', category: '目的地攻略', summary: '从西贡柏悦到西贡万韵，每一家酒店都有独特的故事', content: '<p>胡志明市（西贡）的顶级酒店不仅是一处下榻之所，更是这座城市百年殖民历史与法式优雅的缩影。</p><p>从西贡柏悦（Park Hyatt Saigon）的经典殖民风格到西贡万韵酒店（The Reverie Saigon）的极致奢华，每一家酒店都有独特的故事。</p><p>推荐入住西贡柏悦的总统套房，私人管家服务，顶楼泳池俯瞰城市天际线。</p>' },
      { title: '西贡 rooftop 酒吧指南 | 法式风情夜', category: '主题玩法', summary: '俯瞰西贡天际线，从黄昏到凌晨的微醺之旅', content: '<p>西贡的rooftop酒吧文化是这座城市夜生活的灵魂。从Bitexco金融塔到Saigon Prince酒店，每一处都有独特的风景。</p><p>推荐Chill Skybar——位于AB Tower顶楼，360度无遮挡视野，是观赏西贡日落的最佳位置。</p>' },
      { title: '胡志明市 3 天深度游 | 东方巴黎', category: '行程规划', summary: '三天三夜，玩转西贡精华', content: '<p>Day 1：抵达胡志明市 → 入住柏悦酒店 → 下午步行参观歌剧院、圣母大教堂、中央邮局 → 晚上Chill Skybar。</p><p>Day 2：上午古芝地道半日游 → 下午濱城市場购物 → 晚上越南米其林餐厅Anan Saigon。</p><p>Day 3：上午私人定制SPA → 下午自由活动 → 傍晚送机。</p>' },
      { title: '越南电子签全流程 | VIP加急通道', category: '出行攻略', summary: '保姆级电子签申请指南，最快4小时出签', content: '<p>越南电子签（E-Visa）适用于46个国家，单次入境最长90天。</p><p>申请流程：访问 https://evisa.xuatnhapcanh.gov.vn → 填写个人信息 → 上传护照扫描件和照片 → 支付25美元 → 等待3-5个工作日。</p><p>如需加急，可联系VIP通道，最快4小时出签。</p>' },
      { title: '胡志明市避坑指南 | 这些东西别碰', category: '避坑指南', summary: '常见的坑和骗局，帮你省心省钱', content: '<p>1. 机场换汇汇率很差，建议用ATM取现或提前在市区换。</p><p>2. 街头"免费"椰子水要收费，直接拒绝。</p><p>3. 摩托车上手机不要拿在手上，飞车抢夺是真实存在的。</p><p>4. Grab打车比出租车便宜且透明，必装。</p>' },
      { title: '西贡咖啡文化 | 从街头到精品', category: '本地文化', summary: '一杯滴漏咖啡，品出百年西贡味道', content: '<p>越南是世界上第二大咖啡出口国，咖啡文化深入骨髓。</p><p>街头随处可见的小板凳咖啡馆是西贡最真实的风景。推荐尝试：cà phê sữa đá（冰奶咖啡）和 cà phê trứng（鸡蛋咖啡）。</p><p>精品推荐：The Workshop Coffee，隐藏在狭窄楼道里的三层loft空间，手冲单品豆品质一流。</p>' },
      { title: '越南米其林餐厅盘点 | 舌尖上的西贡', category: '主题玩法', summary: '2026越南米其林指南，从街头到星级', content: '<p>2026年越南米其林指南新增多家餐厅。胡志明市的Anan Saigon是唯一获得一星的餐厅，主厨Peter Cuong Franklin将越南街头美食提升到fine dining高度。</p><p>必比登推荐：Bánh Mì Huynh Hoa——号称全越南最好吃的法棍三明治，凌晨3点就开始排队。</p>' },
      { title: '岘港洲际酒店 | 藏在山茶半岛的奢华', category: '目的地攻略', summary: '全球最美洲际，没有之一', content: '<p>岘港洲际酒店（InterContinental Danang Sun Peninsula Resort）坐落在山茶半岛的私人海湾，由建筑师Bill Bensley设计。</p><p>酒店拥有197间客房，每间都能看到海景。标志性的缆车连接海滩和山顶餐厅Citron。</p><p>价格：经典海景房约$400/晚起，空中别墅$2000/晚起。</p>' },
      { title: '会安古镇 | 灯笼与月光的千年之约', category: '目的地攻略', summary: '不到会安，不算到过越南', content: '<p>会安（Hoi An）是越南保存最完好的古镇，也是联合国教科文组织世界文化遗产。</p><p>每逢农历十四，全镇熄灯，只留灯笼。秋盆河上飘满水灯，是拍照最美的时刻。</p><p>必体验：定制一套会安丝绸、学做越南菜、骑自行车穿过稻田。</p>' },
      { title: '芽庄潜水全攻略 | 越南的马尔代夫', category: '主题玩法', summary: '果冻海、珊瑚礁、越南最佳潜水地', content: '<p>芽庄拥有越南最美的海滩和最佳的潜水条件。最佳潜水季节是3月-9月，能见度可达30米。</p><p>推荐潜点：Hon Mun岛海洋保护区，有超过350种珊瑚和150种鱼类。</p><p>浮潜体验约$25/人，PADI考证课程约$350/人。</p>' },
    ]

    const inserts = articles.map(a => ({
      ...a,
      views: Math.floor(Math.random() * 3000) + 500,
      collects: Math.floor(Math.random() * 150) + 20,
      status: 'published',
      publish_date: Date.now() - Math.floor(Math.random() * 30 * 86400000),
    }))

    for (const article of inserts) {
      await db.collection('articles').add(article)
    }

    return { ok: true, count: inserts.length }
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
