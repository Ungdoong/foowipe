import React, {Component} from 'react'
import {View} from 'react-native'
import {Icon} from 'react-native-elements'

function HeaderLeft(){
    return (
      <View>
        <Icon name='menu' color='white' onPress={()=>console.warn('HeaderLeft Clicked')} />
      </View>
    );
}

export {HeaderLeft};