import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import AuthNavigation from './navigation/AuthNavigation';

LogBox.ignoreLogs([
  "AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage",
])


export const UserContext = createContext({})


const App = () => {


  const[globalType, setGlobalType] = useState('Neerbandhu')
  const[currentUser, setCurrentUser] = useState(null)
  const[userData, setUserData] = useState({
    account: '',
    cart: [],
    email: '',
    kyc: false,
    kycDetails: {
      PAN: '',
      name: '',
      pan_back: '',
      pan_front: '',
      selfie: '',
    },
    purchased: 0,
    verified: false,
    wished: [],
  })

  const[itemData, setItemData] = useState([])
  const[noti, setNoti] = useState(false)
  const[cartSize, setCartSize] = useState(0)

  const getTypeFromCache = async() => {
    try {
      const value = await AsyncStorage.getItem('account_type')
      if(value !== null) {
        setGlobalType(value)
      }
    } catch(e) {
      console.log(e)
    }
  }



  useEffect(()=> {
      getTypeFromCache()
  },[])

 
  return (
    <UserContext.Provider value={{globalType, setGlobalType, currentUser,setCurrentUser, userData, setUserData, itemData, setItemData, noti, setNoti, cartSize, setCartSize}}>
      <AuthNavigation/>
    </UserContext.Provider>
  );
};



export default App;
