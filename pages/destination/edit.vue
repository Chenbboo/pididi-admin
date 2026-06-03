<template>
  <view class="page">
    <view class="header">
      <text class="title">{{ isEdit ? '编辑目的地' : '新建目的地' }}</text>
      <button size="mini" @click="doSave">保存</button>
    </view>

    <view class="form">
      <view class="form-item">
        <text class="label">名称</text>
        <input v-model="form.name" class="input" placeholder="目的地中文名" />
      </view>

      <view class="form-item">
        <text class="label">英文名</text>
        <input v-model="form.name_en" class="input" placeholder="英文名（可选）" />
      </view>

      <view class="form-item">
        <text class="label">区域</text>
        <picker mode="selector" :range="regions" @change="e => form.region = regions[e.detail.value]">
          <view class="picker">{{ form.region || '请选择区域' }}</view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">封面图</text>
        <view class="upload-box" @click="doUpload">
          <image v-if="form.cover_image" :src="form.cover_image" class="cover-preview" />
          <text v-else class="upload-text">点击上传封面图</text>
        </view>
      </view>

      <view class="form-item">
        <text class="label">简介</text>
        <textarea v-model="form.description" class="textarea" placeholder="目的地简介（最多500字）" :maxlength="500" />
      </view>

      <view class="form-item">
        <text class="label">最佳季节</text>
        <input v-model="form.best_season" class="input" placeholder="如：11月-次年4月" />
      </view>

      <view class="form-item">
        <text class="label">排序</text>
        <input v-model.number="form.sort_order" class="input" type="number" placeholder="数字越小越靠前" />
      </view>
    </view>
  </view>
</template>

<script>
const db = uniCloud.database()

export default {
  data() {
    return {
      isEdit: false,
      editId: '',
      form: { name: '', name_en: '', region: '', cover_image: '', description: '', best_season: '', sort_order: 0 },
      regions: ['北部', '中部', '南部'],
    }
  },
  async onLoad(options) {
    if (options.id) {
      this.isEdit = true
      this.editId = options.id
      const res = await db.collection('destinations').doc(options.id).get()
      if (res.result.data && res.result.data.length > 0) {
        this.form = { ...this.form, ...res.result.data[0] }
      }
    }
  },
  methods: {
    doUpload() {
      uni.chooseImage({
        count: 1,
        success: async (res) => {
          uni.showLoading({ title: '上传中...' })
          try {
            const result = await uniCloud.uploadFile({
              filePath: res.tempFilePaths[0],
              cloudPath: `destinations/${Date.now()}.jpg`,
            })
            this.form.cover_image = result.fileID
          } catch (e) { uni.showToast({ title: '上传失败', icon: 'none' }) }
          uni.hideLoading()
        },
      })
    },
    async doSave() {
      if (!this.form.name || !this.form.region) {
        uni.showToast({ title: '请填写名称和区域', icon: 'none' })
        return
      }
      uni.showLoading({ title: '保存中...' })
      try {
        if (this.isEdit) {
          await db.collection('destinations').doc(this.editId).update(this.form)
        } else {
          this.form.create_time = Date.now()
          await db.collection('destinations').add(this.form)
        }
        uni.showToast({ title: '保存成功', icon: 'success' })
        setTimeout(() => uni.navigateBack(), 1000)
      } catch (e) { uni.showToast({ title: '保存失败', icon: 'none' }) }
      uni.hideLoading()
    },
  },
}
</script>

<style scoped>
.page { padding: 16px; background: #f5f5f5; min-height: 100vh; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.title { font-size: 20px; font-weight: bold; }
.form { background: #fff; border-radius: 8px; padding: 16px; }
.form-item { margin-bottom: 16px; }
.label { display: block; font-size: 14px; color: #666; margin-bottom: 8px; }
.input { border: 1px solid #e0e0e0; border-radius: 6px; padding: 8px 12px; font-size: 14px; }
.picker { border: 1px solid #e0e0e0; border-radius: 6px; padding: 8px 12px; font-size: 14px; color: #333; }
.textarea { border: 1px solid #e0e0e0; border-radius: 6px; padding: 8px 12px; font-size: 14px; height: 100px; width: 100%; }
.upload-box { border: 1px dashed #ccc; border-radius: 6px; height: 120px; display: flex; align-items: center; justify-content: center; }
.upload-text { color: #999; font-size: 14px; }
.cover-preview { width: 100%; height: 100%; object-fit: cover; border-radius: 6px; }
</style>
