import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { doc, DocumentReference, getDoc, getFirestore, setDoc } from 'firebase/firestore';

initializeApp({
  apiKey: 'AIzaSyAJStNSEcCBDGnrePnk0C6k_rctVYxn0Qo',
  authDomain: 'ipo-notify-4b5c1.firebaseapp.com',
  projectId: 'ipo-notify-4b5c1',
  storageBucket: 'ipo-notify-4b5c1.appspot.com',
  messagingSenderId: '594641318260',
  appId: '1:594641318260:web:bb79a441d629d101b7fc21',
});

const getSubscriptionKey = (expoPushToken: string) => expoPushToken.split('[')[1].replace(/\]/g, '');

// Firestore
const db = getFirestore();

type Subscription = {
  active: boolean;
  token: string;
};

export const subscriptionDocument = (pushToken: string) =>
  doc(db, 'subscriptions', getSubscriptionKey(pushToken)) as DocumentReference<Subscription>;

export const modifyWeatherSubscription = async (
  pushToken: string,
  isActive: boolean,
  setIsSubscribed: (isSubscribed: boolean) => void
) => {
  const newSubscription: Subscription = { active: isActive, token: pushToken };
  try {
    await setDoc(subscriptionDocument(pushToken), newSubscription);
    setIsSubscribed(isActive);
  } catch (e) {
    console.error('Cannot modify subscription:', e);
  }
};

export const retrieveWeatherSubscription = async (
  pushToken: string,
  setIsSubscribed: (isSubscribed: boolean) => void
) => {
  try {
    const docSnap = await getDoc(subscriptionDocument(pushToken));
    const subscription = docSnap.data();
    setIsSubscribed(subscription ? subscription.active : false);
  } catch (e) {
    console.error('Cannot retrieve subscription:', e);
  }
};

export const testSubscription = async (pushToken: string) => {
  try {
    await axios.get(`https://europe-west1-ipo-notify-4b5c1.cloudfunctions.net/testNotification?token=${pushToken}`);
  } catch (e) {
    console.error('Cannot test subscription:', e);
  }
};
