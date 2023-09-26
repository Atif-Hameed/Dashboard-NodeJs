const mongoose = require('mongoose')
require('./config')

const schema = mongoose.Schema({
    name : String,
    email : String,
    password : String
})

module.exports = mongoose.model('practices', schema)
