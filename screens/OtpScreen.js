import React from 'react';
import { ScrollView, StatusBar } from 'react-native';
import OtpVerify from '../components/OtpVerify';
import Welcome from '../components/Welcome';

const OtpScreen = ({navigation, route}) => {
  return (
    <ScrollView style={{}}>
    <StatusBar translucent backgroundColor={'transparent'}></StatusBar>
    <Welcome message={'Enter OTP'} subMessage={"A 4-digit code has been sent to your mobile number"}/>
    <OtpVerify navigation={navigation}/>
  </ScrollView>
  )
}

export default OtpScreen