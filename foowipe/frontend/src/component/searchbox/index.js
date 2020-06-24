import React, {Component} from 'react';
import axios from 'axios';
import {Keyboard, StyleSheet, View, TouchableOpacity} from 'react-native';
import {SearchBar, Icon, Button, Text} from 'react-native-elements';

import CategoryModal from '../categorymodal';
import Toast from 'react-native-tiny-toast';

export default class SearchBox extends Component {
  state = {
    searchInput: '',
    stores: [],
    modal: false,
    category: '',
  };

  // 검색 내용 업데이트
  updateSearch = (search) => {
    this.setState({searchInput: search});
  };

  searchClear() {
    this.setState({searchInput: ''});
    this.props.changeStores([]);
  }

  requestSearch = async () => {
    if (this.state.searchInput == '') return;
    this.props.setLoading(true);
    const input = this.state.searchInput;
    try {
      await axios
        .get(
          'https://openapi.naver.com/v1/search/local.json?query=' +
            this.props.cur_loc.loc_name +
            ' ' +
            input,
          {
            headers: {
              'X-Naver-Client-Id': 'xx62audx0rvO9KVCtI1y',
              'X-Naver-Client-Secret': 'M4PV8MD6y1',
            },
          },
        )
        .then(async (res) => {
          await res.data.items.map((item, i) => {
            (item.contanct = item.telephone), (item.name = item.title);
            item.menu = [];
          });
          this.setState({stores: res.data.items});
        });
      await this.geocoding();
      await axios
        .post('http://13.125.26.79/store/search/', {
          address: this.props.cur_loc.loc_name,
          name: input,
        })
        .then(async (res) => {
          await res.data.map((item, i) => {
            item.category = item.category + '>' + item.code.split('|')[0];
            item.latitude = parseFloat(item.latitude)
            item.longitude = parseFloat(item.longitude)
          });
          this.setState({stores: [...this.state.stores, ...res.data]});
        });
    } catch (err) {
      console.log(err.message);
    }
    await this.props.changeStores(this.state.stores);
    this.props.setLoading(false);
  };

  async geocoding() {
    for (let item of this.state.stores) {
      let address = item.address;
      try {
        await axios
          .get(
            'https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=' +
              address,
            {
              headers: {
                'X-NCP-APIGW-API-KEY-ID': '6woodxyvhk',
                'X-NCP-APIGW-API-KEY':
                  'cRipzr7HwJNIOmyGQmTINz5y1KX8CrDErrLqIWPQ',
              },
            },
          )
          .then((res) => {
            item.longitude = parseFloat(res.data.addresses[0].x);
            item.latitude = parseFloat(res.data.addresses[0].y);
          });
      } catch (err) {
        console.log(err.message);
      }
    }
  }

  async requestStoreList() {
    if (this.props.cur_loc.loc_name == '') return;
    this.props.setLoading(true);
    try {
      await axios
        .post('http://13.125.26.79/store/list/', {
          address: this.props.cur_loc.loc_name,
          category: this.state.category,
        })
        .then(async (res) => {
          await res.data.map((store, i) => {
            store.latitude = parseFloat(store.latitude);
            store.longitude = parseFloat(store.longitude);
            store.category = store.code;
            store.roadAddress = store.address;
          });
          this.props.changeStores(res.data);
        });
    } catch (err) {
      console.log(err.message);
    }
    this.props.setLoading(false);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   const vitalPropsChange =
  //     this.props.cur_loc.loc_name !== nextProps.cur_loc.loc_name;
  //   const vitalStateChange =
  //     (this.state.stores !== nextState.stores) |
  //     (this.state.searchInput !== nextState.searchInput) |
  //     (this.state.modal !== nextState.modal) |
  //     (this.state.category !== nextState.category);
  //   return vitalPropsChange || vitalStateChange;
  // }

  componentDidMount() {
    this.requestStoreList();
  }

  render() {
    return (
      <View style={styles.container}>
        <SearchBar
          placeholder="장소, 주소 검색"
          placeholderTextColor="white"
          round={true}
          lightTheme={true}
          containerStyle={styles.searchBar}
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.input}
          value={this.state.searchInput}
          onChangeText={this.updateSearch}
          onSubmitEditing={Keyboard.dismiss}
          clearIcon={() => (
            <Icon
              name="cancel"
              onPress={() => {
                this.searchClear();
              }}
            />
          )}
        />
        <View style={styles.textContainer}>
          <Button
            onPress={this.requestSearch}
            buttonStyle={styles.button}
            titleStyle={{fontFamily: 'Cafe24Dongdong', color: 'white'}}
            title="검색"
            type="clear"></Button>
        </View>
        <View style={styles.categoryContainer}>
          <Button
            title="카테고리로 검색"
            onPress={() => this.setState({modal: true})}
            buttonStyle={styles.category}
            titleStyle={{fontFamily: 'Cafe24Dongdong'}}
          />
        </View>
        <CategoryModal
          modalVisible={this.state.modal}
          category={this.state.category}
          changeCategory={(param) => this.setState({category: param})}
          close={async (cate) => {
            await this.setState({
              category: cate,
              modal: false,
              searchInput: '',
            });
            this.requestStoreList();
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  categoryContainer: {
    flex: 0.3,
    backgroundColor: '#70a9ff',
    justifyContent: 'center',
    marginTop: 1,
    marginBottom: 1,
  },
  category: {
    backgroundColor: '#659cf0',
    padding: 2,
    borderRadius: 10,
  },
  searchBar: {
    flex: 1,
    height: 60,
    backgroundColor: '#70a9ff',
    borderColor: '#70a9ff',
    borderWidth: 2,
    paddingLeft: 0,
  },
  inputContainer: {
    backgroundColor: 'white',
  },
  input: {
    fontFamily: 'Cafe24Dongdong',
    color: 'black',
  },
  button: {
    backgroundColor: '#659cf0',
    padding: 10,
    width: 50,
    marginTop: 2,
    marginRight: 5,
    borderRadius: 10,
  },
  textContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#70a9ff',
    marginTop: 1,
    marginBottom: 1,
  },
});
//619bf2
