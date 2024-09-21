import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { UserContext } from '../App'
import { signOut } from 'firebase/auth'
import { auth } from '../Firebase'

const NeerProfile = ({navigation}) => {

  const{userData, globalType} = useContext(UserContext)

  var accBlur ='';

  if(userData.kyc) {
    const account = userData.kycDetails.bankAccount
    accBlur = 'X'.repeat(account.length-4)+account.substring(account.length-4, account.length)
  }
  
  useEffect(() => {
    
  },[])

  //console.log(userData.kycDetails.name)

  return (
    <View>
      <StatusBar translucent backgroundColor={'transparent'}/>
    {/* 
    <ScrollView>
      <StatusBar translucent backgroundColor={'transparent'}/>
      { userData.kyc ? 
      <>
      <View style={{height: 200}}>
        <Image source={{uri: 'https://images.unsplash.com/photo-1552761831-7ef8ec07adbd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=702&q=80'}} style={{height: '100%'}}/>
      </View>
      <View style={{height: 200, width: '80%', backgroundColor: 'white', alignSelf: 'center', bottom: '12%', borderRadius: 10}}>
        <Image source={{uri: userData.profile_image}}
          style={{height: 80, width: 80, alignSelf: 'center', borderRadius: 40, bottom: '20%'}}
        />
        <View style={{ flex :1, flexDirection: 'row', alignItems: 'center', bottom: '12%', justifyContent: 'center'}}>
          <Text style={{color: 'grey', fontWeight: '700', fontSize: 20}}>{userData.kycDetails.name.length > 15 ? userData.kycDetails.name.substring(0,14) + '...': userData.kycDetails.name }</Text>
          {userData.verified? <Image source={require('../assets/verified.png')}
          style={{height: 20, width: 20, marginLeft: '2%'}}
          />:<></>}
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '10%', bottom: '8%'}}>
          <View style={{alignItems: 'center'}}>
            <Text style={{color: 'black', fontWeight: '600'}}>Purchased</Text>
            <Text style={{color: 'grey', fontWeight: '600', marginTop: 8, fontSize: 30}}>{userData.purchased}</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={{color: 'black', fontWeight: '600'}}>Wished</Text>
            <Text style={{color: 'grey', fontWeight: '600', marginTop: 8, fontSize: 30}}>{userData.wished.length}</Text>
          </View>
        </View>
        </View>
        <Text style={{color: 'black', fontWeight: '600', alignSelf: 'center'}}>PAN card number: <Text style={{color: 'grey', fontWeight: '500',}}>{userData.kycDetails.PAN}</Text></Text>
        
        </>
        :
        <>
        <Text style={{marginTop: '20%',color: 'black', fontWeight: '600', fontSize: 20, marginLeft: '10%'}}>Hello,</Text>
        <Text style={{color: 'grey', fontWeight: '600', fontSize: 16, marginLeft: '10%'}}>You have some missing information.</Text>
        <Text style={{color: 'grey', fontWeight: '600', fontSize: 16, marginLeft: '10%'}}>Let's know you better!</Text>
        <TouchableOpacity onPress={() => {navigation.push('Kyc')}}>
            <View style={styles.SignUp}>
                <Text style={styles.signUpText}>Complete KYC</Text>
            </View>
        </TouchableOpacity>
        </> }
    </ScrollView>
    */}
    {userData.kyc? <>
    <View style={{marginTop: '15%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '6%', alignItems: 'center'}}>
      <TouchableOpacity onPress={() => {navigation.goBack()}}>
        <Image source={require('../assets/arrow-left.png')} style={{height: 30, width: 30}}/>
      </TouchableOpacity>
      <Text style={{color: 'black', fontFamily: 'VarelaRound-Regular', fontSize: 20}}>Profile</Text>
      <View style={{marginHorizontal: '3%'}}></View>
    </View>
    <ScrollView>
    <View style={{marginLeft: '6%', marginTop: '8%', flexDirection: 'row'}}>
      <Image source={{uri: userData.profile_image}}
          style={{height: 80, width: 80, borderRadius: 40}}
        />
      
      <View style={{alignSelf: 'center'}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontFamily: 'VarelaRound-Regular', color: 'black',  marginLeft: '3%', fontSize: 18}}>{userData.kycDetails.name}</Text>
          {userData.verified? <Image source={require('../assets/verified.png')}
          style={{height: 20, width: 20, marginLeft: '2%'}}
          />:<></>}
        </View>
        <Text style={{fontFamily: 'VarelaRound-Regular', color: 'grey',  marginLeft: '3%', fontSize: 16}}>{globalType}</Text>
      </View>
    </View>

    <View style={{marginLeft: '6%', marginTop: '8%'}}>
      <Text style={{fontFamily: 'NotoSans-Bold', color: 'black', fontSize: 18}}>{'Account'}</Text>
      <Text style={{fontFamily: 'VarelaRound-Regular', color: 'grey', fontSize: 16}}>{auth.currentUser.email}</Text>
      <Text style={{fontFamily: 'NotoSans-Regular', color: 'black', fontSize: 16, marginTop: '2%'}}>{'PAN'}</Text>
      <Text style={{fontFamily: 'VarelaRound-Regular', color: 'grey', fontSize: 16}}>{userData.kycDetails.PAN}</Text>
      <Text style={{fontFamily: 'NotoSans-Regular', color: 'black', fontSize: 16, marginTop: '2%'}}>{'Bank Name'}</Text>
      <Text style={{fontFamily: 'VarelaRound-Regular', color: 'grey', fontSize: 16}}>{userData.kycDetails.bankName}</Text>
      <Text style={{fontFamily: 'NotoSans-Regular', color: 'black', fontSize: 16, marginTop: '2%'}}>{'Account Number'}</Text>
      <Text style={{fontFamily: 'VarelaRound-Regular', color: 'grey', fontSize: 16}}>{accBlur}</Text>
      <Text style={{fontFamily: 'NotoSans-Regular', color: 'black', fontSize: 16, marginTop: '2%'}}>{'IFSC code'}</Text>
      <Text style={{fontFamily: 'VarelaRound-Regular', color: 'grey', fontSize: 16}}>{userData.kycDetails.bankIfsc}</Text>
      <Text style={{fontFamily: 'NotoSans-Regular', color: 'black', fontSize: 16, marginTop: '2%'}}>{'Kyc status'}</Text>
      <Text style={{fontFamily: 'VarelaRound-Regular', color: 'grey', fontSize: 16}}>{userData.kyc? 'Completed': 'Pending'}</Text>
      <Text style={{fontFamily: 'NotoSans-Regular', color: 'black', fontSize: 16, marginTop: '2%'}}>{'Verification'}</Text>
      <Text style={{fontFamily: 'VarelaRound-Regular', color: 'grey', fontSize: 16}}>{userData.verified? 'Verified': 'Not Verified'}</Text>
    </View>
    <View style={{marginLeft: '6%'}}>
      <TouchableOpacity onPress={() => { signOut(auth) }}>
        <Text style={{fontFamily: 'NotoSans-Bold', color: 'black', fontSize: 18, marginTop: '8%'}}>{'Logout'}</Text>
        <Text style={{fontFamily: 'VarelaRound-Regular', color: 'grey', fontSize: 14,}}>{'Currently logged in as'}{' '}{userData.kycDetails.name}</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={{fontFamily: 'NotoSans-Bold', color: 'black', fontSize: 18, marginTop: '8%'}}>{'About Us'}</Text>
        <Text style={{fontFamily: 'VarelaRound-Regular', color: 'grey', fontSize: 16}}>{'Lorem ipsum dolor sit amet consectetur.'}</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={{fontFamily: 'NotoSans-Bold', color: 'black', fontSize: 18, marginTop: '3%'}}>{'Privacy Policy'}</Text>
        <Text style={{fontFamily: 'VarelaRound-Regular', color: 'grey', fontSize: 16, marginBottom: '50%'}}>{'Lorem ipsum dolor sit amet consectetur.'}</Text>
      </TouchableOpacity>
    </View></ScrollView></> : <>
        <Text style={{marginTop: '20%',color: 'black', fontWeight: '600', fontSize: 20, marginLeft: '10%'}}>Hello,</Text>
        <Text style={{color: 'grey', fontWeight: '600', fontSize: 16, marginLeft: '10%'}}>You have some missing information.</Text>
        <Text style={{color: 'grey', fontWeight: '600', fontSize: 16, marginLeft: '10%'}}>Let's know you better!</Text>
        <TouchableOpacity onPress={() => {navigation.push('Kyc')}}>
            <View style={styles.SignUp}>
                <Text style={styles.signUpText}>Complete KYC</Text>
            </View>
        </TouchableOpacity>
        </> }
    </View>
  )
}


const styles = StyleSheet.create({
  SignUp: {
    backgroundColor: 'teal',
    height: 30,
    width: '50%',
    marginTop: '10%',
    marginLeft: '8%',
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

export default NeerProfile