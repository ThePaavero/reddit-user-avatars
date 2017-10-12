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
          const clonedAvatar = avatar.cloneNode(true)
          clonedAvatar.addEventListener('click', e => {
            showUsersAllComments(username)
          })
          el.style.position = 'relative'
          el.parentNode.insertBefore(clonedAvatar, el)
        }
      })
    }
  }

  const showUsersAllComments = (username) => {
    const comments = getUsersAllComments(username)
    console.log(comments)
  }

  const getUsersAllComments = (username) => {
    const elements = elementPool.filter(el => {
      return el.innerText.trim() === username
    })
    return elements.map(el => {
      return el.parentNode.parentNode.querySelector('.usertext-body .md').innerText
    })
  }

  const getAvatarElement = (username, color) => {
    const styles = {
      backgroundColor: color,
      display: 'inline-block',
      position: 'relative',
      padding: '3px',
      margin: '0 10px',
      color: 'white',
      fontSize: '18px',
      lineHeight: '22px',
      minWidth: '22px',
      textAlign: 'center',
      fontStyle: 'normal',
      textShadow: '1px 1px 0 rgba(0, 0, 0, 0.3)',
      boxShadow: '1px 1px 1px rgba(0, 0, 0, 0.2)',
      borderRadius: '4px',
      borderBottom: 'solid 1px rgba(0, 0, 0, 0.3)',
      cursor: 'pointer',
    }
    const avatar = document.createElement('i')
    avatar.innerText = username.substring(0, 2)
    for (let i in styles) {
      avatar.style[i] = styles[i]
    }
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
