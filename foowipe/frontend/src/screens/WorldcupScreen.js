import React, {Component} from 'react'
import {View, TouchableOpacity, StyleSheet, StatusBar} from 'react-native'
import {Text} from 'react-native-elements'

function WorldcupScreen ({navigation: {goBack}}) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' />
      <View>
        <Text style={{fontSize: 25}}>Worldcup Screen</Text>
      </View>
      <TouchableOpacity
        onPress={() => goBack()}
        style={{
          justifyContent: 'flex-end',
          backgroundColor: 'rgb(87,174,198)',
          padding: 20,
          marginTop: 20,
          borderRadius: 30,
        }}>
        <Text style={{fontSize: 20, textAlign: 'center', color: 'white'}}>
          뒤로
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
})

export default WorldcupScreen
