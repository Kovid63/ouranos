import { collection, deleteDoc, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import AllInOneSDKManager from 'paytm_allinone_react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { UserContext } from '../App'
import { auth, db } from '../Firebase'
import { CALLBACK_URL, MID, URL_SCHEME } from '../paytm/Constants'
import { generateToken } from '../paytm/Service'


const NeerCart = ({navigation}) => {

  const[items, setItems] = useState([])
  const{globalType} = useContext(UserContext)
  const[selected, setSelected] = useState()
  const[sel, setSel] = useState()

  var total = 0
  var tax = 0
  var subtotal = 0

  const postPaymentOrderHandler = async(orderId, items, amount) => {
    const docRef = doc(db, 'Orders',  orderId)
    const userDocRef = doc(db, globalType, auth.currentUser.email)
    const userOrderDocRef = doc(db, globalType,auth.currentUser.email, 'YourOrders', orderId)
    
    getDoc(userDocRef).then((snap) => {

      setDoc(docRef, {
        products: items,
        totalAmount: amount,
        orderId: orderId,
        status: 'Processing',
        name: snap.data().kycDetails.name,
        address: snap.data().kycDetails.address,
      })

      updateDoc(userDocRef, {
          purchased: snap.data().purchased + items.length,
      })

      setDoc(userOrderDocRef, {
        products: items,
        totalAmount: amount,
        orderId: orderId,
        status: 'Processing',
      })

      items.forEach((item) => {
        deleteDoc(doc(db,globalType, auth.currentUser.email, 'Cart', item.version.name))
      })
     
    }).then(() => ToastAndroid.show('Order Successful', ToastAndroid.LONG))

  
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

 
  const payNow = async(amount, items) => {

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
        false,
        true,
        URL_SCHEME
      )
      .then((result) => {
        //const res = JSON.parse(result.body)
        console.log("gateway response", result.STATUS);
        result.STATUS == 'TXN_FAILURE'? 
          postPaymentOrderHandler(orderId, items, amount)
        : {}
      })
      .catch((err) => {
        console.log("gateway error",err);
      });
    } catch (error) {
      console.log("try catch error",error)
    }

  }


  const deleteCart = async(items) => {
    items.forEach((item) => {
      deleteDoc(doc(db,globalType, auth.currentUser.email, 'Cart', item.version.name))
    })
  } 





  const dataHandler = () => {
       onSnapshot(collection(db, globalType , auth.currentUser.email, 'Cart'), 
        (snap) => {setItems(snap.docs.map(doc => doc.data()))}
      )
  }

  const quantityHandler = async(item, _quantity) => {
    const docRef = doc(db,globalType, auth.currentUser.email, 'Cart', item.version.name)

    if(_quantity == 0) {
      deleteDoc(docRef)
      return
    }
    else if (_quantity < 27){
      if(_quantity == 26) {
        ToastAndroid.show('Max quantity reached', ToastAndroid.LONG)
        return
      }
      updateDoc(docRef, {
        quantity: _quantity,
        price: item.base_price * _quantity
      }).then(()=> {
        //do something if you want to
      })
    }
  }

  useEffect(() => {
      dataHandler()
  },[])



  return (
    <>
    <View style={{marginTop: '15%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '6%', alignItems: 'center'}}>
      <TouchableOpacity onPress={() => {navigation.goBack()}}>
        <Image source={require('../assets/arrow-left.png')} style={{height: 30, width: 30}}/>
      </TouchableOpacity>
      <Text style={{color: 'black', fontFamily: 'VarelaRound-Regular', fontSize: 20}}>My Cart</Text>
      <TouchableOpacity onPress={() => {deleteCart(items)}}>
        <Image source={require('../assets/trash-bin.png')} style={{height: 20, width: 20}}/>
      </TouchableOpacity>
    </View>
    <View style={{alignItems: 'center', marginTop: '10%'}}>
      {
        items.map((item, index) => { 
          total = total + item.price;
          tax = total * (20/100);
          subtotal = total - tax;
          return (
          item.quantity == 0? <View key={index}></View>:
            <View key={index} style={{width: '90%', height: 120, borderRadius: 10, flexDirection: 'row', marginBottom: '5%', backgroundColor: 'white', elevation: 5,justifyContent: 'space-between'}}>
              <Image source={{uri: item.poster[0]}} style={{height: '90%', width: '30%', alignSelf: 'center', borderRadius: 100, marginLeft: '3%'}}/>
              <View style={{alignSelf: 'center', width: '50%'}}>
                <Text style={{color: 'black', fontSize: 14, marginLeft: '6%', fontWeight: '500', fontFamily: 'NotoSans-SemiBold'}}>{item.name.length > 50 ? item.name.substring(0,50)+' '+item.version.name+'...' : item.name+item.version.name}</Text>
                <View style={{flexDirection: 'row', marginLeft: '5%', marginTop: '3%', marginRight: '10%'}}>
                  <Text style={{color: 'grey', fontWeight: '600',fontSize: 12}}>₹ </Text>
                  <Text style={{color: 'grey', fontSize: 18, marginTop: '-5%',fontWeight: '500', fontFamily: 'NotoSans-SemiBold'}}>{item.base_price.toLocaleString('en-US')}</Text>
                </View>
              </View>
              <View style={{marginRight: '5%', alignSelf: 'center'}}>
                <TouchableOpacity onPress={() => { [quantityHandler(item, item.quantity - 1), setSelected('minus'), setSel(item.version.name)]}} style={[selected === 'minus' && sel === item.version.name? {backgroundColor: '#A6D1E6', padding: 5, borderRadius: 20}:{padding: 5}]}>
                  <Image source={require('../assets/minus.png')} style={{height: 15, width: 15}}/>
                </TouchableOpacity>
                 <Text style={{color: 'black', fontSize: 14, fontWeight: '500', fontFamily: 'NotoSans-Bold', marginVertical: '10%', paddingHorizontal: 7}}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => { [quantityHandler(item, item.quantity + 1), setSelected('add'), setSel(item.version.name)]}} style={[selected === 'add' && sel === item.version.name? {backgroundColor: '#A6D1E6', padding: 5, borderRadius: 20}:{padding: 5}]}>
                  <Image source={require('../assets/add.png')} style={{height: 15, width: 15}}/>
                </TouchableOpacity>
              </View>
            </View>
        )})
      }
       {items.length == 0? 
       <>
        <View style={{marginTop: '35%', alignItems: 'center', justifyContent: 'center', marginHorizontal: '6%'}}>
          <Text style={{color: 'black', fontSize: 22, textAlign: 'center'}}>Your cart is empty.</Text>
          <Image source={require('../assets/cart_empty.png')} style={{height: 80, width: 80, marginTop: '10%', marginRight: '2%'}}/>
        </View>
        <TouchableOpacity onPress={() => {navigation.navigate('Home')}} style={[styles.SignUp, {alignSelf: 'center',  marginRight: '8%', backgroundColor: 'black', height: 40, width: '80%', marginTop: '10%'}]}>
          <View>
              <Text style={[styles.signUpText]}>Go Shopping</Text>
          </View>
        </TouchableOpacity>
      </>
        :
        <>
        <Text style={{color: 'grey', fontSize: 18, fontFamily: 'NotoSans-Bold', }}>Subtotal: ₹{subtotal.toLocaleString(undefined, {maximumFractionDigits:2})}</Text>
        <Text style={{color: 'grey', fontSize: 18, fontFamily: 'NotoSans-Bold' }}>Taxes: ₹{tax.toFixed(2)}</Text>
        {/*<TouchableOpacity onPress={() => {payNow(total, items)}} style={[styles.SignUp, {alignSelf: 'center',  marginRight: '8%', backgroundColor: 'black', height: 40, width: '90%', marginTop: '10%'}]}>
          <View>
              <Text style={[styles.signUpText]}>Checkout</Text>
          </View>
      </TouchableOpacity>*/}
          <Text style={{color: 'black', fontSize: 18, fontFamily: 'NotoSans-Bold', marginTop: '3%'}}>Total: ₹{total.toLocaleString(undefined, {maximumFractionDigits:2})}</Text>
          <TouchableOpacity onPress={() => {
            navigation.push('Bill', {
              items: items,
              amount: total,
            })
          }} style={{backgroundColor: 'black', height: 40, justifyContent: 'center', alignItems: 'center', marginTop: '10%', borderRadius: 30, paddingHorizontal: '20%'}}>
            <Text style={{color: 'white', fontFamily: 'VarelaRound-Regular'}}>Checkout</Text>
          </TouchableOpacity>
        </>}
    </View>
</>
  )
}

const styles = StyleSheet.create({

  SignUp: {
    marginLeft: '8%',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
},

signUpText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
},
})

export default NeerCart