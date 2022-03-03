import './App.css';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase.Config';
import {getAuth, signInWithPopup,  GoogleAuthProvider,signOut , createUserWithEmailAndPassword,signInWithEmailAndPassword , updateProfile, FacebookAuthProvider } from "firebase/auth";
import React, { useState} from 'react';
import { useForm } from "react-hook-form";
// const app = 
initializeApp(firebaseConfig);
const auth = getAuth();

function App() {
  const provider = new GoogleAuthProvider();
  const [user , setUser] = useState({
    name: '',
    photoId: '',
    email: '',
    password: '',
    newUser: false
  })
  const [logIn , setLoIn] = useState(false);
  const handleSignIn =()=> {
    // console.log("handleSignIn google rendering");
    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const {displayName,photoURL,email } = result.user;
        const signedInUser = {
          name: displayName,
          photoId: photoURL,
          email: email
        }
        setUser(signedInUser)
        setLoIn(true);
        console.log(signedInUser)
        
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        console.log(errorCode)
        const errorMessage = error.message;
        console.log(errorMessage)
        // The email of the user's account used.
        const email = error.email;
        console.log(email)
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(credential)
        // ...
      });
  }
const handleSignOut = ()=> {
  signOut(auth).then(() => {
    const signOutUser = {
      name: '',
      photoId: '',
      email: '',
      password: ''
    }
    setUser(signOutUser)
    setLoIn(false);
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}


 const { register, watch, handleSubmit, formState: { errors } } = useForm();
 const  newUser = watch("newUser");

const onSubmit = data => {
  const {email, password, name } = data;
if(newUser){
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // const user = userCredential.user;
    // console.log(user);
    signInWhenCreate(email, password , name);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // console.log(errorCode);
    // console.log(errorMessage);
    // ..
  });
}else{

  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const userAuth = userCredential.user;
    user.name = userAuth.displayName;
        setUser(user)
        setLoIn(true)
    console.log(user);
    // ...

  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });


}
}
const signInWhenCreate = (email , password , name)=>{

  signInWithEmailAndPassword(auth, email, password )
  .then((userCredential) => {
    // Signed in 

    updateProfile(auth.currentUser, {
      displayName: name
    }).then(() => {
  console.log("Profile updated!");
      // ...

    user.name = name;
        setUser(user)
        setLoIn(true)
    console.log(user);


    }).catch((error) => {
      // An error occurred
      // ...
    });

  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });


}

// fb log in 
const handleFbSign = ()=>{
  const provider = new FacebookAuthProvider();
  signInWithPopup(auth, provider)
  .then((result) => {
    // The signed-in user info.
    const {displayName,photoURL,email } = result.user;
    const signedInUser = {
      name: displayName,
      photoId: photoURL,
      email: email
    }
    setUser(signedInUser)
    setLoIn(true);
    console.log(result.user)
    // // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    // const credential = FacebookAuthProvider.credentialFromResult(result);
    // const accessToken = credential.accessToken;

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    // const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage)
    // // The email of the user's account used.
    // const email = error.email;
    // // The AuthCredential type that was used.
    // const credential = FacebookAuthProvider.credentialFromError(error);

    // ...
  });



}


return (
    <div style={{textAlign: "center"}}>
         <h1>{user.name}</h1>
      {
        
        logIn ? <button onClick={handleSignOut}>Sign out</button> : <div>
        <button onClick={handleSignIn}>Sign in With Google</button><br />
        <button onClick={handleFbSign} >FB Login</button>
   <form onSubmit={handleSubmit(onSubmit)}>
      <input type="checkbox" name="newUser" id="" {...register("newUser")} />
      <label name='newUser'>New User</label><br />
      {newUser && (<div><input placeholder='name' {...register("name", { required: true })} />{!errors.name && <br/>}
      {errors.name && <span>Name field is required <br/></span>}</div>)}
      <input placeholder='email'  {...register("email", { required: true,  pattern: /\S+@\S+\.\S+/ })} /> {!errors.email && <br/>}
      {errors.email && <span>Email field is required <br/></span>}
      <input placeholder='password' {...register("password", { required: true, maxLength: 20, minLength: 6 })} />
      {errors.password && <span>Password field is required</span>}
      <br />
      
      <button type="submit" {...register("button")}>{newUser ? "Register" : "Sign In"}</button>
    </form>
    </div>
}
    </div>
  );
}

export default App;
