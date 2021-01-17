const mongoose = require('mongoose')
const db = mongoose.connection

// 連線資料庫
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
db.on('error', () => console.error('MongoDB error 0_0'))
db.once('open', () => console.log('MongoDB connected!'))

module.exports = db