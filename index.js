const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios');

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const port = 3000

app.post('/*', async (req, res) => {
    let result = await axios.post("https://rpc.flashbots.net/", req.body);
    console.log( req.body)
    res.json(result.data)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})