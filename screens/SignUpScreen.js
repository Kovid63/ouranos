import React, { useContext, useEffect } from 'react'
import { ScrollView, StatusBar } from 'react-native'
import { UserContext } from '../App'
import SignUpComponent from '../components/SignUpComponent'
import Welcome from '../components/Welcome'

const SignUpScreen = ({navigation}) => {
  
  const{setGlobalType} = useContext(UserContext)


  useEffect(() => {
    setGlobalType('')
  }, [])

  return (
    <ScrollView style={{}}>
        <StatusBar translucent backgroundColor={'transparent'}></StatusBar>
        <Welcome message={'Create Account'} subMessage={'Your journey starts here!'}/>
        <SignUpComponent/>
    </ScrollView>
  )
}

export default SignUpScreen