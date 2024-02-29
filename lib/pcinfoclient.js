/**
 * Get data from the Open Hardware Monitor http server
 */

const OHMurl = "http://localhost:8085"

let prevData = null

async function fetchData() {
  let controller = new AbortController()
  try {
    const resp = await fetch(`${OHMurl}/data.json`, {
      signal: controller.signal
    })
    prevData = await resp.json()
    return prevData
  } catch (e) {
    if (e.name === 'AbortError') {
      return prevData
    }
    console.log('Unable to get PC Info, Is the Open Hardware Monitor Server Running?')
    throw e
  }
}

function array2Object(objWithChildren) {

  const children = objWithChildren.Children.reduce(function (acc, current) {

    const child = array2Object(current)

    return {
      ...acc,
      ...child,
    }
  }, {})

  return {
    [objWithChildren.Text]: {
      ...children,
      min: objWithChildren.Min,
      max: objWithChildren.Max,
      value: objWithChildren.Value,
    } 
  }
}

function filterAnd2Object(data) {

  return data
    .filter(function (item) {
      return item.Text.includes('AMD Ryzen')
        || item.Text.includes('Memory')
        || item.Text.includes('NVIDIA')
    }).reduce(function (acc, current) {

      const formated = array2Object(current)

      return {
        ...acc,
        ...formated
      }
    }, {})
}

async function getData() {

  const { Children: children } = await fetchData()
  return filterAnd2Object(children[0].Children)
}

module.exports = { getData, fetchData }