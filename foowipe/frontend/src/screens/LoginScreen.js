import React, { useState, useEffect } from 'react';
import {
  View,
  Alert,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text
} from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-tiny-toast';

export default class Login extends React.Component {
  state = {
    password: '', email: '',
  }
  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }
  login = async () => {
    // password와 email이 ''가 아닌지 확인    
    const SERVER_IP = 'http://i02a107.p.ssafy.io:8000'
      await axios.post(SERVER_IP+'/auth/login/', this.state)
      .then(async res => {
        let token = res.data.token;
        let user_id = String(res.data.user_id);
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user_id', user_id);
        await AsyncStorage.setItem('islogin', 'true');
        // 초기화하기
        this.setState({'password':''});
        this.setState({'email':''});
        Toast.show(`로그인 되었습니다`);
        this.props.navigation.navigate('HomeScreen');
        }
      )
      .catch(error => {
        console.log(error)
        Alert.alert('이메일과 비밀번호를 확인해주세요')
      })
  }
  render() {
    return (
      <View style={styles.container}>
        <Image
        style={styles.profileImg}
        source={require('../../assets/img/pizza.jpg')}
        />
        <TextInput
          style={styles.input}
          placeholder='이메일'
          autoCapitalize="none"
          placeholderTextColor='white'
          onChangeText={val => this.onChangeText('email', val)}
        />
        <TextInput
          style={styles.input}
          placeholder='비밀번호'
          secureTextEntry={true}
          autoCapitalize="none"
          placeholderTextColor='white'
          onChangeText={val => this.onChangeText('password', val)}
        />
          <TouchableOpacity
            onPress={this.login}
            style={styles.loginBtn}>
          <Text style={{ fontSize: 17, textAlign: 'center', color: 'white' }}>
            로그인
              </Text>
          </TouchableOpacity>

        <View style={styles.buttons}>
          <TouchableOpacity
            onPress = {()=>this.props.navigation.navigate('SignupScreen')}
            style={styles.signupBtn}>
            <Text style={{ fontSize: 17, textAlign: 'center', color: 'white' }}>
              가입하기
                </Text>
          </TouchableOpacity>
      </View>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  input: {
    width: 350,
    height: 55,
    backgroundColor: '#42A5F5',
    margin: 10,
    padding: 8,
    color: 'white',
    borderRadius: 14,
    fontSize: 18,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginBtn: {
    justifyContent: 'flex-end',
    backgroundColor: '#6E8FD7',
    padding: 20,
    borderRadius: 30,
    width: 180,
    marginLeft: 20,
    borderColor: 'black',
    borderStyle: 'solid',
    marginTop: 15,
  },
  buttons: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: 'space-around',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupBtn: {
    justifyContent: 'flex-end',
    backgroundColor: '#6E8FD7',
    padding: 20,
    borderRadius: 30,
    width: 180,
    marginLeft: 20,
    borderColor: 'black',
    borderStyle: 'solid',
  },
  profileImg: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderColor: 'white',
    marginBottom: 15,
  }
})