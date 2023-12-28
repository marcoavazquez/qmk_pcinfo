const os = require('os')
const HID = require('node-hid')

const deviceInfo =   {
  vendorId: 28257,
  productId: 24675,
  path: '\\\\?\\HID#VID_6E61&PID_6063&MI_02&Col01#9&4cf415e&0&0000#{4d1e55b2-f16f-11cf-88cb-001111000030}',
  serialNumber: '',
  manufacturer: 'nullbits',
  product: 'SNAP',
  release: 1,
  interface: 2,
  usagePage: 1,
  usage: 128
}
/**
 * [CPU_TEMP * 10, GPU_TEMP, VRAM_USED_PERCENT, RAM_USED_PERCENT]
 */
async function sendData(data) {
  let kb = null
  try {
    kb = await HID.HIDAsync.open(deviceInfo.path)
    
    kb.on('data', function (data) {
      console.log('kb data:', data, data.toString('hex'))
    })
  
    kb.on('error', function (err) {
      console.log('kb error: ', err)
    })
    
    // kb.sendFeatureReport(data)

    if (os.platform() == 'win32') {
      data.unshift(0x00)
    }
    kb.write(data)

    kb.close()
  } catch (e) {
    if (kb) {
      kb.close()
    }
    throw e
  }
}

module.exports = { sendData }