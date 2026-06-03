<template>
  <view class="page">
    <view class="header">
      <text class="title">CTA 触点配置</text>
      <text class="desc">四个转化入口的二维码和文案管理</text>
    </view>

    <view v-if="loading" class="loading">加载中...</view>

    <view v-else class="grid">
      <view v-for="item in list" :key="item._id" class="card" @click="goEdit(item._id)">
        <view class="card-header">
          <text class="position">CTA-{{ item.position }}</text>
          <text class="status" :class="{ active: item.is_active }">{{ item.is_active ? '已启用' : '已停用' }}</text>
        </view>
        <text class="card-text">{{ item.text || '未设置文案' }}</text>
        <view class="card-pos-label">{{ positionLabel(item.position) }}</view>
        <image v-if="item.qr_code_url" :src="item.qr_code_url" class="qr-preview" mode="aspectFit" />
        <view v-else class="qr-empty">未上传二维码</view>
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
    positionLabel(pos) {
      const map = { A: '攻略底部固定条', B: '攻略文中插入卡片', C: '专属定制独立页', D: '浏览弹窗' }
      return map[pos] || pos
    },
    async fetchList() {
      this.loading = true
      try {
        const res = await db.collection('cta_config').get()
        this.list = res.result.data || []
      } catch (e) {
        uni.showToast({ title: '加载失败', icon: 'none' })
      }
      this.loading = false
    },
    goEdit(id) {
      uni.navigateTo({ url: `/pages/cta/edit?id=${id}` })
    },
  },
}
</script>

<style scoped>
.page { padding: 20px; background: #f5f5f5; min-height: 100vh; }
.header { margin-bottom: 20px; }
.title { font-size: 22px; font-weight: bold; display: block; }
.desc { font-size: 13px; color: #999; margin-top: 4px; display: block; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.card { background: #fff; border-radius: 10px; padding: 16px; cursor: pointer; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.position { font-size: 18px; font-weight: bold; color: #333; }
.status { font-size: 12px; padding: 2px 10px; border-radius: 10px; background: #eee; color: #999; }
.status.active { background: #e8f5e9; color: #2e7d32; }
.card-text { font-size: 13px; color: #666; display: block; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.card-pos-label { font-size: 12px; color: #999; display: block; margin-bottom: 8px; }
.qr-preview { width: 80px; height: 80px; margin-top: 8px; border-radius: 6px; background: #f5f5f5; }
.qr-empty { width: 80px; height: 80px; margin-top: 8px; border-radius: 6px; border: 1px dashed #ddd; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #ccc; }
.loading { text-align: center; padding: 60px 0; color: #999; }
</style>
