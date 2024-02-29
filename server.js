const http = require('http')
const fs = require('fs').promises
const { networkInterfaces } = require('os')
const pcInfo = require('./pcinfoclient')
const underglow = require('./underglow')

const port = 8080

let host = ''
let indexHtml = null

const getIpLocal = function () {
  const nets = networkInterfaces()
  const ipv4 = nets['Ethernet'].find(function (item) {
    return item.family === 'IPv4'
  })
  return ipv4?.address || 'localhost'
}

const requestListener = async function (req, res) {

  console.log(req.method, req.url)

  try {

    const [url] = req.url.split('?')

    switch (url) {

      case '/':
        res.setHeader("Content-Type", "text/html")
        res.writeHead(200);
        res.end(indexHtml)
        break

      case '/data':
        res.setHeader("Content-Type", "application/json")

        const data = await pcInfo.getData()
        res.end(JSON.stringify(data))
        break
      case '/send':

        if (req.method !== 'POST') {
          break;
        }
        const chunks = []
        req.on('data', function (chunk) {
          chunks.push(chunk)
        })
        req.on('end', function () {
          const body = Buffer.concat(chunks)
          const resData = underglow.send(body)
          res.end(JSON.stringify({
            req: body.toString(),
            resp: resData
          }))
        })
        break

      default:
        let isFile = false

        if (req.url.includes('.css')) {
          isFile = true
          res.setHeader("Content-Type", "text/css")
        }

        if (req.url.includes('.js')) {
          isFile = true
          res.setHeader("Content-Type", "text/javascript")
        }
        if (req.url.includes('.html')) {
          isFile = true
          res.setHeader("Content-Type", "text/html")
        }

        if (isFile) {
          const file = await fs.readFile(__dirname + url)
          res.writeHead(200)
          res.end(file)
        } else {
          res.setHeader("Content-Type", "text/html")
          res.writeHead(404)
          res.end("Not foumd")
        }
    }
  } catch (e) {
    res.setHeader("Content-Type", "text/html")
    res.writeHead(500);
    res.end(e.toString())
    console.log(e)
  }
}

const server = http.createServer(requestListener)

async function readIndexFileAndStart() {
  indexHtml = await fs.readFile(__dirname + "/web/index.html")
  server.listen(port, host, function () {
    host = getIpLocal()
    console.log(`Server is running on http://${host}:${port}`)
  })
}

function start() {
  readIndexFileAndStart()
}

start()