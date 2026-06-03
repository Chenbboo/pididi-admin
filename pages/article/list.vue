<template>
  <view class="page">
    <view class="header">
      <text class="title">攻略管理</text>
      <button type="primary" size="mini" @click="goCreate">新建攻略</button>
    </view>

    <view class="filters">
      <picker mode="selector" :range="categoryOptions" @change="onCategoryChange">
        <view class="filter-item">{{ currentCategory || '全部分类' }}</view>
      </picker>
      <picker mode="selector" :range="statusOptions" @change="onStatusChange">
        <view class="filter-item">{{ currentStatus || '全部状态' }}</view>
      </picker>
    </view>

    <view v-if="loading" class="loading">加载中...</view>

    <view v-else class="list">
      <view v-for="item in list" :key="item._id" class="card">
        <image v-if="item.cover_image" :src="item.cover_image" class="card-cover" mode="aspectFill" />
        <view class="card-body">
          <view class="card-header">
            <text class="card-title">{{ item.title }}</text>
            <text class="card-status" :class="item.status">{{ item.status === 'published' ? '已发布' : '草稿' }}</text>
          </view>
          <view class="card-meta">
            <text>{{ item.category }}</text>
            <text>👁 {{ item.view_count || 0 }}</text>
            <text>❤ {{ item.collect_count || 0 }}</text>
          </view>
          <view class="card-actions">
            <button size="mini" @click="goEdit(item._id)">编辑</button>
            <button size="mini" type="warn" @click="doDelete(item._id)">删除</button>
          </view>
        </view>
      </view>
    </view>

    <view v-if="!loading && list.length === 0" class="empty">
      <text>暂无攻略，点击上方新建</text>
    </view>
  </view>
</template>

<script>
const db = uniCloud.database()

export default {
  data() {
    return {
      list: [],
      loading: true,
      currentCategory: '',
      currentStatus: '',
      categoryOptions: ['全部', '目的地攻略', '主题玩法', '行程规划', '出行攻略', '避坑指南', '本地文化'],
      statusOptions: ['全部', '草稿', '已发布'],
    }
  },
  onShow() {
    this.fetchList()
  },
  methods: {
    async fetchList() {
      this.loading = true
      try {
        const res = await db.collection('articles').orderBy('create_time', 'desc').get()
        this.list = res.result.data || []
      } catch (e) {
        uni.showToast({ title: '加载失败', icon: 'none' })
      }
      this.loading = false
    },
    goCreate() {
      uni.navigateTo({ url: '/pages/article/edit' })
    },
    goEdit(id) {
      uni.navigateTo({ url: `/pages/article/edit?id=${id}` })
    },
    async doDelete(id) {
      const res = await uni.showModal({ title: '确认删除', content: '删除后不可恢复' })
      if (res.confirm) {
        await db.collection('articles').doc(id).remove()
        uni.showToast({ title: '已删除', icon: 'success' })
        this.fetchList()
      }
    },
    onCategoryChange(e) {
      this.currentCategory = this.categoryOptions[e.detail.value]
    },
    onStatusChange(e) {
      this.currentStatus = this.statusOptions[e.detail.value]
    },
  },
}
</script>

<style scoped>
.page { padding: 16px; background: #f5f5f5; min-height: 100vh; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.title { font-size: 20px; font-weight: bold; }
.filters { display: flex; gap: 12px; margin-bottom: 16px; }
.filter-item { padding: 6px 12px; background: #fff; border-radius: 6px; font-size: 14px; }
.card { background: #fff; border-radius: 8px; overflow: hidden; margin-bottom: 12px; }
.card-cover { width: 100%; height: 140px; background: #eee; }
.card-body { padding: 12px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-title { font-size: 16px; font-weight: 500; flex: 1; }
.card-status { font-size: 12px; padding: 2px 8px; border-radius: 4px; }
.card-status.published { background: #e8f5e9; color: #2e7d32; }
.card-status.draft { background: #fff3e0; color: #e65100; }
.card-meta { display: flex; gap: 16px; margin-top: 8px; font-size: 12px; color: #999; }
.card-actions { display: flex; gap: 8px; margin-top: 12px; justify-content: flex-end; }
.loading, .empty { text-align: center; padding: 40px 0; color: #999; }
</style>
