import React, { useState, useEffect, useCallback, useRef } from 'react'
import { ScrollView, View, BackHandler, Platform, RefreshControl, StyleSheet, Text, SafeAreaView } from 'react-native'
import { WebView } from 'react-native-webview'
import Constants from 'expo-constants'
import { useFocusEffect } from '@react-navigation/native'
import registerNNPushToken from 'native-notify'

function wait(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout)
  })
}

const HomeScreen = () => {
  const [refreshing, setRefreshing] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [scrollDirection, setScrollDirection] = useState('up')
  const [showRefreshControl, setShowRefreshControl] = useState(false)
  const [webViewUrl, setWebViewUrl] = useState('https://www.tiwtaw.com/')
  const webViewRef = useRef(null)
  const canGoBack = useRef(false)
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    wait(2000).then(() => setRefreshing(false))
  }, [])

  const onAndroidBackPress = () => {
    if (canGoBack.current && webViewRef.current) {
      webViewRef.current.goBack()
      return true
    }
    return false
  }

  useEffect(() => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress)
    }

    return () => {
      if (Platform.OS === 'android') {
        BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress)
      }
    }
  }, [])

  const onNavigationStateChange = (navState) => {
    canGoBack.current = navState.canGoBack
  }

  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent
    const newScrollDirection = contentOffset.y > scrollPosition ? 'down' : 'up'
    setScrollPosition(contentOffset.y)
    setScrollDirection(newScrollDirection)
    setShowRefreshControl(newScrollDirection === 'up' && contentOffset.y <= 0)
  }

  useFocusEffect(
    useCallback(() => {
      setWebViewUrl('https://www.tiwtaw.com/')
    }, []),
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <WebView
          ref={webViewRef}
          onNavigationStateChange={onNavigationStateChange}
          automaticallyAdjustContentInsets={false}
          source={{ uri: webViewUrl }}
          allowsFullscreenVideo={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
        />
      </ScrollView>
      {showRefreshControl && (
        <View style={styles.scrollIndicator}>
          <Text>Release to refresh</Text>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight || 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollIndicator: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
})

export default HomeScreen
