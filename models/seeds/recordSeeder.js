const Record = require('../record')
const db = require('../../config/mongoose')

db.once('open', () => {
  const promises = []
  promises.push(
    Record.create(
      {
        name: '午餐',
        category: '餐飲食品',
        date: '2020-11-08',
        amount: 60,
        icon: '<i class="fas fa-utensils"></i>',
        merchant: '麥當勞'
      },
      {
        name: '電影',
        category: '休閒娛樂',
        date: '2020-11-06',
        amount: 300,
        icon: '<i class="fas fa-grin-beam"></i>',
        merchant: '威秀影城'
      },
      {
        name: '捷運',
        category: '交通出行',
        date: '2020-11-05',
        amount: 40,
        icon: '<i class="fas fa-shuttle-van"></i>',
        merchant: '捷運'
      },
      {
        name: '租金',
        category: '家居物業',
        date: '2020-11-05',
        amount: 10000,
        icon: '<i class="fas fa-home"></i>',
        merchant: '房東'
      },
      {
        name: '交際應酬',
        category: '其他',
        date: '2020-11-03',
        amount: 450,
        icon: '<i class="fas fa-hand-holding-usd"></i>',
        merchant: '吃到飽'
      }
    )
  )
  Promise.all(promises).then(() => {
    console.log('Record seed done!')
    db.close()
  })
})