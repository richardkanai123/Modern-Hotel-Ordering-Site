// elements
const ScrollTopBtn = document.querySelector("#ScrollTop")
const body = document.querySelector('body')
const MenuToggler = document.querySelector('.MenuToggler')
const nav = document.querySelector("nav")
const CloseModalBtn = document.querySelector("#CloseModalBtn")
const ModalContentDiv = document.createElement("div")
const SignInTag = document.querySelector("#SignInTag")
const SignUpTag = document.querySelector("#SignUpTag")
const AccountTag = document.querySelector("#AccountTag")
const LogInForm = document.querySelector("#LogInForm")
const SignUpForm = document.querySelector("#SignUpForm")
const MakeAdminForm = document.querySelector("#MakeAdminForm")
const AccountInfo = document.querySelector("#AccountInfo")
const ModalOverlay = document.querySelector(".ModalOverlay")
const AdminSection = document.querySelector("#AdminSection")
const AddNewAdminTag = document.querySelector("#AddNewAdminTag")
const NonAdminDivs = document.querySelectorAll(".NonAdmin")
const AddNewMealForm = document.querySelector("#AddNewMealForm")
const AddNewMealTag = document.querySelector("#AddNewMealTag")
const MenuList = document.querySelector(".MenuList")
const MyOrdersTag = document.querySelector("#MyOrdersTag")
const MyOrdersDiv = document.querySelector("#MyOrders")
const CustomerCart = document.querySelector('#CustomerOrdersHolder')




// events
ScrollTopBtn.addEventListener('click', () => {
    window.scrollTo(0, 0)
})





// menu toggler for phone
MenuToggler.addEventListener('click', () => {
    nav.classList.toggle("Close")
})


// close modal
CloseModalBtn.addEventListener("click", (e) => {
    ModalContentDiv.innerHTML = ` `;
    ModalOverlay.classList.toggle("Close");
})


// create forms as per request
function CreateModalContent(tag, Content){
        tag.addEventListener("click",()=>{
        ModalContentDiv.classList.add("ModalContent")
        ModalContentDiv.innerHTML =``;
        ModalContentDiv.appendChild(Content)
        Content.style.display = "flex"
        ModalOverlay.append(ModalContentDiv)
        document.querySelector('body').appendChild(ModalOverlay)
        ModalOverlay.classList.toggle("Close")
    })
}

CreateModalContent(SignUpTag, SignUpForm)
CreateModalContent(SignInTag, LogInForm)
CreateModalContent(AccountTag, AccountInfo)
CreateModalContent(AddNewAdminTag, MakeAdminForm)
CreateModalContent(AddNewMealTag, AddNewMealForm)
CreateModalContent(MyOrdersTag, MyOrdersDiv)



// get data from firestore to get available meals
db.collection('Meals').where("Status", "==", "Available").get()
    .then(snapshot=>{
        // console.log(snapshot.docs.data());
    createMenuItem(snapshot.docs)
})
   
// create a menu item
const createMenuItem =(data)=>{
    MenuList.innerHTML = "";
    data.forEach(doc => {
        const AvailableFood = doc.data()
        const NewMenuItem = document.createElement("div")
        NewMenuItem.classList.add("MenuItem")
        const NeWFoodItem = document.createElement("div")
        NeWFoodItem.classList.add("FoodItem")
        NeWFoodItem.setAttribute("data-id", doc.id)
        const FoodImage = document.createElement("img")
        // image
        const ImPic = Imageref.child(`${AvailableFood.Name}`)
        ImPic.getDownloadURL()
        .then((url)=>{
            FoodImage.src = url;
        })
        NewMenuItem.appendChild(FoodImage)
    
         NeWFoodItem.innerHTML=  `
         <h5 class="ItemTitle">${AvailableFood.Name}</h5>
         <p id="FoodItemDescription">${AvailableFood.Description}</p>
         <p class="Cost">Ksh.<span class="FoodItemCost">${AvailableFood.UnitPrice}</span> </p>
         <input type="number" placeholder="No" min="1" name="Quantity" id="Quantity">
         <button class="OrderItemBtn"><i class="bi bi-bag-plus-fill"></i></button>      
        `
    
        // append food item to Menu item
        NewMenuItem.appendChild(NeWFoodItem)
    
        // append meu item to menu list
        MenuList.appendChild(NewMenuItem)
    });

}


// Functions

// filter menu depending on the user choice

function SortMenu(){
    const FoodCategoryOption = document.querySelector("#FoodCategory")
    const AvailableMeals = db.collection('Meals').where("Status", "==", "Available")
    MenuList.innerHTML = "";
    if(FoodCategoryOption.value==="All"){
        db.collection('Meals').where("Status", "==", "Available").get()
        .then(snapshot=>{
            createMenuItem(snapshot.docs)
        })
    }else if(FoodCategoryOption.value==="Drinks"){
        AvailableMeals.where("Category", "==", "Drinks").get()
        .then(snapshot=>{
            createMenuItem(snapshot.docs)
        })
    } else if(FoodCategoryOption.value==="Pizza"){
        AvailableMeals.where("Category", "==", "Pizza").get()
        .then(snapshot=>{
            createMenuItem(snapshot.docs)
        })
    }else if(FoodCategoryOption.value==="Meat"){
        AvailableMeals.where("Category", "==", "Meat").get()
        .then(snapshot=>{
            createMenuItem(snapshot.docs)
        })
    }else if(FoodCategoryOption.value==="Burger"){
        AvailableMeals.where("Category", "==", "Burger").get()
        .then(snapshot=>{
            createMenuItem(snapshot.docs)
        })
    }else if(FoodCategoryOption.value==="Rice"){
        AvailableMeals.where("Category", "==", "Rice").get()
        .then(snapshot=>{
            createMenuItem(snapshot.docs)
        })
    }
}

