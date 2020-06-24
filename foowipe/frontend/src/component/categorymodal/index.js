import React, {Component} from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import RadioButton from '../common/RadioButton';

export default class CategoryModal extends Component {
  constructor(props) {
    super(props);
    this.PROP = [
      {
        key: '카페',
        text: '카페',
      },
      {
        key: '음식점',
        text: '음식점',
      },
      {
        key: '알코올',
        text: '알코올',
      },
    ];
    this.category = this.props.category;
  }

  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <RadioButton
              PROP={this.PROP}
              close={(cate) => {
                this.category = cate;
                this.props.close(cate);
              }}
              category={this.category}
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
    alignItems: 'center',
  },
  modalView: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,.9)',
    borderRadius: 10,
    padding: 20,
    paddingLeft: 30,
    paddingRight: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
