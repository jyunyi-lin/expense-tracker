if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Record = require('../record')
const User = require('../user')
const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')

const SEED_USER = {
  name: 'user1',
  email: 'user1@example.com',
  password: '123'
}

db.once('open', () => {
  console.log('MongoDB connected recordSeeder!')
  const newUser = []

  const { name, email } = SEED_USER
  newUser.push(
    User.find({ email: SEED_USER.email })
      .then(user => {
        if (user.length !== 0) {
          return
        }
        return bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(SEED_USER.password, salt))
          .then(hash => {
            return User.create({ name, email, password: hash })
          })
      })
  )
  Promise.all(newUser).then(() => {
    const newRecord = []
    newRecord.push(
      User.findOne({ email })
        .then(user => {
          const userId = user._id
          return Record.create(
            {
              name: '早餐',
              category: '餐飲食品',
              date: '2020-06-11',
              amount: 120,
              merchant: '全家便利商店',
              icon: '<i class="fas fa-utensils"></i>',
              userId
            },
            {
              name: '午餐',
              category: '餐飲食品',
              date: '2020-06-10',
              amount: 300,
              merchant: '麥當勞',
              icon: '<i class="fas fa-utensils"></i>',
              userId
            },
            {
              name: '電影',
              category: '休閒娛樂',
              date: '2020-05-28',
              amount: 250,
              merchant: '威尼斯影城',
              icon: '<i class="fas fa-grin-beam"></i>',
              userId
            },
            {
              name: '加油',
              category: '交通出行',
              date: '2020-05-10',
              amount: 1200,
              merchant: '中油',
              icon: '<i class="fas fa-shuttle-van"></i>',
              userId
            },
            {
              name: '房租',
              category: '家居物業',
              date: '2020-04-25',
              amount: 12000,
              merchant: '其他',
              icon: '<i class="fas fa-home"></i>',
              userId
            }
          )
        })
    )
    Promise.all(newRecord).then(item => {
      process.exit()
    })
  })
})