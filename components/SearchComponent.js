import { collection, endAt, getDocs, orderBy, query, startAt, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { db } from '../Firebase'

const SearchComponent = ({navigation}) => {

  const[search, setSearch] = useState('')
  const[itemData, setItemData] = useState([])
  const[loading, isLoading] = useState(false)
  const[result, setResult] = useState(null)
  const[isFirst, setFirst] = useState(true)


  const queryDatabaseHandler = async(search_query) => {
    isLoading(true)
    setFirst(false)
    //const q = query(collection(db,'Items'), where('key', '>', search_query))
    const q = query(collection(db, 'Items'), orderBy('key'), startAt(search_query), endAt(search_query+'\uf8ff'))
    getDocs(q).then((snap)=> {
      setItemData(snap.docs.map((doc)=> doc.data()))
      isLoading(false) 
    })
  }



  useEffect(()=> {
      //queryDatabaseHandler(search.toLowerCase())
      itemData.length == 0? setResult(false) : setResult(true)
  },[itemData])
  
  return (
    <View>
    <View style={styles.searchBox}>
      <TouchableOpacity onPress={() => {}}>
        <Image source={require('../assets/search.png')} style={styles.icons}/>
      </TouchableOpacity>
      <TextInput placeholder='Search' selectionColor={'black'} value={search} placeholderTextColor={'grey'} onSubmitEditing={(value) => value.nativeEvent.text.length !=0? queryDatabaseHandler(value.nativeEvent.text.toLowerCase()): <></>} onChangeText={(val) => setSearch(val)} style={styles.searchInput}/>
      {search.length > 0 ? <TouchableOpacity onPress={() => {setSearch('')}}>
        <Image source={require('../assets/close.png')} style={styles.cross}/>
      </TouchableOpacity>: <></>}
    </View>
    {loading? <Image style={{height: 100, width: 100, alignSelf: 'center', marginTop: '60%'}} source={require('../assets/loading.gif')}/>
    : 
    result? 
    <ScrollView style={{marginBottom: '22%'}}>
      {itemData.map((item, index) => (
          <TouchableOpacity onPress={() => {navigation.push('Product', {
            poster: item.poster,
            name: item.name,
            description: item.description,
            price: item.price,
            version: item.version,
            brand: item.companyName,
            details: item.details,
          })}} key={index} style={{flexDirection: 'row', marginHorizontal: '6%', marginTop: '1%', backgroundColor: 'white', padding: 20, borderColor: 'grey', borderWidth: 1, marginBottom: '1%'}}>
            <Image source={{uri : item.poster[0]}} style={{height: 200, width: 130}}/>
            <View style={{width: '100%'}}>
              <Text style={{color: 'black', marginLeft: '5%', width: '60%', paddingRight: '5%' }}>{item.name}</Text>
              <Text style={{color: 'grey', marginLeft: '5%', width: '60%', marginTop: '5%', paddingRight: '5%'}}>{item.description.length > 15? item.description.substring(0,50) + '...' : item.description.substring(0,15)}</Text>
              <View style={{flexDirection: 'row', marginLeft: '5%', marginTop: '5%'}}>
                <Text style={{color: 'black'}}>₹ <Text style={{color: 'black', fontSize: 24}}>{item.version[1].price.toLocaleString('en-us')}</Text></Text>
                <Text style={{color: 'black', fontSize: 22}}>{item.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>: isFirst? <></>:<>
        <Image style={{height: 100, width: 100, alignSelf: 'center', marginTop: '60%'}} source={require('../assets/no-results.png')}/>
        <Text style={{alignSelf: 'center', color: 'black', marginTop: '2%', fontFamily: 'VarelaRound-Regular', fontSize: 24}}>Oops! nothing to show</Text></>}
      </View>
    )
}


const styles = StyleSheet.create({

  icons: {
    height: 20,
    width: 20,
  },

  search: {
    height: 40,
    width: 40,
  },

  searchBox: {
    alignSelf: 'center',
    height: 50, 
    width: '90%',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: '3%',
    borderWidth: 1,
    borderColor: '#dadada',
    alignItems: 'center',
    marginTop: '15%',
  },

  searchInput: {
    color: 'black',
    fontSize: 20,
    marginLeft: '2%',
    width: '78%',
  },

  cross: {
    height: 20,
    width: 20,
  },

})

export default SearchComponent