import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';

const OtpVerify = ({route, navigation}) => {

    const[otp, setOtp] = useState('');
    const[isselected, setSelected] = useState(null)
    const[value, setValue] = useState('')

    

    useEffect(() => {
        //setOtp(route.params.otp)
    },[])
    

  return (
    <View style={{marginLeft: '8%'}}>
            <Text style={styles.field}>Secret Code</Text>
            <View style={[styles.fieldContainer,  isselected && value.length <= 0 || isselected && value.length > 4  ? {borderColor: 'red'} : {borderColor: 'black'}]}>
                <TextInput keyboardType='number-pad' onFocus={()=> {setSelected(true)}} style={{color: 'black', width: '90%', paddingTop: '4%', paddingBottom: '4%'}} placeholder={'Enter 4-digit OTP'} placeholderTextColor={'grey'} onChangeText={(value) => setValue(value)}/>
            </View>
        <TouchableOpacity style={styles.Login} onPress={()=> {/*value == otp?*/ navigation.push('SignUpScreen')/* : ToastAndroid.show('wrong OTP', ToastAndroid.SHORT)*/}}>
                <View>
                    <Text style={styles.loginText}>Verify</Text>
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

export default OtpVerify