// place order Orders Collection in database
window.addEventListener("click", (e) => {
    if (e.target.classList == "OrderItemBtn") {
        CartOrder(e)
    }
  })
  
  function CartOrder(e) {
  
    // gets the menu item of the button clicked
    let parentItem = e.target.parentElement;
    const MealID = parentItem.getAttribute("data-id")
  
    let MealQuantity = parentItem.querySelector("#Quantity").value
    if(MealQuantity==0){
        return MealQuantity = 1;
    }

    const MealUnitCost = parentItem.querySelector(".FoodItemCost").innerText
    const CalculatedCost = MealQuantity*Number(MealUnitCost)
  



    // console.log(MealQuantity,Number(MealUnitCost),MealQuantity*Number(MealUnitCost) ); 
    let Customer = auth.currentUser;
  
    // customer side...
  
        // save the order to the customers orders collection on firestore
        return db.collection('Orders').doc().set({
          CustomerID: Customer.uid,
          OrderedMealID: MealID,
          UnitCost: MealUnitCost,
          QuantityOrdered: MealQuantity,
          OrderCost: CalculatedCost,
          OrderStatus: "In Cart",
          OrderTime: firebase.firestore.FieldValue.serverTimestamp()  
        })
  
        .then(
           function(){
            UpdateCart();
            alert("order on Cart");
           }
        )
  
  }
  
// Customer's Cart; Fetches orders from firestore and only displays what the user has put in cart

function UpdateCart(){
    const Customer = auth.currentUser;
    OrdersList.where("CustomerID", "==", `${Customer.uid}`).get().then(doc=>{
        doc.forEach(Order=>{
            const OrderedMealCode = Order.data().OrderedMealID;
            let OrderQuantity = Order.data().QuantityOrdered;

            const OrderTotalCost  = Order.data().OrderCost;
            const OrderUnitCost = Order.data().UnitCost;
            const OrderStatusNow = Order.data().OrderStatus;
            
            // gets meals by their id
            GetMealsUsingID(Order.id,OrderedMealCode,OrderQuantity,OrderUnitCost,OrderTotalCost,OrderStatusNow)
        })

        
    })  
    .catch(err=>console.log(err));
}

// get meal info and create a cart item using mealId
// status here means the orderstatus
function GetMealsUsingID(OrderID, MealID,Quantity,PerUnit,AllCost, status){
   MealsRef.doc(MealID).get()
   .then(doc=>{
    const newMenuItem = document.createElement('div')
    newMenuItem.classList.add("MenuItem")
    newMenuItem.setAttribute("data-id", OrderID)
   
    // new FoodItem Div
    const NewCartFoodItem = document.createElement("div")
    NewCartFoodItem.classList.add("FoodItem")
    NewCartFoodItem.setAttribute("data-id",MealID)

 
    // new image has same us meal picture
    const MealImage = document.createElement("img")
    const ImPic = Imageref.child(`${doc.data().Name}`)
    ImPic.getDownloadURL()
    .then((url)=>{
      MealImage.src = url;
    })

    newMenuItem.appendChild(MealImage)  
    NewCartFoodItem.innerHTML += `
            <h5 class="ItemTitle">${doc.data().Name}</h5>
            <h4>Quantity: <span class="Quantity">${Quantity}</span> @ <span class="Unit Price">${PerUnit}</span></h4>
            <p class="Cost">Ksh.<span class="FoodItemCost">${AllCost}</span> </p>
                             
    `

    const statusBtn = document.createElement("button")
    statusBtn.classList.add("OrderStatus");
    statusBtn.setAttribute("onclick", "SubmitOrder(event)");
    statusBtn.innerText = status
    if(status!== "In Cart"){
        statusBtn.classList.add("Ordered")
    }

    NewCartFoodItem.appendChild(statusBtn)
    newMenuItem.appendChild(NewCartFoodItem)
    MyOrdersDiv.appendChild(newMenuItem)

  })
  .catch(err=>console.log(err))
}


//Customer submits order
function SubmitOrder(e){
    const FoodHolder = e.target.parentElement;
    const MenuItemHolder = FoodHolder.parentElement;

    // ID of Ordered meal
   let MealID = FoodHolder.getAttribute("data-id")

    // ID of specific Order for certain meal with above ID
   let OrderID = MenuItemHolder.getAttribute("data-id")
    console.log(MealID, OrderID );
    // get order by its Id and set status as Order placed,
    UpdateOrderStatus(OrderID)
    .then(function () {
        alert("Ordered. Please Wait for Processing....");
        e.target.innerText = "Ordered"
        e.target.disabled = true;

    })

}


// updates the OrderStatus
function UpdateOrderStatus(id){
    const Order = db.collection('Orders').doc(id)
    return Order.update({
        OrderStatus: "Ordered"
    }).catch(err=>console.log(err))
}



