const sdk = require('J:/PiDiDi小程序/开发工具/HBuilderX/plugins/unicloud/node_modules/@alicloud/mpserverless-node-sdk/dist/index.js')
const client = new sdk.default({
  endpoint: 'https://api.next.bspapp.com',
  spaceId: 'mp-1d2de47f-aa8c-41d0-8cbc-f88bb18923ad',
  clientSecret: 'MmBX5nRa3yBziaje1cKdlw==',
  timeout: 30000,
})

async function main() {
  try {
    // 检查文章数量
    const r = await client.function.invoke({ name: 'article', method: 'list', params: {} })
    console.log('Articles:', JSON.stringify(r, null, 2))
  } catch(e) {
    console.error('Error:', e.message)
  }
}
main()
