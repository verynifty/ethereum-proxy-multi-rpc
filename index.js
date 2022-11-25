const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios');

const app = express()

app.use(bodyParser.json())

var http = require('http');
var https = require('https');

const port = 3000

async function post(url, req) {
    const dataString = JSON.stringify(req.body)

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': dataString.length,
        },
        timeout: 3000, // in ms
    }

    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            var start = performance.now();
            if (res.statusCode < 200 || res.statusCode > 299) {
                return reject(new Error(`HTTP status code ${res.statusCode}`))
            }

            const body = []
            res.on('data', (chunk) => {
                body.push(chunk)
            })
            res.on('end', () => {
                var end = performance.now();
                var time = end - start;
                console.log(url, 'Execution time: ' + time);
                const resString = Buffer.concat(body).toString()
                resolve(resString)
            })
        })

        req.on('error', (err) => {
            reject(err)
        })

        req.on('timeout', () => {
            req.destroy()
            reject(new Error('Request time out'))
        })

        req.write(dataString)
        req.end()
    })
}

let RPCS = [
    "https://nodes.mewapi.io/rpc/eth",
    "https://rpc.flashbots.net/",
    "https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7",
    "https://cloudflare-eth.com/",
    "https://api.securerpc.com/v1",
    "https://1rpc.io/eth",
    "https://eth-rpc.gateway.pokt.network/",
    "https://yolo-intensive-paper.discover.quiknode.pro/45cad3065a05ccb632980a7ee67dd4cbb470ffbd",
    "https://eth-mainnet.g.alchemy.com/v2/demo",
    "https://eth-mainnet.public.blastapi.io",
    "https://ethereum.publicnode.com",
    "https://api.bitstack.com/v1/wNFxbiJyQsSeLrX8RRCHi7NpRxrlErZk/DjShIqLishPCTB9HiMkPHXjUM9CNM9Na/ETH/mainnet",
    "https://eth-mainnet.g.alchemy.com/v2/_vDB38mJZ39GyrIYbhoFtEkxYVydis-o",
    "https://eth-mainnet.g.alchemy.com/v2/99AGaUrirzYtWyUSS7DrvRFckSAGhcFc",
    "https://eth-mainnet.g.alchemy.com/v2/SFt1fObAdxidwp4fI4F5TH8PWPxnz6Yj",
    "https://eth-mainnet.g.alchemy.com/v2/oR2RI3ISaPeRDfEm4IB-f5ios943aPoy",
    "https://eth-mainnet.g.alchemy.com/v2/CH_ObmGVd-o_02ZW6jryFFrr3GmdbWPi",
    "https://eth-mainnet.g.alchemy.com/v2/YMRFBPG1iyBwiRQIHThSWZanZj0NXUjv"
]

function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}


app.post('/*', async (req, res) => {
    let rpcs = shuffleArray(RPCS);
    for (const rpcUrl of rpcs) {
        try {
            const response = await post(rpcUrl, { method: 'POST', body: (req.body) });
            let resp = JSON.parse(response);
            if (resp.error != null && resp.error.code == -32002) {
                throw resp.error.message
            }
            if (resp.error != null && resp.error.code == 229) {
                throw resp.error.message
            }
            // console.log("RESPONSE: ", response)
            res.setHeader('Content-Type', 'application/json');
            res.end(response);
            return
        } catch (error) {
            console.log("NODE GAVE ERROR", rpcUrl)
            console.log(error)
        }

    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})