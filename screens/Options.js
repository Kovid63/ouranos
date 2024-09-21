import { View, Text, StatusBar, TouchableOpacity, Image } from 'react-native'
import React from 'react'

const Options = ({navigation}) => {

  return (
    <>
      <StatusBar translucent backgroundColor={'transparent'}/>
      <View style={{marginTop: '15%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '6%', alignItems: 'center'}}>
      <TouchableOpacity onPress={() => {navigation.goBack()}}>
        <Image source={require('../assets/arrow-left.png')} style={{height: 30, width: 30}}/>
      </TouchableOpacity>
        <Text style={{color: 'black', fontFamily: 'VarelaRound-Regular', fontSize: 26}}>Menu</Text>
      <View style={{width: '10%'}}>
        {/* Just to maintain space */}
      </View>
      </View>
    <View style={{marginTop: '5%'}}>
      <TouchableOpacity onPress={() => {navigation.push('myorder')}} style={{width: '55%',borderRadius: 5, marginLeft: '6%', paddingHorizontal: '3%', marginTop: '2%', paddingVertical: '2%', flexDirection: 'row'}}>
        <Image source={require('../assets/clipboard.png')} style={{height: 30, width: 30, alignSelf: 'center'}}/>
        <Text style={{color: 'black', fontSize: 20, fontFamily: 'NotoSans-Medium', marginLeft: '5%'}}>Your Orders</Text>
      </TouchableOpacity>
      {/*<TouchableOpacity style={{width: '55%',borderRadius: 5, marginLeft: '6%', paddingHorizontal: '3%', marginTop: '5%', paddingVertical: '2%', flexDirection: 'row'}}>
        <Image source={require('../assets/address.png')} style={{height: 30, width: 30, alignSelf: 'center'}}/>
        <Text style={{color: 'black', fontSize: 20, fontFamily: 'NotoSans-SemiBold', marginLeft: '5%'}}>Saved Address</Text>
      </TouchableOpacity>*/}
      <TouchableOpacity style={{width: '75%',borderRadius: 5, marginLeft: '6%', paddingHorizontal: '3%', marginTop: '2%', paddingVertical: '2%', flexDirection: 'row'}}>
        <Image source={require('../assets/policy.png')} style={{height: 30, width: 30, alignSelf: 'center'}}/>
        <Text style={{color: 'black', fontSize: 20, fontFamily: 'NotoSans-Medium', marginLeft: '5%'}}>Terms and Privacy Policy</Text>
      </TouchableOpacity>
    </View>
    </>
  )
}

export default Options