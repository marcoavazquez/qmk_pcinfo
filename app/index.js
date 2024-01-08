async function getData() {
  const data = (await fetch('data')).json()
  console.log(data)
}

setInterval(getData, 60000)