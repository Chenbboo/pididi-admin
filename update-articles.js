const sdk = require('J:/PiDiDi小程序/开发工具/HBuilderX/plugins/unicloud/node_modules/@alicloud/mpserverless-node-sdk/dist/index.js')
const client = new sdk.default({
  endpoint: 'https://api.next.bspapp.com',
  spaceId: 'mp-1d2de47f-aa8c-41d0-8cbc-f88bb18923ad',
  clientSecret: 'MmBX5nRa3yBziaje1cKdlw==',
  timeout: 30000,
})

async function main() {
  try {
    // Get all articles
    const res = await client.database.collection('articles').where({}).get()
    const list = res.data || []
    console.log(`Found ${list.length} articles`)

    for (const a of list) {
      await client.database.collection('articles').doc(a._id).update({
        status: 'published',
        views: a.views || Math.floor(Math.random() * 3000) + 500,
        collects: a.collects || Math.floor(Math.random() * 150) + 20,
      })
      console.log(`Updated: ${a.title}`)
    }
    console.log(`Done! Published ${list.length} articles`)
  } catch (e) {
    console.error('Error:', e.message || e)
  }
}
main()
