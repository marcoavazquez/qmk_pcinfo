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

function updateCallback(values) {
  
  const sensor = values.sensor
  const value = values.value
  const maxValue = values.maxValue

  const history = sensor.querySelectorAll('.component-sensor-history-item')
  if (history) {
    updateHistory(Array.from(history), value, maxValue)
  }
  const needle = sensor.querySelector('.component-sensor-vumeter-needle')
  if (needle) {
    updateNeedle(needle, value, maxValue)
  }
}
