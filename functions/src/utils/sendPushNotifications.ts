import {Expo, ExpoPushMessage} from 'expo-server-sdk';
import getWeatherData from './getWeatherData';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const sendPushNotifications = async (pushTokens: string[]) => {
  const cityData = await getWeatherData('Barcelona');
  if (cityData) {
    const expoPushMessages: ExpoPushMessage[] = pushTokens.map((pushToken) => ({
      body: `${cityData.temperature} ºC`,
      data: cityData,
      title: `Barcelona is ${cityData.weatherName} today`,
      to: pushToken,
    }));

    const expo = new Expo();
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(expoPushMessages);
      console.log('ticketChunk', ticketChunk);
    } catch (e) {
      console.error('Cannot sendPushNotificationsAsync:', e);
    }
  /* Note that expo.sendPushNotificationsAsync will not send the push notifications
     * to the user immediately but will send the information to Expo notifications
     * service instead, which will later send the notifications to the users */
  }
};

export default sendPushNotifications;
