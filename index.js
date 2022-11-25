const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios');

const app = express()

app.use(bodyParser.json())

const port = 3000

app.post('/*', async (req, res) => {

    let result = axios.post("https://nodes.mewapi.io/rpc/eth", req.body, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function (result) {
        console.log(req.body)
        console.log(result)
        res.setHeader('Content-Type', 'application/json');
        console.log(result.data)
        res.end(JSON.stringify(result.data));
    })
        .catch(function (error) {
            console.log(error);
        });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})