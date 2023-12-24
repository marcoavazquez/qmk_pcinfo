const si = require('systeminformation')

async function getInfo() {
  try {
    const cpuTemperature = await si.cpuTemperature()
    const { controllers: gpu } = await si.graphics()
    const ram = await si.mem()

    const oneGigabyte = 1024 * 1024 * 1024

    const data = {
      cpu: {
        temperature: cpuTemperature.main,
      },
      gpu: {
        temperature: gpu[0].temperatureGpu,
        vram: {
          total: gpu[0].memoryTotal,
          used: gpu[0].memoryUsed,
          free: gpu[0].memoryFree,
          unit: 'mb',
        }
      },
      ram: {
        total: ram.total / oneGigabyte,
        free: ram.free / oneGigabyte,
        used: ram.used / oneGigabyte,
        active: ram.active / oneGigabyte,
        available: ram.available / oneGigabyte,
        unit: 'gb',
      }
    }

    console.log("data:", data)
  } catch (e) {
    console.log("error: ", e)
  }
}

console.log("getting info...")

setInterval(getInfo, 10000)
