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
      const avatar = getAvatarElement(username, color)
      elementPool.forEach(el => {
        if (el.innerText.trim() === username) {
          el.style.position = 'relative'
          el.parentNode.insertBefore(avatar.cloneNode(true), el)
        }
      })
    }
  }

  const getAvatarElement = (username, color) => {
    const avatar = document.createElement('i')
    avatar.innerText = username.substring(0, 2)
    avatar.style.backgroundColor = color
    avatar.style.display = 'inline-block'
    avatar.style.position = 'relative'
    avatar.style.padding = '3px'
    avatar.style.margin = '0 10px'
    avatar.style.color = 'white'
    avatar.style.fontSize = '30px'
    avatar.style.lineHeight = '30px'
    avatar.style.fontStyle = 'normal'
    avatar.style.textShadow = '1px 1px 0 rgba(0, 0, 0, 0.3)'
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
