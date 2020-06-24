import React from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-elements';

function HeaderRight() {
  const navigation = useNavigation();
  return (
    <View>
      <Icon
        name="search"
        color="white"
        size={30}
        onPress={() => navigation.navigate('지도')}
      />
    </View>
  );
}

export {HeaderRight};
