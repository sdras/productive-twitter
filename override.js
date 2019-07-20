function replaceSidebar() {
  setTimeout(() => {
    const sidebaritem = document.querySelector("aside"),
      sidebarcontain = sidebaritem.parentNode.parentNode.parentNode,
      children = sidebarcontain.childNodes

    children.forEach((el, i) => {
      i === 0 ? (el.style.marginTop = "5px") : (el.style.display = "none")
    })
  }, 1000)
}

replaceSidebar()
if ("onhashchange" in window) {
  replaceSidebar()
}
