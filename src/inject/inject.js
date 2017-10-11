const RedditUserAvatars = () => {

  const usernamesToColors = {}
  const elementPool = []

  const populateUserPool = () => {
    const usernameElements = document.querySelectorAll('a.author')
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
      const avatar = document.createElement('i')
      avatar.style.backgroundColor = hex
      avatar.style.display = 'inline-block'
      avatar.style.width = '10px'
      avatar.style.height = '10px'

      console.log(username)

      elementPool.forEach(el => {
        if (el.innerText.trim() === username) {
          el.appendChild(avatar.cloneNode(true))
        }
      })
    }
  }

  const init = () => {
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
