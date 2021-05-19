const stylesheet = document.styleSheets[1]
let boxParaRule

for(let i = 0; i < stylesheet.cssRules.length; i++) {
  if(stylesheet.cssRules[i].selectorText === '.homePageHolder') {
    boxParaRule = stylesheet.cssRules[i] 
  }
}

function random(min,max) {
  const num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

function randomColor() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`
}

function setRandomBgColor() {
  const newBgColor = randomColor()
  boxParaRule.style.setProperty('background-color', newBgColor)
}

function throttle(fn, wait) {
  let time = Date.now()
  return function() {
    if ((time + wait - Date.now()) < 0) {
      fn()
      time = Date.now();
    }
  }
}

window.addEventListener('scroll', throttle(setRandomBgColor, 1000))
