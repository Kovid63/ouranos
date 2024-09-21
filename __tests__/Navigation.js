import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { UserContext } from '../App';
import NeerbandhuHome from '../components/NeerbandhuHome';
import NeerCart from '../components/NeerCart';
import NeerNotification from '../components/NeerNotification';
import NeerProfile from '../components/NeerProfile';
import SearchComponent from '../components/SearchComponent';
import { auth, db } from '../Firebase';
import BillingScreen from '../screens/BillingScreen';
import KycScreen from '../screens/KycScreen';
import LoginScreen from '../screens/LoginScreen';
import MyOrders from '../screens/MyOrders';
import NeerShopScreen from '../screens/NeerShopScreen';
import Options from '../screens/Options';
import OrderScreen from '../screens/OrderScreen';
import OtpScreen from '../screens/OtpScreen';
import PhoneScreen from '../screens/PhoneScreen';
import ProductScreen from '../screens/ProductScreen';
import RetailerScreen from '../screens/RetailerScreen';
import SignUpScreen from '../screens/SignUpScreen';
import WaitScreen from '../screens/WaitScreen';


export const SignedOutStack = () => {

    const stack = createStackNavigator();

    const options = {
      headerShown: false,
    }

  return (
    <NavigationContainer>
        <stack.Navigator initialRouteName='LoginScreen' screenOptions={options}>
          <stack.Screen name='LoginScreen' component={LoginScreen}/>
          <stack.Screen name='PhoneScreen' component={PhoneScreen}/>
          <stack.Screen name='SignUpScreen' component={SignUpScreen}/>
          <stack.Screen name='OtpScreen' component={OtpScreen}/>
        </stack.Navigator>
    </NavigationContainer>
  )
}


export const SignedInStack = () => {

  const stack = createStackNavigator();

  const options = {
    headerShown: false,
  }

return (
  <NavigationContainer>
      <stack.Navigator initialRouteName={'WaitScreen'} screenOptions={options}>
        <stack.Screen name='WaitScreen' component={WaitScreen}/>
        <stack.Screen name='Neerbandhu' component={NeerShopScreen}/>
        <stack.Screen name='Retailer' component={RetailerScreen}/>
        <stack.Screen name='Kyc' component={KycScreen}/>
        <stack.Screen name='Product' component={ProductScreen}/>
        <stack.Screen name='Search' component={SearchComponent}/>
        <stack.Screen name='Bill' component={BillingScreen}/>
        <stack.Screen name='Order' component={OrderScreen}/>
        <stack.Screen name='options' component={Options}/>
        <stack.Screen name='message' component={NeerNotification}/>
      </stack.Navigator>
  </NavigationContainer>
)
}


export const TabsNav = () => {

  const styles = StyleSheet.create({

    containerFocused: {
      alignItems: 'center', 
      justifyContent: 'center',
    },

    iconFocused: {
      height: 20, 
      width: 20, 
      alignSelf: 'center',
    },

    iconTextFocused: {
      color: 'black', 
      fontSize: 12, 
      width: '100%', 
      textAlign: 'center',
      fontWeight: '700',
    },

    iconText: {
      color: 'grey', 
      fontSize: 12, 
      width: '100%',
    },


  })

  const{userData, globalType} = useContext(UserContext)
  const[cartSize, setCartSize] = useState(0)
  const{setNoti} = useContext(UserContext)

  const cartDataHandler = async() => {
    onSnapshot(collection(db, globalType , auth.currentUser.email, 'Cart'), 
      (snap) => setCartSize(snap.size)
    )
  }

  const notiDataHandler = async() => {
    onSnapshot(collection(db, globalType , auth.currentUser.email, 'Notifications'), { includeMetadataChanges: true },
      (snap) => snap.metadata.hasPendingWrites? setNoti(true) : <></>
    )
  }


  useEffect(() => {
    cartDataHandler()
    notiDataHandler()
  },[])

  

  const Tabs = createBottomTabNavigator()

  return (
      <Tabs.Navigator initialRouteName='Home' screenOptions={{
        tabBarShowLabel: false, 
        headerShown: false,
        lazy: true,
        
      
        tabBarStyle: {
          position: 'absolute',
          elevation: 0,
          borderTopWidth: 0,
          height: 60,
          bottom: 20,
          paddingHorizontal: 20,
        },

        tabBarBackground: () => (
          <View style={{backgroundColor: 'white', height: '100%', width: '95%', alignSelf: 'center', elevation: 5, borderRadius: 10}}>

          </View>
         ),
        }}>
          <Tabs.Screen name="Home" component={NeerbandhuHome} options={{
            tabBarIcon: ({focused}) => (
             
              focused? 
              
              <View style={styles.containerFocused}> 
                <Image source={require('../assets/homeIconA.png')} style={styles.iconFocused}/>
                <Text style={styles.iconTextFocused}>Home</Text>
              </View>
              :

              <View style={{flex: 1 ,alignItems: 'center', justifyContent: 'center'}}> 
                <Image source={require('../assets/homeIcon.png')} style={{height: 20, width: 20}}/>
                <Text style={styles.iconText}>Home</Text>
              </View>
            )
          }}/>

          <Tabs.Screen name="cart" component={NeerCart} options={{
                      tabBarIcon: ({focused}) => (

                        
                        focused? 
              
                      <View style={styles.containerFocused}> 
                        <Image source={require('../assets/cartA.png')} style={styles.iconFocused}/>
                        <Text style={styles.iconTextFocused}>Cart</Text>
                      </View>
                      :

                      <View style={{flex: 1 ,alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{backgroundColor: 'red', alignItems: 'center',paddingHorizontal: 4 ,position: 'absolute', bottom: 40, left: 22, borderRadius: 10}}>
                          {cartSize == 0? <></>: <Text style={{color: 'white', fontSize: 10, fontWeight: '600' }}>{cartSize}</Text>}
                        </View>
                        <Image source={require('../assets/cart.png')} style={{height: 20, width: 20}}/>
                        <Text style={styles.iconText}>Cart</Text>
                      </View>
                      )
                    }}/>

                  <Tabs.Screen name="myorder" component={MyOrders} options={{
                      unmountOnBlur: true,
                      tabBarIcon: ({focused}) => (
                      
                        focused? 
              
                      <View style={styles.containerFocused}> 
                        <Image source={require('../assets/orderA.png')} style={styles.iconFocused}/>
                        <Text style={styles.iconTextFocused}>Orders</Text>
                      </View>
                      :

                      <View style={{flex: 1 ,alignItems: 'center', justifyContent: 'center'}}>
                        <Image source={require('../assets/order.png')} style={{height: 20, width: 20}}/>
                        <Text style={styles.iconText}>Orders</Text>
                      </View>
                      )
                    }}/>

                    <Tabs.Screen name="Profile" component={NeerProfile} options={{
            tabBarIcon: ({focused}) => (
             
              focused? 
              
              <View style={styles.containerFocused}>  
                <Image source={require('../assets/userA.png')} style={styles.iconFocused}/>
                <Text style={styles.iconTextFocused}>Profile</Text>
              </View>
              :

              <View style={{flex: 1 ,alignItems: 'center', justifyContent: 'center'}}> 
                <Image source={require('../assets/user.png')} style={{height: 20, width: 20}}/>
                <Text style={styles.iconText}>Profile</Text>
              </View>
            )
          }}/>
               
      </Tabs.Navigator>
  )
  
}



