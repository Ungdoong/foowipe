import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet, StatusBar} from 'react-native';
import {Text} from 'react-native-elements';
import Swipe from '../component/swipe';
function FoodScreen({route, navigation}) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.type,
      headerTitleStyle: {fontFamily: '12lotteLight'},
    });
  }, [navigation, route]);
  console.log(route.params.type)
  if(route.params.type == "음식점") return <View style={styles.swipeContainer}><Swipe name="food" navigation={navigation}></Swipe></View>;
  else if(route.params.type == "카페") return <View style={styles.swipeContainer}><Swipe name="cafe" navigation={navigation}></Swipe></View>;
  else if(route.params.type == "알코올") return <View style={styles.swipeContainer}><Swipe name="alcohol" navigation={navigation}></Swipe></View>;
}

const styles = StyleSheet.create({
  swipeContainer:{
    flex:1,
    justifyContent:'center',
  }
});

export default FoodScreen;
