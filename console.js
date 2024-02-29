const pcInfo = require('./lib/pcinfoclient')

const cpuName = "AMD Ryzen 7 5800X"
const ramName = "Generic Memory"
const gpuName = "NVIDIA NVIDIA GeForce RTX 2060"

const reset = '\x1b[0m'
const invert = (text) => `\x1b[7m${text}`

const title = (text) => {
  return invert(`\x1b[1m ${text} ${reset}\n`)
}

const componentName = (text) => {
  return text + reset
}

const componentValue = (text, warning) => {
  if (warning) {
    return `\x1b[91m ${text} ${reset}`
  }
  return text
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

const renderComponent = (component) => {
  process.stdout.write(title(component.title))
  process.stdout.write(reset + '\n')
  component.sensors.forEach((sensor) => {
    renderSensor(sensor)
  })
  process.stdout.write('\n')
}

const renderSensor = (sensor) => {

  const valueFloat = parseFloat(sensor.value)
  const percent = (valueFloat * 100) / sensor.maxValue
  const warning = percent > 80
  const isTemp = sensor.name === 'TEMP'

  process.stdout.write(componentName(sensor.name.padEnd(5, ' ') + ': '))
  process.stdout.write(componentValue(sensor.value.padStart(isTemp ? 9 : 8, ' ')))
  process.stdout.write(` \x1b[31m (${sensor.max}) \n`)
  process.stdout.write(getBar(percent, warning))
  process.stdout.write('\n')
}

const getBar = (percent, warning) => {
  const numBlocks = Math.round(percent)
  const barUsed = "x".repeat(numBlocks)
  const empty = "x".repeat(100 - numBlocks)
  const color = warning ? '\x1b[31m' : '\x1b[32m'
  return color + barUsed + '\x1b[90m' + empty + reset
}

const getData = async () => {
  const info = await pcInfo.getData()
  const data = formatData(info)

  process.stdout.cursorTo(0, 0)

  Object.values(data).forEach((component) => {

    const sensors = Object.entries(component).reduce((acc, [key, val]) => {
      process.stdout.clearLine(0)
      if (key !== 'name') {
        acc.push({
          ...val,
          name: key.toUpperCase(),
        })
      }
      return acc
    }, [])

    renderComponent({
      title: component.name,
      sensors,
    })
  })
}

const start = () => {
  setInterval(getData, 1000)
}


start()