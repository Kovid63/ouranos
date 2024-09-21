import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PhoneVerify = ({navigation}) => {

    const[phone, setPhone] = useState('+91');
    const[isselected, setSelected] = useState(null)


    const sendOTP = async() => {
        await fetch('http://192.168.1.2/phone.php',{
            method: 'POST',
            body: JSON.stringify({
                phone: phone,
              }),
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
           })
           .then((response)=>response.json()).then((otp)=>{
             navigation.push('OtpScreen', {
                number: phone,
                otp: otp.code,
            })
          });
    }



  return (
    <View style={{marginLeft: '8%'}}>
            <Text style={styles.field}>Phone number</Text>
            <View style={[styles.fieldContainer,  isselected && phone.length < 4 || isselected && phone.length > 14  ? {borderColor: 'red'} : {borderColor: 'black'}]}>
                <Text style={{color: 'black'}}>+91</Text>
                <TextInput keyboardType='number-pad' onFocus={()=> {setSelected(true)}} style={{color: 'black', width: '90%', paddingTop: '4%', paddingBottom: '4%'}} placeholder={'Enter your phone number'} placeholderTextColor={'grey'} onChangeText={(value) => setPhone('+91'+value)}/>
            </View>
        <TouchableOpacity style={styles.Login} onPress={()=> {[/*sendOTP()*/navigation.push('OtpScreen')]}}>
                <View>
                    <Text style={styles.loginText}>Send Code</Text>
                </View>
        </TouchableOpacity>
    </View>
    
  )
}

const styles = StyleSheet.create({
    field:{
        marginTop: '10%',
        color: 'black',
        fontSize: 15,
        fontWeight: '600',
    },

    fieldContainer:{
        width: '85%',
        marginTop: '3%',
        borderRadius: 5,
        borderWidth: 1,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },

    Login: {
        backgroundColor: 'teal',
        height: 40,
        width: '50%',
        marginTop: '8%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    loginText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },


})

export default PhoneVerify