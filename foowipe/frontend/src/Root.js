import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// Screens
import HomeScreen from './screens/HomeScreen';
import FoodScreen from './screens/FoodScreen';
import MapScreen from './screens/MapScreen';
import WorldcupScreen from './screens/WorldcupScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import MypageScreen from './screens/MypageScreen';

// Components
import MyHeader from './component/header';
import {Text, Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Home() {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          header: () => {
            return <MyHeader cur="home" />;
          },
        }}
      />
      <Stack.Screen name="FoodScreen" component={FoodScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="MyPageScreen" component={MypageScreen} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
    </Stack.Navigator>
  );
}

function Maps() {
  return (
    <Stack.Navigator initialRouteName="MapScreen">
      <Stack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{
          header: () => {
            return <MyHeader cur="map" />;
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default class Root extends React.Component {
  constructor() {
    super();
    this.state = {
      islogin: 'false',
      updated: false,
    };
  }

  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="홈"
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName;
              let iconColor;

              if (route.name === '홈') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === '지도') {
                iconName = focused ? 'map' : 'map-outline';
              } else if (route.name === '게임') {
                iconName = focused ? 'trophy' : 'trophy-outline';
              } else {
                iconName = focused ? 'account' : 'account-outline';
              }
              return (
                <Icon name={iconName} type="material-community" size={size} />
              );
            },
            tabBarLabel: ({focused, color}) => {
              return (
                <Text
                  style={{
                    fontFamily: 'Cafe24Dongdong',
                    fontSize: 14,
                  }}>
                  {route.name}
                </Text>
              );
            },
          })}>
          <Tab.Screen name="홈" component={Home} />
          <Tab.Screen name="지도" component={Maps} />
          {/* <Tab.Screen name='게임' component={Home} /> */}
          <Tab.Screen name="마이페이지" component={MypageScreen} />
          <Tab.Screen name="로그인" component={LoginScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
