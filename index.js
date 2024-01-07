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
    temperature: stringToRoundedInt(data[cpuName].Temperatures["CPU Package"].value),
    load: stringToRoundedInt(data[cpuName].Load["CPU Total"].value),
    power: stringToRoundedInt(data[cpuName].Powers["CPU Package"].value)
  }

  const ram = {
    load: stringToRoundedInt(data[ramName].Load["Memory"].value)
  }

  const gpu = {
    temperature: stringToRoundedInt(data[gpuName].Temperatures["GPU Core"].value),
    load: stringToRoundedInt(data[gpuName].Load["GPU Core"].value),
    vram: stringToRoundedInt(data[gpuName].Load["GPU Memory"].value),
    power: stringToRoundedInt(data[gpuName].Powers['GPU Power'].value)
  }

  return {
    cpu,
    ram,
    gpu
  }
}

/**
 * @param {string} value "34.4 %"|"43.4 °C"|"34.5 W"
 * @returns array<array<int, int>> [[34,4], [43,4], [34,5]] 
 */
function valueToNumberArray(value) {
  return value.split(" ")[0].split(".").map(n => +n)
}

/**
 * @param {string} value "34.4 %"|"43.4 °C"|"34.5 W"
 * @returns int 34, 43, 36 
 */
function stringToRoundedInt(value) {
  return Math.round(parseFloat(value))
}

async function send() {
  try {
    const pcData = await pcInfo.getData()
    const { cpu, ram, gpu } = formatData(pcData)

    const data = [
      cpu.load,
      cpu.temperature,
      cpu.power,
      gpu.load,
      gpu.temperature,
      gpu.power,
      gpu.vram,
      ram.load,
    ]
    hid.sendData(data)
  } catch (e) {
    console.log("Error:", e)
    throw e
  }
}

setInterval(send, 1000)

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