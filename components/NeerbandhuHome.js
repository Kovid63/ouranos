import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { UserContext } from '../App'
import { db } from '../Firebase'

const NeerbandhuHome = ({navigation}) => {

    const[isSelected, SetSelected] = useState(null)
    const[ads, setAds] = useState([])
    const[categories, setCat] = useState([])
    const[itemData, setItemData] = useState([])
    const[loading, isLoading] = useState(true)
    const{noti} = useContext(UserContext)
    const[catRes, setCatRes] = useState(true)
    
    const flatlist = useRef({})


    const{width, height} = Dimensions.get('window')


    const renderAds = ({item,index}) => {
      return (
        <View key={index} style={{alignItems: 'center', width: width}}>
          <View style={{height: 180, width: '88%'}}>
            <Image source={{uri: item.poster}} style={{width: '100%', height: '100%', resizeMode: 'contain'}}/>
          </View> 
        </View>
      )
    }

    const adHandler = async() => {
      const colRef = collection(db, 'Ad')
      onSnapshot(colRef, (snap) => {
       setAds(snap.docs.map((doc) => doc.data()))
      })
    }

    const categoryHandler = async() => {
      const colRef = collection(db, 'Category')
      onSnapshot(colRef, (snap) => {
       setCat(snap.docs.map((doc) => doc.data()))
      })
    }

    const dataHandler = async() => {
      const colRef = collection(db, 'Items')
      onSnapshot(colRef, (snap) => {
       setItemData(snap.docs.map((doc) => doc.data()))
       isLoading(false)
      })
    }
    
    const queryDatabaseHandler = async(search_query) => {
      const q = query(collection(db,'Items'), where('category', '==', search_query))
      await getDocs(q).then((snap)=> {
        setItemData(snap.docs.map((doc)=> doc.data()))
      })
    }


    useEffect(() => {
      adHandler()
      categoryHandler()
      dataHandler()
    },[])

    useEffect(()=> {
      //queryDatabaseHandler()
      itemData.length === 0? setCatRes(false) : setCatRes(true)
    },[itemData])

   

  return (
    <>
    <View style={styles.wrapper}>
   
      {/* Top Menu and search Icon */}
      <StatusBar translucent backgroundColor={'transparent'}></StatusBar>
         <View style={styles.top}>
         <TouchableOpacity onPress={() => { navigation.push('Search') } }>
            <Image source={require('../assets/search.png')} style={styles.icons}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.push('message') }}>
        { noti? <View style={{height: 8, width: 8, backgroundColor: 'red', alignItems: 'center',paddingHorizontal: 4 ,position: 'absolute', bottom: 28, left: 25, borderRadius: 10}}>
                        </View>: <></>}
            <Image source={require('../assets/bell.png')} style={styles.icons}/>
        </TouchableOpacity>
        </View>

        {/* Ads section */}
        {loading? <>
        
          <Image style={{height: 100, width: 100, alignSelf: 'center', marginTop: '60%'}} source={require('../assets/loading.gif')}/>
        </>: <>
     <ScrollView style={{marginBottom: '20%', marginTop: '2%'}}>
        <View>
          <FlatList 
            ref={flatlist}
            data={ads}
            renderItem={renderAds}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            style={{marginTop: '5%'}}
          />
        </View>

         {/* Categories Section */}
        <View style={{paddingHorizontal: '0%'}}>
          <ScrollView horizontal style={{marginTop: '10%'}} showsHorizontalScrollIndicator={false}>
            {categories.map((category, index) => (<View key={index}>
              <TouchableOpacity onPress={() => {[SetSelected(category.name), queryDatabaseHandler(category.name)]}} style={[isSelected == category.name? {backgroundColor: '#0098EF'}: {},{height: 50, marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, borderRadius: 30}]}>
                <Image source={{uri: category.poster}} style={{height: 40, width: 40, borderRadius: 30}}/>
                <Text style={[isSelected == category.name? {color: 'black'} : {color: 'grey'},{fontWeight: '500', marginLeft: 10}]}>{category.name}</Text> 
                </TouchableOpacity>
            </View>))}
          </ScrollView>
        </View>
        
       {/* New and Trending section */}
       {catRes? <View style={{marginTop: '8%'}}>
          <Text style={{color: 'black', marginLeft: '6%', fontSize: 20, fontWeight: '600'}}>New Products</Text>
           <FlatList
            data={itemData}
            scrollEnabled={false}
            renderItem={({item}) => (
              <>
              <TouchableOpacity onPress={() => {navigation.push('Product', {
                poster: item.poster,
                name: item.name,
                description: item.description,
                model: item.model,
                category: item.category,
                brand: item.companyName,
                version: item.version,
                details: item.details,
              })}} style={{height: 250 , width: '40%', marginHorizontal: '6%', marginTop: '5%', backgroundColor: '#F9F9F9' , borderRadius: 10, elevation: 3, marginBottom: '8%'}}>
                <Image source={{uri: item.poster[0]}} style={{height: '40%', width: '80%', marginTop: '10%', alignSelf: 'center'}}/>
                <Text style={{color: '#0098EF', fontSize: 16, marginTop: '5%', marginHorizontal: '6%'}}>{item.category}</Text>
                <Text style={{color: 'black', fontSize: 16, fontWeight: '400', paddingHorizontal: '6%', height: '30%'}}>{item.name.substring(0,48)+'...'}</Text>
                <TouchableOpacity onPress={() => {navigation.push('Product', {
                poster: item.poster,
                name: item.name,
                description: item.description,
                model: item.model,
                category: item.category,
                brand: item.companyName,
                version: item.version,
                details: item.details,
              })}} style={{height: 30, width: 30, backgroundColor: 'black', borderBottomRightRadius: 10, borderTopLeftRadius: 10, alignSelf: 'flex-end'}}>
                        <Image source={require('../assets/add_price.png')} style={{height: '100%', width: '100%'}}/>
                  </TouchableOpacity>
              </TouchableOpacity>
              {/*<TouchableOpacity onPress={() => {navigation.push('Product', {
                poster: item.poster,
                name: item.name,
                description: item.description,
                model: item.model,
                category: item.category,
                brand: item.companyName,
                version: item.version,
                details: item.details,
              })}} style={{ height: 150, width: '40%', marginHorizontal: '5%', marginTop: '5%', marginBottom: '60%'}}>
                
                    <Image source={{uri: item.poster[0]}} style={{height: '100%', width: '100%', borderRadius: 10}}/>
               
                <Text style={{color: '#0098EF', fontSize: 16, marginTop: '5%', marginLeft: '1%'}}>{item.category}</Text>
                <Text style={{color: 'black', fontSize: 20, fontWeight: '600'}}>{item.name.substring(0, 50)+'...'}</Text>
                <View style={{flexDirection: 'row', marginTop: '3%', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={{color: 'black', fontWeight: '700', fontSize: 16}}>₹ {item.version[0].price.toLocaleString('en-us')}</Text>
                  <TouchableOpacity onPress={() => {navigation.push('Product', {
            poster: item.poster,
            name: item.name,
            description: item.description,
            price: item.price,
            model: item.model,
          })}} style={{height: 30, width: 30, backgroundColor: 'black', borderBottomRightRadius: 10, borderTopLeftRadius: 10}}>
                        <Image source={require('../assets/add_price.png')} style={{height: '100%', width: '100%'}}/>
                  </TouchableOpacity>
                </View>
        </TouchableOpacity>*/}
        </>
            )}
            numColumns={2}/>
        </View>:<>
        <Image source={require('../assets/not-found.png')} style={{height: 80, width: 80, alignSelf: 'center', marginTop: '30%'}}/>
        </>}
        </ScrollView>
        </>}
        {/*<ScrollView keyboardShouldPersistTaps={'handled'} style={{paddingHorizontal: '6%'}}>
          {itemData.map((item,index) => (
            !searchbox? 
          <TouchableOpacity onPress={() => { 
              navigation.push('Product', {
                poster: item.poster,
                name: item.name,
                description: item.description,
                price: item.price,
              })

          }} key={index} style={{backgroundColor: 'white',height: 60, width: '100%', flexDirection: 'row', flex: 1, alignItems: 'center', borderTopWidth: 0.5, borderColor: 'grey', borderRadius: 10}}>
              <Image source={{uri: item.poster}} style={{height: 50, width: 50, resizeMode: 'contain', marginLeft: '3%'}}/>
              <Text style={{color: 'black', marginLeft: '3%', fontWeight: '700'}}>{item.name}</Text>
          </TouchableOpacity>:<View key={index}></View>
          ))}
        </ScrollView>*/}
    </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },

  top: {
    flexDirection: 'row',
    marginTop: '15%',
    paddingHorizontal: '6%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  icons: {
    height: 22,
    width: 22,
  },

  search: {
    height: 40,
    width: 40,
  },

  searchBox: {
    height: 50, 
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: '3%',
    borderWidth: 1,
    borderColor: '#dadada',
    alignItems: 'center',
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

export default NeerbandhuHome