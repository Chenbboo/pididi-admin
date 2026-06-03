// 种子数据脚本
const sdk = require('J:/PiDiDi小程序/开发工具/HBuilderX/plugins/unicloud/node_modules/@alicloud/mpserverless-node-sdk/dist/index.js')

const client = new sdk.default({
  endpoint: 'https://api.next.bspapp.com',
  spaceId: 'mp-1d2de47f-aa8c-41d0-8cbc-f88bb18923ad',
  clientSecret: 'MmBX5nRa3yBziaje1cKdlw==',
  timeout: 30000,
});

(async () => {
  try {
    const r1 = await client.function.invoke({
      name: 'article',
      method: 'seed',
      params: {},
    })
    console.log('article.seed:', JSON.stringify(r1))
    const r2 = await client.function.invoke({
      name: 'destination',
      method: 'seed',
      params: {},
    })
    console.log('destination.seed:', JSON.stringify(r2))
    console.log('Done!')
  } catch (e) {
    console.error(e)
  }
})()
