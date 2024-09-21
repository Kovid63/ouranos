import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import React, { useContext, useState } from 'react'
import { Dimensions, FlatList, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { UserContext } from '../App'
import { auth, db } from '../Firebase'


const ProductScreen = ({route, navigation}) => {

  const arr = [
    {
      var: 'varient 1',
    },
    {
      var: 'varient 2',
    },
  ]

  const{globalType, cartSize} = useContext(UserContext)

  const[active, setActive] = useState(arr[0].var)
  const[quantity, setQuantity] = useState(1)
  const[loading, isLoading] = useState(false)
  const{width, height} = Dimensions.get('window')
  const[price, setPrice] = useState(route.params.version[0])
  const[read, setRead] = useState(false)
  var regex = new RegExp('<br>', "g");


  

  const qty = [
    {
      qty: 1,
    },
    {
      qty: 2,
    },
    {
      qty: 3,
    },
  ]

  const pics = [
    {
      pic: 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-2_large.png?format=webp&v=1530129318',
    },
    {
      pic: 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-5_large.png?format=jpg&quality=90&v=1530129458',
    },
  ]

  const picRender = ({item, index}) => {
    return (
      <View key={index} style={{alignItems: 'center', width: width, marginTop: '5%'}}>
        <View style={{width: '80%'}}>
         <Image style={{height: 400}} source={{uri: item}} resizeMode={'contain'}/>
        </View>
      </View>
    )
  }
  

  const addItemToCartHandler = async(item) => {

    //loading starts

    isLoading(true)

    if(item.quantity > 25) {
      ToastAndroid.show('Max 25 products allowed', ToastAndroid.SHORT);
      isLoading(false)
      return;
    }

    const docRef = doc(db,globalType, auth.currentUser.email, 'Cart', item.version.name)

    await getDoc(docRef).then((snap) =>{
      if(snap.exists()){
        if(parseInt(snap.data().quantity) + parseInt(item.quantity) > 25) {
          ToastAndroid.show('Max 25 products allowed', ToastAndroid.SHORT);
          isLoading(false);
          return;
        }
        updateDoc(docRef, {
          quantity: parseInt(snap.data().quantity) + parseInt(item.quantity),
        }).then(() => {
          isLoading(false)
          ToastAndroid.show('Item added to cart', ToastAndroid.SHORT)
        })
      }
      else{
      setDoc(docRef, item).then(()=> {[ToastAndroid.show('Item added to cart', ToastAndroid.SHORT), isLoading(false)]}).catch((error)=> console.log(error))
      }
    })
   
    /*updateDoc(docRef, {
      quantity: 3,
    }).then(()=> ToastAndroid.show('Item added to cart', ToastAndroid.SHORT))*/
    /*getDocs(collection(db, globalType ,auth.currentUser.email, 'Cart')).then((snap) => {
      snap.docs.forEach((doc)=> console.log(doc.data()))
    })*/
  }


  return (
    <>
      <StatusBar translucent backgroundColor={'transparent'}/>
      <View style={{marginTop: '15%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '6%'}}>
        <TouchableOpacity onPress={() => { navigation.goBack() }}>
          <Image source={require('../assets/arrow-left.png')} style={{height: 30, width: 30}}/>
        </TouchableOpacity>
        <Text style={{color: 'black', fontFamily: 'VarelaRound-Regular', fontSize: 20}}>{route.params.category}</Text>
        <TouchableOpacity onPress={() => {navigation.navigate('cart')}}>
          <View style={{backgroundColor: 'red', alignItems: 'center',paddingHorizontal: 4 ,position: 'absolute', bottom: 28, left: 24, borderRadius: 10}}>
            {cartSize == 0? <></>: <Text style={{color: 'white', fontSize: 10, fontWeight: '600' }}>{cartSize}</Text>}
          </View>
          <Image source={require('../assets/shopping-bag.png')} style={{height: 30, width: 30}}/>
        </TouchableOpacity>
      </View>
      <ScrollView style={{marginBottom: '20%', marginTop: "2%"}}>
      <View style={{marginLeft: '6%', marginTop: '5%'}}>
        <Text style={{color: '#0098EF', fontFamily: 'VarelaRound-Regular', fontSize: 14}}>Brand: {route.params.brand}</Text>
      </View>
      <Text style={{color: 'black', fontSize: 14, fontFamily: 'VarelaRound-Regular', paddingHorizontal: '6%'}}>{route.params.name}</Text>
      {/* Product Image */}
      <FlatList
        data={route.params.poster}
        renderItem={picRender}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        style={{marginTop: '5%'}}
      />
      <Text style={{color: 'black', fontFamily: 'VarelaRound-Regular', fontSize: 22, alignSelf: 'center', marginTop: '2%'}}>{'<< Swipe >>'}</Text>
      <View>
     {/* <Text style={{color: 'black', fontSize: 20, fontFamily: 'VarelaRound-Regular' ,marginTop: '3%', paddingHorizontal: '6%'}}>Select Variant :</Text>
      <View style={{flexDirection: 'row', marginTop: '5%', marginLeft: '3%'}}>
        {arr.map((varient, index) => (
          <TouchableOpacity key={index} onPress={() => {setActive(varient.var)}} style={[active == varient.var? {backgroundColor: 'orange'}: {backgroundColor: 'white'},{marginHorizontal: '3%', padding: 10, borderRadius: 10}]}>
            <Text style={{color: 'black'}}>{varient.var}</Text>
          </TouchableOpacity>
        ))}
        </View>*/}
        <Text style={{color: 'black', fontSize: 20, fontFamily: 'VarelaRound-Regular' ,marginTop: '3%', paddingHorizontal: '6%'}}>Version: </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop: '1%', marginLeft: '5%'}}>
        {route.params.version.map((varient, index) => (
          <TouchableOpacity key={index} onPress={() => { setPrice(varient) }} style={[ price == varient? {backgroundColor: 'orange',}: {backgroundColor: 'white',} , {paddingVertical: 15, paddingHorizontal: 15 ,borderRadius: 10, marginRight: 15}]}>
            <Text style={{color: 'black'}}>{varient.name}</Text>
            <Text style={{color: 'black'}}>{'₹ '}{varient.price.toLocaleString('en-us')}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={{color: 'black', fontSize: 20, fontFamily: 'VarelaRound-Regular' ,marginTop: '3%', paddingHorizontal: '6%'}}>Product details</Text>
      <Text style={{color: 'grey', fontSize: 14, fontFamily: 'VarelaRound-Regular' ,marginTop: '2%', paddingHorizontal: '6%'}}>{route.params.details.replace(regex, "\n•")}</Text>
      <Text style={{color: 'black', fontSize: 20, fontFamily: 'VarelaRound-Regular' ,marginTop: '3%', paddingHorizontal: '6%'}}>Quantity :</Text>
      <View style={{flexDirection: 'row', marginTop: '5%', marginLeft: '3%'}}>
        {qty.map((varient, index) => (
          <TouchableOpacity key={index} onPress={() => { setQuantity(varient.qty) }} style={[ quantity == varient.qty? {backgroundColor: 'orange',}: {backgroundColor: 'white',} , {marginHorizontal: '3%', paddingVertical: 10, paddingHorizontal: 15 ,borderRadius: 10}]}>
            <Text style={{color: 'black'}}>{varient.qty}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={[{backgroundColor: 'white',} , {marginHorizontal: '6%', paddingVertical: 2, paddingHorizontal: 15 ,borderRadius: 10, width: '40%', marginTop: '5%'}]}>
          <TextInput style={{color: 'black'}} placeholderTextColor='grey' placeholder={'Enter quantity'} keyboardType={'number-pad'} onChangeText={(value)=> {setQuantity(value)}}/>
      </View>
      <Text style={{color: 'black', fontSize: 20, fontFamily: 'VarelaRound-Regular' ,marginTop: '3%', paddingHorizontal: '6%'}}>Product description</Text>
      <Text style={{color: 'grey', fontSize: 14, fontFamily: 'VarelaRound-Regular' ,marginTop: '2%', paddingHorizontal: '6%'}}>{read? route.params.description : route.params.description.substring(0,150)+'...'}{read? <></>:<Text onPress={() => setRead(true)} style={{color: '#7DCE13', fontSize: 14, fontFamily: 'VarelaRound-Regular'}}>{'Read more'}</Text>}</Text>
      <Text style={{color: 'black', fontSize: 20, fontFamily: 'VarelaRound-Regular', paddingHorizontal: '6%', marginTop: '2%'}}>Price : ₹ {price.price.toLocaleString('en-us')}</Text>
      <Text style={{color: 'black', fontSize: 20, fontFamily: 'VarelaRound-Regular', paddingHorizontal: '6%', marginTop: '2%'}}>Delivery charge : ₹ {'100/Piece'}</Text>
      </View>
    </ScrollView>
    <TouchableOpacity style={styles.SignUp} onPress={() => { loading? <></> : addItemToCartHandler({
      name: route.params.name,
      base_price: price.price,
      price: price.price * quantity,
      poster: route.params.poster,
      quantity: quantity,
      version: price,
    })}}>
      {loading? 
              <>
                <Image style={{height: 50, width: 50}} source={require('../assets/barloading.gif')}/>
              </>
              :
              <>
                <Text style={styles.signUpText}>Add to cart</Text>
              </>}
      </TouchableOpacity>
      </>
  )
}

const styles = StyleSheet.create({
    
  SignUp: {
    backgroundColor: 'black',
    position: 'absolute',
    height: 50,
    width: '90%',
    bottom: 15,
    alignSelf: 'center',
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

export default ProductScreen