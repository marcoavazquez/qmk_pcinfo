
window.addEventListener('load', function () {

  const history = setValues()
  const needlee = document.querySelector("#needle")
  const value = document.querySelector('#value span')

  // const history = document.querySelector('#history')

  // // setInterval(getData, 1000)
  // setInterval(function () {
  //   history.appendChild(createHistoryElement(Math.random() * 100))
  //   history.removeChild(history.firstChild)
  // }, 2000)


  this.setInterval(function () {
    const newValue = Math.random() * 100

    history.forEach(function (el, idx) {
      if (idx < history.length - 1) {
        el.style.height = history[idx + 1].style.height
      } else {
        el.style.height = newValue + '%'
      }
    })
    value.textContent = newValue.toFixed(1) + '%'

    needlee.style.transform = 'rotateZ('+ getNeedleValue(newValue, 100) +'deg)'
  }, 1500)

})

function getNeedleValue(value, maxValue) {
  const u = maxValue / 100
  return (value / u) - 50
}

async function getData() {
  // const data = (await fetch('data')).json()
  // console.log(data)
}

function setValues() {
  const h = document.querySelectorAll('.component-sensor-history-item')

  return Array.from(h).map(function (el) {
    // console.log(el)
    el.style.height = (Math.random() * 100) + '%'
    return el
  })
}

function createHistoryElement(value) {
  const el = document.createElement('div')
  el.className = 'component-sensor-history-item'
  el.style.height = value + '%'
  return el
}
