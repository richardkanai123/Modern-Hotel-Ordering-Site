// add admin
MakeAdminForm.addEventListener('submit', (e)=>{
  e.preventDefault()
  const adminMail = MakeAdminForm.querySelector("#NewAdminEmail").value
  console.log(adminMail);
  // refer to  adminrole function
    const AddAdminRole = functions.httpsCallable('AddAdminRole');
    AddAdminRole({email:adminMail}).then(result=>{
      console.log(result);
    })

})


// console.log(imagesRef.fullPath);

// get admin items
const AdminItems = document.querySelector(".AdminSection")
// listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        user.getIdTokenResult().then(idTokenResult=>{
            user.admin = idTokenResult.claims.admin; 
            // console.log(user.admin); 
            if(user.admin){
              AdminItems.style.display="flex";
              NonAdminDivs.forEach(div=>{
                div.style.display = "none"
              })
            }
        })
        // Create Account Section
        db.collection('users').doc(user.uid).get()  
          .then(doc=>{
            const UserInfo = `
            <h3> ${ doc.data().UName}</h3>
            <span>Email: <h5 id="MyUserEmail">${ doc.data().umail}</h5></span>
            <div> ${user.admin? 'Admin Account': 'Customer  '} </div>
            `;
            document.querySelector(".UserInfoDiv").innerHTML = UserInfo;
          })

        SetLoggedInUi()
      // console.log('user logged in: ', user);
      // database access
        // db.collection('guides').onSnapshot(snapshot => {
        // setupGuides(snapshot.docs);
        // })
    } else {
      // console.log('user logged out', user);    
    SetLoggedOutUi()
    document.querySelector(".UserInfoDiv").innerHTML = ``;
    }
})

// sign up a new user
SignUpForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  // get user info
  const email = SignUpForm['NewUserEmail'].value;
  const password = SignUpForm['NewUserPassword'].value;
  const UserName = SignUpForm['NewUserName'].value;

      // add new user
      auth.createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            // console.log(userCredential);
           return db.collection('users').doc(user.uid).set({
             UName: UserName,
             umail: email
           })

          }).then(
            function(){
            SignUpForm.reset();
            CloseOpenModal()
            location.reload()
          })

        // Handle Errors here.
          .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
              alert('The password is too weak.');
            } else {
              alert(errorMessage);
            }
          });
})

// logging out a logged in user
const LogOutBtn = document.querySelectorAll("#LogOutBtn")
LogOutBtn.forEach(btn=>{
  btn.addEventListener("click",()=>{
  auth.signOut().then(()=>{
   
    
    CloseOpenModal()
    alert("Logged Out! Bye!");
    location.reload()
  })
})
})
// log in current user
LogInForm.addEventListener("submit",(e)=>{
  e.preventDefault();

  // get user info to auth logging in
  const email = LogInForm['UserEmail'].value;
  const password = LogInForm['UserPassword'].value;

  auth.signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    // console.log(userCredential);
    alert("Welcome Back", user.email)

    CloseOpenModal()
    location.reload()
  })
  .catch((error) => {
    var errorMessage = error.message;
    alert(errorMessage)
  });
})





// closes currently open modal
function CloseOpenModal(){
  setTimeout(
    function(){
    ModalOverlay.classList.toggle("Close");
    },
  500)
}




// hides this ui when user is logged in
function SetLoggedInUi(){
  // setupUi depending on log state
const LoggedOutUi = document.querySelectorAll(".UserLoggedOut")
const LoggedInUi = document.querySelectorAll(".LoggedIn")
  LoggedOutUi.forEach(element => {
    element.style.display = 'none';
  });

  LoggedInUi.forEach(element => {
    element.style.display = 'All';
  });

}

// update UI when user logs out
function SetLoggedOutUi(){
  const LoggedOutUi = document.querySelectorAll(".UserLoggedOut")
  const LoggedInUi = document.querySelectorAll(".LoggedIn")
  LoggedOutUi.forEach(element => {
    element.style.display = 'all';
  });

  LoggedInUi.forEach(Ui => {
    Ui.style.display = 'none';
  });

}



// creating new meals
AddNewMealForm.addEventListener('submit',(e)=>{
  e.preventDefault();

  const MealName = AddNewMealForm['MealName'].value
  const MealDescription = AddNewMealForm['MealDescription'].value
  const UnitPrice = AddNewMealForm['UnitPrice'].value
  const MealCategory = AddNewMealForm['MealCategory'].value
  const Image = AddNewMealForm['MealPic']
  UploadImage(Image, MealName)
  return db.collection('Meals').doc().set({
    Name: MealName,
    Description: MealDescription,
    UnitPrice: UnitPrice,
    Category: MealCategory,
    Status: "Available"
  })

 
  .then(()=>{
    AddNewMealForm.reset()
    ModalOverlay.classList.toggle("Close")
  })

})



// Get All meals from firestore to customer section
  db.collection("Meals").get().then(snapshot=>{
    GetMeals(snapshot.docs)
  })


// set up meals as gotten from Meals Collection
function GetMeals(array){
  const AllMealsDiv  = document.querySelector('#AllMeals')
  array.forEach(doc=>{
    // create new div with class = MenuItem
    const newMenuItem = document.createElement('div')
    newMenuItem.classList.add("MenuItem")

    // new FoodItem Div
    const newFoodItem = document.createElement("div")
    newFoodItem.classList.add("FoodItem")
 
    // new image has same us meal picture
    const MealImage = document.createElement("img")
    const ImPic = Imageref.child(`${doc.data().Name}`)
    ImPic.getDownloadURL()
    .then((url)=>{
      MealImage.src = url;
    })
    newMenuItem.appendChild(MealImage)
    newFoodItem.innerHTML = `
                        <h5 class="ItemTitle">${doc.data().Name}</h5>
                        <p id="FoodItemDescription">${doc.data().Description}</p>
                        <p class="Cost">Ksh.<span class="FoodItemCost">${doc.data().UnitPrice}</span> </p>
    `

    const MealSettings = document.createElement('div')
    MealSettings.classList.add("MealControls")

    MealSettings.innerHTML =`
    <select name="MealStatus" id="MealStatus">
      <option value="Available" selected>Available</option>
      <option value="Unvailable">Unavailable</option>
    </select>
    `

    newMenuItem.appendChild(newFoodItem)
      newMenuItem.appendChild(MealSettings) 
    AllMealsDiv.appendChild(newMenuItem)
  })

}


//  uploade image to database when creating a new meal

function UploadImage(imagesrc, filename){
    let photo = imagesrc.files[0]
    const metadata ={
      contentType: 'image/png'
    }

    Imageref.child(filename).put(photo, metadata)
   .then(snapshot=>snapshot.ref.getDownloadURL())
   .then(url=>{
     console.log(url);
     alert("upload Successful")
     
   })
}