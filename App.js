import React, { useContext, useEffect, useState, useRef } from 'react'
import { Linking, StatusBar, Text } from 'react-native'
import { EventRegister } from 'react-native-event-listeners'
import AppNavigation from './src/navigation/appNavigation'
import ThemeContext from './src/context/ThemeContext'
import theme from './src/constant/themes'
import { LanguageProvider } from './src/context/LanguageContext'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import axios from 'axios'
import Constants from 'expo-constants'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

export default function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [fontsLoaded] = useFonts({
    'OpenSans-Bold': require('./src/assets/fonts/OpenSans-Bold.ttf'),
    'OpenSans-SemiBold': require('./src/assets/fonts/OpenSans-SemiBold.ttf'),
    'OpenSans-Medium': require('./src/assets/fonts/OpenSans-Medium.ttf'),
    'OpenSans-Regular': require('./src/assets/fonts/OpenSans-Regular.ttf'),
  })

  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState(false)

  const notificationListener = useRef()
  const responseListener = useRef()

  useEffect(() => {
    const themeListener = EventRegister.addEventListener('ChangeTheme', (data) => {
      setDarkMode(data)
    })
    async function prepare() {
      await SplashScreen.preventAutoHideAsync()
      setTimeout(() => {
        SplashScreen.hideAsync()
      }, 2000)
    }
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token)
    })
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification)
    })
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      alert(JSON.stringify(response))
      Linking.openURL(`https://www.google.com/?${response}`)
    })
    prepare()
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
      EventRegister.removeEventListener('ChangeTheme', themeListener)
    }
  }, [])

  if (!fontsLoaded) {
    return <Text>Loading...</Text>
  }
  return (
    <>
      <StatusBar translucent backgroundColor="#B5D9FB" barStyle="light-content" />

      <LanguageProvider>
        <ThemeContext.Provider value={{ darkMode, theme: darkMode ? theme.dark : theme.light }}>
          <AppNavigation />
        </ThemeContext.Provider>
      </LanguageProvider>
    </>
  )
}

export const useTheme = () => {
  return useContext(ThemeContext)
}

async function registerForPushNotificationsAsync() {
  const saveToken = async (token) => {
    const endpoint = 'https://notification-mysql-48f715723b35.herokuapp.com/save-token'
    try {
      const response = await axios.post(endpoint, { token: token })
      console.log('Token saved successfully:', response.data)
    } catch (error) {
      console.error('Error saving token:', error)
    }
  }

  let token
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Please check the Notification Permission')
      return
    }

    token = (
      await Notifications.getDevicePushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })
    ).data

    await saveToken(token)
  } else {
    alert('Please check the Notification Permission')
  }
  return token
}
