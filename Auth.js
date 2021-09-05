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


// get admin items
const AdminItems = document.querySelector(".AdminSection")
// listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        user.getIdTokenResult().then(idTokenResult=>{
            user.admin = idTokenResult.claims.admin; 
            console.log(user.admin); 
            if(user.admin){
              AdminItems.style.display="flex";
              NonAdminDivs.forEach(div=>{
                div.style.display = "none"
              })
            }
        })
        // Create User information
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
      console.log('user logged in: ', user);
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
    alert("Welcome Back")

    CloseOpenModal()
    location.reload()
  })
  .catch((error) => {
    var errorCode = error.code;
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
