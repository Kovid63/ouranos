import { View, Text, StatusBar, TouchableOpacity, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { UserContext } from '../App'
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../Firebase'


const NeerNotification = ({navigation}) => {

  const{setNoti, globalType, noti} = useContext(UserContext)
  const[message, setMessage] = useState([])

  const notiDataHandler = async() => {
    onSnapshot(collection(db, globalType , auth.currentUser.email, 'Notifications'), { includeMetadataChanges: true },
      (snap) => setMessage(snap.docs.map((doc) => doc).reverse())
    )
  }

  const deleteNotification = () => {
    message.map((msg, index) =>{
      const docRef = doc(db, globalType, auth.currentUser.email, 'Notifications', msg.id)
      deleteDoc(docRef)
    })
  }


  useEffect(() => {
    notiDataHandler()
  }, [])

  useEffect(()=> {
    const timeout = setTimeout(() => {
      setNoti(false)
    }, 2500);
    return () => clearTimeout(timeout)
  },[])


  return (
    <View>
      <StatusBar translucent backgroundColor={'transparent'}/>
      <View style={{marginTop: '15%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '6%', alignItems: 'center'}}>
      <TouchableOpacity onPress={() => {navigation.goBack()}}>
        <Image source={require('../assets/arrow-left.png')} style={{height: 30, width: 30}}/>
      </TouchableOpacity>
      <Text style={{color: 'black', fontFamily: 'VarelaRound-Regular', fontSize: 20}}>Notifications</Text>
      <TouchableOpacity onPress={() => {deleteNotification()}}>
        <Image source={require('../assets/trash-bin.png')} style={{height: 20, width: 20}}/>
      </TouchableOpacity>
    </View>
      {message.length == 0 ? <><Text style={{alignSelf: 'center', color: 'black', marginTop: '2%', fontFamily: 'VarelaRound-Regular', fontSize: 20, marginTop: '70%'}}>Nothing to show.</Text></>:<ScrollView style={{marginTop: '10%'}}>
        {
          message.map((msg, index) => (
            <View key={index} style={[index == 0 && noti? {backgroundColor: '#0098EF'}:{backgroundColor: 'white'},{height: 60, elevation: 2, marginBottom: '3%', width: '88%', alignSelf: 'center', padding: 10, borderRadius: 10}]}> 
                <Text style={[index == 0 && noti? {color: 'white'}:{color: 'black'},{fontFamily: 'VarelaRound-Regular'}]}>{index == 0 && noti?<Text style={{color: 'orange'}}>{'New! '}</Text>: <></>}{msg.data().message}</Text>
            </View>
          ))
        }
      </ScrollView>}
    </View>
  )
}

export default NeerNotification