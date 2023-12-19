import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native'
import { useTheme } from '../../App'
import { fonts } from '../constant/fonts'
import axios from 'axios'

const NotificationScreen = () => {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [notifications, setNotifications] = useState([])
  const { theme } = useTheme()

  const fetchData = async () => {
    axios
      .get('https://notification-mysql-48f715723b35.herokuapp.com/getnotification')
      .then((response) => {
        setNotifications(response.data.data)
      })
      .catch((error) => {
        console.error('Error fetching notifications:', error)
      })
      .finally(() => {
        setRefreshing(false)
        setLoading(false)
      })
  }
  const onRefresh = () => {
    setRefreshing(true)
    fetchData()
  }
  const handleViewClick = (link) => {
    if (link) {
      Linking.openURL(`${link}`)
    } else {
      const googleUrl = 'https://www.tiwtaw.com/'
      Linking.openURL(googleUrl)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  const renderNotification = ({ item }) => {
    const notificationData = item
    const isTitleNotEmpty = notificationData.title.trim() !== ''
    const isBodyNotEmpty = notificationData.message.trim() !== ''
    if (notifications) {
      return (
        <TouchableOpacity onPress={() => handleViewClick(notificationData.link)}>
          <View style={styles.card}>
            <View style={styles.imageContainer}>
              {notificationData.image ? (
                <Image source={{ uri: notificationData.image }} style={styles.image} />
              ) : (
                <Image source={require('../assets/images/logo.png')} style={styles.image} />
              )}
            </View>
            <View style={styles.textContainer}>
              {isTitleNotEmpty && <Text style={styles.title}>{notificationData.title}</Text>}
              {isBodyNotEmpty && <Text style={styles.body}>{notificationData.message}</Text>}
              {isTitleNotEmpty && isBodyNotEmpty && notificationData.date && (
                <Text style={styles.date}>{notificationData.date}</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      )
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  if (notifications.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text>No notifications found</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderNotification}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#B5D9FB',
    borderRadius: 8,
    marginBottom: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    elevation: 3,
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 100, // set to the desired size
    height: 100, // set to the desired size
    borderRadius: 25, // half of the width or height to achieve a circular shape
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.Sans.bold,
    marginBottom: 4,
    color: '#333333',
  },
  body: {
    fontSize: 16,
    fontFamily: fonts.Sans.regular,
    marginBottom: 4,
    color: '#555555',
  },
  date: {
    fontSize: 14,
    fontFamily: fonts.Sans.medium,
    color: '#888888',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default NotificationScreen
