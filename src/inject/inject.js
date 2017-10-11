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
    const chars = '0123456789abcdef'
    let length = 6
    let hex = '#'
    while (length--) {
      hex += chars[(Math.random() * 16) | 0]
    }
    return hex
  }

  const render = () => {
    for (let i in usernamesToColors) {
      const username = i
      const hex = usernamesToColors[i]
      const avatar = getAvatarElement(hex)
      elementPool.forEach(el => {
        if (el.innerText.trim() === username) {
          el.style.position = 'relative'
          el.parentNode.insertBefore(avatar.cloneNode(true), el)
        }
      })
    }
  }

  const getAvatarElement = (hex) => {
    const avatar = document.createElement('i')
    avatar.style.backgroundColor = hex
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
    console.log(usernamesToColors)
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
