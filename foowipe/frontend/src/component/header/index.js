import React, {Component} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {Header} from 'react-native-elements';
import {HeaderTitle} from './HeaderTitle';
import {HeaderLeft} from './HeaderLeft';
import {HeaderRight} from './HeaderRight';

function MyHeader(props) {
  return (
    <Header
      // leftComponent={<HeaderLeft />}
      centerComponent={<HeaderTitle/>}
      rightComponent={() => {
        if (props.cur != 'map') return <HeaderRight/>;
      }}
      containerStyle={styles.container}
      barStyle="light-content"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#70a9ff',
    height: 0.08 * Dimensions.get('window').height,
    paddingTop: 0,
    elevation: 20,
  },
});

export default MyHeader;
