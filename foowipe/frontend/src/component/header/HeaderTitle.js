import React from 'react';
import {StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Text} from 'react-native-elements';
import {Fonts} from '../../fonts'

function HeaderTitle() {
  const navigation = useNavigation();
  return <Text style={styles.title} onPress={()=> navigation.navigate('홈')}>Foowipe</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontFamily: Fonts["Lovely-Boys"],
    color: 'white',
    fontSize: 34,
    borderRadius:5
  },
});

export {HeaderTitle};
