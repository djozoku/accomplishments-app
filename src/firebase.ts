import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { ref } from '@vue/composition-api';
import { firebaseConfig } from './firebaseConfig';

// initialize firebase
const fire = firebase.initializeApp(firebaseConfig);

// initialize authentication
export const auth = fire.auth();

export type FirebaseUser = firebase.User;

// user hook
export const useUser = () => {
  const user = ref<FirebaseUser | null>(auth.currentUser);
  auth.onAuthStateChanged((u) => {
    user.value = u;
  });
  return user;
};

// initialize and export database
export const db = fire.firestore();

// export timestamp
export const { Timestamp } = firebase.firestore;

// sign in
export const signIn = () => {
  auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
};

// sign out
export const signOut = () => {
  auth.signOut();
};

// function to check if a user is new on the app
export const isNewUser = async (uid: string) => {
  return (
    await db
      .collection('users')
      .doc(uid)
      .get()
  ).exists;
};
