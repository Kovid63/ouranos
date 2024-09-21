import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';
import LoginComponent from '../components/LoginComponent';
import Welcome from '../components/Welcome';

const LoginScreen = ({navigation}) => {

  const[active, setActive] = useState('Retailer')

  
  return (
    
    <ScrollView keyboardShouldPersistTaps={'handled'} style={{}}>
      <StatusBar translucent backgroundColor={'transparent'}></StatusBar>
      <Welcome message={'Hi, Welcome Back!👋'} subMessage={"Hello again, You've been missed!"}/>
      <LoginComponent navigation={navigation}/>
    </ScrollView>
   
  );
}

const styles = StyleSheet.create({


})

export default LoginScreen