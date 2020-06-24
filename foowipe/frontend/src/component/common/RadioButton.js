import React, {Component} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

export default class RadioButton extends Component {
  state = {
    value: this.props.category
  };

  render() {
    const {PROP} = this.props;
    const {value} = this.state;

    return (
      <View>
        {PROP.map((res) => {
          return (
            <View key={res.key} style={styles.container}>
              <TouchableOpacity
                style={styles.radioCircle}
                onPress={async () => {
                  await this.setState({
                    value: res.key,
                  });
                  this.props.close(this.state.value)
                }}>
                {value === res.key && <View style={styles.selectedRb} />}
              </TouchableOpacity>
              <Text style={styles.radioText}>{res.text}</Text>
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  radioText: {
    fontFamily: 'Cafe24Dongdong',
    fontSize: 20,
  },
  radioCircle: {
    marginRight: 20,
    height: 25,
    width: 25,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#70a9ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: 15,
    height: 15,
    borderRadius: 50,
    backgroundColor: '#3740ff',
  },
  result: {
    marginTop: 20,
    color: 'white',
    fontWeight: '600',
    backgroundColor: '#F3FBFE',
  },
});
