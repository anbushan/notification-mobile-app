import React, { useEffect, useState } from 'react'
import { View, Switch, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Share, Platform } from 'react-native'
import { EventRegister } from 'react-native-event-listeners'
import { useLanguage } from '../context/LanguageContext'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../App'
import { Feather } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button'
import { fonts } from '../constant/fonts'
import axios from 'axios'

const SettingsScreen = () => {
  const { changeLanguage, language } = useLanguage()
  const { theme, darkMode } = useTheme()
  const [contactUs, setContactUs] = useState('')
  const [shareLink, setShareLink] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState(language)
  const [mode, setMode] = useState(darkMode)
  const { t } = useTranslation()
  useEffect(() => {
    const apiUrl = 'https://notification-mysql-48f715723b35.herokuapp.com/v1/api/settings/get-contact'
    axios
      .get(apiUrl)
      .then((response) => {
        setContactUs(response.data.data.contact)
        setShareLink(response.data.data.share)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [])
  const handleShare = async () => {
    if (Platform.OS === 'android') {
      try {
        await Share.share({
          message: shareLink,
          title: 'TIWTAW',
        })
      } catch (error) {
        console.error('Error sharing the app:', error.message)
      }
    } else if (Platform.OS === 'ios') {
      try {
        await Share.share({
          message: shareLink,
          title: 'TIWTAW',
        })
      } catch (error) {
        console.error('Error sharing the app:', error.message)
      }
    } else {
      alert('Your device os as Different from Android or ios')
    }
  }

  const handleRateApp = () => {
    if (Platform.OS === 'android') {
      const storeUrl = 'https://play.google.com/store/apps/details?id=app.tiwtaw.com&pcampaignid=web_share'
      Linking.openURL(storeUrl)
    } else if (Platform.OS === 'ios') {
      alert('Your device is IOS')
    } else {
      alert('Your device os as Different from Android or ios')
    }
  }

  const handleContactUs = () => {
    try {
      Linking.openURL(contactUs)
    } catch (error) {
      alert('This link as not Properly')
    }
  }

  const handleLanguageChange = (newLanguage) => {
    setSelectedLanguage(newLanguage)
    EventRegister.emit('ChangeLanguage', newLanguage)
    changeLanguage(newLanguage)
  }

  const radioButtons = [
    { label: 'English', value: 'en' },
    { label: 'Hebrew', value: 'he' },
  ]

  return (
    <ScrollView style={[styles.mainContainer, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <View style={{ marginVertical: 10 }}>
          <Text style={[styles.label, { color: theme.color }]}>{t('theme')}</Text>
          <View style={styles.theme}>
            <Text style={[styles.actionText]}>{t('darkMode')}</Text>
            <Switch
              value={mode}
              onValueChange={(value) => {
                setMode(value)
                EventRegister.emit('ChangeTheme', value)
              }}
            />
          </View>
        </View>
        <View style={styles.languageContainer}>
          <Text style={[styles.label, { color: theme.color }]}>{t('language')}</Text>
          <RadioForm formHorizontal={false} animation={true}>
            {radioButtons.map((radio, index) => (
              <RadioButton labelHorizontal={true} key={index} style={styles.radioContainer}>
                <RadioButtonLabel
                  obj={radio}
                  index={index}
                  labelHorizontal={true}
                  onPress={() => handleLanguageChange(radio.value)}
                  labelStyle={[styles.radioButtonLabel]}
                />
                <RadioButtonInput
                  obj={radio}
                  index={index}
                  isSelected={selectedLanguage === radio.value}
                  onPress={() => handleLanguageChange(radio.value)}
                  borderWidth={1}
                  buttonSize={10}
                  buttonInnerColor={theme.primaryColor}
                  buttonOuterColor={theme.primaryColor}
                />
              </RadioButton>
            ))}
          </RadioForm>
        </View>
        <TouchableOpacity
          onPress={handleShare}
          style={styles.actionButton}
          disabled={Platform.OS === 'android' ? false : true}
        >
          <Feather name="share-2" size={20} color="black" />
          <Text style={styles.actionText}>{t('share')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleContactUs} style={styles.actionButton}>
          <AntDesign name="customerservice" size={24} color="black" />
          <Text style={styles.actionText}>{t('contactUs')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleRateApp}
          style={styles.actionButton}
          disabled={Platform.OS === 'android' ? false : true}
        >
          <MaterialIcons name="star-rate" size={24} color="yellow" />
          <Text style={styles.actionText}>{t('rateApp')}</Text>
        </TouchableOpacity>
        <View style={styles.version}>
          <Text style={styles.versionText}>{t('appVersion')}: V1.0</Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default SettingsScreen

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
  theme: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#B5D9FB',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
  },
  label: {
    fontFamily: fonts.Sans.bold,
  },
  languageContainer: {
    marginBottom: 20,
  },
  radioButtonLabel: {
    fontFamily: fonts.Sans.semiBold,
  },
  radioContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#B5D9FB',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
  },
  actionButton: {
    backgroundColor: '#B5D9FB',
    borderRadius: 15,
    padding: 20,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  actionText: {
    fontFamily: fonts.Sans.semiBold,
    marginHorizontal: 10,
  },
  versionText: {
    fontFamily: fonts.Sans.regular,
    marginTop: 10,
    color: '#888888',
  },
  version: {
    alignItems: 'center',
    marginVertical: 20,
  },
})
