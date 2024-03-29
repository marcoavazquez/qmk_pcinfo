const one = `
 ╥ 
 ║ 
 ╨ 
`
const two = `
╒═╗
╔═╝
╚═╛
`
const three = `
╒═╗
 ═╣
╘═╝
`
const four = `
╥ ╥
╚═╣
  ╨
`
const five = `
╔═╕
╚═╗
╘═╝
`
const six = `
╔═╕
╠═╗
╚═╝
`
const seven = `
╒═╗
  ║
  ╨
`
const eight = `
╔═╗
╠═╣
╚═╝
`
const nine = `
╔═╗
╚═╣
╘═╝
`
const zero = `
╔═╗
║ ║
╚═╝
`

const numbers = [
  zero, one, two, three, four, five, six, seven, eight, nine
]

const printSingleNumber = function(x, y, numberToPrint) {
  const number = numbers[numberToPrint]
  const lines = number.split('\n')

  process.stdout.cursorTo(x, y)

  lines.forEach((line) => {
    process.stdout.write(line)
    process.stdout.cursorTo(x, y++)
  })
}

const printNumber = function(number, options) {

  const { x, y, size = 0, withZeros = false } = options

  let initX = x

  const fullNumber = number.toFixed(1)
    .padStart(size, withZeros ? '0' : ' ')
    .split('')
  fullNumber.forEach((n) => {
    if (n !== ' ' && n !== '.') {
      printSingleNumber(initX, y, +n)
    }
    if (n === '.') {
      process.stdout.cursorTo(initX, y + 2)
      // process.stdout.write('▀')
      process.stdout.write('■')
      initX += 2
    } else {
      initX += 4
    }
  })
}

module.exports = {
  printNumber,
}
