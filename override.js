console.log(
  `%c 
                            ___......__             _
                        _.-'           ~-_       _.=a~~-_
--=====-.-.-_----------~   .--.       _   -.__.-~ ( ___===>
              '''--...__  (    \ \\\ { )       _.-~
                        =_ ~_  \\-~~~//~~~~-=-~
                         |-=-~_ \\   \\
                         |_/   =. )   ~}
                         |}      ||
                        //       ||
                      _//        {{
                   '='~'          \\_    =
                                   ~~'
                              run! @sarah_edo is shitposting again!
`,
  "font-family:monospace"
)

const body = document.querySelector("body")

if (body.style.backgroundColor === "rgb(21, 32, 43)") {
  console.log("hi")
  body.classList.add("dim")
}
