import React from 'react';
import {View, StyleSheet} from 'react-native';
import HomeCard from '../component/HomeCard';
import AsyncStorage from '@react-native-community/async-storage';
export default function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
      <HomeCard name="카페" navigation={navigation} />
      <HomeCard name="음식점" navigation={navigation} />
      <HomeCard name="알코올" navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: 10,
  },
});
