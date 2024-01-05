/**
 * Get data from the Open Hardware Monitor http server
 */

const OHMurl = "http://localhost:8085"

async function fetchData() {
  const resp = (await fetch(`${OHMurl}/data.json`)).json()
  const data = await resp

  return data
}

function findData(arr, textToFind) {
  const data = arr.find(function (item) {
    return item.Text.includes(textToFind)
  })

  return {
    min: data.Min,
    max: data.Max,
    value: data.Value
  }
}

function findAndFormat(arr, keyValuesObj) {
  return arr.reduce(function (acc, current) {

    const data = Object.entries(keyValuesObj).find(function (val) {
      return current.Text.includes(val[1])
    })

    if (!!data && data.length) {
      return {
        ...acc,
        [data[0]]: {
          min: current.Min, //value.Min,
          max: current.Max,//value.Max,
          value: current.Value//value.Value
        }
      }
    }
    return acc
  }, {})
}

async function formatData() {
  const { Children: children } = await fetchData()
  const allData = children[0].Children

  return allData.reduce(function (acc, current) {

    // CPU
    if (current.Text.includes('AMD Ryzen')) {
      const cpu = current.Children.reduce(function (cpuAcc, cpuCurrent) {
        let key = ''
        let keyValues = {}

        switch (cpuCurrent.Text) {
          case "Temperature":
            key = 'temperature'
            keyValues = {
              ccd: 'CCD',
              package: 'Package'
            }
              break
            case "Load":
              key = 'load'
              keyValues = {
                total: 'Total'
              }
              break
            case "Powers":
              key = 'power'
              keyValues = {
                package: 'Package',
                cores: 'Cores'
              }
              break
            default:
              return cpuAcc
        }
        
        const data = findAndFormat(cpuCurrent.Children, keyValues)

        return {
          ...cpuAcc,
          [key]: data
        }
      }, {})

      return {
        ...acc,
        cpu
      }
    }

    // RAM
    if (current.Text.includes('Memory')) {

      const ram = current.Children.reduce(function (ramAcc, ramCurrent) {

        let key = ''
        let keyValues = {}

        switch (ramCurrent.Text) {
          case 'Load':
            key = 'load'
            keyValues = {
              memory: 'Memory'
            } 
            break
          case 'Data':
            key = 'data'
            keyValues = {
              used: 'Used'
            } 
            break
          default:
            return ramAcc
        }

        const data = findAndFormat(ramCurrent.Children, keyValues)

        return {
          ...ramAcc,
          [key]: data
        }
      }, {})
      return {
        ...acc,
        ram
      }
    }

    // GPU
    if (current.Text.includes('NVIDIA')) {
      const gpu = current.Children.reduce(function (gpuAcc, gpuCurrent) {

        let key = ''
        let keyValues = {}

        switch (gpuCurrent.Text) {
          case 'Temperatures':
            key = 'temperature'
            keyValues = {
              core: 'Core'
            } 
            break
          case 'Load':
            key = 'load'
            keyValues = {
              memory: 'Memory'
            } 
            break
          case 'Powers':
            key = 'power'
            keyValues = {
              power: 'Power'
            } 
            break
          default:
            return gpuAcc
        }

        const data = findAndFormat(gpuCurrent.Children, keyValues)

        return {
          ...gpuAcc,
          [key]: data
        }
      }, {})
      return {
        ...acc,
        gpu
      }
    }
    return acc
  }, {})
}


async function getData() {
  // const data = await formatData()
  console.log("all data:", await formatData())
}

getData()