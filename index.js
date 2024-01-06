const pcInfo = require('./pcinfoclient')
const hid = require('./hid')

const cpuName = "AMD Ryzen 7 5800X"
const ramName = "Generic Memory"
const gpuName = "NVIDIA NVIDIA GeForce RTX 2060"

/**
 *  
 * @returns {
 *  cpu: { temperature, load, power },
 *  gpu: { temperature, load, power, vram },
 *  ram: { load }
 * } 
 */
function formatData(data) {

  const cpu = {
    temperature: valueToNumberArray(data[cpuName].Temperatures["CPU Package"].value),
    load: valueToNumberArray(data[cpuName].Load["CPU Total"].value),
    power: valueToNumberArray(data[cpuName].Powers["CPU Package"].value)
  }

  const ram = {
    load: valueToNumberArray(data[ramName].Load["Memory"].value)
  }

  const gpu = {
    temperature: valueToNumberArray(data[gpuName].Temperatures["GPU Core"].value),
    load: valueToNumberArray(data[gpuName].Load["GPU Core"].value),
    vram: valueToNumberArray(data[gpuName].Load["GPU Memory"].value),
    power: valueToNumberArray(data[gpuName].Powers['GPU Power'].value)
  }

  return {
    cpu,
    ram,
    gpu
  }
}

// value = "34.4 %"|"43.4 °C"|"34.5 W"
function valueToNumberArray(value) {
  return value.split(" ")[0].split(".").map(n => +n)
}

async function send() {
  try {
    const pcData = await pcInfo.getData()
    const { cpu, ram, gpu } = formatData(pcData)

    const data = [
      cpu.load[0],
      cpu.load[1],
      cpu.temperature[0],
      cpu.temperature[1],
      cpu.power[0],
      cpu.power[1],

      gpu.load[0],
      gpu.load[1],
      gpu.temperature[0],
      gpu.temperature[1],
      gpu.power[0],
      gpu.power[1],
      gpu.vram[0],
      gpu.vram[1],

      ram.load[0],
      ram.load[1],
    ]
    console.log("data: ", data)
    hid.sendData(data)
  } catch (e) {
    console.log("Error:", e)
    throw e
  }
}

setInterval(send, 5000)

/*******************
RAM 32.5% VRAM 43.2%
---   %   deg   W
CPU 12.3 43.4 34.5
GPU 43.3 43.2 53.5
 */

/*******************
SNAP de Marco A.
CPU 12.4% 43.5C 23W
GPU 43.5% 23.5C 43W
RAM 23.5% VRAM 43.5%
 */