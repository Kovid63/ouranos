import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Welcome = ({message, subMessage}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.submessage}>{subMessage}</Text>
    </View>
  )
}

const styles = StyleSheet.create({

    container: {
        marginLeft: '8%',
        marginTop: '25%',
    },

    message: {
        color: 'black',
        fontSize: 26,
        fontWeight: '700',
    },

    submessage: {
        marginTop: '3%',
        color: 'grey',
        fontSize: 15,
        width: '80%',
    }
})

export default Welcome