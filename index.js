const pcInfo = require('./pcInfo')
const hid = require('./hid')

async function send() {
  try {
    const { cpu, gpu, ram } = await pcInfo.getInfo()

    const vramUsed = (gpu.vram.used * 100) / gpu.vram.total 
    const ramUsed = (ram.used * 100) / ram.total

    const data = [
      Math.round(cpu.temperature * 10),
      gpu.temperature,
      Math.round(vramUsed),
      Math.round(ramUsed)
    ]
    console.log("data: ", data)
    // hid.sendData(data)
  } catch (e) {
    console.log(e)
  }
}

setInterval(send, 1000)
