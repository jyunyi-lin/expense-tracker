const mongoose = require('mongoose')
const Schema = mongoose.Schema

// add new Schema
const recordSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    min: [1, '至少輸入 1 元'],
    required: true
  },
  icon: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  }
})

// Export module
module.exports = mongoose.model('Record', recordSchema)