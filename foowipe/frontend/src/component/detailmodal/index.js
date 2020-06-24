import React, {Component} from 'react';
import {Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Icon, Text, ButtonGroup, Button} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

import Contents from './Contents';

export default class DetailModal extends Component {
  constructor() {
    super();
    this.state = {
      selectedIndex: 0,
    };
    this.updateIndex = this.updateIndex.bind(this);
    this.storeExist = false;
  }

  updateIndex(selectedIndex) {
    this.setState({selectedIndex});
  }

  rename(name) {
    name = name.replace('<b>', '');
    name = name.replace('</b>', '');
    return name;
  }

  async select() {
    if (this.props.changeStore) {
      this.props.changeStore([this.props.store]);
    } else {
      await AsyncStorage.setItem('userStore', JSON.stringify(this.props.store))
    }
    this.props.navigation.navigate('지도');
    this.props.close();
  }

  render() {
    const tabs = ['매장정보', '메뉴', '이미지', '블로그'];
    const {selectedIndex} = this.state;
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.closeContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  this.props.close();
                }}>
                <Icon name="close" size={16} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalTitle}>
              {this.rename(this.props.store.name)} ❤️
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Icon name="directions-fork" type="material-community" />
              <Text style={styles.distance}>{this.props.store.distance}</Text>
            </View>
            <Text style={styles.modalCategori}>
              {this.rename(this.props.store.category)}
            </Text>
            <ButtonGroup
              onPress={this.updateIndex}
              selectedIndex={selectedIndex}
              buttons={tabs}
            />
            <Contents selectedIndex={selectedIndex} store={this.props.store} />
            <Button
              title="선택"
              buttonStyle={styles.button}
              onPress={() => this.select()}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 22,
  },
  modalView: {
    flex: 1,
    margin: 20,
    backgroundColor: 'rgba(255,255,255,.9)',
    borderRadius: 10,
    padding: 20,
    paddingTop: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
  },
  closeButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    elevation: 1,
  },
  buttonPress: {
    borderColor: '#000066',
    backgroundColor: '#000066',
    borderWidth: 1,
    borderRadius: 10,
  },
  modalTitle: {
    flex: 0.1,
    fontFamily: '12lotteBold',
    fontSize: 28,
    marginBottom: 10,
  },
  modalCategori: {
    flex: 0.05,
    fontFamily: '12lotteLight',
    fontSize: 14,
    width: '100%',
    paddingLeft: 10,
  },
  distance: {
    fontFamily: '12lotteLight',
    paddingTop: 6,
    paddingLeft: 8,
    fontSize: 16,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#70a9ff',
    padding: 30,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    opacity: 0.9,
  },
});
