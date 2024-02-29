const makeButton = function (index) {
  // const btn = document.createElement('button')
  const btn = document.createElement('input');
  btn.type = 'color';
  btn.dataset.index = index
  btn.addEventListener('change', handleChange, false);
  return btn
}

const handleChange = async function (e) {
  
  const color = e.target.value
  const index = e.target.dataset.index

  const data = (await fetch('/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ color, index }),
  })).json()

  console.log("data", data)
}

window.addEventListener('load', function() {

  const matrixContainer = document.querySelector('#matrix')

  for (let i = 0; i < 12; i++) {
    const btn = makeButton(i)
    matrixContainer.appendChild(btn)
  }
})