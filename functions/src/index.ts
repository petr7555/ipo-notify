import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import sendPushNotifications from './utils/sendPushNotifications';

// import sendPushNotifications from './utils/sendPushNotifications';

admin.initializeApp();

const db = admin.firestore();

/* Firebase function that runs everyday at 8:00 AM (Spanish timezone) */
export const dailyWeatherNotification = functions
  .region('europe-west1')
  .pubsub.schedule('0 8 * * *')
  .timeZone('Europe/Madrid')
  .onRun(() => {
    return db
      .collection('subscriptions')
      .get()
      .then((subscriptionsSnapshot) => {
        // const subscriptions = subscriptionsSnapshot.docs.map((doc) => doc.data());
        // todo filter in query
        // const pushTokens = subscriptions.filter((subscription) => subscription.active)
        //     .map((subscription) => subscription.token);

        return true;
      });
  });

/* HTTPS endpoint that can be used at any time to send a notification to a given device */
export const testNotification = functions.region('europe-west1').https.onRequest((req, res) => {
  const pushToken = req.query.token as string;

  if (!pushToken) {
    res.status(400).send('No pushToken provided');
  } else {
    sendPushNotifications([pushToken])
      .then(() => {
        res.status(200).send('Ok');
      })
      .catch((e) => {
        console.error("Couldn't send push notifications:", e);
        res.status(500).send("Couldn't send push notifications.");
      });
  }
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.region('europe-west1').https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  console.log('console log working');
  response.send('Hello from Firebase!');
});
