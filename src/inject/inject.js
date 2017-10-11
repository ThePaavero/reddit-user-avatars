const RedditUserAvatars = () => {

  const usernamesToColors = {}
  const elementPool = []

  const populateUserPool = () => {
    const usernameElements = document.querySelectorAll('.commentarea a.author')
    Array.from(usernameElements).forEach(el => {
      const username = el.innerText.trim()
      usernamesToColors[username] = getRandomColorHex()
      elementPool.push(el)
    })
  }

  const getRandomColorHex = () => {
    const colorPool = [
      'DarkOliveGreen',
      'Olive',
      'OliveDrab',
      'YellowGreen',
      'LimeGreen',
      'Lime',
      'LawnGreen',
      'Chartreuse',
      'GreenYellow',
      'SpringGreen',
      'MediumSpringGreen',
      'LightGreen',
      'PaleGreen',
      'DarkSeaGreen',
      'MediumAquamarine',
      'MediumSeaGreen',
      'SeaGreen',
      'ForestGreen',
      'Green',
      'DarkGreen',
      'Aqua',
      'Cyan',
      'LightCyan',
      'PaleTurquoise',
      'Aquamarine',
      'Turquoise',
      'MediumTurquoise',
      'DarkTurquoise',
      'LightSeaGreen',
      'CadetBlue',
      'DarkCyan',
      'Teal',
      'LightSteelBlue',
      'PowderBlue',
      'LightBlue',
      'SkyBlue',
      'LightSkyBlue',
      'DeepSkyBlue',
      'DodgerBlue',
      'CornflowerBlue',
      'SteelBlue',
      'RoyalBlue',
      'Blue',
      'MediumBlue',
      'DarkBlue',
      'Navy',
      'MidnightBlue'
    ]

    return colorPool[Math.round(Math.random() * colorPool.length - 1)]
  }

  const render = () => {
    for (let i in usernamesToColors) {
      const username = i
      const color = usernamesToColors[i]
      const avatar = getAvatarElement(color)
      elementPool.forEach(el => {
        if (el.innerText.trim() === username) {
          el.style.position = 'relative'
          el.parentNode.insertBefore(avatar.cloneNode(true), el)
        }
      })
    }
  }

  const getAvatarElement = (color) => {
    const avatar = document.createElement('i')
    avatar.style.backgroundColor = color
    avatar.style.display = 'block'
    avatar.style.position = 'relative'
    avatar.style.width = '100%'
    avatar.style.height = '5px'
    return avatar
  }

  const init = () => {
    if (window.location.href.indexOf('/comments/') < 0) {
      return
    }
    populateUserPool()
    render()
  }

  return {
    init
  }
}

chrome.extension.sendMessage({}, () => {
  const readyStateCheckInterval = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval)
      setTimeout(() => {
        RedditUserAvatars().init()
      }, 1000)
    }
  }, 10)
})
