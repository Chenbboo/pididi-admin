<template>
  <view class="page">
    <view class="header">
      <text class="title">{{ isEdit ? '编辑攻略' : '新建攻略' }}</text>
      <button size="mini" @click="doSave">保存</button>
    </view>

    <view class="form">
      <view class="form-item">
        <text class="label">标题</text>
        <input v-model="form.title" class="input" placeholder="攻略标题" />
      </view>

      <view class="form-item">
        <text class="label">分类</text>
        <picker mode="selector" :range="categories" @change="onCategoryChange">
          <view class="picker">{{ form.category || '请选择分类' }}</view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">关联目的地</text>
        <picker mode="selector" :range="destNames" @change="onDestChange">
          <view class="picker">{{ currentDestName || '请选择目的地（可选）' }}</view>
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
        <text class="label">摘要</text>
        <textarea v-model="form.summary" class="textarea" placeholder="攻略摘要（选填，最多200字）" :maxlength="200" />
      </view>

      <view class="form-item">
        <text class="label">正文（富文本）</text>
        <editor
          class="editor"
          placeholder="开始写攻略..."
          @ready="onEditorReady"
          @input="onEditorInput"
        />
      </view>

      <view class="form-item">
        <text class="label">状态</text>
        <view class="status-switch">
          <view class="status-option" :class="{ active: form.status === 'draft' }" @click="form.status = 'draft'">草稿</view>
          <view class="status-option" :class="{ active: form.status === 'published' }" @click="form.status = 'published'">发布</view>
        </view>
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
      form: {
        title: '',
        category: '',
        destination_id: '',
        cover_image: '',
        summary: '',
        content: '',
        status: 'draft',
      },
      categories: ['目的地攻略', '主题玩法', '行程规划', '出行攻略', '避坑指南', '本地文化'],
      destinations: [],
      destNames: [],
      editorCtx: null,
    }
  },
  computed: {
    currentDestName() {
      const d = this.destinations.find(d => d._id === this.form.destination_id)
      return d ? d.name : ''
    },
  },
  async onLoad(options) {
    if (options.id) {
      this.isEdit = true
      this.editId = options.id
      await this.fetchArticle(options.id)
    }
    await this.fetchDestinations()
  },
  methods: {
    async fetchArticle(id) {
      const res = await db.collection('articles').doc(id).get()
      if (res.result.data && res.result.data.length > 0) {
        this.form = { ...this.form, ...res.result.data[0] }
      }
    },
    async fetchDestinations() {
      const res = await db.collection('destinations').get()
      this.destinations = res.result.data || []
      this.destNames = this.destinations.map(d => d.name)
    },
    onCategoryChange(e) {
      this.form.category = this.categories[e.detail.value]
    },
    onDestChange(e) {
      this.form.destination_id = this.destinations[e.detail.value]?._id || ''
    },
    doUpload() {
      uni.chooseImage({
        count: 1,
        success: async (res) => {
          uni.showLoading({ title: '上传中...' })
          try {
            const result = await uniCloud.uploadFile({
              filePath: res.tempFilePaths[0],
              cloudPath: `articles/${Date.now()}.jpg`,
            })
            this.form.cover_image = result.fileID
          } catch (e) {
            uni.showToast({ title: '上传失败', icon: 'none' })
          }
          uni.hideLoading()
        },
      })
    },
    onEditorReady() {
      uni.createSelectorQuery().select('.editor').context((res) => {
        this.editorCtx = res.context
        if (this.isEdit && this.form.content) {
          this.editorCtx.setContents({ html: this.form.content })
        }
      }).exec()
    },
    onEditorInput(e) {
      this.form.content = e.detail.html
    },
    async doSave() {
      if (!this.form.title || !this.form.category) {
        uni.showToast({ title: '请填写标题和分类', icon: 'none' })
        return
      }
      uni.showLoading({ title: '保存中...' })
      try {
        const data = {
          ...this.form,
          update_time: Date.now(),
        }
        if (this.isEdit) {
          await db.collection('articles').doc(this.editId).update(data)
        } else {
          data.create_time = Date.now()
          await db.collection('articles').add(data)
        }
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
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.title { font-size: 20px; font-weight: bold; }
.form { background: #fff; border-radius: 8px; padding: 16px; }
.form-item { margin-bottom: 16px; }
.label { display: block; font-size: 14px; color: #666; margin-bottom: 8px; }
.input { border: 1px solid #e0e0e0; border-radius: 6px; padding: 8px 12px; font-size: 14px; }
.picker { border: 1px solid #e0e0e0; border-radius: 6px; padding: 8px 12px; font-size: 14px; color: #333; }
.textarea { border: 1px solid #e0e0e0; border-radius: 6px; padding: 8px 12px; font-size: 14px; height: 80px; width: 100%; }
.editor { border: 1px solid #e0e0e0; border-radius: 6px; min-height: 300px; padding: 8px; }
.upload-box { border: 1px dashed #ccc; border-radius: 6px; height: 120px; display: flex; align-items: center; justify-content: center; }
.upload-text { color: #999; font-size: 14px; }
.cover-preview { width: 100%; height: 100%; object-fit: cover; border-radius: 6px; }
.status-switch { display: flex; gap: 12px; }
.status-option { padding: 8px 24px; border: 1px solid #e0e0e0; border-radius: 6px; font-size: 14px; }
.status-option.active { background: #2e7d32; color: #fff; border-color: #2e7d32; }
</style>
