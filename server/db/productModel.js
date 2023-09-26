const mongoose = require('mongoose')
require('./config')

const productSchema = mongoose.Schema({
    name:String,
    price:String,
    category:String,
    userId:String,
    company:String
})

module.exports = mongoose.model('practice-products', productSchema)