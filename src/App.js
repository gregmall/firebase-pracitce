import React from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useState, useRef } from 'react';

firebase.initializeApp({
  apiKey: "AIzaSyCpGaMcyAqnckdKEliMnyjRmNRUUDLHDxY",
  authDomain: "first-firebase-3c584.firebaseapp.com",
  projectId: "first-firebase-3c584",
  storageBucket: "first-firebase-3c584.appspot.com",
  messagingSenderId: "320520603315",
  appId: "1:320520603315:web:84d3c3d88314f0a68992c6",
  measurementId: "G-V1H71MVWFD"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function SignIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )

}
function SignOut(){
  return auth.currentUser && (

    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}
function ChatRoom(){
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue]= useState('');

  const sendMessage = async(e) => {
    e.preventDefault();
    const { uid, photoURL }= auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL

    })
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth'});
  }
  return (
    <>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      <div ref={dummy}></div>
    </main>
    <form onSubmit={sendMessage}>
      <input value={formValue}onChange={(e) => setFormValue(e.target.value)} />
      <button type="submit">send</button>
    </form>
    </>
  )
}
function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="www.placekitten.com" />
      <p>{text}</p>
     
    </div>
  )
}

function App() {
  const [user]= useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
        <SignOut />
 
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

export default App;

