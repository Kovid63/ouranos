import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import { UserContext } from '../App'
import { auth, db } from '../Firebase'

const MyOrders = ({navigation}) => {

    const{globalType} = useContext(UserContext)
    const[items, setItems] = useState([])
    const[loading, isLoading] = useState(true)
    const[result, setResult] = useState(true)

    const dataHandler = () => {
        onSnapshot(collection(db, globalType , auth.currentUser.email, 'YourOrders'), 
         (snap) => {[setItems(snap.docs.map(doc => doc.data())), isLoading(false), snap.size == 0? setResult(false) : setResult(true)]}
       )
   }


   useEffect(() => {
    dataHandler()
    },[])


  return (
    <>
    <View style={{marginTop: '15%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '6%', alignItems: 'center'}}>
      <StatusBar translucent backgroundColor={'transparent'}/>
      <TouchableOpacity onPress={() => {navigation.goBack()}}>
        <Image source={require('../assets/arrow-left.png')} style={{height: 30, width: 30}}/>
      </TouchableOpacity>
      <Text style={{color: 'black', fontFamily: 'VarelaRound-Regular', fontSize: 20}}>Your Orders</Text>
      <View style={{width: '4%'}}>
        {/* Just to maintain space */}
      </View>
    </View>
    { loading?
    <Image style={{height: 100, width: 100, alignSelf: 'center', marginTop: '60%'}} source={require('../assets/loading.gif')}/>
    
    :
    result? 
    <ScrollView style={{marginTop: '5%', marginBottom: '22%'}}>
     {items.map((item, index) => (
        <View key={index} style={{width: '100%', marginTop: '0%', backgroundColor: 'white', borderBottomColor: 'grey', borderBottomWidth: 1, paddingVertical: '5%', elevation: 5}}>
          <Text style={{color: 'black', fontFamily: 'VarelaRound-Regular', fontSize: 16, marginHorizontal: '6%'}}>Order ID: {item.orderId}</Text>
          <Text style={{color: 'black', fontFamily: 'VarelaRound-Regular', fontSize: 14, marginHorizontal: '6%', marginTop: '2%'}}>Ordered on: {item.date}</Text>
          <Text style={{color: 'black', fontFamily: 'VarelaRound-Regular', fontSize: 14, marginHorizontal: '6%'}}>Time: {item.time}</Text>
          <Text style={{color: 'black', fontFamily: 'VarelaRound-Regular', fontSize: 14, marginHorizontal: '6%'}}>Status: {item.status}</Text>
          <Text style={{color: 'black', fontFamily: 'VarelaRound-Regular', fontSize: 14, marginHorizontal: '6%'}}>Total Amount Paid: ₹{item.totalAmount.toLocaleString('en-us')}</Text>
          <Text style={{color: 'black', fontFamily: 'VarelaRound-Regular', fontSize: 14, marginHorizontal: '6%', marginTop: '2%'}}>Products: {item.products.length}</Text>
          {
            item.products.map((prod, index) => (
              <View key={index}>
                <Text style={{color: '#0098EF', fontFamily: 'VarelaRound-Regular', fontSize: 12, marginHorizontal: '6%'}}>Name: {prod.name}</Text>
                <Text style={{color: 'black', fontFamily: 'VarelaRound-Regular', fontSize: 12, marginHorizontal: '6%'}}>Version: {prod.version.name}</Text>
                <Text style={{color: 'black', fontFamily: 'VarelaRound-Regular', fontSize: 12, marginHorizontal: '6%'}}>Price: ₹{prod.version.price.toLocaleString('en-us')}</Text>
                <Text style={{color: 'black', fontFamily: 'VarelaRound-Regular', fontSize: 12, marginHorizontal: '6%'}}>Quantity: {prod.quantity}</Text>
              </View>
              ))
          }
        </View>
     ))}
    </ScrollView>:
    <>
      <Image style={{height: 100, width: 100, alignSelf: 'center', marginTop: '60%'}} source={require('../assets/browser.png')}/>
    </>}
    </>
  )
}

export default MyOrders