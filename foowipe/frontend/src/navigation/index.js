import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import DetailScreen from '../screens/DetailScreen';
import HomeScreen from '../screens/HomeScreen';
import FoodScreen from '../screens/FoodScreen';
import CoffeeScreen from '../screens/CoffeeScreen';
import MapScreen from '../screens/MapScreen';
import WorldcupScreen from '../screens/WorldcupScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

const HomeStack = createStackNavigator(
    {
        HomeScreen: {screen: HomeScreen},
        DetailScreen: {screen: DetailScreen},
        FoodScreen: {screen: FoodScreen},
        CoffeeScreen: {screen: CoffeeScreen},
        MapScreen: {screen: MapScreen},
        WorldcupScreen: {screen: WorldcupScreen},
        LoginScreen: {screen: LoginScreen},
        SignupScreen: {screen: SignupScreen},
    },
    {
        initialRouteName: 'HomeScreen'
    }
);

// 최상단 네비게이터
const AppNavigator = createSwitchNavigator(
    {
        Home: HomeStack
    },
);

export default createAppContainer(AppNavigator);