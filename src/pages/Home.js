import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../components/Context/authContext/AuthContext';
import {PreloaderContext} from '../components/Context/preloaderContext/preloaderContext';
import {FirebaseContext} from "../components/Context/firebaseContext/FirebaseContext";
import Contacts from '../components/Contacts/Contacts';
import firebase from "../components/Firebase/Firebase";
import {withRouter, Redirect} from 'react-router-dom';
import Firebase from "../components/Firebase/Firebase";

const Home = () => {
  const {currentUser, setCurrentUser} = useContext(AuthContext);
  const {showPreloader, hidePreloader} = useContext(PreloaderContext);
  //const {setDataUsersOnline} = useContext(FirebaseContext);
  const [dataUsersOnline, setDataUsersOnline] = useState(null);
  const [firebaseInitialized, setFirebaseInitialized] = useState(true);
  const {getDataUsersOnline, presence} = Firebase;

  useEffect(() => {
    firebase.isInitialized().then(val => {
      setCurrentUser( ()=> val.displayName);
      setFirebaseInitialized(val);
    });
  });

  // useEffect( ()=> {
  //   if (!dataUsersOnline ?? currentUser) {
  //     console.log(dataUsersOnline, currentUser);
  //     getDataUsersOnline().then((data) => {
  //       let users = Object.keys(data);
  //       console.log(data);
  //       setDataUsersOnline(() => users);
  //     });
  //   }
  // });

  useEffect(() => {
    // presence.on('value', snapshot => {
    //   console.log(snapshot.val());
    //   setDataUsersOnline( ()=> snapshot.val());
    // }, []);

    if (!dataUsersOnline ?? currentUser) {
      console.log(dataUsersOnline, currentUser);
      presence.child(`/${currentUser}`).update({
        'userName': currentUser,
        'onlineStatus': true
      });
      presence.child(`/${currentUser}`).onDisconnect().remove();
      presence.on('child_added', snapshot => {
        getDataUsersOnline().then((snapshot) => {
          setDataUsersOnline(snapshot);
        })
      });
      presence.on('child_removed', snapshot => {
        getDataUsersOnline().then((snapshot) => {
          setDataUsersOnline(snapshot);
        })
      });
    }
  });

  // useEffect(() => {
  //   currentUser ? hidePreloader() : showPreloader();
  // }, []);
  useEffect(() => {
    // if (firebaseInitialized) {
    //   getDataUsersOnline().then((data) => {
    //     let users = Object.keys(data);
    //     console.log(data);
    //     setDataUsersOnline(() => users);
    //   });
    //   hidePreloader();
    // } else {
    //   showPreloader()
    // }
    firebaseInitialized ? hidePreloader() : showPreloader();
  }, []);


  return firebaseInitialized ?<Contacts firebaseInitialized={firebaseInitialized} dataUsersOnline={dataUsersOnline} currentUser={currentUser}/>
      : <Redirect to="/"/>

  // return <Contacts firebaseInitialized={firebaseInitialized} dataUsersOnline={dataUsersOnline}/>

};

export default withRouter(Home);