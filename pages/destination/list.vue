<template>
  <view class="page">
    <view class="header">
      <text class="title">目的地管理</text>
      <button type="primary" size="mini" @click="goCreate">新建目的地</button>
    </view>

    <view v-if="loading" class="loading">加载中...</view>

    <view v-else class="list">
      <view v-for="item in list" :key="item._id" class="card">
        <image v-if="item.cover_image" :src="item.cover_image" class="card-cover" mode="aspectFill" />
        <view class="card-body">
          <text class="card-title">{{ item.name }} <text class="name-en">{{ item.name_en }}</text></text>
          <text class="card-region">{{ item.region }}</text>
          <text class="card-desc">{{ item.description }}</text>
          <view class="card-actions">
            <button size="mini" @click="goEdit(item._id)">编辑</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const db = uniCloud.database()

export default {
  data() {
    return { list: [], loading: true }
  },
  onShow() {
    this.fetchList()
  },
  methods: {
    async fetchList() {
      this.loading = true
      const res = await db.collection('destinations').orderBy('sort_order', 'asc').get()
      this.list = res.result.data || []
      this.loading = false
    },
    goCreate() {
      uni.navigateTo({ url: '/pages/destination/edit' })
    },
    goEdit(id) {
      uni.navigateTo({ url: `/pages/destination/edit?id=${id}` })
    },
  },
}
</script>

<style scoped>
.page { padding: 16px; background: #f5f5f5; min-height: 100vh; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.title { font-size: 20px; font-weight: bold; }
.card { background: #fff; border-radius: 8px; overflow: hidden; margin-bottom: 12px; }
.card-cover { width: 100%; height: 120px; background: #eee; }
.card-body { padding: 12px; }
.card-title { font-size: 16px; font-weight: 500; }
.name-en { font-size: 12px; color: #999; margin-left: 8px; }
.card-region { display: inline-block; font-size: 12px; background: #e3f2fd; color: #1565c0; padding: 2px 8px; border-radius: 4px; margin-top: 6px; }
.card-desc { display: block; font-size: 13px; color: #666; margin-top: 8px; line-height: 1.5; }
.card-actions { display: flex; gap: 8px; margin-top: 12px; justify-content: flex-end; }
.loading { text-align: center; padding: 40px 0; color: #999; }
</style>
