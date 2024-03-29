const numbers = require('./lib/number2Lines')
const pcInfo = require('./lib/pcinfoclient')

const cpuName = "AMD Ryzen 7 5800X"
const ramName = "Generic Memory"
const gpuName = "NVIDIA NVIDIA GeForce RTX 2060"

const reset = '\x1b[0m'
const invert = (text) => `\x1b[7m${text}`

const title = (text) => {
  return invert(`\x1b[1m ${text} ${reset}\n`)
}

const formatData = (data) => {
  return {
    cpu: {
      name: cpuName,
      temp: {
        ...data[cpuName].Temperatures['CPU Package'],
        maxValue: 90
      },
      load: {
        ...data[cpuName].Load['CPU Total'],
        maxValue: 100
      },
      power: {
        ...data[cpuName].Powers['CPU Package'],
        maxValue: 110
      },
    },
    ram: {
      name: ramName,
      load: {
        ...data[ramName].Load['Memory'],
        maxValue: 100
      }
    },
    gpu: {
      name: gpuName,
      temp: {
        ...data[gpuName].Temperatures['GPU Core'],
        maxValue: 90
      },
      load: {
        ...data[gpuName].Load['GPU Core'],
        maxValue: 100,
      },
      power: {
        ...data[gpuName].Powers['GPU Power'],
        maxValue: 160
      },
      vram: {
        ...data[gpuName].Load['GPU Memory'],
        maxValue: 100
      }
    }
  }
}

const renderComponent = (component, posY) => {

  let posSensorY = posY
  process.stdout.cursorTo(0, posY - 1)
  process.stdout.write(title(component.title))
  process.stdout.write(reset + '\n')
  component.sensors.forEach((sensor) => {
    renderSensor(sensor, {
      x: 0,
      y: posSensorY
    })
    posSensorY += 5
  })
  process.stdout.write('\n')
}

const renderSensor = (sensor, positions) => {

  const {x, y} = positions

  const valueFloat = parseFloat(sensor.value)
  const percent = (valueFloat * 100) / sensor.maxValue
  const warning = percent > 80
  const unit = sensor.value.split(' ').pop()

  process.stdout.cursorTo(x, y)
  process.stdout.write(sensor.name + ':')
  
  numbers.printNumber(valueFloat, {
    x: x + 6,
    y,
    size: 5
  })

  process.stdout.cursorTo(x + 24, y)
  process.stdout.write(unit)
  process.stdout.write(` \x1b[31m (${sensor.max}) \n`)
  process.stdout.cursorTo(x, y + 3)
  process.stdout.write(getBar(percent, warning))
  process.stdout.write('\n')
}

const getBar = (percent, warning) => {
  const numBlocks = Math.floor(Math.round(percent) / 2)
  const cursor = numBlocks % 2 === 0 ? '█' : '▌' 
  // const barUsed = "═".repeat(numBlocks)
  // const empty = "═".repeat(100 - numBlocks)
  const barUsed = "█".repeat(numBlocks)
  const empty = " ".repeat(50 - numBlocks)
  const color = warning ? '\x1b[31m' : '\x1b[32m'
  return '\x1b[100m' + color + barUsed + cursor + '\x1b[90m' + empty + reset
}

const getData = async () => {
  const info = await pcInfo.getData()
  const data = formatData(info)

  process.stdout.cursorTo(0, 0)
  let posY = 1

  Object.values(data).forEach((component) => {

    let accY = 0

    const sensors = Object.entries(component).reduce((acc, [key, val]) => {
      process.stdout.clearLine(0)
      if (key !== 'name') {
        acc.push({
          ...val,
          name: key.toUpperCase(),
        })
      }
      accY += 4
      return acc
    }, [])

    renderComponent({
      title: component.name,
      sensors,
    }, posY)
    posY += accY
  })
}

const start = () => {
  setInterval(getData, 1000)
}


start()