import React from 'react'
import { Image, StatusBar } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

const SplashScreen = () => {
  return (
        <LinearGradient colors={['#0098EF', '#0098EF','#0098EF']} style={{flex: 1, justifyContent: 'center'}}>
            <StatusBar translucent backgroundColor={'transparent'}/>
            <Image source={require('../assets/whiterobot.png')} style={{height: 110, width: 95, alignSelf: 'center'}}/>
        </LinearGradient>
  )
}

export default SplashScreen