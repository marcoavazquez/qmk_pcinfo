const cpu = {
  name: "AMD Ryzen 7 5800X",
  sensors: {
    Temperatures: [
      {
        name: 'CPU Package',
        maxValue: 100
      }
    ],
    Powers: [
      {
        name: 'CPU Package',
        maxValue: 160,
      }
    ],
    Load: [
      {
        name: 'CPU Total',
        maxValue: 100,
      }
    ],
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
    Temperatures: [
      {
        name: 'GPU Core',
        maxValue: 100,
      }
    ],
    Powers: [
      {
        name: 'GPU Power',
        maxValue: 160,
      }
    ],
    Load: [
      {
        name: 'GPU Core',
        maxValue: 100
      }, {
        name: 'GPU Memory',
        maxValue: 100
      }
    ],
  }
}

const components = [gpu, cpu, ram]
let fetchingData = false

const fetchData = async function () {
  fetchingData = true
  try {
    const data = (await fetch('data')).json()
    fetchingData = false
    return data
  } catch (e) {
    setTimeout(() => {
      fetchingData = false
    }, 1000)
  }
}

function filterData (data) {
  return components.map(function (component) {
    const compData = data[component.name]
    const sensorsInfo = Object.entries(component.sensors).flatMap(function (sensor) {
      const sensorName = sensor[0]
      const sensorValues = sensor[1]

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

      if (typeof updateCallback === 'function') {
        updateCallback({ sensor, min, max, value, maxValue })
      }
    })
  })
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

function loadTheme(themeNumber) {
  const headTag = document.querySelector('head')

  const jsTag = document.createElement('script')
  jsTag.src = 'app/theme' + themeNumber + '.js'

  const cssTag = document.createElement('link')
  cssTag.href = 'app/theme' + themeNumber + '.css'
  cssTag.rel = 'stylesheet'

  headTag.appendChild(jsTag)
  headTag.appendChild(cssTag)
}

window.addEventListener('load', async function () {

  const mainElement = document.querySelector('main')
  const themeSelect = document.querySelector('#theme-selector')
  const btnMenu = document.querySelector('#btn-menu')
  const menu = document.querySelector('#menu')

  const urlParams = new URLSearchParams(window.location.search)
  const theme = urlParams.get('theme')
  
  if (!theme) {
    loadTheme(1)
  } else {
    loadTheme(theme)
    themeSelect.value = theme
  }


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
    if (!fetchingData) {
      updateData()
    } else {
      console.log('bussy...')
    }
  }, 1000)

  btnMenu.addEventListener('click', function () {
    menu.classList.toggle('show')
  })

  themeSelect.addEventListener('change', function (e) {
    const val = e.target.value
    window.location.href = '?theme=' + val
  })
})