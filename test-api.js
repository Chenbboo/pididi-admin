const sdk = require('J:/PiDiDi小程序/开发工具/HBuilderX/plugins/unicloud/node_modules/@alicloud/mpserverless-node-sdk/dist/index.js')

async function main() {
  const client = new sdk.default({
    endpoint: 'https://api.next.bspapp.com',
    spaceId: 'mp-1d2de47f-aa8c-41d0-8cbc-f88bb18923ad',
    clientSecret: 'MmBX5nRa3yBziaje1cKdlw==',
    timeout: 30000,
  })

  try {
    console.log('Testing article.hot()...')
    const r1 = await client.function.invoke({ name: 'article', method: 'hot', params: { limit: 3 } })
    console.log('article.hot result:', JSON.stringify(r1, null, 2))

    console.log('\nTesting article.list()...')
    const r2 = await client.function.invoke({ name: 'article', method: 'list', params: {} })
    console.log('article.list result:', JSON.stringify(r2, null, 2))
  } catch (e) {
    console.error('API ERROR:', e.message)
    console.error(e.stack)
  }
}

main()
