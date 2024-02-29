const hid = require('./hid')

const send = function (data) {
  const { index, color } = JSON.parse(data.toString());
  const red = parseInt(color.substring(1, 3), 16)
  const green = parseInt(color.substring(3, 5), 16)
  const blue = parseInt(color.substring(5, 7), 16)

  console.log(red, green, blue)
  try {


    hid.sendData([
      1, // indicate that is rgb control
      parseInt(index),
      red,
      green,
      blue
    ])
  } catch (err) {
    console.error(err)
    throw err
  }
  return { index, red, green, blue }
}

module.exports = {
  send
}