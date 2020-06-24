import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  ActivityIndicator,
  Text,
} from 'react-native';
import NaverMapView, {Marker} from 'react-native-nmap';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import Toast from 'react-native-tiny-toast';
import {getPreciseDistance} from 'geolib';

import DetailModal from '../detailmodal';

export default class NaverMap extends Component {
  state = {
    cur_loc: {latitude: 0, longitude: 0},
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

  // 위치정보 권한 요청
  async requestLocationPermission() {
    // console.log(PermissionsAndroid.RESULTS.GRANTED)
    // if ('granted' !== PermissionsAndroid.RESULTS.GRANTED) {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    } catch (err) {
      console.warn(err.message);
    }
    // }
  }

  // 현재 위치정보 요청
  getCurrentLocation = () => {
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
  };

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
            Toast.show('현재 위치정보를 불러올 수 없습니다');
          } else {
            await this.setState({
              cur_loc: {
                ...this.state.cur_loc,
                loc_name: res.data.results[0].region.area3.name,
              },
            });
            this.props.onChangeCur(this.state.cur_loc);
          }
        });
    } catch (err) {
      console.log(err.message);
    }
  }

  rename(name) {
    name = name.replace('<b>', '');
    name = name.replace('</b>', '');
    return name;
  }

  async getStore() {
    this.state.selectedStore.name = this.rename(this.state.selectedStore.name);
    let query =
      this.state.cur_loc.loc_name + ' ' + this.state.selectedStore.name;
    try {
      // 상점 정보 불러오기
      if (this.state.selectedStore.store_id != null) {
        await axios
          .get(
            'https://openapi.naver.com/v1/search/local.json?query=' + query,
            {
              headers: {
                'X-Naver-Client-Id': 'xx62audx0rvO9KVCtI1y',
                'X-Naver-Client-Secret': 'M4PV8MD6y1',
              },
            },
          )
          .then((res) => {
            if (res.data.display != 0) {
              const item = res.data.items[0];
              this.state.selectedStore.link = item.link;
              this.state.selectedStore.address = item.address;
              this.state.selectedStore.roadAddress = item.roadAddress;
              this.state.selectedStore.category = item.category;
            }
          });
      }
      // 거리 계산
      this.state.selectedStore.distance = '- m';
      const dis = await getPreciseDistance(
        {
          latitude: this.state.cur_loc.latitude,
          longitude: this.state.cur_loc.longitude,
        },
        {
          latitude: this.state.selectedStore.latitude,
          longitude: this.state.selectedStore.longitude,
        },
      );
      if (dis <= 1000) {
        this.state.selectedStore.distance = dis + 'm';
      } else {
        this.state.selectedStore.distance = dis / 1000 + 'km';
      }
    } catch (err) {
      console.log(err.message);
    }

    // 블로그 불러오기

    query = this.state.cur_loc.loc_name + ' ' + this.state.selectedStore.name;
    try {
      await axios
        .get('https://openapi.naver.com/v1/search/blog.json?query=' + query, {
          headers: {
            'X-Naver-Client-Id': 'xx62audx0rvO9KVCtI1y',
            'X-Naver-Client-Secret': 'M4PV8MD6y1',
          },
        })
        .then((res) => {
          console.log(res.data)
          this.state.selectedStore.blogs = res.data.items;
        });
    } catch (err) {
      console.log(err.message);
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   const vitalPropsChange =
  //     (this.props.stores.length !== nextProps.stores.length) |
  //     (this.props.isLoading !== nextProps.isLoading);
  //   const vitalStateChange =
  //     (this.state.cur_loc !== nextState.cur_loc) |
  //     (this.state.modal !== nextState.modal);
  //   return vitalPropsChange || vitalStateChange;
  // }
  async componentDidMount() {
    await this.requestLocationPermission();
    await this.getCurrentLocation();
  }

  render() {
    const searchResults = this.props.stores.map((store, i) => {
      const loc = {
        latitude: store.latitude,
        longitude: store.longitude,
      };
      return (
        <Marker
          key={i}
          coordinate={loc}
          onClick={async () => {
            await this.setState({selectedStore: store});
            await this.getStore();
            this.setState({modal: true});
          }}
        />
      );
    });
    return (
      <View style={styles.container}>
        <Text>{this.userStore}</Text>
        {this.state.cur_loc && !this.props.isLoading ? (
          <NaverMapView
            style={styles.mainMap}
            showsMyLocationButton={true}
            center={{
              ...this.state.cur_loc,
              zoom: 16,
            }}>
            {searchResults}
          </NaverMapView>
        ) : (
          <ActivityIndicator size="large" color="#70a9ff" />
        )}
        <DetailModal
          modalVisible={this.state.modal}
          store={this.state.selectedStore}
          close={() => this.setState({modal: false})}
          cur_loc={this.state.cur_loc}
          navigation={this.props.navigation}
          changeStore={(stores) => this.props.changeStore(stores)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
  },
  mainMap: {
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
  },
});
