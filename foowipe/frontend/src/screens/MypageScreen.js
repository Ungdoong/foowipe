import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ListItem, Icon } from 'react-native-elements'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-tiny-toast'

function MyinfoScreen(props) {
  // state 초기화
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const navigation = useNavigation();


  useEffect(() => {
    console.log('정보보기')
    // 회원정보 보기
    AsyncStorage.getItem('user_id').then(value => {
      axios.get(`http://i02a107.p.ssafy.io:8000/auth/user/${value}/`)
        .then((response) => {
          console.log(response.data)
          // https://ko.reactjs.org/docs/hooks-state.html
          setEmail(response.data.email)
          setNickname(response.data.nickname)
        })
        .catch((error) => {
          console.log(error);
        });
    }
    )
  }
  );


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        style={styles.profileImg}
        source={require('../../assets/img/blueberry.jpg')}
      />
      <Text style={styles.infotitle}>내 정보</Text>
      <View>
        <Text style={styles.infotext}>아이디 {nickname}</Text>
        <Text style={styles.infotext}>이메일 {email}</Text>
      </View>
      <TouchableOpacity
        onPress={() =>
          AsyncStorage.getItem('token').then(value => {
            axios({
              url: 'http://i02a107.p.ssafy.io/auth/logout/',
              method: 'post',
              headers: { 'Authorization': `Token ${value}` }
            })
              .then(async ()=>{
                // Asyncstorage에 담긴 것 확인
                await AsyncStorage.removeItem('token'),
                await AsyncStorage.removeItem('user_id'),
                await AsyncStorage.removeItem('islogin')
                Toast.show('로그아웃 되었습니다'),
                // 메인 페이지로 보내주기
                navigation.navigate('HomeScreen')
              })
              .catch(error => console.log(error))
          },
          )
        }
        style={styles.logoutBtn}>
        <Text style={{ fontSize: 17, textAlign: 'center', color: 'white' }}>
          로그아웃
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function LikeScreen() {
  const [likes, setLikes] = useState([]);
  useEffect(() => {
    console.log('찜리스트')
    AsyncStorage.getItem('user_id').then(value => {
      axios.post(`http://i02a107.p.ssafy.io:8000/likey/list/`,
        { 'user_id': `${value}` })
        .then(response => {
          // console.log(response.data)
          setLikes(response.data)
          // 페이지 재로딩하기
        })
        .catch(error => console.log(error))
    })
  }, [] // 한 번만 실행시키기 위해 , [] 넣음
  );

  const array1 = [
    { "상호명": "냥이네집", "사진": "이미지", "주소": "서울시 은평구 불광동 32" },
    { "상호명": "멍이네집", "사진": "이미지", "주소": "서울시 은평구 성석동 32" },
    { "상호명": "뱀이네집", "사진": "이미지", "주소": "서울시 은평구 불광동 55" },
    { "상호명": "뱀2이네집", "사진": "이미지", "주소": "서울시 은평구 불광동 55" },
  ]

  return (
    <View>
      <View style={{ marginBottom: 30 }} >
        <Text style={styles.liketitle}>내 찜 목록 ❤️</Text>
      </View>
      <View>
        {
          likes.map((l, i) => (
            <ListItem
              key={i}
              title={l.name}
              // leftAvatar={{ source: { uri: l.avatar_url } }}
              subtitle={l.address}
              // 삭제 버튼 클릭하면 삭제되도록
              rightIcon={{
                name: 'delete', onPress: () => {
                  AsyncStorage.getItem('user_id').then(value => {
                    axios.post(`http://i02a107.p.ssafy.io:8000/likey/remove/`,
                      { 'user_id': `${value}`, 'store_id': `${l.store_id}` })
                      .then(response => {
                        // 재 로딩
                        axios.post(`http://i02a107.p.ssafy.io:8000/likey/list/`,
                          { 'user_id': `${value}` })
                          .then(response => {
                            setLikes(response.data)
                          })
                      })
                      .catch(error => console.log(error))
                  })

                }
              }}
              bottomDivider
              chevron // 화살표
            />
          ))
        }
      </View>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

export default function MypageScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="My info" component={MyinfoScreen} />
      <Tab.Screen name="Like" component={LikeScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  infotitle: {
    fontSize: 30,
    fontWeight: '500',
    fontFamily: '12lotteBold',
    marginBottom: 40,
    marginTop: 20,
  },
  infotext: {
    fontSize: 23,
    fontWeight: '500',
    fontFamily: '12lotteLight',
  },
  liketitle: {
    fontSize: 30,
    fontWeight: '500',
    fontFamily: '12lotteBold',
    marginTop: 30,
    paddingLeft: '30%'
  },
  liketext: {
    marginTop: 30,
    fontSize: 23,
    fontWeight: '500',
    fontFamily: '12lotteLight',
    paddingLeft: 20,
  },
  profileImg: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderColor: 'white',
  },
  logoutBtn: {
    justifyContent: 'flex-end',
    backgroundColor: '#6E8FD7',
    padding: 20,
    borderRadius: 30,
    width: 180,
    marginLeft: 20,
    marginTop: 30,
    borderColor: 'black',
    borderStyle: 'solid',
  },
  loginBtn: {
    justifyContent: 'flex-end',
    backgroundColor: '#6E8FD7',
    padding: 20,
    borderRadius: 30,
    width: 150,
    marginLeft: 20,
    marginTop: 30,
  },
})