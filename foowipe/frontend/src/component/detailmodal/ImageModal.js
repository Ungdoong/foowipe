import React from 'react';
import {Modal, View, TouchableOpacity, StyleSheet} from 'react-native';
import {Image, Icon} from 'react-native-elements';

export default function (props) {
  return (
    <Modal animationType="fade" transparent={true} visible={props.modalVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.closeContainer}>
            <TouchableOpacity style={styles.imgContainer} onPress={()=>props.close()}>
              <Image source={{uri: props.store.img}} style={styles.img}></Image>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.8)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'rgba(255,255,255,.9)',
    padding: 5,
    alignItems: 'center',
    elevation: 5,
  },
  closeContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  imgContainer: {
      flex:1,
      aspectRatio:1
    // backgroundColor: 'grey',
  },
  img:{
      height:'100%',
      width:'auto'
  }
});
