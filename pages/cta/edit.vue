<template>
  <view class="page">
    <view class="header">
      <text class="title">编辑 CTA-{{ form.position }}</text>
      <text class="subtitle">{{ positionLabel(form.position) }}</text>
      <button size="mini" type="primary" @click="doSave">保存</button>
    </view>

    <view class="form">
      <view class="form-item">
        <text class="label">触点位置</text>
        <view class="readonly">{{ positionLabel(form.position) }}</view>
      </view>

      <view class="form-item">
        <text class="label">引导文案</text>
        <textarea v-model="form.text" class="textarea" placeholder="输入 CTA 引导文案" :maxlength="200" />
      </view>

      <view class="form-item">
        <text class="label">企微活码</text>
        <view class="upload-box" @click="doUpload">
          <image v-if="form.qr_code_url" :src="form.qr_code_url" class="cover-preview" />
          <text v-else class="upload-text">点击上传二维码</text>
        </view>
        <text class="hint">从企微后台获取活码，上传到这里</text>
      </view>

      <view class="form-item" v-if="form.position === 'D'">
        <text class="label">触发时间（秒）</text>
        <input v-model.number="form.trigger_seconds" class="input" type="number" placeholder="15" />
        <text class="hint">用户浏览多少秒后弹出</text>
      </view>

      <view class="form-item" v-if="form.position === 'D'">
        <text class="label">触发滚动位置（%）</text>
        <input v-model.number="form.trigger_scroll_percent" class="input" type="number" placeholder="60" />
        <text class="hint">用户滑到页面百分之多少时弹出</text>
      </view>

      <view class="form-item">
        <text class="label">启用状态</text>
        <switch :checked="form.is_active" @change="e => form.is_active = e.detail.value" />
      </view>
    </view>
  </view>
</template>

<script>
const db = uniCloud.database()

export default {
  data() {
    return {
      editId: '',
      form: {
        position: '',
        text: '',
        qr_code_url: '',
        trigger_seconds: 15,
        trigger_scroll_percent: 60,
        is_active: true,
      },
    }
  },
  async onLoad(options) {
    if (options.id) {
      this.editId = options.id
      const res = await db.collection('cta_config').doc(options.id).get()
      if (res.result.data && res.result.data.length > 0) {
        this.form = { ...this.form, ...res.result.data[0] }
      }
    }
  },
  methods: {
    positionLabel(pos) {
      const map = {
        A: '攻略底部固定条',
        B: '攻略文中插入卡片',
        C: '专属定制独立页',
        D: '浏览弹窗',
      }
      return map[pos] || pos
    },
    doUpload() {
      uni.chooseImage({
        count: 1,
        success: async (res) => {
          uni.showLoading({ title: '上传中...' })
          try {
            const result = await uniCloud.uploadFile({
              filePath: res.tempFilePaths[0],
              cloudPath: `cta/${Date.now()}.png`,
            })
            this.form.qr_code_url = result.fileID
          } catch (e) { uni.showToast({ title: '上传失败', icon: 'none' }) }
          uni.hideLoading()
        },
      })
    },
    async doSave() {
      if (!this.form.text) {
        uni.showToast({ title: '请填写引导文案', icon: 'none' })
        return
      }
      uni.showLoading({ title: '保存中...' })
      try {
        await db.collection('cta_config').doc(this.editId).update(this.form)
        uni.showToast({ title: '保存成功', icon: 'success' })
        setTimeout(() => uni.navigateBack(), 1000)
      } catch (e) {
        uni.showToast({ title: '保存失败', icon: 'none' })
      }
      uni.hideLoading()
    },
  },
}
</script>

<style scoped>
.page { padding: 16px; background: #f5f5f5; min-height: 100vh; }
.header { margin-bottom: 20px; }
.title { font-size: 20px; font-weight: bold; display: block; }
.subtitle { font-size: 13px; color: #999; display: block; margin-bottom: 12px; }
.form { background: #fff; border-radius: 8px; padding: 16px; }
.form-item { margin-bottom: 16px; }
.label { display: block; font-size: 14px; color: #666; margin-bottom: 8px; }
.readonly { padding: 8px 12px; background: #f5f5f5; border-radius: 6px; font-size: 14px; color: #333; }
.input { border: 1px solid #e0e0e0; border-radius: 6px; padding: 8px 12px; font-size: 14px; }
.textarea { border: 1px solid #e0e0e0; border-radius: 6px; padding: 8px 12px; font-size: 14px; height: 80px; width: 100%; }
.upload-box { border: 1px dashed #ccc; border-radius: 6px; height: 120px; display: flex; align-items: center; justify-content: center; }
.upload-text { color: #999; font-size: 14px; }
.cover-preview { width: 100%; height: 100%; object-fit: contain; border-radius: 6px; }
.hint { font-size: 12px; color: #bbb; margin-top: 4px; display: block; }
</style>
