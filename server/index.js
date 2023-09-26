const express = require('express')
const userModel = require('./db/userModel')
const productModel = require('./db/productModel')
const app = express()
const cors = require('cors')

const Jwt = require('jsonwebtoken')
const jwtKey = 'e-comm'

app.use(cors())
app.use(express.json())

app.post('/register', async (req, resp) => {
    let data = userModel(req.body)
    let result = await data.save()
    let finalResult = result.toObject()
    delete finalResult.password
    Jwt.sign({finalResult}, jwtKey, {expiresIn:'2h'}, (err, token) => {
        if(err){
            resp.send({ Result: "Something went wrong please try again after sometime" })
        }
        resp.send({finalResult, auth:token})
    })
})

app.post('/login', async (req, resp) => {
    if (req.body.email && req.body.password) {
        const data = await userModel.findOne(req.body).select("-password")
        if (data) {
            Jwt.sign({data}, jwtKey, {expiresIn:'2h'}, (err, token) => {
                if(err){
                    resp.send({ Result: "Something went wrong please try again after sometime" })
                }
                resp.send({data, auth:token})
            })
            
        } else {
            resp.send({ Result: "Data Not Found" })
        }
    } else {
        resp.send({ Result: "Data Not Found" })
    }
})

app.post('/addProduct',virificationToken, async (req, resp) => {
    const data = new productModel(req.body)
    const result = await data.save()
    resp.send(result)
})

app.get('/listProduct', virificationToken, async (req, resp) => {
    const data = await productModel.find()
    resp.send(data)
})

app.delete('/deleteProduct/:id',virificationToken, async (req, resp) => {
    const data = await productModel.deleteOne({_id:req.params.id})
    resp.send(data)
})

app.put('/updateProduct/:id',virificationToken, async (req, resp) => {
    const data = await productModel.updateOne(
        {_id:req.params.id},
        {
            $set: req.body
        }
    )
    resp.send(data)
})

app.get('/updateProduct/:id',virificationToken, async (req, resp) => {
    const data = await productModel.findOne({_id: req.params.id})
    resp.send(data)
})

app.get('/search/:key', virificationToken, async (req, resp) => {
    const data = await productModel.find({
        "$or":[
            {name : {$regex: req.params.key}},
            {price : {$regex: req.params.key}},
            {company : {$regex: req.params.key}},
            {category : {$regex: req.params.key}}
        ]
    })
    resp.send(data)
})

function virificationToken(req, resp, next){
    let token = req.headers['authorization']
    if(token){
        token = token.split(' ')[1]
        Jwt.verify(token, jwtKey, (err, valid) => {
            if(err){
                resp.status(401).send({Result: " hello peter Please Add Token in Header"})
            }
            else{
                next();
            }
        })
    }
    else{
        resp.send({Result: "Hello Please Add Token in Header"})
    }
}

app.listen(4230)