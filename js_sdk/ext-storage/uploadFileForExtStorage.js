// ext-storage 上传适配（stub: 使用内置存储）
export default {
  init(options = {}) {
    // 设置 uniCloud.uploadFile 使用内置存储
    const oldUpload = uniCloud.uploadFile
    uniCloud.uploadFile = async function(opts) {
      return oldUpload.call(uniCloud, opts)
    }
  }
}
