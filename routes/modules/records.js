const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')


// 搜尋支出
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  Record.find()
    .lean()
    .then(list => {
      const records = list.filter(item => {
        return item.category.includes(keyword) ||
          item.name.toLowerCase().includes(keyword.toLowerCase())
      })
      let totalAmount = 0
      for (let i = 0; i < records.length; i++) {
        totalAmount += Number(records[i].amount)
      }
      return res.render('index', { records, keyword, totalAmount })
    })
    .catch(error => console.log(error))
})


// 新增明細
router.get('/new', (req, res) => {
  Category.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(categories => res.render('new', { categories }))
    .catch(error => console.error(error))
})
router.post('/new', (req, res) => {
  const expense = req.body
  expense.userId = req.user._id
  Category.find({ title: expense.category })
    .lean()
    .then(list => {
      expense.icon = list[0].icon
      return Record.create(expense)
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 編輯明細
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ _id, userId })
    .lean()
    .then(record => {
      Category.find() // for categories options
        .lean()
        .sort({ _id: 'asc' })
        .then(categories => res.render('edit', { record, categories }))
        .catch(error => console.error(error))
    })
})
router.put('/:id', (req, res) => {
  const updated = req.body
  const userId = req.user._id
  const _id = req.params.id
  Category.find({ title: updated.category })
    .lean()
    .then(list => { updated.icon = list[0].icon })
  return Record.findOne({ _id, userId })
    .then(record => {
      record = Object.assign(record, updated)
      return record.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 刪除明細
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ _id, userId })
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


// 類別、月份篩選
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id
    const category = req.query.category
    const month = req.query.month
    let records = await Record.find({ userId }).lean().sort({ date: 'asc' })
    let totalAmount = 0

    if (category) {
      records = (category === '全類別') ? records : records.filter(record => record.category === category)
    }

    if (month) {
      records = (month === '全月份') ? records : records.filter(record => (Number(new Date(record.date).getMonth()) + 1) === Number(month))
    }

    records.forEach(record => {
      totalAmount += record.amount
    })

    res.render('index', { records, totalAmount, month, category })

  } catch (err) {
    console.error(err)
  }
})


module.exports = router