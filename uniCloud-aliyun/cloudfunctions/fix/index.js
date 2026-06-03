'use strict'
const db = uniCloud.database()
module.exports = async function() {
  const res = await db.collection('articles').get()
  const list = res.data || []
  let count = 0
  for (const a of list) {
    await db.collection('articles').doc(a._id).update({
      status: 'published',
      views: a.views || Math.floor(Math.random() * 3000) + 500,
      collects: a.collects || Math.floor(Math.random() * 150) + 20,
    })
    count++
  }
  return { ok: true, count }
}
