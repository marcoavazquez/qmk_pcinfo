function createSensor(sensorName, sensorValue, maxValue) {
  const className = 'component-sensor'
  const sensor = createElementWithClassName(className)
  sensor.id = toSlug(sensorName)

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

function updateCallback(values) {
  const sensor = values.sensor
  const value = parseFloat(values.value)
  const maxValue = values.maxValue

  const percent = (value * 100) / maxValue

  if (percent > 80) {
    sensor.classList.add('warning')
  } else {
    sensor.classList.remove('warning')
  }
}