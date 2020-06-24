import React from 'react';
import {View, StyleSheet, Linking} from 'react-native';
import {Text, Icon} from 'react-native-elements';

export default function TextRow(props) {
  const openUrl = () => {
    if (props.type == 'link') {
      Linking.openURL(props.right);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textLC}>
        <Icon name={props.left} type="material-community" />
      </View>
      <View style={styles.textRC}>
        <Text
          style={props.type == 'link' ? styles.link : styles.textR}
          onPress={() => {
            if (props.type == 'link' && props.right != '') openUrl;
          }}>
          {props.right}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 5,
    marginBottom: 5,
  },
  textLC: {
    flex: 0.1,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  textRC: {
    flex: 0.9,
  },
  textL: {
    fontFamily: '12lotteBold',
    fontSize: 20,
  },
  textR: {
    fontFamily: '12lotteLight',
    fontSize: 18,
    paddingTop: 4,
  },
  link: {
    fontSize: 18,
    color: 'blue',
    textDecorationLine: 'underline',
    paddingTop: 4,
  },
});
