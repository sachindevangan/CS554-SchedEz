import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    signInWithEmailAndPassword,
    updatePassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    EmailAuthProvider,
    reauthenticateWithCredential
  } from 'firebase/auth';
  import axios from 'axios'
  
  async function doCreateUserWithEmailAndPassword(email, password, displayName) {
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password)
    axios.post("http://localhost:3000/user/all-users",{id: auth.currentUser.uid}).then((response)=> {
      console.log(response);
    }).catch((error)=> {
      console.log(error);
  })
    await updateProfile(auth.currentUser, {displayName: displayName});

  }
  
  async function doChangePassword(email, oldPassword, newPassword) {
    const auth = getAuth();
    let credential = EmailAuthProvider.credential(email, oldPassword);
    console.log(credential);
    await reauthenticateWithCredential(auth.currentUser, credential);
  
    await updatePassword(auth.currentUser, newPassword);
    await doSignOut();
  }
  
  async function doSignInWithEmailAndPassword(email, password) {
    let auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password).then((userID)=> {
        const uuid = userID.user.uid;
        console.log(uuid);
    });
  }
  
  async function doSocialSignIn() {
    let auth = getAuth();
    let socialProvider = new GoogleAuthProvider();
    await signInWithPopup(auth, socialProvider);
  }
  
  async function doPasswordReset(email) {
    let auth = getAuth();
    await sendPasswordResetEmail(auth, email);
  }
  
  async function doSignOut() {
    let auth = getAuth();
    await signOut(auth);
  }
  
  export {
    doCreateUserWithEmailAndPassword,
    doSocialSignIn,
    doSignInWithEmailAndPassword,
    doPasswordReset,
    doSignOut,
    doChangePassword
  };