// elements
const ScrollTopBtn = document.querySelector("#ScrollTop")
const body = document.querySelector('body')
const MenuToggler = document.querySelector('.MenuToggler')
const nav = document.querySelector("nav")
const AdminOrderList = document.querySelector(".OrdersPop")




// const CloseModalBtn = document.querySelector("#CloseModalBtn")
// const OrderItemBtn = document.querySelectorAll("OrderItemBtn")
// events
ScrollTopBtn.addEventListener('click', ()=>{
    window.scrollTo(0,0)
    console.log("top");
})


window.addEventListener("click",(e)=>{
    if(e.target.classList == "OrderItemBtn"){
        AddOrderToAdminList(e)
    }
})
// menu toggler for phone

MenuToggler.addEventListener('click', ()=>{
    nav.classList.toggle("Close")
})


// close modal

// CloseModalBtn.addEventListener("click", ()=>{
//     CloseModalBtn.parentElement.style.display = "none";
// })



// Function

function AddOrderToAdminList(e){

    // gets the menu item of the button clicked
        let parentItem = e.target.parentElement;

    // change text in button to ordered and disable it
        parentItem.querySelector("button").innerText = "Ordered";
        parentItem.querySelector("button").disabled =  true;
        parentItem.querySelector("button").style.pointerEvents = "none";
        parentItem.querySelector("button").style.background = "green";

    // sets quantity ordered from use to the item appearing on admin side
        let QuantityOrdered = parentItem.querySelector("input").value
        parentItem.querySelector("input").disabled = true;


    // create new div using the menu item whose button was clicked
        let newOrderItem = document.createElement("div")
        newOrderItem.classList = parentItem.classList;
        newOrderItem.innerHTML = parentItem.innerHTML;
    // updates quantity as put by the user
        newOrderItem.querySelector("input").value = QuantityOrdered;

        // change text in button for admin to user name
        newOrderItem.querySelector("button").innerText = "userName";
        newOrderItem.querySelector("button").disabled = true;
        newOrderItem.querySelector("button").style.cursor = "none"
        // create a status order btn on Admin
        // let OrderStatus = document.createElement("div")
        // OrderStatus.classList = "OrderStatus";
        // OrderStatus.innerHTML = `
        // <input type="radio" id="Received" name="OrderStatusChoice" value="Received">
        //   <label for="Received">Received</label>
        //   <input type="radio" id="Preparing" name="OrderStatusChoice" value="Preparing">
        //   <label for="Preparing">Preparing</label>
        //   <input type="radio" id="Ready" name="OrderStatusChoice" value="Ready">
        //   <label for="Ready">Ready</label> 
        
        // <button id="ArchiveOrder">Close</button>
        // `
        // newOrderItem.appendChild(OrderStatus)

    // Add order appear to the admin side
        AdminOrderList.appendChild(newOrderItem)
}


// remove completed order from Admin Panel
window.addEventListener("click", (e)=>{
    if(e.target.id === "ArchiveOrder"){
        let ParentMenu = e.target.parentElement.parentElement;
       console.log(ParentMenu);
       ParentMenu.remove();
    }
})