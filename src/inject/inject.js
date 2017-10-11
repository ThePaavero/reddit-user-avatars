const RedditUserAvatars = () => {

  const usernamesToColors = {}
  const elementPool = []

  const populateUserPool = () => {
    const usernameElements = document.querySelectorAll('.commentarea a.author')
    Array.from(usernameElements).forEach(el => {
      const username = el.innerText.trim()
      usernamesToColors[username] = getRandomColorHex(username)
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
    avatar.style.fontSize = '18px'
    avatar.style.lineHeight = '22px'
    avatar.style.minWidth = '22px'
    avatar.style.textAlign = 'center'
    avatar.style.fontStyle = 'normal'
    avatar.style.textShadow = '1px 1px 0 rgba(0, 0, 0, 0.3)'
    avatar.style.boxShadow = '1px 1px 1px rgba(0, 0, 0, 0.2)'
    avatar.style.borderRadius = '4px'
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
