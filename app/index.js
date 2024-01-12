const cpu = {
  name: "AMD Ryzen 7 5800X",
  sensors: {
    Load: [
      {
        name: 'CPU Total',
        maxValue: 100,
      }
    ],
    Powers: [
      {
        name: 'CPU Package',
        maxValue: 160,
      }
    ],
    Temperatures: [
      {
        name: 'CPU Package',
        maxValue: 100
      }
    ]
  }
}
const ram = {
  name: "Generic Memory",
  sensors: {
    Load: [
      {
        name: 'Memory',
        maxValue: 100,
      }
    ],
  }
}
const gpu = {
  name: "NVIDIA NVIDIA GeForce RTX 2060",
  sensors: {
    Load: [
      {
        name: 'GPU Core',
        maxValue: 100
      }, {
        name: 'GPU Memory',
        maxValue: 100
      }
    ],
    Powers: [
      {
        name: 'GPU Power',
        maxValue: 160,
      }
    ],
    Temperatures: [
      {
        name: 'GPU Core',
        maxValue: 100,
      }
    ]
  }
}

const components = [gpu, cpu, ram]

const fetchData = async function () {
  const data = (await fetch('data')).json()
  return data
}

function filterData (data) {
  return components.map(function (component) {
    const compData = data[component.name]
    const sensorsInfo = Object.entries(component.sensors).flatMap(function (sensor) {
      const sensorName = sensor[0]
      const sensorValues = sensor[1]
      // conso
      const sensorData = compData[sensorName]
      const sensorDataValues = sensorValues.map(function (details) {

        return {
          name: sensorName + ' / ' + details.name,
          values: sensorData[details.name],
          maxValue: details.maxValue,
        }
      })
      return sensorDataValues
    })
    return {
      name: component.name,
      values: sensorsInfo
    }
  })
}

async function updateData() {
  const data = await fetchData() 
  const filteredData = filterData(data)
  filteredData.forEach(function (componentData) {
    componentData.values.forEach(function (sensorData) {
      const id = toSlug(sensorData.name)
      const min = sensorData.values.min
      const max = sensorData.values.max
      const value = sensorData.values.value
      const maxValue = sensorData.maxValue

      const sensor = document.querySelector('#' + id)
      sensor.querySelector('.component-sensor-value').textContent = value
      sensor.querySelector('.component-sensor-min').textContent = min
      sensor.querySelector('.component-sensor-max').textContent = max

      const history = sensor.querySelectorAll('.component-sensor-history-item')
      updateHistory(Array.from(history), value, maxValue)

      const needle = sensor.querySelector('.component-sensor-vumeter-needle')
      updateNeedle(needle, value, maxValue)

    })
  })
}

function updateHistory(history, newValue, maxValue) {

  const u = maxValue / 100
  const value = (parseFloat(newValue) / u)

  history.forEach(function (el, idx) {
    if (idx < history.length - 1) {
      el.style.height = history[idx + 1].style.height
    } else {
      el.style.height = value + '%'
    }
  })
}

function getNeedleValue(value, maxValue) {
  const deg = 80
  const totalDeg = deg * 2
  const u = maxValue / totalDeg
  return (value / u) - deg
}

function updateNeedle(needle, value, maxValue) {
  needle.style.transform = 'rotateZ('
    + getNeedleValue(parseFloat(value), maxValue)
    + 'deg)'
}

function updateSensor(sensor, value) {
  sensor.textContent = value
}

function setHistoryValues(history, newValue) {
  history.forEach(function (el, idx) {
    if (idx < history.length - 1) {
      el.style.height = history[idx + 1].style.height
    } else {
      el.style.height = newValue + '%'
    }
  })
}

///

function createComponent(compName, sensors) {
  const component = createElementWithClassName('component')
  component.id = toSlug(compName)

  const componentTitle = createElementWithClassName('component-title')
  componentTitle.textContent = compName

  const componentSensors = createElementWithClassName('component-sensors')
  sensors.forEach(function (el) {
    componentSensors.appendChild(el)
  })
  
  component.appendChild(componentTitle)
  component.appendChild(componentSensors)

  return component
}

function createSensor(sensorName, sensorValue, maxValue) {
  const className = 'component-sensor'
  const sensor = createElementWithClassName(className)
  sensor.id = toSlug(sensorName)

  const vumeter = createElementWithClassName(className + '-vumeter')
  const needle = createElementWithClassName(className + '-vumeter-needle')
  vumeter.appendChild(needle)
  sensor.appendChild(vumeter)
  updateNeedle(needle, sensorValue.value, maxValue)

  const history = createElementWithClassName(className + '-history')
  const historyItems = []
  Array(40).fill(0).forEach(function () {
    const historyItem = createElementWithClassName(className + '-history-item')
    historyItems.push(historyItem)
    history.appendChild(historyItem)
  })
  sensor.appendChild(history)
  updateHistory(historyItems, sensorValue.value, maxValue)
  

  const value = createElementWithClassName(className + '-value')
  value.textContent = sensorValue.value
  sensor.appendChild(value)

  const maxMin = createElementWithClassName(className + '-other')
  const min = createElementWithClassName(className + '-min')
  min.textContent = sensorValue.min
  const max = createElementWithClassName(className + '-max')
  max.textContent = sensorValue.max
  maxMin.appendChild(min)
  maxMin.appendChild(max)
  sensor.appendChild(maxMin)

  return sensor
}

function createElementWithClassName(className) {
  const el = document.createElement('div')
  el.className = className
  return el
}

function toSlug(text) {
  return text.replaceAll(' ', '_')
    .replaceAll('/', '-')
    .toLowerCase()
}


window.addEventListener('load', async function () {

  const mainElement = document.querySelector('main')

  const data = await fetchData()
  const filteredData = filterData(data)

  const elements = filteredData.map(function (componentData) {
    const sensors = componentData.values.map(function (sensorData) {
      return createSensor(sensorData.name, sensorData.values, sensorData.maxValue)
    })

    const compoment = createComponent(componentData.name, sensors)

    return compoment
  })

  elements.forEach(function (el) {
    mainElement.appendChild(el)
  })

  setInterval(function () {
    updateData()
  }, 2000)
})