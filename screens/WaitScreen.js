import { signOut } from 'firebase/auth'
import { collection, doc, getDoc, onSnapshot, query } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { Image, StatusBar, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { UserContext } from '../App'
import { auth, db } from '../Firebase'

const WaitScreen = ({navigation}) => {

  const{globalType, setUserData} = useContext(UserContext)
  const[trigger, setTrigger] = useState()
  const[message, SetMessage] = useState('Loading you in...')

  const dataHandler = async() => {
    const docRef = doc(db, globalType, auth.currentUser.email)
    getDoc(docRef).then((snapshot) => {
      snapshot.exists()? [setUserData(snapshot.data()), navigation.replace(globalType)] : [signOut(auth), ToastAndroid.show("Not Authorized!", ToastAndroid.LONG) ]
    })
  }

  /*setTimeout(()=> {
      dataHandler()
  }, 3000)*/

  const q = query(collection(db,globalType))
  onSnapshot(q, (snap) => {
    setTrigger()
  })
 

  useEffect(() => {
    dataHandler()
  },[trigger])

  useEffect(() => {
    const timer = setTimeout(() => {
      SetMessage('Your connect seems slow, hold on...')
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.loading}>
      <StatusBar translucent backgroundColor={'transparent'}/>
      {/*<ProgressView style={{width: '60%', height: 20}} progressTintColor="#7DCE13"
          trackTintColor="white"
          progress={0.3} isIndeterminate/>*/}
          <Image style={{height: 100, width: 100}} source={require('../assets/loading.gif')}/>
          <Text style={{color: 'black', fontFamily: 'VarelaRound-Regular', fontSize: 18, textAlign: 'center', width: '90%'}}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default WaitScreen