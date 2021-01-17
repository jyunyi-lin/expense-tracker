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
  Category.find({ "title": `${expense.category}` })
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
  Category.find({ "title": `${updated.category}` })
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


// 類別篩選
router.get('/', (req, res) => {
  const filter = req.query.filter
  if (filter.length === 0) { return res.redirect('/') }
  Record.find({ category: `${req.query.filter}` })
    .lean()
    .then(records => {
      let totalAmount = 0
      for (let i = 0; i < records.length; i++) {
        totalAmount += Number(records[i].amount)
      }
      res.render('index', { records, totalAmount, filter })
    })
    .catch(error => console.log(error))
})


module.exports = router