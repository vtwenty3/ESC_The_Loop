import React from 'react'
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Linking,
} from 'react-native'

import {globalStyles} from '../globalStyles'
import Title from '../components/TitleElement'
import Esc from '../components/EscElement'
import BrutalButton from '../components/BrutalButton'
import NoDataFound from '../components/NoDataFound'


async function openSettings() {
  const pNotification = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  )

  if (pNotification) {
    Linking.sendIntent('android.settings.USAGE_ACCESS_SETTINGS')
  } else {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    )
  }
}

export default function Permissions() {
  return (
    <View style={[globalStyles.root]}>
      <View style={[globalStyles.header]}>
        <View style={[globalStyles.headerChildren]}>
          <Esc onPress={() => console.log('Esc')} />
          <Title
            text={'First Steps'}
            fontFamily={'Lexend-Medium'}
            fontSize={40}
          />
        </View>
      </View>
      <View style={[globalStyles.body]}>
        <View style={styles.buttonsContainer}>
          <View style={styles.brutalButton}>
            <BrutalButton
              text="Permission"
              iconName="shield-sync-outline"
              color="#FF6B6B"
              onPress={openSettings}
            />
          </View>
          <View style={styles.brutalButton}></View>
        </View>
        <View style={{paddingTop: 20}}>
          <NoDataFound
            boldText="In order to use ESC The Loop you have to grant notification and usage acess permissions:"
            step1="1. Click on the Permission button above and grant notification acess"
            step2="2. Click on the Permission button above and find ESC The Loop in the
          list of apps"
            step3="3. Toggle usage acess"
            disclamer="Escape The Loop does not send any data to the cloud, everythis is stored
        locally on your phone. It uses the data collected to provide you the features of the app."
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    width: '90%',
    paddingLeft: 3,
    alignSelf: 'center',
    top: 0,
    marginTop: -20,
    justifyContent: 'space-between',
    zIndex: 3,
  },
  brutalButton: {
    width: '48%',
  },
})
