const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch');
const axios = require('axios');

const app = express()

app.use(bodyParser.json())

const port = 3000

app.post('/*', async (req, res) => {

    const response = await fetch('https://httpbin.org/post', {
        method: 'post',
        body: req.body,
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log(data)
    return
    let result = axios.post("https://rpc.flashbots.net/", req.body, {
        headers: {
            // Overwrite Axios's automatically set Content-Type
            'Content-Type': 'application/json'
        }
    }).then(function (result) {
        res.send(result);
        return
        console.log(result)
        console.log(req.body)
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