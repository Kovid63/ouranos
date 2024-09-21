import { View, Text, ScrollView, StatusBar, StyleSheet, Image } from 'react-native'
import React from 'react'

const OrderScreen = ({route, navigation}) => {

    const day = new Date();


  return (
    <ScrollView style={{backgroundColor: 'white'}}>
        <StatusBar translucent backgroundColor={'transparent'}/>
    { route.params.result? 
    <>
        <View style={{alignItems: 'center', flex: 1}}>
            <Image style={{height: 100, width: 100, marginTop: '40%'}} source={require('../assets/checkmark.gif')}/>
            <Text style={styles.successmsg}>Order Placed</Text>
            <Text style={[styles.date, { width: '80%', marginTop: '2%'}]}>{'Your order #'}{route.params.orderId}{' was placed successfully.'}</Text>
        </View>
        <View style={{backgroundColor: 'white', height: 100, width: '80%', alignSelf: 'center', marginTop: '5%', borderRadius: 15, elevation: 5, flexDirection: 'row', justifyContent: 'space-between' ,paddingHorizontal: '6%'}}>
            <View style={{}}>
                <Text style={{color: 'black',  marginTop: '35%'}}>Date:</Text>
                <Text style={{color: 'black', marginTop: '5%'}}>{day.toLocaleDateString('en-US')}</Text>
            </View>
            <View style={{marginTop: '10%'}}>
                <Text style={{color: 'black'}}>Payment: </Text>
                <Text style={{color: 'black', marginTop: '5%'}}>{route.params.paymentMode}</Text>
            </View>
        </View>
        <Text style={[styles.date, { width: '80%', marginTop: '5%', alignSelf: 'center'}]}>{'You can track your order anytime by'}</Text>
        <Text onPress={() => {
            navigation.navigate('myorder')
        }} style={[styles.date, { width: '80%', marginTop: '1%', alignSelf: 'center', color: 'orange'}]}>{'Clicking Here'}</Text>
    </> : 
    <> 
        <View style={{alignItems: 'center', flex: 1}}>
            <Image style={{height: 100, width: 100, marginTop: '40%'}} source={require('../assets/delete-button.png')}/>
            <Text style={styles.successmsg}>Order Failed</Text>
            <Text style={[styles.date, { width: '80%', marginTop: '2%'}]}>{'Your order #'}{route.params.orderId}{' Failed.'}</Text>
        </View>
        <View style={{backgroundColor: 'white', height: 100, width: '80%', alignSelf: 'center', marginTop: '5%', borderRadius: 15, elevation: 5, flexDirection: 'row', justifyContent: 'space-between' ,padding: '6%', marginBottom: '20%'}}>
            <View style={{}}>
                <Text style={{color: 'black'}}>Date:</Text>
                <Text style={{color: 'black', marginTop: '5%'}}>{day.toLocaleDateString('en-US')}</Text>
            </View>
            <View style={{}}>
                <Text style={{color: 'black'}}>Payment:</Text>
                <Text style={{color: 'black', marginTop: '5%'}}>Not completed</Text>
            </View>
        </View>
    </>    
    }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    header: {
        marginTop: '15%',
        marginLeft: '6%',
        flexDirection: 'row',
        alignItems: 'center',
    },

    accept:{
        height: 30,
        width: 30,
    },

    successmsg: {
        color: 'black',
        fontSize: 26,
        fontWeight: '600',
        fontFamily: 'VarelaRound-Regular',
        marginTop: '3%',
    },

    dateContainer:{
        marginTop: '3%',
        marginLeft: '6%',
    },

    date: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'VarelaRound-Regular',
        textAlign: 'center',
    },

    addresstitle: {
        color: 'black',
        marginLeft: '3%',
        fontSize: 20,
        fontWeight: '500',
    },
})

export default OrderScreen