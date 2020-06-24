import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Linking,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {Text, ListItem, Image, Divider} from 'react-native-elements';

import TextRow from './TextRow';
import ImageModal from './ImageModal';

function rename(name) {
  name = name.split('<b>').join('');
  name = name.split('</b>').join('');
  return name;
}
function redate(date) {
  date = [date.slice(0, 4), date.slice(4, 6), date.slice(6, 8)];
  return date.join('.');
}
function openUrl(url) {
  Linking.openURL(url);
}

export default function Contents(props) {
  const [modal, setModal] = useState(false);
  if (props.selectedIndex == '0') {
    return (
      <View style={styles.container}>
        <TextRow left="map-marker" right={props.store.address} />
        <TextRow left="map-marker-outline" right={props.store.roadAddress} />
        <TextRow left="phone" right={props.store.contact} />
        {/* <TextRow left="clock-outline" right={''} /> */}
        <TextRow left="home-outline" right={props.store.link} type="link" />
        <TextRow left="text" right={props.store.description} />
      </View>
    );
  } else if (props.selectedIndex == '1') {
    return (
      <View style={styles.container}>
        <SafeAreaView style={{flex: 1, width: '100%'}}>
          <ScrollView style={styles.scrollContainer}>
            <Text style={styles.menuTitle}>메뉴</Text>
            {props.store.menu.length != 0 ? (
              <View style={{marginTop: 10}}>
                {props.store.menu.map((menu, i) => (
                  <View key={i}>
                    <View key={i} style={styles.menuContainer}>
                      <Text style={styles.menuName}>{menu.name}</Text>
                      <Text style={styles.price}>{menu.price}원</Text>
                    </View>
                    <Divider style={styles.divider} />
                  </View>
                ))}
              </View>
            ) : (
              <View style={{marginTop:100, alignItems:'center'}}>
                <Image source={require('frontend/assets/img/menu_empty.png')} style={{width:100,aspectRatio:1}}/>
                <Text style={{...styles.menuName,textAlign:'center',marginTop:30}}>등록된 메뉴가 없습니다</Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  } else if (props.selectedIndex == '2') {
    return (
      <SafeAreaView style={{flex: 1, width: '100%'}}>
        <ScrollView style={styles.scrollContainer}>
          <View
            style={{
              flex: 0.99,
              justifyContent: 'space-around',
              flexDirection: 'column',
            }}>
            <View
              style={{
                flex: 4,
                flexDirection: 'row',
                justifyContent: 'flex-start',
              }}>
              <TouchableOpacity
                style={styles.imgContainer}
                onPress={() => setModal(true)}>
                <Image
                  containerStyle={styles.img}
                  source={{uri: props.store.img}}
                  PlaceholderContent={<ActivityIndicator />}
                />
              </TouchableOpacity>
            </View>
          </View>
          <ImageModal
            modalVisible={modal}
            store={props.store}
            close={() => setModal(false)}
          />
        </ScrollView>
      </SafeAreaView>
    );
  } else {
    const {blogs} = props.store;
    return (
      <SafeAreaView style={{flex: 1, width: '100%'}}>
        <ScrollView style={styles.scrollContainer}>
          {blogs.map((blog, i) => (
            <ListItem
              containerStyle={styles.listItem}
              key={i}
              title={rename(blog.title)}
              titleStyle={{fontWeight: 'bold', fontSize: 18}}
              subtitle={redate(blog.postdate) + '\n' + blog.bloggername}
              chevron
              onPress={() => openUrl(blog.link)}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    width: '100%',
    borderWidth: 0.1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  menuTitle: {
    fontFamily: '12lotteBold',
    fontSize: 20,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  listItem: {
    borderWidth: 1,
    borderRadius: 10,
  },
  imgContainer: {
    width: '33%',
    aspectRatio: 1,
    padding: 3,
  },
  img: {
    height: '100%',
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  menuName: {
    fontFamily: '12lotteBold',
    fontSize: 20,
  },
  price: {
    fontFamily: '12lotteLight',
    fontSize: 20,
  },
  divider: {
    backgroundColor: 'black',
    marginLeft: 10,
    marginRight: 10,
  },
});
