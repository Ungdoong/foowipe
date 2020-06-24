import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  PermissionsAndroid,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Swiper from 'react-native-swiper';
import {Icon, Card} from 'react-native-elements';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import Toast from 'react-native-tiny-toast';
import {getPreciseDistance} from 'geolib';

import DetailModal from './detailmodal';

class Swipe extends React.Component {
  SERVER_IP = 'http://i02a107.p.ssafy.io:8000';
  state = {
    names: [],
    data: {
      address: '역삼동',
      category: '',
    },
    image: '',
    stores: [],
    cur_loc: {latitude: 0, longitude: 0},
    isLoading: false,
    modal: false,
    selectedStore: {
      address: '',
      category: '',
      description: '',
      link: '',
      latitude: '',
      longitude: '',
      roadAddress: '',
      contact: '',
      name: '',
    },
  };
  async requestLocationPermission() {
    // console.log(PermissionsAndroid.RESULTS.GRANTED)
    // if ('granted' !== PermissionsAndroid.RESULTS.GRANTED) {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    } catch (err) {}
    // }
  }
  getCurrentLocation() {
    Geolocation.getCurrentPosition(
      async (position) => {
        await this.setState({
          cur_loc: position.coords,
        });
        this.reverseGeooding();
      },
      (error) => {
        console.log(error.message);
        this.getCurrentLocation();
      },
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 1000},
    );
  }

  async reverseGeooding() {
    try {
      await axios
        .get(
          'https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=' +
            this.state.cur_loc.longitude +
            ',' +
            this.state.cur_loc.latitude +
            '&output=json',
          {
            headers: {
              'X-NCP-APIGW-API-KEY-ID': '6woodxyvhk',
              'X-NCP-APIGW-API-KEY': 'cRipzr7HwJNIOmyGQmTINz5y1KX8CrDErrLqIWPQ',
            },
          },
        )
        .then(async (res) => {
          if (res.data.results.length == 0) {
            Toast.show(
              '현재 위치정보를 불러올 수 없습니다\n전체지역 결과를 가져옵니다',
            );
          } else {
            await this.setState({
              cur_loc: {
                ...this.state.cur_loc,
                loc_name: res.data.results[0].region.area3.name,
              },
            });
          }
        });
    } catch (err) {
      console.log(err.message);
    }
  }

  getList(loc_name, curr) {
    if (loc_name == null) return;
    this.setState({isLoading: true});
    try {
      axios
        .post(this.SERVER_IP + '/store/list/', {
          address: loc_name,
          category: curr,
        })
        .then(async (res) => {
          await res.data.map(async (store, i) => {
            store.roadAddress = store.address;
            store.category = store.category + ' > ' + store.code.split('|')[0];
            store.link = '';
            store.latitude = parseFloat(store.latitude);
            store.longitude = parseFloat(store.longitude);
            if (store.img == null) {
              store.img =
                'https://user-images.githubusercontent.com/41600558/80696592-9002db80-8b12-11ea-85f7-6361413b8d80.gif';
            }
            // 거리 계산
            store.distance = '- m';
            const dis = await getPreciseDistance(
              {
                latitude: this.state.cur_loc.latitude,
                longitude: this.state.cur_loc.longitude,
              },
              {
                latitude: store.latitude,
                longitude: store.longitude,
              },
            );
            if (dis <= 1000) {
              store.distance = dis + 'm';
            } else {
              store.distance = dis / 1000 + 'km';
            }
          });
          this.setState({stores: res.data});
        });
    } catch (err) {
      console.log(err.message);
    }

    this.setState({isLoading: false});
  }

  getBlogs() {
    // 블로그 불러오기
    let query =
      this.state.cur_loc.loc_name + ' ' + this.state.selectedStore.name;

    axios
      .get('https://openapi.naver.com/v1/search/blog.json?query=' + query, {
        headers: {
          'X-Naver-Client-Id': 'xx62audx0rvO9KVCtI1y',
          'X-Naver-Client-Secret': 'M4PV8MD6y1',
        },
      })
      .then((res) => {
        this.state.selectedStore.blogs = res.data.items;
      });
  }

  shouldComponentUpdate(nextProps, nextStates) {
    if (this.state.cur_loc.loc_name !== nextStates.cur_loc.loc_name) {
      switch (this.props.name) {
        case 'cafe':
          var curr = '카페';
          this.getList(nextStates.cur_loc.loc_name, curr);
          break;
        case 'food':
          var curr = '음식점';
          this.getList(nextStates.cur_loc.loc_name, curr);
          break;
        case 'alcohol':
          var curr = '알코올';
          this.getList(nextStates.cur_loc.loc_name, curr);
          break;
        default:
          break;
      }
    }
    return true;
  }

  async componentDidMount() {
    this.requestLocationPermission();
    this.getCurrentLocation();
  }
  async showDetail(store) {
    await this.setState({selectedStore: store});
    await this.getBlogs();
    this.setState({modal: true});
  }
  render() {
    const list = this.state.stores.map((store, i) => (
      <TouchableOpacity
        key={i}
        style={{flex: 1}}
        onPress={() => this.showDetail(store)}>
        <Card
          title={<Text style={styles.title}>{store.name}</Text>}
          imageStyle={styles.image}
          image={{uri: store.img}}
          containerStyle={styles.card}>
          <Text style={styles.text}>{store.category}</Text>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Icon
              name="directions-fork"
              type="material-community"
              color="crimson"
            />
            <Text style={styles.distance}>{store.distance}</Text>
          </View>
        </Card>
      </TouchableOpacity>
    ));

    if (this.state.isLoading) {
      return (
        <View
          style={{flex: 1, backgroundColor: 'white', justifyContent: 'center'}}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return (
        <View style={{flex: 1}}>
          <Swiper
            style={styles.wrapper}
            showsButtons={true}
            showsPagination={false}>
            {list}
          </Swiper>
          <DetailModal
            modalVisible={this.state.modal}
            close={() => this.setState({modal: false})}
            store={this.state.selectedStore}
            navigation={this.props.navigation}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    // backgroundColor: '#cce1ff',
    //backgroundColor: '#cce1ff',
    justifyContent: 'center',
    margin: 0,
    // marginTop : 10,
    //  marginBottom :10,
    //  marginLeft:10,
    //  marginRight:10
  },
  wrapper: {},
  title: {
    textAlign: 'center',
    width: '100%',
    fontFamily: 'ssang',
    fontSize: 25,
    marginBottom: 20,
    marginTop: 20,
  },
  text: {
    textAlign: 'center',
    width: '100%',
    fontFamily: 'ssang',
    fontSize: 24,
    marginTop: 20,
  },
  image: {
    height: '60%',
    width: '100%',
  },
  distance: {
    fontFamily: '12lotteLight',
    paddingTop: 6,
    paddingLeft: 8,
    fontSize: 16,
  },
});
export default Swipe;
