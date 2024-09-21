import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import AllInOneSDKManager from 'paytm_allinone_react-native'
import React, { useContext, useState } from 'react'
import { Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { UserContext } from '../App'
import { auth, db } from '../Firebase'
import { CALLBACK_URL, MID, URL_SCHEME } from '../paytm/Constants'
import { generateToken } from '../paytm/Service'

const BillingScreen = ({navigation, route}) => {
   
  const[isselected, setSelected] = useState(null)
  const[details, setDetails] = useState({name: '', address: '', city: '', state: '', pin: '', phone: '', email: ''})
  const{globalType, userData} = useContext(UserContext)
  const[loading, isLoading] = useState(false)



  const postPaymentNotificationHandler = async(orderId, bool) => {
    const notiRef = doc(db, globalType, auth.currentUser.email, 'Notifications', orderId)
    if(bool){
    await setDoc(notiRef, {
      message: 'Your last order #'+orderId+' was placed successfully.',
    })
    }
    else if(!bool){
      await setDoc(notiRef, {
        message: 'Your last order #'+orderId+' failed.',
      })
    }
  }

  const postPaymentOrderHandler = async(orderId, items, amount, details) => {
    const docRef = doc(db, 'Orders',  orderId)
    const userDocRef = doc(db, globalType, auth.currentUser.email)
    const userOrderDocRef = doc(db, globalType,auth.currentUser.email, 'YourOrders', orderId)
    const d = new Date()
    const date = d.getDate()
    const month = d.toLocaleString('default', {month: 'long'})
    const year = d.getFullYear()
    
    getDoc(userDocRef).then((snap) => {

      setDoc(docRef, {
        products: items,
        totalAmount: amount,
        orderId: orderId,
        status: 'Processing',
        name: snap.data().kycDetails.name,
        //address: snap.data().kycDetails.address,
        billingDetail: details,
      })

      updateDoc(userDocRef, {
          purchased: snap.data().purchased + items.length,
      })

      setDoc(userOrderDocRef, {
        products: items,
        totalAmount: amount,
        orderId: orderId,
        status: 'Processing',
        billingDetail: details,
        date: month +' '+ date +', ' + year,
        time: d.toLocaleTimeString(),
      })

      items.forEach((item) => {
        deleteDoc(doc(db,globalType, auth.currentUser.email, 'Cart', item.version.name))
      })

     
    }).then(() => ToastAndroid.show('Order Successful', ToastAndroid.LONG))

  
  }

  const uiHandler = (bool, order, orderId, amount, paymentMode) => {
    navigation.replace('Order', {
      result: bool,
      order: order,
      orderId: orderId,
      amount: amount,
      paymentMode: paymentMode,
    })
  }


  const merge = (str1, str2) => {

    var a = str1.split("").filter(Boolean);
  
    var b = str2.split("");
  
    var mergedString = '';
  
  
    for(var i = 0; i < a.length || i < b.length; i++) {  //loop condition checks if i is less than a.length or b.length
     if(i < a.length)  //if i is less than a.length add a[i] to string first.
       mergedString +=  a[i];
     if(i < b.length)  //if i is less than b.length add b[i] to string.
       mergedString +=  b[i];
    }
  return mergedString;
  
  }


  const payNow = async(amount, items, details) => {

    if(!userData.kyc){
      ToastAndroid.show('Complete KYC details please.', ToastAndroid.SHORT);
      navigation.navigate('Profile');
      return;
    }

    if(!userData.verified){
      ToastAndroid.show('Wait for kyc verification.', ToastAndroid.SHORT);
      navigation.navigate('Profile');
      return;
    }

    if(details.name == '' || details.address == '' || details.city == '' || details.state == '' || details.pin == '' || details.phone == ''){
      ToastAndroid.show('Fill all required fields', ToastAndroid.SHORT);
      return;
    }

    if(details.phone.length < 14 || details.phone.length > 14 ){
      ToastAndroid.show('Invalid phone number', ToastAndroid.SHORT);
      return;
    }

    //loading starts
    isLoading(true)

    const day = new Date()
    const customerId = auth.currentUser.uid
    //const orderId = day.getTime()+customerId
    const orderId = merge(customerId.substring(0,5), day.getTime().toString())
    const token = await generateToken(orderId, amount, customerId);
   
    
    
    try {
      AllInOneSDKManager.startTransaction(
        orderId,
        MID,
        token,
        amount.toFixed(2),
        CALLBACK_URL+orderId,
        //false, for production
        true,
        true,
        URL_SCHEME
      )
      .then((result) => {
        //const res = JSON.parse(result.body)
        console.log("gateway response", result);
        isLoading(false)
        result.STATUS == 'TXN_SUCCESS'? 
          [postPaymentOrderHandler(orderId, items, amount, details), uiHandler(true, details, orderId, amount, result.PAYMENTMODE), postPaymentNotificationHandler(orderId, true)]
        : [uiHandler(false, details, orderId, amount), postPaymentNotificationHandler(orderId, false) ]
      })
      .catch((err) => {
        isLoading(false)
        console.log("gateway error",err);
      });
    } catch (error) {
      isLoading(false)
      console.log("try catch error",error)
    }

  }

  return (
    <ScrollView keyboardShouldPersistTaps={'always'}>
      <View style={{marginTop: '15%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '6%', alignItems: 'center'}}>
          <StatusBar translucent backgroundColor={'transparent'}/>
          <TouchableOpacity onPress={() => {navigation.goBack()}}>
              <Image source={require('../assets/arrow-left.png')} style={{height: 30, width: 30}}/>
          </TouchableOpacity>
          <Text style={{color: 'black', fontFamily: 'VarelaRound-Regular', fontSize: 20}}>Billing Information</Text>
          <View>
          {/* Just to maintain space */} 
          </View>
      </View>
      <View style={{marginTop: '10%', marginLeft: '5%'}}>
        <Text style={{color: 'black', fontFamily: 'VarelaRound-Regular', fontSize: 18}}>Personal Details</Text>
        
        {/*Name Field*/}
        <View>
          <View style={[styles.fieldContainer, isselected === 'name' ? {borderColor: 'black'}:{borderColor: 'grey'} ]}>
            <TextInput style={{color: 'black', width: '100%'}} onFocus={() => setSelected('name')} placeholder={'Full Name'} placeholderTextColor={'grey'} onChangeText={(value) => {setDetails({...details, name: value})}}/>
          </View>
        </View>

         {/*Address Field*/}
         <View>
          <View style={[styles.fieldContainer, isselected === 'address' ? {borderColor: 'black'}:{borderColor: 'grey'} ]}>
            <TextInput style={{color: 'black', width: '100%'}} onFocus={() => setSelected('address')} placeholder={'Address'} placeholderTextColor={'grey'} onChangeText={(value) => {setDetails({...details, address: value})}}/>
          </View>
        </View>

        {/*City Field*/}
        <View>
          <View style={[styles.fieldContainer, isselected === 'landmark' ? {borderColor: 'black'}:{borderColor: 'grey'} ]}>
            <TextInput style={{color: 'black', width: '100%'}} onFocus={() => setSelected('landmark')} placeholder={'Landmark'} placeholderTextColor={'grey'} onChangeText={(value) => {setDetails({...details, city: value})}}/>
          </View>
        </View>

         {/*State Field*/}
         <View>
          <View style={[styles.fieldContainer,  isselected === 'state' ? {borderColor: 'black'}:{borderColor: 'grey'} ]}>
            <TextInput style={{color: 'black', width: '100%'}} onFocus={() => setSelected('state')} placeholder={'State'} placeholderTextColor={'grey'} onChangeText={(value) => {setDetails({...details, state: value})}}/>
          </View>
         </View>

         {/*Pin code Field*/}
         <View>
          <View style={[styles.fieldContainer,  isselected === 'pin' ? {borderColor: 'black'}:{borderColor: 'grey'} ]}>
            <TextInput keyboardType={'number-pad'} style={{color: 'black', width: '100%'}} onFocus={() => setSelected('pin')} placeholder={'Pin code'} placeholderTextColor={'grey'} onChangeText={(value) => {setDetails({...details, pin: value})}}/>
          </View>
         </View>

      </View>

      <View style={{marginTop: '10%', marginLeft: '5%'}}>
        <Text style={{color: 'black', fontFamily: 'VarelaRound-Regular', fontSize: 18}}>Contact Details</Text>
        
        {/*Phone number Field*/}
        <View>
          <View style={[styles.fieldContainer, isselected === 'phone' ? {borderColor: 'black'}:{borderColor: 'grey'}, isselected === 'phone' && details.phone.length < 14 || details.phone.length > 14? {borderColor: 'red'}:<></>]}>
            <TextInput keyboardType='number-pad' style={{color: 'black', width: '100%'}} onFocus={() => setSelected('phone')} placeholder={'Phone number'} placeholderTextColor={'grey'} onChangeText={(value) => {setDetails({...details, phone: '+91 '+value})}}/>
          </View>
        </View>

         {/*Email address Field*/}
         <View>
          <View style={[styles.fieldContainer, isselected === 'email' ? {borderColor: 'black'}:{borderColor: 'grey'} ]}>
            <TextInput style={{color: 'black', width: '100%'}} onFocus={() => setSelected('email')} placeholder={'Email (optional)'} placeholderTextColor={'grey'} onChangeText={(value) => {setDetails({...details, email: value})}}/>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={() => {loading? <></> : payNow(route.params.amount, route.params.items, details)}}>
            <View style={styles.SignUp}>
              {loading? 
              <>
                <Image style={{height: 50, width: 50}} source={require('../assets/barloading.gif')}/>
              </>
              :
              <>
                <Text style={styles.signUpText}>Payment</Text>
              </>}
              
            </View>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({

  field: {
    marginTop: '3%',
    color: 'black',
    fontSize: 15,
    fontWeight: '600',
  },

  fieldContainer: {
    width: '90%',
    marginTop: '3%',
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  SignUp: {
    backgroundColor: 'black',
    height: 50,
    width: '90%',
    marginTop: '10%',
    alignSelf: 'center',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10%',
},

signUpText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
},
})

export default BillingScreen