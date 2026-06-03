// uni-admin Vue 插件
export default {
  install(app) {
    // uni-admin 全局功能
    app.config.globalProperties.$uniAdmin = {
      version: '1.0.0',
    }
  }
}
