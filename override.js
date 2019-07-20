setTimeout(() => {
  var sidebaritem = document.querySelector("aside")
  var sidebarcontain = sidebaritem.parentNode.parentNode.parentNode
  var children = sidebarcontain.childNodes

  children.forEach((el, i) => {
    i === 0 ? (el.style.marginTop = "10px") : (el.style.display = "none")
  })
}, 1000)
