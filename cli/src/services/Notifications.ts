import notifee, { AndroidImportance } from '@notifee/react-native'

async function createChannel() {
  return await notifee.createChannel({
    id: 'main',
    name: 'Main',
    sound: 'default',
    vibration: true,
    importance: AndroidImportance.HIGH,
  })
}

export async function timerExpired() {
  const channelId = await createChannel()

  await notifee.displayNotification({
    title: 'ESC',
    body: 'Timer expired!',
    id: '123',
    android: {
      importance: AndroidImportance.HIGH,
      channelId,
      ongoing: true,
      pressAction: {
        id: 'default',
      },
    },
  })
}

export async function timeLeft(timeLeft: number) {
  const channelId = await createChannel()

  await notifee.displayNotification({
    title: 'Just a heads up',
    body: `Time remaining: ${timeLeft} seconds`,
    id: '123',
    android: {
      importance: AndroidImportance.HIGH,
      channelId,
      ongoing: false,
      pressAction: {
        id: 'default',
      },
    },
  })
}
