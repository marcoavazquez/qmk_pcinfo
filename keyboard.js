const pcInfo = require('./lib/pcinfoclient')
const hid = require('./lib/hid')

const cpuName = "AMD Ryzen 7 5800X"
const ramName = "Generic Memory"
const gpuName = "NVIDIA NVIDIA GeForce RTX 2060"


/**
 * @param {string} value "34.4 %"|"43.4 °C"|"34.5 W"
 * @returns array<array<int, int>> [[34,4], [43,4], [34,5]] 
 */
function valueToNumberArray(value) {
  return value.split(" ")[0].split(".").map(n => +n)
}

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
    name: cpuName,
    temperature: stringToRoundedInt(data[cpuName].Temperatures["CPU Package"].value),
    load: stringToRoundedInt(data[cpuName].Load["CPU Total"].value),
    power: stringToRoundedInt(data[cpuName].Powers["CPU Package"].value)
  }

  const ram = {
    name: ramName,
    load: stringToRoundedInt(data[ramName].Load["Memory"].value)
  }

  const gpu = {
    name: gpuName,
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
 * @returns int 34, 43, 36 
 */
function stringToRoundedInt(value) {
  return Math.round(parseFloat(value))
}

async function send() {
  try {
    const info = await pcInfo.getData()
    const { cpu, ram, gpu } = formatData(info)

    const data = [
      // 0, // indicate that is to display pc-info on the keyboard
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

function start() {
  console.log("Sending data to keyboard...")
  setInterval(send, 1500)
}

start()
