import AsyncStorage from '@react-native-async-storage/async-storage'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import React, { useContext, useState } from 'react'
import { Image, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { UserContext } from '../App'
import { auth, db } from '../Firebase'

const SignUpComponent = () => {
 
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


    const SignUpUserHandler = async(email,password,type) => {
        if(type == 'Select your account type') {
            ToastAndroid.show('Select Account Type!', ToastAndroid.LONG)
            return
        }
        if(email == '' || password == ''){
            ToastAndroid.show('Fill all required fields.', ToastAndroid.LONG)
            return
        }
        isLoading(true)
        const docRef = doc(db, type, email)
        await createUserWithEmailAndPassword(auth,email,password)
        .then(() => {
            setDoc(docRef,{
                account: type,
                profile_image: "data:image/png;base64,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",
                email: email,
                verified: false,
                kyc: false,
                purchased: 0,
                wished: [],
                kycDetails: {
                },
            })
            console.log('Congratulations! Your account has been created.')
            isLoading(false)
        }).catch((e)=> {  
            isLoading(false)
        if(e.message == 'Firebase: Error (auth/email-already-in-use).') {
            ToastAndroid.show('Email already registered! Sign In Please.', ToastAndroid.LONG)
        }
    })
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
            <View style={[styles.fieldContainer]}>
                <TouchableOpacity onPress={() => {isDown? setDown(false):setDown(true)}}>
                    <Image source={require('../assets/down-arrow.png')} style={{height: 20, width: 20}}/>
                </TouchableOpacity>
                    <Text style={{color: 'grey', marginLeft: '2%'}}>{type}</Text>
            </View>
        </View>
        {isDown? data.map((type,index) => (<View key={index} style={{height: 50, width: '90%', justifyContent: 'center', borderColor: 'black', borderWidth: 0.5}}>
            <Text onPress={()=> {[setType(type.name), setDown(false), setGlobalType(type.name)]}} style={{color: 'black', marginLeft: '10%', paddingHorizontal: '1%'}}>{type.name}</Text>
        </View>)):<></>}
        <View>
            <Text style={styles.field}>Email</Text>
            <View style={[styles.fieldContainer, isselected === 'email'? {borderColor: 'black'}:{borderColor: 'grey'} ]}>
                <TextInput keyboardType='email-address' style={{color: 'black', width: '100%'}} onFocus={() => setSelected('email')} placeholder={'Enter your email'} placeholderTextColor={'grey'} onChangeText={(value) => setEmail(value)}/>
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
        <TouchableOpacity onPress={() => {loading? <></> :[SignUpUserHandler(email,password,type), addTypeToCache(type)]}}>
            <View style={styles.SignUp}>
            {loading? 
              <>
                <Image style={{height: 50, width: 50}} source={require('../assets/barloading.gif')}/>
              </>
              :
              <>
                <Text style={styles.signUpText}>Sign Up</Text>
              </>}
            </View>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({

    container: {
        marginLeft: '8%',
        marginTop: '8%',
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


    SignUp: {
        backgroundColor: 'teal',
        height: 50,
        width: '90%',
        marginTop: '10%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    signUpText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },

})


export default SignUpComponent