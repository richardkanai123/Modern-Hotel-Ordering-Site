const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

exports.AddAdminRole = functions.https.onCall((data, context)=>{
    // get user to add custom claim (admin)
    return admin.auth().getUserByEmail(data.email)
        .then(user=>{
            return  admin.auth().setCustomUserClaims(user.uid, {
                admin: true
            });
        }).then(()=>{
            return {
                message: `Sucess! ${data.email} is now admin`
            }
        }).catch(err=>{
            return err;
    });
});