import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useContext, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../Firebase'
import { UserContext } from '../App'
import AsyncStorage from '@react-native-async-storage/async-storage'

const LoginComponent = ({navigation}) => {

    const[isselected, setSelected] = useState(null)
    const[isHidden, setHidden] = useState(true)
    const[email, setEmail]= useState('')
    const[password, setPassword]= useState('')
    const[isDown, setDown] = useState(false)
    const[type, setType] = useState('Select your account type')
    const{setGlobalType} = useContext(UserContext)
    const[loading, isLoading] = useState(false)

    const data = [
        {
            name: 'Retailer',
        },
        {
            name: 'Neerbandhu',
        },
    ]


    const SignInUserHandler = async(email,password) => {
        if(type == 'Select your account type') {
            ToastAndroid.show('Select Account Type!', ToastAndroid.LONG)
            return
        }
        isLoading(true)
        await signInWithEmailAndPassword(auth,email,password)
        .then(() => {isLoading(false)})
        .catch((e) => {[ToastAndroid.show('Wrong Email/Password', ToastAndroid.SHORT), isLoading(false)]})
    }


    const addTypeToCache = async(type) =>{
        try {
            await AsyncStorage.setItem('account_type', type)
          } catch (e) {
            console.log(e)
          }
    }


  return (
    <View style={styles.container}>
        <View>
            <Text style={styles.field}>Account Type</Text>
            <TouchableOpacity onPress={() => {isDown? setDown(false):setDown(true)}} style={[styles.fieldContainer]}>
                <TouchableOpacity onPress={() => {isDown? setDown(false):setDown(true)}}>
                    <Image source={require('../assets/down-arrow.png')} style={{height: 20, width: 20}}/>
                </TouchableOpacity>
                    <Text style={[type === 'Select your account type'? {color: 'grey'}:{color: 'black'},{marginLeft: '2%'}]}>{type}</Text>
            </TouchableOpacity>
        </View>
        {isDown? data.map((type,index) => (<View key={index} style={{height: 50, width: '90%', justifyContent: 'center', borderColor: 'black', borderWidth: 0.5}}>
            <Text onPress={()=> {[setType(type.name), setDown(false)]}} style={{color: 'black', marginLeft: '10%', paddingHorizontal: '1%'}}>{type.name}</Text>
        </View>)):<></>}
        <View>
            <Text style={styles.field}>Email</Text>
            <View style={[styles.fieldContainer, isselected === 'email'? {borderColor: 'black'}:{borderColor: 'grey'} ]}>
                <TextInput style={{color: 'black', width: '100%'}} onFocus={() => setSelected('email')} placeholder={'Enter your email'} placeholderTextColor={'grey'} onChangeText={(value) => setEmail(value)}/>
            </View>
        </View>
        <View>
            <Text style={styles.field}>Password</Text>
            <View style={[styles.fieldContainer, isselected === 'password'? {borderColor: 'black'}:{borderColor: 'grey'}]}>
                <TextInput style={{color: 'black', width: '80%'}} onFocus={() => setSelected('password')} placeholder={'Enter your password'} placeholderTextColor={'grey'} secureTextEntry={isHidden} onChangeText={(value) => setPassword(value)}/>
                <View style={styles.hiddenContainer}>
                    <TouchableOpacity onPress={()=> { isHidden? setHidden(false) : setHidden(true)}}>
                        <Image style={styles.hidden} source={isHidden? require('../assets/hidden.png'): require('../assets/view.png') }/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        <Text style={styles.forgot}>Forgot Password?</Text>
        <TouchableOpacity style={styles.Login} onPress={() => {loading? <></> : [SignInUserHandler(email,password), setGlobalType(type), addTypeToCache(type)]}}>
            <View>
            {loading? 
              <>
                <Image style={{height: 50, width: 50}} source={require('../assets/barloading.gif')}/>
              </>
              :
              <>
                <Text style={styles.loginText}>Login</Text>
              </>}
            </View>
        </TouchableOpacity>
        <Text style={styles.footer}>Don't have an account?<Text onPress={() => {navigation.push('SignUpScreen')}} style={{color: 'teal',fontWeight: '600'}}> Sign Up</Text></Text>
    </View>
  )
}

const styles = StyleSheet.create({

    container: {
        marginLeft: '8%',
        marginTop: '15%',
    },

    field:{
        marginTop: '3%',
        color: 'black',
        fontSize: 15,
        fontWeight: '600',
    },

    fieldContainer:{
        width: '90%',
        marginTop: '3%',
        borderRadius: 5,
        borderWidth: 1,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
    },

    hiddenContainer:{
       marginLeft: '10%',
    },

    hidden:{
        height: 20,
        width: 20,
    },

    forgot: {
        color: 'teal',
        fontWeight: '600',
        marginTop: '5%',
    },

    Login: {
        backgroundColor: 'teal',
        height: 50,
        width: '90%',
        marginTop: '5%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    loginText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },

    footer: {
        color: 'grey',
        marginTop: '40%',
        justifyContent: 'center',
        alignSelf: 'center',
        marginRight: '8%',
        marginBottom: '10%',
    },
})

export default LoginComponent