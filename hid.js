const os = require('os')
const HID = require('node-hid')

const RAW_USAGE_PAGE = 0XFF60;
const RAW_USAGE_ID = 0X61;
const VID = 0x6E61;
const PID = 0x6063;

const devices = HID.devices();

const isSnapKB = function (d) {
  return d.vendorId === VID
    && d.productId === PID
    && d.usagePage === RAW_USAGE_PAGE
    && d.usage === RAW_USAGE_ID
}

/**
 * 
 * @param {*} data [
 *  CPU_lOAD_INTEGER,
 *  CPU_TEMP_INTEGER,
 *  CPU_POWER_INTEGER,
 *  GPU_lOAD_INTEGER,
 *  GPU_TEMP_INTEGER,
 *  GPU_POWER_INTEGER,
 *  GPU_VRAM_INTEGER
 *  RAM_INTEGER
 * ]
 */
async function sendData(data = []) {
  let kb = null
  try {

    const deviceInfo = devices.find(isSnapKB)

    if (!deviceInfo) {
      throw "Device not found :("
    }

    const device = new HID.HID(deviceInfo.path)

    if (!device) {
      throw "Cant find the device :("
    }

    // kb.on('data', function (data) {
    //   console.log('kb data:', data, data.toString('hex'))
    // })
  
    // kb.on('error', function (err) {
    //   console.log('kb error: ', err)
    // })
    
    if (os.platform() == 'win32') {
      data.unshift(0x00)
    }

    const fullData = data.concat(new Array(32 - data.length).fill(0x00))

    await device.write(fullData)

    device.close()
  } catch (e) {
    console.log(":(")
    if (kb) {
      await kb.close()
    }
    console.log(e)
    process.exit(1)
  }
}

module.exports = { sendData }
