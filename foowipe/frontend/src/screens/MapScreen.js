import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Card} from 'react-native-elements';
import NaverMap from '../component/navermap';
import SearchBox from '../component/searchbox';
import AsyncStorage from '@react-native-community/async-storage';

export default class MapScreen extends Component {
  state = {
    stores: [],
    cur_loc: {
      loc_name: '',
    },
    isLoading: false,
  };

  checkUserStore = async () => {
    AsyncStorage.getItem('userStore', async (err, result) => {
      const store = JSON.parse(result);
      if(store != null){
        this.setState({stores: [store]});
      }
    });
  };

  onLoad = () => {
    this.props.navigation.addListener('focus', () => {
      this.checkUserStore();
    });
  };

  componentDidMount() {
    this.onLoad();
    AsyncStorage.removeItem('userStore');
  }

  render() {
    return (
      <View>
        <SearchBox
          cur_loc={this.state.cur_loc}
          changeStores={(stores) => {
            this.setState({stores: stores});
          }}
          setLoading={(loading) => this.setState({isLoading: loading})}
        />
        <Card containerStyle={styles.card}>
          <NaverMap
            stores={this.state.stores}
            isLoading={this.state.isLoading}
            onChangeCur={(addr) => this.setState({cur_loc: addr})}
            navigation={this.props.navigation}
            changeStore={(stores) => this.setState({stores: stores})}
          />
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    justifyContent: 'center',
    margin: 0,
    padding: 0,
    // height: '100%',
    paddingBottom: 120,
  },
});
