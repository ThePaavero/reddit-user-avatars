const RedditUserAvatars = () => {

  const usernamesToBackgroundColors = {}
  const elementPool = []

  const populateUserPool = () => {
    const usernameElements = document.querySelectorAll('.commentarea a.author')
    Array.from(usernameElements).forEach(el => {
      const username = el.innerText.trim()
      usernamesToBackgroundColors[username] = getRandomColorHex(username)
      elementPool.push(el)
    })
  }

  const getRandomColorHex = (str) => {
    // https://stackoverflow.com/a/16348977
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    let colour = '#'
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF
      colour += ('00' + value.toString(16)).substr(-2)
    }
    return colour
  }

  const render = () => {
    for (let i in usernamesToBackgroundColors) {
      const username = i
      const backgroundColor = usernamesToBackgroundColors[i]
      const avatar = getAvatarElement(username, backgroundColor)
      elementPool.forEach(el => {
        if (el.innerText.trim() === username) {
          const clonedAvatar = avatar.cloneNode(true)
          el.style.position = 'relative'
          el.style.backgroundColor = getSuitableForegroundColorForBackground(backgroundColor)
          el.parentNode.insertBefore(clonedAvatar, el)
        }
      })
    }
  }

  const getSuitableForegroundColorForBackground = (backgroundColor) => {
    const rgb = hexToRgb(backgroundColor)
    const brightness = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000
    return brightness < 150 ? '#fff' : '#000'
  }

  const hexToRgb = (hex) => {
    // https://stackoverflow.com/a/5624139
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  const getAvatarElement = (username, color) => {
    const avatar = document.createElement('i')
    avatar.innerText = username.substring(0, 2)
    avatar.className = 'RUA-avatar'
    avatar.style.backgroundColor = color
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
