// elements
const ScrollTopBtn = document.querySelector("#ScrollTop")
const body = document.querySelector('body')
const MenuToggler = document.querySelector('.MenuToggler')
const nav = document.querySelector("nav")


// events
ScrollTopBtn.addEventListener('click', ()=>{
    window.scrollTo(0,0)
    console.log("top");
})

// menu toggler for phone

MenuToggler.addEventListener('click', ()=>{
    nav.classList.toggle("Close")
})

// Function