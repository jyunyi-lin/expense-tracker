const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  records: [{
    type: Schema.Types.ObjectId,
    ref: 'Record'
  }]
})

// Export module
module.exports = mongoose.model('Category', categorySchema)