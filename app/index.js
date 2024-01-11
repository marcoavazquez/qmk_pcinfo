const cpu = {
  name: "AMD Ryzen 7 5800X",
  sensors: {
    Load: ['CPU Total'],
    Powers: ['CPU Package'],
    Temperatures: ['CPU Package']
  }
}
const ram = {
  name: "Generic Memory",
  sensors: {
    Load: ['Memory'],
  }
}
const gpu = {
  name: "NVIDIA NVIDIA GeForce RTX 2060",
  sensors: {
    Load: ['GPU Core', 'GPU Memory'],
    Powers: ['GPU Power'],
    Temperatures: ['GPU Core']
  }
}

const components = [cpu, ram, gpu]

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

      const sensorData = compData[sensorName]
      const sensorDataValues = sensorValues.map(function (name) {
        return {
          name: sensorName + ' / ' + name,
          values: sensorData[name]
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

function getNeedleValue(value, maxValue) {
  const deg = 80
  const totalDeg = deg * 2
  const u = maxValue / totalDeg
  return (value / u) - deg
}

function updateNeedle(needle, value, maxValue) {
  needle.style.transform = 'rotateZ('+ getNeedleValue(value, maxValue) +'deg)'
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

function createSensor(sensorName, sensorValue) {
  const className = 'component-sensor'
  const sensor = createElementWithClassName(className)
  sensor.id = toSlug(sensorName)

  const vumeter = createElementWithClassName(className + '-vumeter')
  const needle = createElementWithClassName(className + '-vumeter-needle')
  vumeter.appendChild(needle)
  sensor.appendChild(vumeter)

  const history = createElementWithClassName(className + '-history')
  Array(40).fill(0).forEach(function () {
    const historyItem = createElementWithClassName(className + '-history-item')
    console.log('appendign histoy')
    history.appendChild(historyItem)
  })
  sensor.appendChild(history)

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
  return text.replaceAll(' ', '_').toLowerCase()
}


window.addEventListener('load', async function () {

  const mainElement = document.querySelector('main')

  const data = await fetchData()
  const filteredData = filterData(data)

  console.log('FIlteres', filteredData)

  const elements = filteredData.map(function (componentData) {
    const sensors = componentData.values.map(function (sensorData) {
      return createSensor(sensorData.name, sensorData.values)
    })

    const compoment = createComponent(componentData.name, sensors)

    return compoment
  })

  elements.forEach(function (el) {
    mainElement.appendChild(el)
  })
})