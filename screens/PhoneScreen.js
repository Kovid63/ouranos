import { ScrollView, StatusBar } from 'react-native'
import React from 'react'
import Welcome from '../components/Welcome';
import PhoneVerify from '../components/PhoneVerify';

const PhoneScreen = ({navigation}) => {
    return (
    
        <ScrollView style={{}}>
          <StatusBar translucent backgroundColor={'transparent'}></StatusBar>
          <Welcome message={'Continue with Phone'} subMessage={"You'll recieve a 4 digit code to verify"}/>
          <PhoneVerify navigation={navigation}/>
        </ScrollView>
       
      );
}

export default PhoneScreen