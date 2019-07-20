setTimeout(() => {
  var sidebaritem = document.querySelector("aside")
  var sidebarcontain = sidebaritem.parentNode.parentNode.parentNode
  var children = sidebarcontain.childNodes

  console.log(Array.isArray(children))
  // var finalchildren = children.shift()

  // finalchildren.style.display = "none"
}, 1000)
